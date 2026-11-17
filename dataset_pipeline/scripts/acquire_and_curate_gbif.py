import os
import sys
import time
import json
import hashlib
import concurrent.futures
import requests
import pandas as pd
import numpy as np
from PIL import Image
import cv2
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

WORKSPACE_ROOT = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI"
PIPELINE_ROOT = os.path.join(WORKSPACE_ROOT, "dataset_pipeline")
METADATA_DIR = os.path.join(PIPELINE_ROOT, "metadata")
REPORTS_DIR = os.path.join(PIPELINE_ROOT, "reports", "phase_10")
DATA_DIR = os.path.join(PIPELINE_ROOT, "data", "public", "gbif")

os.makedirs(REPORTS_DIR, exist_ok=True)
for sub in ["raw", "candidate", "verified", "rejected"]:
    for sp in ["rastrelliger_kanagurta", "decapterus_macarellus"]:
        os.makedirs(os.path.join(DATA_DIR, sub, sp), exist_ok=True)
os.makedirs(os.path.join(DATA_DIR, "rejected"), exist_ok=True)

# 1. Load occurrences
occ_csv = os.path.join(METADATA_DIR, "gbif_occurrences.csv")
if not os.path.exists(occ_csv):
    print(f"Error: {occ_csv} not found!")
    sys.exit(1)

df_occ = pd.read_csv(occ_csv)
print(f"Loaded {len(df_occ)} occurrences from {occ_csv}")

# 2. Select candidates (up to 120 per species)
# Prioritize:
# - Unique gbifID (one primary photo per occurrence)
# - Valid image format (jpeg/png)
# - For RKAN: prioritize Indonesia, then other Indo-Pacific, valid license
# - For DMAC: prioritize preserved specimens & verified observations, valid license
def standardize_license(lic_str):
    if not isinstance(lic_str, str) or not lic_str.strip():
        return "LICENSE_UNKNOWN", "NO", "NO", "YES", "REJECTED_UNKNOWN_LICENSE"
    l = lic_str.lower()
    if "zero/1.0" in l or "cc0" in l or "publicdomain" in l or "public domain" in l:
        return "CC0 1.0", "YES", "YES", "NO", "COMPATIBLE_OPEN"
    elif "by/4.0" in l or "by/3.0" in l:
        return "CC BY 4.0", "YES", "YES", "YES", "COMPATIBLE_OPEN"
    elif "by-nc/4.0" in l or "by-nc/3.0" in l or "by-nc" in l:
        return "CC BY-NC 4.0", "NO", "YES", "YES", "COMPATIBLE_ACADEMIC"
    elif "by-nc-sa" in l:
        return "CC BY-NC-SA 4.0", "NO", "YES", "YES", "COMPATIBLE_ACADEMIC_SHAREALIKE"
    elif "by-nc-nd" in l:
        return "CC BY-NC-ND 4.0", "NO", "YES", "YES", "RESTRICTIVE_NO_DERIVS"
    elif "by-sa" in l:
        return "CC BY-SA 4.0", "YES", "YES", "YES", "COMPATIBLE_SHAREALIKE"
    elif "conditions apply" in l or "copyright" in l or "nabu" in l:
        return "RESTRICTIVE_COPYRIGHT", "NO", "NO", "YES", "REJECTED_RESTRICTIVE"
    else:
        return lic_str, "NO", "YES", "YES", "NEEDS_REVIEW"

# License Audit
license_audit_rows = []
for idx, row in df_occ.iterrows():
    std_lic, comm, res, attr, verdict = standardize_license(row.get('media_license'))
    license_audit_rows.append({
        'gbifID': row.get('gbifID'),
        'species_code': row.get('species_code'),
        'scientific_name': row.get('scientificName'),
        'license_raw': row.get('media_license'),
        'license_standard': std_lic,
        'commercial_allowed': comm,
        'research_allowed': res,
        'attribution_required': attr,
        'rights_holder': row.get('rightsHolder'),
        'publisher': row.get('publisher'),
        'license_verdict': verdict,
        'references': row.get('references')
    })
