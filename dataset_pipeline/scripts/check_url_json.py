import json

with open('dataset_pipeline/reports/phase_12_1/url_reachability_results.json', encoding='utf-8') as f:
    d = json.load(f)

print('=== Direct URLs Reachability Summary ===')
statuses = {}
for u, info in d['direct_urls_tested'].items():
    st = info['status']
    statuses[st] = statuses.get(st, 0) + 1
for st, cnt in sorted(statuses.items()):
    print(f'  {st}: {cnt}')

print('\n=== Non-200 Direct URLs ===')
non_200 = 0
for u, info in d['direct_urls_tested'].items():
    if not info['status'].startswith('HTTP_200'):
        non_200 += 1
        print(f"  {info['status']} | {u[:70]} | Records: {info['record_ids']}")
if non_200 == 0:
    print("  None! All 47 direct URLs returned HTTP_200!")
