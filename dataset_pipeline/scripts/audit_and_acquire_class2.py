import os
import csv
import hashlib
import urllib.request
import urllib.error
from pathlib import Path
from PIL import Image

WORKSPACE_ROOT = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
INVENTORY_CSV = WORKSPACE_ROOT / "Fishguard_AI" / "fishguard_public_image_inventory.csv"
OUTPUT_DIR = WORKSPACE_ROOT / "dataset_pipeline" / "public_reference_images" / "class_2_upeneus_sulphureus"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 FishGuardAI-Auditor/1.0"

def get_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def main():
    print(f"Reading inventory from {INVENTORY_CSV}...")
    with open(INVENTORY_CSV, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    
    c2_candidates = [r for r in rows if r["target_class"] == "2" and r["acquisition_status"] == "TAXONOMY_REVIEW"]
    print(f"Found {len(c2_candidates)} Class 2 candidates for taxonomic audit & acquisition.")

    results = []

    for item in c2_candidates:
        rec_id = item["record_id"]
        direct_url = item["direct_image_url"]
        source_name = item["source_name"]
        rights_holder = item["rights_holder_photographer"]
        license_label = item["license_label"]
        locality = item["locality"]
        
        # Decide file extension
        ext = ".jpg"
        if ".png" in direct_url.lower():
            ext = ".png"
        elif ".jpeg" in direct_url.lower():
            ext = ".jpeg"
            
        species_name = item.get("target_species", "upeneus_sulphureus")
        save_filename = f"{rec_id}_{species_name.replace(' ', '_').lower()}{ext}"
        save_path = OUTPUT_DIR / save_filename

        print(f"\nProcessing {rec_id} ({source_name}):")
        print(f"  URL: {direct_url}")
        
        req = urllib.request.Request(
            direct_url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
                "Referer": item["source_page_url"] or "https://www.google.com/"
            }
        )

        success = False
        error_msg = ""
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                status_code = resp.getcode()
                content = resp.read()
                if len(content) == 0:
                    error_msg = "Received 0 bytes from server"
                else:
                    with open(save_path, "wb") as f_out:
                        f_out.write(content)
                    success = True
        except Exception as e:
            error_msg = str(e)

        if success:
            file_size_kb = round(save_path.stat().st_size / 1024, 2)
            sha = get_hash(save_path)
            try:
                with Image.open(save_path) as im:
                    w, h = im.size
                    fmt = im.format
                    mode = im.mode
                print(f"  [OK] Saved {save_filename} ({file_size_kb} KB, {w}x{h}, {fmt}, {mode})")
                print(f"  SHA-256: {sha}")
                results.append({
                    "record_id": rec_id,
                    "filename": save_filename,
                    "status": "DOWNLOAD_SUCCESS",
                    "filesize_kb": file_size_kb,
                    "width": w,
                    "height": h,
                    "format": fmt,
                    "sha256": sha,
                    "rights_holder": rights_holder,
                    "license": license_label,
                    "locality": locality,
                    "error": ""
                })
            except Exception as e:
                print(f"  [CORRUPT] Downloaded file cannot be read by PIL: {e}")
                results.append({
                    "record_id": rec_id,
                    "filename": save_filename,
                    "status": "CORRUPT_IMAGE",
                    "filesize_kb": file_size_kb,
                    "width": 0,
                    "height": 0,
                    "format": "",
                    "sha256": sha,
                    "rights_holder": rights_holder,
                    "license": license_label,
                    "locality": locality,
                    "error": str(e)
                })
        else:
            print(f"  [FAILED] {error_msg}")
            results.append({
                "record_id": rec_id,
                "filename": "",
                "status": "DOWNLOAD_FAILED",
                "filesize_kb": 0,
                "width": 0,
                "height": 0,
                "format": "",
                "sha256": "",
                "rights_holder": rights_holder,
                "license": license_label,
                "locality": locality,
                "error": error_msg
            })

    # Summary
    success_count = sum(1 for r in results if r["status"] == "DOWNLOAD_SUCCESS")
    print(f"\nAcquisition complete: {success_count}/{len(c2_candidates)} successfully downloaded.")

if __name__ == "__main__":
    main()
