import csv

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    inv = list(csv.DictReader(f))

tier_a = [r for r in inv if r['license_tier'] == 'A_OPEN']
print(f"Total Tier A_OPEN records ({len(tier_a)}):")
for r in tier_a:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Status: {r['acquisition_status']} | Source: {r['source_name']} | Rights: {r['rights_holder_photographer']}")
