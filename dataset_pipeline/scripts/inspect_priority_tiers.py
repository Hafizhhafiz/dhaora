import csv

with open('Fishguard_AI/fishguard_download_priority.csv', encoding='utf-8') as f:
    prio = list(csv.DictReader(f))

print(f"Total Priority rows: {len(prio)}")
for tier in ['P1', 'P2', 'P3', 'P4', 'P5']:
    tier_rows = [r for r in prio if r['priority_tier'] == tier]
    print(f"\n--- {tier} ({len(tier_rows)} records) ---")
    actions = set(r['action'] for r in tier_rows)
    for a in actions:
        cnt = sum(1 for r in tier_rows if r['action'] == a)
        print(f"  Action [{a}]: {cnt} records")
    # Show sample records
    for r in tier_rows[:3]:
        print(f"    Rank {r['rank']} | ID: {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Lic: {r['license_tier']} | Acq: {r['acquisition_status']}")
        print(f"      Gate: {r['gate_before_training']}")
        print(f"      Rationale: {r['rationale'][:100]}...")
