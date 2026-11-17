import csv

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

c1_p2_ids = ['FG-C1-007', 'FG-C1-017', 'FG-C1-019', 'FG-C1-020', 'FG-C1-021', 'FG-C1-022', 'FG-C1-026', 'FG-C1-028', 'FG-C1-029']

for r in rows:
    if r['record_id'] in c1_p2_ids:
        print(f"Record: {r['record_id']} | Rights: {r['rights_holder_photographer']} | Lic: {r['license_label']}")
        print(f"  Status Reason: {r['status_reason']}")
        print(f"  Evidence:      {r['evidence_source']}")
        print(f"  Size/specimen: {r['size_or_specimen']}")
        print(f"  Locality:      {r['locality']}")
        print()
