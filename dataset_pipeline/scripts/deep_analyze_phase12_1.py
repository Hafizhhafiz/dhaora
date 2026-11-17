import csv
import json
from collections import Counter, defaultdict

def analyze_all():
    with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
        inv = list(csv.DictReader(f))
    with open('Fishguard_AI/fishguard_download_priority.csv', encoding='utf-8') as f:
        prio = list(csv.DictReader(f))
    with open('Fishguard_AI/fishguard_taxonomy_review.csv', encoding='utf-8') as f:
        tax = list(csv.DictReader(f))
    with open('Fishguard_AI/fishguard_source_license_audit.csv', encoding='utf-8') as f:
        src = list(csv.DictReader(f))

    print(f"Counts: Inv={len(inv)}, Prio={len(prio)}, Tax={len(tax)}, Src={len(src)}")

    # 1. Species breakdown in inventory
    sp_count = Counter((r['target_class'], r['target_species']) for r in inv)
    print("\nSpecies breakdown in Inventory:")
    for (tc, ts), cnt in sorted(sp_count.items()):
        print(f"  Class {tc} ({ts}): {cnt}")

    # 2. License tier breakdown
    lic_count = Counter(r['license_tier'] for r in inv)
    print("\nLicense Tier breakdown in Inventory:")
    for lic, cnt in sorted(lic_count.items()):
        print(f"  Tier {lic}: {cnt}")

    # 3. Record type breakdown
    rec_type_count = Counter(r['record_type'] for r in inv)
    print("\nRecord Type breakdown in Inventory:")
    for rt, cnt in sorted(rec_type_count.items(), key=lambda x: -x[1]):
        print(f"  {rt}: {cnt}")

    # 4. Acquisition status breakdown
    acq_count = Counter(r['acquisition_status'] for r in inv)
    print("\nAcquisition Status breakdown in Inventory:")
    for acq, cnt in sorted(acq_count.items(), key=lambda x: -x[1]):
        print(f"  {acq}: {cnt}")

    # 5. Direct URL status breakdown
    durl_status = Counter(r['direct_url_status'] for r in inv)
    print("\nDirect URL status in Inventory:")
    for ds, cnt in sorted(durl_status.items(), key=lambda x: -x[1]):
        print(f"  {ds}: {cnt}")

    # 6. Duplication groups
    dup_groups = defaultdict(list)
    for r in inv:
        dg = r.get('dup_group', '').strip()
        if dg:
            dup_groups[dg].append(r['record_id'])
    print(f"\nDuplication groups: {len(dup_groups)} groups, {sum(len(v) for v in dup_groups.values())} records")
    for dg, recs in dup_groups.items():
        print(f"  {dg}: {recs}")

    # 7. Priority Tiers in Priority CSV
    prio_tiers = Counter(r['priority_tier'] for r in prio)
    print("\nPriority Tiers in Download Priority CSV:")
    for pt, cnt in sorted(prio_tiers.items()):
        print(f"  {pt}: {cnt}")

    prio_actions = Counter(r['action'] for r in prio)
    print("\nActions in Download Priority CSV:")
    for pa, cnt in sorted(prio_actions.items(), key=lambda x: -x[1]):
        print(f"  {pa}: {cnt}")

    # 8. Post-2025 review in Taxonomy Review CSV
    post2025 = Counter(r['post2025_review_required'] for r in tax)
    print("\nPost-2025 Review Required in Taxonomy Review CSV:")
    for p, cnt in sorted(post2025.items()):
        print(f"  {p}: {cnt}")

    tax_decisions = Counter(r['reviewer_decision'] for r in tax)
    print("\nReviewer Decisions in Taxonomy Review CSV:")
    for td, cnt in sorted(tax_decisions.items(), key=lambda x: -x[1]):
        print(f"  {td}: {cnt}")

    # 9. Cross-reconciliation: which records in Inv are NOT in Priority, Tax?
    inv_ids = set(r['record_id'] for r in inv)
    prio_ids = set(r['record_id'] for r in prio)
    tax_ids = set(r['record_id'] for r in tax)

    diff_inv_prio = inv_ids - prio_ids
    diff_inv_tax = inv_ids - tax_ids

    print(f"\nInv records missing from Priority ({len(diff_inv_prio)}): {sorted(diff_inv_prio)}")
    print(f"Inv records missing from Taxonomy ({len(diff_inv_tax)}): {sorted(diff_inv_tax)}")

    # Details on why missing from priority
    print("\nMissing from Priority details:")
    for r in inv:
        if r['record_id'] in diff_inv_prio:
            print(f"  {r['record_id']} | Class: {r['target_class']} | {r['target_species']} | {r['record_type']} | {r['acquisition_status']} | Reason: {r['status_reason']}")

    # 10. Source License Audit analysis
    print("\nSource License summary:")
    for s in src:
        print(f"  {s['source_id']} ({s['source']}): Observed={s['license_regime_observed']} | Risk={s['legal_risk']} | Action={s['recommended_action']}")

if __name__ == '__main__':
    analyze_all()
