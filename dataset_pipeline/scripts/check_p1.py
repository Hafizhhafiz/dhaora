import csv

with open('Fishguard_AI/fishguard_download_priority.csv', encoding='utf-8') as f:
    prio = list(csv.DictReader(f))

for r in prio:
    if r['priority_tier'] == 'P1':
        print(f"Rank {r['rank']} | ID: {r['record_id']} | Class: {r['target_class']} | {r['target_species']} | Lic: {r['license_tier']} | Acq: {r['acquisition_status']}")
