import csv
import os

manifest_file = 'dataset_pipeline/reports/phase_12_1_1/public_reference_image_manifest.csv'
failure_file = 'dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_download_failures.csv'
lic_reg_file = 'dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_license_attribution_register.csv'
qc_file = 'dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_image_quality_audit.csv'

with open(manifest_file, encoding='utf-8') as f:
    manifest = list(csv.DictReader(f))
with open(failure_file, encoding='utf-8') as f:
    failures = list(csv.DictReader(f))
with open(lic_reg_file, encoding='utf-8') as f:
    lic_reg = list(csv.DictReader(f))
with open(qc_file, encoding='utf-8') as f:
    qc = list(csv.DictReader(f))

print(f"Manifest rows: {len(manifest)}")
print(f"Failures rows: {len(failures)}")
print(f"License register rows: {len(lic_reg)}")
print(f"Quality audit rows: {len(qc)}")

# Check files on disk
base_dir = 'dataset_pipeline/public_reference_images'
c0_files = os.listdir(os.path.join(base_dir, 'class_0_rastrelliger_brachysoma'))
c1_files = os.listdir(os.path.join(base_dir, 'class_1_selaroides_leptolepis'))
c2_files = os.listdir(os.path.join(base_dir, 'class_2_upeneus_sulphureus'))
q_files = os.listdir(os.path.join(base_dir, 'quarantine'))
ood_files = os.listdir(os.path.join(base_dir, 'ood_reference'))

print(f"\nFiles on disk:")
print(f"  Class 0: {len(c0_files)} files -> {c0_files}")
print(f"  Class 1: {len(c1_files)} files -> {c1_files}")
print(f"  Class 2: {len(c2_files)} files -> {c2_files}")
print(f"  Quarantine: {len(q_files)} files -> {q_files}")
print(f"  OOD: {len(ood_files)} files -> {ood_files}")

# Verify FG-C1-019
c1_019_manifest = [r for r in manifest if r['record_id'] == 'FG-C1-019']
print(f"\nFG-C1-019 in manifest: {c1_019_manifest[0]['taxonomy_status']}, notes: {c1_019_manifest[0]['notes']}")
print(f"FG-C1-019 file in quarantine: {'FG-C1-019_1_selaroides_leptolepis.jpg' in q_files}")

# Verify FG-C0-009
c0_009_failure = [r for r in failures if r['record_id'] == 'FG-C0-009']
print(f"\nFG-C0-009 in failures: {c0_009_failure[0]['error_reason']}")
print(f"FG-C0-009 in manifest: {any(r['record_id'] == 'FG-C0-009' for r in manifest)}")

# Verify SHA256 uniqueness vs biological duplicates
print("\nBiological clusters in downloaded set:")
for m in manifest:
    rid = m['record_id']
    if rid in ['FG-C0-016', 'FG-C0-017']:
        print(f"  Cluster DUP-INAT-4f48550b: {rid} | SHA256: {m['sha256'][:16]}... | WxH: {m['image_width']}x{m['image_height']}")
    elif rid in ['FG-C1-020', 'FG-C1-021']:
        print(f"  Cluster DUP-OSMANY-20130318: {rid} | SHA256: {m['sha256'][:16]}... | WxH: {m['image_width']}x{m['image_height']}")
    elif rid in ['FG-C1-022']:
        print(f"  Cluster DUP-OSMANY-20130625: {rid} (FG-C1-023 held in PERMISSION_REQUIRED) | SHA256: {m['sha256'][:16]}...")
