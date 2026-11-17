import csv

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    inv = list(csv.DictReader(f))

rejected = [r for r in inv if r['acquisition_status'] == 'REJECTED']
ood = [r for r in inv if r['acquisition_status'] == 'OOD_REFERENCE']
tax_review = [r for r in inv if r['acquisition_status'] == 'TAXONOMY_REVIEW']
ready = [r for r in inv if r['acquisition_status'] == 'READY_FOR_REVIEW']
perm = [r for r in inv if r['acquisition_status'] == 'PERMISSION_REQUIRED']

print(f"REJECTED ({len(rejected)}):")
for r in rejected:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Type: {r['record_type']} | Reason: {r['status_reason']}")

print(f"\nOOD_REFERENCE ({len(ood)}):")
for r in ood:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Type: {r['record_type']} | Reason: {r['status_reason']}")

print(f"\nREADY_FOR_REVIEW ({len(ready)}):")
for r in ready:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Tier: {r['license_tier']} | Rights: {r['rights_holder_photographer']}")

print(f"\nTAXONOMY_REVIEW ({len(tax_review)}):")
for r in tax_review:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Tier: {r['license_tier']} | Reason: {r['status_reason']}")
