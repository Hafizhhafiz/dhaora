import csv
from collections import Counter

with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print("=== Record Type ===")
for k, v in Counter(r['record_type'] for r in rows).most_common():
    print(f"  {k}: {v}")

print("\n=== Fish Condition ===")
for k, v in Counter(r['fish_condition'] for r in rows).most_common():
    print(f"  {k}: {v}")

print("\n=== Market / Landing Site locality mentions ===")
market_recs = []
for r in rows:
    loc = r.get('locality', '').lower()
    if any(m in loc for m in ['market', 'landing', 'tpi', 'port', 'dock', 'bazaar', 'harbour', 'fish stall', 'auction']):
        market_recs.append(r)
print(f"Total records mentioning market/landing/TPI: {len(market_recs)}")
for r in market_recs:
    print(f"  {r['record_id']} | Class {r['target_class']} | {r['target_species']} | Locality: {r['locality']} | Status: {r['acquisition_status']}")