df_license_audit = pd.DataFrame(license_audit_rows)
license_audit_path = os.path.join(METADATA_DIR, "gbif_license_audit.csv")
df_license_audit.to_csv(license_audit_path, index=False, encoding='utf-8')
print(f"Saved license audit to: {license_audit_path}")

# Filter candidate images to download
selected_candidates = []

# For RKAN:
rkan_occ = df_occ[df_occ['species_code'] == 'RKAN'].copy()
# Sort: Indonesia first, then Accepted status, then media_index 0
rkan_occ['is_indonesia'] = rkan_occ['country'] == 'Indonesia'
rkan_occ['is_accepted'] = rkan_occ['taxonomicStatus'] == 'ACCEPTED'
rkan_occ = rkan_occ.sort_values(by=['is_indonesia', 'is_accepted', 'media_index'], ascending=[False, False, True])
rkan_unique = rkan_occ.drop_duplicates(subset=['gbifID']).head(120)
selected_candidates.append(rkan_unique)

# For DMAC:
dmac_occ = df_occ[df_occ['species_code'] == 'DMAC'].copy()
dmac_occ['is_preserved'] = dmac_occ['basisOfRecord'] == 'PRESERVED_SPECIMEN'
dmac_occ['is_accepted'] = dmac_occ['taxonomicStatus'] == 'ACCEPTED'
dmac_occ = dmac_occ.sort_values(by=['is_preserved', 'is_accepted', 'media_index'], ascending=[False, False, True])
dmac_unique = dmac_occ.drop_duplicates(subset=['gbifID']).head(120)
selected_candidates.append(dmac_unique)

df_download_candidates = pd.concat(selected_candidates, ignore_index=True)
print(f"Total candidate images to download: {len(df_download_candidates)} (RKAN: {len(rkan_unique)}, DMAC: {len(dmac_unique)})")

# 3. Download worker
download_logs = []

def download_image(cand):
    gbif_id = cand['gbifID']
    sp_code = cand['species_code']
    target_sp = cand['target_species']
    url = cand['media_identifier']
    
    # Subdir
    sub_folder = "rastrelliger_kanagurta" if sp_code == "RKAN" else "decapterus_macarellus"
    ext = ".jpg"
    if url:
        clean_url = url.split("?")[0].lower()
        if clean_url.endswith(".png"): ext = ".png"
        elif clean_url.endswith(".jpeg"): ext = ".jpeg"
    
    filename = f"GBIF_{sp_code}_{gbif_id}{ext}"
    local_path = os.path.join(DATA_DIR, "raw", sub_folder, filename)
    
    log_entry = {
        'gbifID': gbif_id,
        'species_code': sp_code,
        'target_species': target_sp,
        'filename': filename,
        'media_url': url,
        'local_filepath': local_path,
        'http_status': None,
        'download_status': 'FAILED',
        'file_size_bytes': 0,
        'download_time_sec': 0.0,
        'error_message': None
    }
    
    if not url or not isinstance(url, str) or not url.startswith("http"):
        log_entry['error_message'] = "Invalid or empty URL"
        return log_entry
        
    t0 = time.time()
    try:
        headers = {'User-Agent': 'FishGuardAI-Research/1.0 (Univ Pendidikan Indonesia Serang)'}
        resp = requests.get(url, headers=headers, timeout=25, stream=True)
        log_entry['http_status'] = resp.status_code
        dt = time.time() - t0
        log_entry['download_time_sec'] = round(dt, 2)
        
        if resp.status_code == 200:
            content = resp.content
            if len(content) < 1024:
                log_entry['error_message'] = "File too small (<1KB)"
                return log_entry
            with open(local_path, "wb") as f:
                f.write(content)
            log_entry['download_status'] = 'SUCCESS'
            log_entry['file_size_bytes'] = len(content)
        else:
            log_entry['error_message'] = f"HTTP Error {resp.status_code}"
    except Exception as e:
        log_entry['error_message'] = str(e)
        log_entry['download_time_sec'] = round(time.time() - t0, 2)
        
    return log_entry

