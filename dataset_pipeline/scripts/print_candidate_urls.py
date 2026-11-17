import csv

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    inv_map = {r['record_id']: r for r in csv.DictReader(f)}

c0_ids = ['FG-C0-018', 'FG-C0-006', 'FG-C0-008', 'FG-C0-009', 'FG-C0-011', 'FG-C0-012', 'FG-C0-013', 'FG-C0-014', 'FG-C0-015', 'FG-C0-016', 'FG-C0-017']
c1_ids = ['FG-C1-031', 'FG-C1-032', 'FG-C1-007', 'FG-C1-017', 'FG-C1-019', 'FG-C1-020', 'FG-C1-021', 'FG-C1-022', 'FG-C1-026', 'FG-C1-028', 'FG-C1-029']

print("=== CLASS 0 CANDIDATES (11 records) ===")
for rid in c0_ids:
    r = inv_map[rid]
    print(f"ID: {rid} | Lic: {r['license_tier']} ({r['license_label']}) | Rights: {r['rights_holder_photographer']}")
    print(f"  Direct URL: {r['direct_image_url']}")
    print(f"  Page URL:   {r['source_page_url']}")
    print(f"  Status:     {r['direct_url_status']}")
    print()

print("=== CLASS 1 CANDIDATES (11 records) ===")
for rid in c1_ids:
    r = inv_map[rid]
    print(f"ID: {rid} | Lic: {r['license_tier']} ({r['license_label']}) | Rights: {r['rights_holder_photographer']}")
    print(f"  Direct URL: {r['direct_image_url']}")
    print(f"  Page URL:   {r['source_page_url']}")
    print(f"  Status:     {r['direct_url_status']}")
    print()
