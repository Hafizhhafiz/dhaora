import os
import sys
import json
import hashlib
import pandas as pd
import numpy as np

WORKSPACE_ROOT = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI"
PIPELINE_ROOT = os.path.join(WORKSPACE_ROOT, "dataset_pipeline")
METADATA_DIR = os.path.join(PIPELINE_ROOT, "metadata")
REPORTS_DIR = os.path.join(PIPELINE_ROOT, "reports", "phase_10")
DATA_DIR = os.path.join(PIPELINE_ROOT, "data", "public", "gbif")

# Load all files
df_master = pd.read_csv(os.path.join(METADATA_DIR, "dataset_master.csv"))
df_occ = pd.read_csv(os.path.join(METADATA_DIR, "gbif_occurrences.csv"))
df_lic = pd.read_csv(os.path.join(METADATA_DIR, "gbif_license_audit.csv"))
df_dl = pd.read_csv(os.path.join(METADATA_DIR, "gbif_download_log.csv"))
df_qual = pd.read_csv(os.path.join(METADATA_DIR, "gbif_quality_report.csv"))
df_exp = pd.read_csv(os.path.join(REPORTS_DIR, "expert_review_needed.csv"))
df_fail = pd.read_csv(os.path.join(REPORTS_DIR, "download_failed.csv"))

print("=== 1. PHYSICAL FILE RECONCILIATION ===")
raw_rkan_dir = os.path.join(DATA_DIR, "raw", "rastrelliger_kanagurta")
raw_dmac_dir = os.path.join(DATA_DIR, "raw", "decapterus_macarellus")
cand_rkan_dir = os.path.join(DATA_DIR, "candidate", "rastrelliger_kanagurta")
cand_dmac_dir = os.path.join(DATA_DIR, "candidate", "decapterus_macarellus")
ver_rkan_dir = os.path.join(DATA_DIR, "verified", "rastrelliger_kanagurta")
ver_dmac_dir = os.path.join(DATA_DIR, "verified", "decapterus_macarellus")
rej_dir = os.path.join(DATA_DIR, "rejected")

files_raw_rkan = os.listdir(raw_rkan_dir) if os.path.exists(raw_rkan_dir) else []
files_raw_dmac = os.listdir(raw_dmac_dir) if os.path.exists(raw_dmac_dir) else []
files_cand_rkan = os.listdir(cand_rkan_dir) if os.path.exists(cand_rkan_dir) else []
files_cand_dmac = os.listdir(cand_dmac_dir) if os.path.exists(cand_dmac_dir) else []
files_ver_rkan = os.listdir(ver_rkan_dir) if os.path.exists(ver_rkan_dir) else []
files_ver_dmac = os.listdir(ver_dmac_dir) if os.path.exists(ver_dmac_dir) else []
files_rej = os.listdir(rej_dir) if os.path.exists(rej_dir) else []

print(f"Physical files in raw/rastrelliger_kanagurta: {len(files_raw_rkan)}")
print(f"Physical files in raw/decapterus_macarellus: {len(files_raw_dmac)}")
print(f"Total raw files downloaded: {len(files_raw_rkan) + len(files_raw_dmac)}")
print(f"Physical files in candidate/: {len(files_cand_rkan)} (RKAN) + {len(files_cand_dmac)} (DMAC) = {len(files_cand_rkan) + len(files_cand_dmac)}")
print(f"Physical files in verified/: {len(files_ver_rkan)} (RKAN) + {len(files_ver_dmac)} (DMAC) = {len(files_ver_rkan) + len(files_ver_dmac)}")
print(f"Physical files in rejected/: {len(files_rej)}")

# Check Master physical files exist
master_missing = []
for idx, row in df_master.iterrows():
    fn = row['filename']
    st = row['source_type']
    if st == 'PUBLIC_GBIF':
        sp = "rastrelliger_kanagurta" if "RKAN" in fn else "decapterus_macarellus"
        raw_p = os.path.join(DATA_DIR, "raw", sp, fn)
        if not os.path.exists(raw_p):
            master_missing.append((fn, raw_p))
    elif st == 'SYNTHETIC_TEST':
        # Check in sample_calibrated_images or test_audit_variations
        p1 = os.path.join(PIPELINE_ROOT, "sample_calibrated_images", fn)
        p2 = os.path.join(PIPELINE_ROOT, "test_audit_variations", fn)
        if not (os.path.exists(p1) or os.path.exists(p2)):
            master_missing.append((fn, "synthetic path"))