print("\nStarting concurrent downloads with 12 workers...")
t_start = time.time()
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
    futures = [executor.submit(download_image, row) for _, row in df_download_candidates.iterrows()]
    for f in concurrent.futures.as_completed(futures):
        download_logs.append(f.result())

t_end = time.time()
print(f"Downloads completed in {t_end - t_start:.2f} seconds.")

df_log = pd.DataFrame(download_logs)
log_csv_path = os.path.join(METADATA_DIR, "gbif_download_log.csv")
df_log.to_csv(log_csv_path, index=False, encoding='utf-8')
print(f"Saved download log to: {log_csv_path}")

success_downloads = df_log[df_log['download_status'] == 'SUCCESS']
failed_downloads = df_log[df_log['download_status'] == 'FAILED']
print(f"Downloaded successfully: {len(success_downloads)} / {len(df_log)}")
print(f"Failed downloads: {len(failed_downloads)}")

# Save failed log
failed_path = os.path.join(REPORTS_DIR, "download_failed.csv")
failed_downloads.to_csv(failed_path, index=False, encoding='utf-8')

# 4. Quality inspection, hashing, and duplicate detection
def compute_dhash(pil_img, hash_size=8):
    try:
        img_gray = pil_img.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
        pixels = list(img_gray.getdata())
        diff = []
        for r in range(hash_size):
            for c in range(hash_size):
                p_left = pixels[r * (hash_size + 1) + c]
                p_right = pixels[r * (hash_size + 1) + c + 1]
                diff.append(p_left > p_right)
        decimal_val = 0
        hex_str = []
        for i, v in enumerate(diff):
            if v:
                decimal_val += 2 ** (i % 8)
            if (i % 8) == 7:
                hex_str.append(hex(decimal_val)[2:].rjust(2, '0'))
                decimal_val = 0
        return "".join(hex_str)
    except Exception:
        return "UNKNOWN"

quality_records = []
seen_sha256 = {}
seen_dhash = {}

