import csv

with open('Fishguard_AI/fishguard_taxonomy_review.csv', encoding='utf-8') as f:
    tax_rows = list(csv.DictReader(f))

print(f"Total taxonomy review rows: {len(tax_rows)}")

u_sulph = [r for r in tax_rows if r['target_class'] == '2']
print(f"Upeneus sulphureus records in review: {len(u_sulph)}")

# Show unique review triggers and diagnostic checks for Class 2
u_triggers = set(r['review_triggers'] for r in u_sulph)
print("\nUnique review triggers for Upeneus sulphureus:")
for t in u_triggers:
    print(f"  - {t}")

print("\nSample diagnostic checks for Upeneus sulphureus:")
for r in u_sulph[:3]:
    print(f"ID: {r['record_id']} | Current Conf: {r['current_confidence']} | Post2025: {r['post2025_review_required']}")
    print(f"  Triggers: {r['review_triggers']}")
    print(f"  Diagnostics: {r['diagnostic_checks']}")
    print(f"  Action: {r['required_action']}")
    print()

r_brachy = [r for r in tax_rows if r['target_class'] == '0']
print(f"\nRastrelliger brachysoma records in review: {len(r_brachy)}")
for r in r_brachy[:3]:
    print(f"ID: {r['record_id']} | Current Conf: {r['current_confidence']}")
    print(f"  Triggers: {r['review_triggers']}")
    print(f"  Diagnostics: {r['diagnostic_checks']}")
    print(f"  Action: {r['required_action']}")
    print()

s_lepto = [r for r in tax_rows if r['target_class'] == '1']
print(f"\nSelaroides leptolepis records in review: {len(s_lepto)}")
for r in s_lepto[:3]:
    print(f"ID: {r['record_id']} | Current Conf: {r['current_confidence']}")
    print(f"  Triggers: {r['review_triggers']}")
    print(f"  Diagnostics: {r['diagnostic_checks']}")
    print(f"  Action: {r['required_action']}")
    print()
