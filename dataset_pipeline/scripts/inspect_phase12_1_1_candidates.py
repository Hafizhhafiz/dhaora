import csv

with open('Fishguard_AI/fishguard_download_priority.csv', encoding='utf-8') as f:
    prio_rows = list(csv.DictReader(f))

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    inv_map = {r['record_id']: r for r in csv.DictReader(f)}

with open('Fishguard_AI/fishguard_taxonomy_review.csv', encoding='utf-8') as f:
    tax_map = {r['record_id']: r for r in csv.DictReader(f)}

# Identify P1 and P2 candidates
# Note from user:
# - 3 P1 candidates with CC0 license
# - 19 P2 candidates with non-commercial license
# Total: 22 candidates
p1_candidates = [r for r in prio_rows if r['priority_tier'] == 'P1' and r['license_tier'] == 'A_OPEN' and r['acquisition_status'] != 'TAXONOMY_REVIEW']
p2_candidates = [r for r in prio_rows if r['priority_tier'] == 'P2']

print(f"P1 Candidates count: {len(p1_candidates)}")
for r in p1_candidates:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Lic: {r['license_tier']} | Rights: {r['rights_holder']}")

print(f"\nP2 Candidates count: {len(p2_candidates)}")
for r in p2_candidates:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Lic: {r['license_tier']} | Rights: {r['rights_holder']}")

all_22 = p1_candidates + p2_candidates
print(f"\nTotal selected candidates: {len(all_22)}")

# Check their URLs in inventory
print("\n--- URL and Details for All 22 Candidates ---")
for idx, r in enumerate(all_22, 1):
    inv = inv_map[r['record_id']]
    d_url = inv.get('direct_image_url', '').strip()
    s_url = inv.get('source_page_url', '').strip()
    print(f"{idx}. {r['record_id']} (Class {r['target_class']}, {r['target_species']})")
    print(f"   Priority: {r['priority_tier']}, Status: {inv['acquisition_status']}, License: {inv['license_label']} ({inv['license_tier']})")
    print(f"   Rights: {inv['rights_holder_photographer']}")
    print(f"   Direct URL: {d_url if d_url else '[EMPTY/NULL]'}")
    print(f"   Direct URL Status: {inv.get('direct_url_status')}")
    print(f"   Source Page: {s_url}")
    print()