print("\nInspecting downloaded images...")
for idx, row in success_downloads.iterrows():
    fpath = row['local_filepath']
    fname = row['filename']
    sp_code = row['species_code']
    gbif_id = row['gbifID']
    
    # Defaults
    q_entry = {
        'image_id': f"IMG-GBIF-{sp_code}-{gbif_id}",
        'filename': fname,
        'species_code': sp_code,
        'gbifID': gbif_id,
        'sha256': None,
        'dhash': None,
        'width': 0,
        'height': 0,
        'aspect_ratio': 0.0,
        'file_size_kb': round(row['file_size_bytes'] / 1024, 1),
        'blur_score': 0.0,
        'is_readable': False,
        'duplicate_type': 'UNIQUE',
        'duplicate_of': None,
        'visual_category': 'UNCERTAIN',
        'quality_tier': 'LOW',
        'curation_status': 'CANDIDATE',
        'curation_reason': ''
    }
    
    try:
        with open(fpath, "rb") as f:
            bytes_data = f.read()
            sha256_hash = hashlib.sha256(bytes_data).hexdigest()
            q_entry['sha256'] = sha256_hash
            
        pil_img = Image.open(fpath)
        pil_img.verify()
        # reopen for processing
        pil_img = Image.open(fpath)
        w, h = pil_img.size
        q_entry['width'] = w
        q_entry['height'] = h
        q_entry['aspect_ratio'] = round(w / h, 2) if h > 0 else 0.0
        q_entry['is_readable'] = True
        
        # dhash
        dhash_str = compute_dhash(pil_img)
        q_entry['dhash'] = dhash_str
        
        # Blur metric via cv2
        cv_img = cv2.imread(fpath, cv2.IMREAD_GRAYSCALE)
        if cv_img is not None:
            lap_var = cv2.Laplacian(cv_img, cv2.CV_64F).var()
            q_entry['blur_score'] = round(float(lap_var), 1)
        else:
            q_entry['blur_score'] = 0.0
            
        # Duplicate detection
        if sha256_hash in seen_sha256:
            q_entry['duplicate_type'] = 'EXACT_DUPLICATE'
            q_entry['duplicate_of'] = seen_sha256[sha256_hash]
            q_entry['curation_status'] = 'REJECTED'
            q_entry['curation_reason'] = f"Exact duplicate of {seen_sha256[sha256_hash]}"
        elif dhash_str in seen_dhash:
            q_entry['duplicate_type'] = 'PERCEPTUAL_NEAR_DUPLICATE'
            q_entry['duplicate_of'] = seen_dhash[dhash_str]
            q_entry['curation_status'] = 'NEEDS_REVIEW'
            q_entry['curation_reason'] = f"Perceptual near-duplicate of {seen_dhash[dhash_str]}"
        else:
            seen_sha256[sha256_hash] = fname
            seen_dhash[dhash_str] = fname
            
            # Check license compatibility from df_license_audit
            lic_match = df_license_audit[df_license_audit['gbifID'] == gbif_id]
            lic_verdict = lic_match['license_verdict'].iloc[0] if len(lic_match) > 0 else 'NEEDS_REVIEW'
            
            if "REJECTED" in lic_verdict:
                q_entry['curation_status'] = 'REJECTED'
                q_entry['curation_reason'] = f"Incompatible license ({lic_verdict})"
            elif w < 400 or h < 300:
                q_entry['quality_tier'] = 'LOW'
                q_entry['curation_status'] = 'REJECTED'
                q_entry['curation_reason'] = f"Resolution too low ({w}x{h})"
            elif q_entry['blur_score'] < 15.0:
                q_entry['quality_tier'] = 'LOW'
                q_entry['curation_status'] = 'NEEDS_REVIEW'
                q_entry['curation_reason'] = f"Severe motion blur (Laplacian var: {q_entry['blur_score']})"
            else:
                if w >= 1200 and h >= 800 and q_entry['blur_score'] >= 50.0:
                    q_entry['quality_tier'] = 'HIGH'
                else:
                    q_entry['quality_tier'] = 'MEDIUM'
                
                # Check basis of record & taxonomic status
                occ_match = df_occ[df_occ['gbifID'] == gbif_id]
                tax_status = occ_match['taxonomicStatus'].iloc[0] if len(occ_match) > 0 else 'UNKNOWN'
                basis = occ_match['basisOfRecord'].iloc[0] if len(occ_match) > 0 else 'UNKNOWN'
                country = occ_match['country'].iloc[0] if len(occ_match) > 0 else 'UNKNOWN'
                
                if basis == 'PRESERVED_SPECIMEN':
                    q_entry['visual_category'] = 'MUSEUM_PRESERVED_SPECIMEN'
                else:
                    q_entry['visual_category'] = 'LIVE_FIELD_OBSERVATION'
                    
                if tax_status == 'ACCEPTED' and lic_verdict in ['COMPATIBLE_OPEN', 'COMPATIBLE_ACADEMIC', 'COMPATIBLE_ACADEMIC_SHAREALIKE']:
                    # Highly relevant candidate
                    if country == 'Indonesia' and sp_code == 'RKAN':
                        q_entry['curation_status'] = 'VERIFIED'
                        q_entry['curation_reason'] = "Verified Indo-Pacific location (Indonesia), accepted taxonomy, open CC license"
                    else:
                        q_entry['curation_status'] = 'CANDIDATE'
                        q_entry['curation_reason'] = "Valid candidate specimen, pending domain-specific visual triage"
                elif tax_status == 'SYNONYM':
                    q_entry['curation_status'] = 'NEEDS_REVIEW'
                    q_entry['curation_reason'] = "Taxonomic status recorded as SYNONYM; needs species key verification"
                else:
                    q_entry['curation_status'] = 'NEEDS_REVIEW'
                    q_entry['curation_reason'] = f"Uncertain taxonomy or license ({tax_status}, {lic_verdict})"
                    
    except Exception as e:
        q_entry['is_readable'] = False
        q_entry['curation_status'] = 'REJECTED'
        q_entry['curation_reason'] = f"Image corrupted or unreadable: {str(e)}"
        
    quality_records.append(q_entry)

