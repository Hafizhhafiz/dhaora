import csv

with open('Fishguard_AI/fishguard_source_license_audit.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f"Total sources: {len(rows)}")
for r in rows:
    print(f"### {r['source_id']}: {r['source']}")
    print(f"- **URL**: {r['url']}")
    print(f"- **License Observed**: {r['license_regime_observed']}")
    print(f"- **Attribution Terms**: {r['attribution_terms']}")
    print(f"- **Verified Content**: {r['what_i_actually_verified']}")
    print(f"- **ML Training Addressed**: {r['ml_training_use_explicitly_addressed']}")
    print(f"- **Legal Risk**: `{r['legal_risk']}`")
    print(f"- **Recommended Action**: {r['recommended_action']}")
    print()
