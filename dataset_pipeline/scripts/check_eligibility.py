import csv
from collections import Counter

with open('dataset_pipeline/reports/phase_12_1/public_image_inventory_audited.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f"Total audited records: {len(rows)}")
elig = Counter(r['download_eligibility'] for r in rows)
for k, v in sorted(elig.items()):
    print(f"  {k}: {v}")

print("\nEligibility by Class:")
by_class = Counter((r['target_class'], r['download_eligibility']) for r in rows)
for (cls, el), cnt in sorted(by_class.items()):
    print(f"  Class {cls} | {el}: {cnt}")
