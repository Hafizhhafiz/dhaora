import csv

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

dup_dict = {}
for r in rows:
    dg = r.get('dup_group', '').strip()
    if dg:
        if dg not in dup_dict:
            dup_dict[dg] = []
        dup_dict[dg].append(r)

print(f"Total duplicate groups: {len(dup_dict)}")
for g_name, recs in dup_dict.items():
    print(f"\nGroup: {g_name} ({len(recs)} records)")
    for r in recs:
        print(f"  ID: {r['record_id']} | Class: {r['target_class']} | {r['target_species']} | Source: {r['source_name']} | Locality: {r['locality']} | Date: {r['date']} | Status: {r['acquisition_status']}")