df_quality = pd.DataFrame(quality_records)
quality_csv_path = os.path.join(METADATA_DIR, "gbif_quality_report.csv")
df_quality.to_csv(quality_csv_path, index=False, encoding='utf-8')
print(f"Saved quality report to: {quality_csv_path}")

# Categorize and copy/move to verified, candidate, rejected
import shutil
for _, q in df_quality.iterrows():
    sp_folder = "rastrelliger_kanagurta" if q['species_code'] == 'RKAN' else "decapterus_macarellus"
    raw_src = os.path.join(DATA_DIR, "raw", sp_folder, q['filename'])
    if not os.path.exists(raw_src):
        continue
    status = q['curation_status'].lower()
    if status == 'verified':
        dst = os.path.join(DATA_DIR, "verified", sp_folder, q['filename'])
        shutil.copy2(raw_src, dst)
    elif status == 'candidate':
        dst = os.path.join(DATA_DIR, "candidate", sp_folder, q['filename'])
        shutil.copy2(raw_src, dst)
    elif status == 'rejected':
        dst = os.path.join(DATA_DIR, "rejected", q['filename'])
        shutil.copy2(raw_src, dst)

# Save expert review needed list
expert_df = df_quality[df_quality['curation_status'] == 'NEEDS_REVIEW']
expert_path = os.path.join(REPORTS_DIR, "expert_review_needed.csv")
expert_df.to_csv(expert_path, index=False, encoding='utf-8')
print(f"Saved expert review list ({len(expert_df)} items) to: {expert_path}")

