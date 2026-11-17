import csv
from collections import Counter

with open('dataset_pipeline/reports/phase_12_1_1/public_reference_image_manifest.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f"Total downloaded rows in manifest: {len(rows)}")

# 1. Check SHA256 duplicates
hashes = [r['sha256'] for r in rows]
hash_counts = Counter(hashes)
dups = {h: cnt for h, cnt in hash_counts.items() if cnt > 1}
if dups:
    print(f"DUPLICATE SHA256 DETECTED ({len(dups)}):")
    for h, cnt in dups.items():
        matching = [r['record_id'] for r in rows if r['sha256'] == h]
        print(f"  Hash {h[:16]}... appears in {matching}")
else:
    print("Zero identical binary files (All 21 SHA256 hashes are completely unique!).")

# 2. Check dimensions and sizes
print("\nImage Statistics:")
for r in rows:
    print(f"ID: {r['record_id']} | Cls: {r['class_id']} | {r['file_format']} {r['image_width']}x{r['image_height']} | Size: {int(r['file_size_bytes']):,} bytes | Local: {r['local_filename']}")
