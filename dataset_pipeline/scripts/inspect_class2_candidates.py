import csv

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

c2_review = [r for r in rows if r['target_class'] == '2' and r['acquisition_status'] == 'TAXONOMY_REVIEW']
print(f"Total Class 2 TAXONOMY_REVIEW records: {len(c2_review)}")
for r in c2_review:
    print(f"ID: {r['record_id']} | Source: {r['source_name']}")
    print(f"  Rights: {r['rights_holder_photographer']}")
    print(f"  License: {r['license_label']} ({r['license_tier']})")
    print(f"  Direct URL: {r['direct_image_url']}")
    print(f"  Page URL: {r['source_page_url']}")
    print(f"  Locality: {r['locality']}")
    print(f"  Status Reason: {r['status_reason'][:100]}...")
    print()
