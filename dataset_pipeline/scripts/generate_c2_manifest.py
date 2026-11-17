import os
import csv
import hashlib
from pathlib import Path
from PIL import Image
from datetime import datetime

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
INVENTORY_CSV = WORKSPACE / "Fishguard_AI" / "fishguard_public_image_inventory.csv"
C2_DIR = WORKSPACE / "dataset_pipeline" / "public_reference_images" / "class_2_upeneus_sulphureus"
PHASE_12_1_1_DIR = WORKSPACE / "dataset_pipeline" / "reports" / "phase_12_1_1"
PHASE_12_1_2_DIR = WORKSPACE / "dataset_pipeline" / "reports" / "phase_12_1_2"
PHASE_12_1_2_DIR.mkdir(parents=True, exist_ok=True)

def get_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

with open(INVENTORY_CSV, encoding="utf-8") as f:
    inv_rows = {r["record_id"]: r for r in csv.DictReader(f)}

# Read existing manifest
with open(PHASE_12_1_1_DIR / "public_reference_image_manifest.csv", encoding="utf-8") as f:
    existing_manifest = list(csv.DictReader(f))
    fieldnames = list(existing_manifest[0].keys())

c2_manifest_rows = []
today_str = datetime.now().strftime("%Y-%m-%d")

c2_ids = ["FG-C2-010", "FG-C2-011", "FG-C2-012", "FG-C2-013", "FG-C2-014", "FG-C2-019", "FG-C2-020", "FG-C2-021", "FG-C2-022", "FG-C2-023"]

for cid in c2_ids:
    inv = inv_rows[cid]
    filename = f"{cid}_upeneus_sulphureus.jpg"
    filepath = C2_DIR / filename
    
    with Image.open(filepath) as img:
        w, h = img.size
        fmt = img.format
    size_bytes = filepath.stat().st_size
    sha = get_hash(filepath)
    
    row = {
        "image_id": f"IMG-{cid}",
        "record_id": cid,
        "class_id": "2",
        "scientific_name": "Upeneus sulphureus",
        "common_name": "Kuniran / Sulphur goatfish",
        "source_name": inv["source_name"],
        "source_page_url": inv["source_page_url"],
        "direct_image_url": inv["direct_image_url"],
        "photographer": inv["rights_holder_photographer"],
        "license": inv["license_label"],
        "attribution": f"Photo by {inv['rights_holder_photographer']} via {inv['source_name']}, License: {inv['license_label']}",
        "download_date": today_str,
        "original_filename": Path(inv["direct_image_url"]).name,
        "local_filename": f"class_2_upeneus_sulphureus/{filename}",
        "file_format": fmt,
        "image_width": str(w),
        "image_height": str(h),
        "file_size_bytes": str(size_bytes),
        "sha256": sha,
        "download_status": "DOWNLOADED_SUCCESS",
        "taxonomy_status": "TAXONOMY_CLEARED_UIBLEIN_2025",
        "usage_restriction": "ACADEMIC_RESEARCH_ONLY" if "NC" in inv["license_label"] or "FishBase" in inv["source_name"] else "ATTRIBUTION_REQUIRED",
        "notes": f"Verified against Uiblein et al. (2025): Plain caudal fin without dark bars, white barbels, two yellow lateral stripes. Locality: {inv['locality']}."
    }
    c2_manifest_rows.append(row)

# Write Class 2 specific manifest
with open(PHASE_12_1_2_DIR / "phase_12_1_2_class2_manifest.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(c2_manifest_rows)

# Write comprehensive master manifest v2
master_rows = existing_manifest + c2_manifest_rows
with open(PHASE_12_1_2_DIR / "public_reference_image_manifest_v2.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(master_rows)

print(f"Generated Phase 12.1.2 Class 2 manifest ({len(c2_manifest_rows)} records)")
print(f"Generated Master Manifest v2 ({len(master_rows)} total records across Class 0, 1, 2)")
