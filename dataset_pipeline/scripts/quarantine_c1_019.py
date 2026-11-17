import csv
import os
import shutil

src_file = 'dataset_pipeline/public_reference_images/class_1_selaroides_leptolepis/FG-C1-019_1_selaroides_leptolepis.jpg'
dst_file = 'dataset_pipeline/public_reference_images/quarantine/FG-C1-019_1_selaroides_leptolepis.jpg'

if os.path.exists(src_file):
    shutil.move(src_file, dst_file)
    print(f"Moved {src_file} -> {dst_file}")

# Update manifest
manifest_path = 'dataset_pipeline/reports/phase_12_1_1/public_reference_image_manifest.csv'
with open(manifest_path, encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

for r in rows:
    if r['record_id'] == 'FG-C1-019':
        r['taxonomy_status'] = 'QUARANTINE_UNDERWATER_DOMAIN'
        r['notes'] = 'Underwater dive photo (Tulamben Bali by Carlos Faria); moved to quarantine per review criteria (non-landed domain)'

with open(manifest_path, 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=rows[0].keys())
    w.writeheader()
    w.writerows(rows)

# Update root manifest copy
root_manifest = 'dataset_pipeline/public_reference_images/public_reference_image_manifest.csv'
with open(root_manifest, 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=rows[0].keys())
    w.writeheader()
    w.writerows(rows)

# Update QC audit
qc_path = 'dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_image_quality_audit.csv'
with open(qc_path, encoding='utf-8') as f:
    qc_rows = list(csv.DictReader(f))

for r in qc_rows:
    if r['record_id'] == 'FG-C1-019':
        r['scene_type'] = 'UNDERWATER_DIVING_PHOTOGRAPH'
        r['suitable_for_yolo_training'] = 'NO_QUARANTINED_UNDERWATER'
        r['qc_verdict'] = 'QUARANTINE_UNDERWATER'

with open(qc_path, 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=qc_rows[0].keys())
    w.writeheader()
    w.writerows(qc_rows)

print("Updated manifest and QC records for FG-C1-019 quarantine.")