# 5. Create Contact Sheets
def create_contact_sheet(df_subset, sp_code, out_path, grid=(4, 5)):
    rows, cols = grid
    max_imgs = rows * cols
    sample_df = df_subset.head(max_imgs)
    
    fig, axes = plt.subplots(rows, cols, figsize=(16, 12))
    axes = axes.flatten()
    
    sp_folder = "rastrelliger_kanagurta" if sp_code == 'RKAN' else "decapterus_macarellus"
    sp_title = "Rastrelliger kanagurta (Kembung Lelaki)" if sp_code == 'RKAN' else "Decapterus macarellus (Layang)"
    
    for i in range(max_imgs):
        ax = axes[i]
        if i < len(sample_df):
            q_row = sample_df.iloc[i]
            img_path = os.path.join(DATA_DIR, "raw", sp_folder, q_row['filename'])
            if os.path.exists(img_path):
                try:
                    img = Image.open(img_path).convert('RGB')
                    ax.imshow(img)
                    label = f"{q_row['filename']}\n{q_row['width']}x{q_row['height']} | {q_row['quality_tier']}\n[{q_row['curation_status']}]"
                    color = 'green' if q_row['curation_status'] == 'VERIFIED' else ('blue' if q_row['curation_status'] == 'CANDIDATE' else 'orange')
                    ax.set_title(label, fontsize=7, color=color)
                except Exception:
                    ax.text(0.5, 0.5, "Err Load", ha='center', va='center')
            else:
                ax.text(0.5, 0.5, "Not Found", ha='center', va='center')
        else:
            ax.axis('off')
        ax.set_xticks([])
        ax.set_yticks([])
        
    plt.suptitle(f"FishGuard AI Phase 10 - GBIF Contact Sheet: {sp_title}", fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(out_path, dpi=120)
    plt.close()
    print(f"Created contact sheet: {out_path}")

cs_rkan_path = os.path.join(REPORTS_DIR, "contact_sheet_rkan.jpg")
cs_dmac_path = os.path.join(REPORTS_DIR, "contact_sheet_dmac.jpg")
create_contact_sheet(df_quality[df_quality['species_code'] == 'RKAN'], 'RKAN', cs_rkan_path)
create_contact_sheet(df_quality[df_quality['species_code'] == 'DMAC'], 'DMAC', cs_dmac_path)

# 6. Update dataset_master.csv safely
master_csv = os.path.join(METADATA_DIR, "dataset_master.csv")
df_master_orig = pd.read_csv(master_csv)
print(f"\nOriginal dataset_master rows: {len(df_master_orig)}")

new_master_rows = []
for idx, q in df_quality.iterrows():
    # Only include VERIFIED and CANDIDATE in master catalog (exclude REJECTED)
    if q['curation_status'] not in ['VERIFIED', 'CANDIDATE']:
        continue
    gbif_id = q['gbifID']
    sp_code = q['species_code']
    occ_match = df_occ[df_occ['gbifID'] == gbif_id].iloc[0]
    lic_match = df_license_audit[df_license_audit['gbifID'] == gbif_id].iloc[0]
    
    sp_local = "Ikan Kembung Lelaki" if sp_code == "RKAN" else "Ikan Layang"
    sc_name = "Rastrelliger kanagurta" if sp_code == "RKAN" else "Decapterus macarellus"
    family = "Scombridae" if sp_code == "RKAN" else "Carangidae"
    
    new_master_rows.append({
        'image_id': q['image_id'],
        'filename': q['filename'],
        'specimen_id': f"SPEC-GBIF-{sp_code}-{gbif_id}",
        'species_local': sp_local,
        'scientific_name': sc_name,
        'family': family,
        'source_type': 'PUBLIC_GBIF',
        'source_name': f"GBIF Occurrence ({occ_match.get('datasetName', 'GBIF Occurrence')})",
        'source_url': occ_match.get('references') if pd.notna(occ_match.get('references')) else f"https://www.gbif.org/occurrence/{gbif_id}",
        'license': lic_match.get('license_standard'),
        'attribution': f"{occ_match.get('recordedBy', 'Observer')} via GBIF. Publisher: {occ_match.get('publisher', 'GBIF')}",
        'capture_location': f"{occ_match.get('locality', '')}, {occ_match.get('country', '')}".strip(', '),
        'capture_date': occ_match.get('eventDate', ''),
        'capture_session': 'GBIF_ACQUISITION_PH10',
        'camera_device': 'Field Camera / Museum Imaging Device',
        'image_width': q['width'],
        'image_height': q['height'],
        'annotation_status': 'UNANNOTATED',
        'annotation_type': 'NONE',
        'total_length_cm': np.nan,
        'length_type': 'UNKNOWN',
        'image_quality': q['quality_tier'],
        'verification_status': q['curation_status'],
        'split': 'UNASSIGNED',
        'notes': f"Category: {q['visual_category']}. Laplacian var: {q['blur_score']}. {q['curation_reason']}"
    })

df_new_master = pd.DataFrame(new_master_rows)
# Combine with original
df_master_combined = pd.concat([df_master_orig, df_new_master], ignore_index=True)
df_master_combined.to_csv(master_csv, index=False, encoding='utf-8')
print(f"Updated dataset_master.csv: {len(df_master_combined)} rows ({len(df_master_orig)} original preserved + {len(df_new_master)} GBIF candidates appended)")

# 7. Generate phase_10_summary.json
summary_data = {
    'phase': 'Phase 10 — GBIF Dataset Acquisition, Validation & Curation',
    'timestamp': time.strftime("%Y-%m-%d %H:%M:%S"),
    'gbif_api_endpoint': 'https://api.gbif.org/v1/occurrence/search',
    'species_targets': {
        'Rastrelliger_kanagurta': {
            'common_name': 'Ikan Kembung Lelaki',
            'family': 'Scombridae',
            'gbif_total_occurrences_with_image': 707,
            'metadata_media_extracted': 937,
            'candidates_attempted': len(rkan_unique),
            'download_success': int(df_log[(df_log['species_code'] == 'RKAN') & (df_log['download_status'] == 'SUCCESS')].shape[0]),
            'download_failed': int(df_log[(df_log['species_code'] == 'RKAN') & (df_log['download_status'] == 'FAILED')].shape[0]),
            'curation_breakdown': {
                'VERIFIED': int(df_quality[(df_quality['species_code'] == 'RKAN') & (df_quality['curation_status'] == 'VERIFIED')].shape[0]),
                'CANDIDATE': int(df_quality[(df_quality['species_code'] == 'RKAN') & (df_quality['curation_status'] == 'CANDIDATE')].shape[0]),
                'NEEDS_REVIEW': int(df_quality[(df_quality['species_code'] == 'RKAN') & (df_quality['curation_status'] == 'NEEDS_REVIEW')].shape[0]),
                'REJECTED': int(df_quality[(df_quality['species_code'] == 'RKAN') & (df_quality['curation_status'] == 'REJECTED')].shape[0])
            }
        },
        'Decapterus_macarellus': {
            'common_name': 'Ikan Layang',
            'family': 'Carangidae',
            'gbif_total_occurrences_with_image': 256,
            'metadata_media_extracted': 403,
            'candidates_attempted': len(dmac_unique),
            'download_success': int(df_log[(df_log['species_code'] == 'DMAC') & (df_log['download_status'] == 'SUCCESS')].shape[0]),
            'download_failed': int(df_log[(df_log['species_code'] == 'DMAC') & (df_log['download_status'] == 'FAILED')].shape[0]),
            'curation_breakdown': {
                'VERIFIED': int(df_quality[(df_quality['species_code'] == 'DMAC') & (df_quality['curation_status'] == 'VERIFIED')].shape[0]),
                'CANDIDATE': int(df_quality[(df_quality['species_code'] == 'DMAC') & (df_quality['curation_status'] == 'CANDIDATE')].shape[0]),
                'NEEDS_REVIEW': int(df_quality[(df_quality['species_code'] == 'DMAC') & (df_quality['curation_status'] == 'NEEDS_REVIEW')].shape[0]),
                'REJECTED': int(df_quality[(df_quality['species_code'] == 'DMAC') & (df_quality['curation_status'] == 'REJECTED')].shape[0])
            }
        }
    },
    'duplicates_found': {
        'exact_duplicates': int((df_quality['duplicate_type'] == 'EXACT_DUPLICATE').sum()),
        'perceptual_near_duplicates': int((df_quality['duplicate_type'] == 'PERCEPTUAL_NEAR_DUPLICATE').sum())
    },
    'total_candidates_appended_to_master': len(df_new_master),
    'contact_sheets_generated': [cs_rkan_path, cs_dmac_path],
    'training_readiness_status': 'NOT_READY_FOR_TRAINING',
    'training_readiness_reason': 'GBIF provides image occurrences without bounding boxes or TL calibration; domain shift towards underwater observations; field specimen images from Teluk Banten required.'
}

summary_json_path = os.path.join(REPORTS_DIR, "phase_10_summary.json")
with open(summary_json_path, "w", encoding='utf-8') as f:
    json.dump(summary_data, f, indent=2)
print(f"Saved summary JSON to: {summary_json_path}")
print("\nPHASE 10 PIPELINE COMPLETED SUCCESSFULLY!")