print(f"Master entries missing physical files: {len(master_missing)}")

# 2. Reconcile 207 downloads
success_filenames = set(df_dl[df_dl['download_status'] == 'SUCCESS']['filename'])
print(f"Successful download log filenames: {len(success_filenames)}")
master_gbif_filenames = set(df_master[df_master['source_type'] == 'PUBLIC_GBIF']['filename'])
print(f"Master GBIF filenames: {len(master_gbif_filenames)}")
diff_32 = success_filenames - master_gbif_filenames
print(f"32 files excluded from master: {len(diff_32)}")

# Breakdown of the 32 excluded files
df_diff_32 = df_qual[df_qual['filename'].isin(diff_32)]
print("Breakdown of 32 excluded files in quality report:")
print(df_diff_32['curation_status'].value_counts())
print(df_diff_32[['filename', 'species_code', 'curation_status', 'curation_reason']].head(10).to_string())

# 3. Duplicate and individual analysis
print("\n=== 2. DUPLICATE & INDIVIDUAL AUDIT ===")
print(f"Unique gbifIDs in gbif_occurrences: {df_occ['gbifID'].nunique()} / {len(df_occ)}")
print(f"Unique occurrenceIDs in gbif_occurrences: {df_occ['occurrenceID'].nunique() if 'occurrenceID' in df_occ else 'N/A'}")
print(f"Unique media_identifiers in gbif_occurrences: {df_occ['media_identifier'].nunique()} / {len(df_occ)}")

# In downloaded 207 files:
print(f"Downloaded files: {len(df_qual)}")
print(f"Unique sha256 in downloaded: {df_qual['sha256'].nunique()} / {len(df_qual)}")
dup_sha = df_qual[df_qual.duplicated(subset=['sha256'], keep=False)]
print(f"Files with identical SHA-256: {len(dup_sha)}")
for h, grp in dup_sha.groupby('sha256'):
    print(f"  Hash {h[:12]}... : {grp['filename'].tolist()} (gbifIDs: {grp['gbifID'].tolist()})")

# In occurrences: multiple media per gbifID
occ_per_gbif = df_occ.groupby('gbifID').size()
multi_media_gbif = occ_per_gbif[occ_per_gbif > 1]
print(f"Occurrences with multiple images (same observation event/individual): {len(multi_media_gbif)}")
print(f"Max images for single gbifID: {occ_per_gbif.max()}")

# 4. Taxonomic audit
print("\n=== 3. TAXONOMIC AUDIT ===")
print("Taxonomic status in gbif_occurrences:")
print(df_occ.groupby(['species_code', 'taxonomicStatus', 'acceptedScientificName']).size())

print("\nIn 75 'VERIFIED' records of Phase 10:")
df_ver = df_qual[df_qual['curation_status'] == 'VERIFIED']
ver_gbif_ids = df_ver['gbifID'].unique()
ver_occ = df_occ[df_occ['gbifID'].isin(ver_gbif_ids)]
print("Countries in 'VERIFIED':", ver_occ['country'].value_counts().to_dict())
print("Taxonomic status in 'VERIFIED':", ver_occ['taxonomicStatus'].value_counts().to_dict())
print("Scientific names in 'VERIFIED':", ver_occ['scientificName'].value_counts().to_dict())
print("Basis of record in 'VERIFIED':", ver_occ['basisOfRecord'].value_counts().to_dict())
print("Dataset names in 'VERIFIED':", ver_occ['datasetName'].value_counts().head(5).to_dict())

# 5. License reassessment
print("\n=== 4. LICENSE REASSESSMENT ===")
print("Standardized licenses across 1,340 media items:")
print(df_lic['license_standard'].value_counts())
print("\nLicenses across 207 downloaded files:")
df_dl_lic = df_lic[df_lic['gbifID'].isin(df_qual['gbifID'])]
print(df_dl_lic['license_standard'].value_counts())

