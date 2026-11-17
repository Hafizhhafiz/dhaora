import csv
import json
from urllib.parse import urlparse

def build_audited_csv():
    # Load input files
    with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
        inv_rows = list(csv.DictReader(f))

    prio_map = {}
    with open('Fishguard_AI/fishguard_download_priority.csv', encoding='utf-8') as f:
        for r in csv.DictReader(f):
            prio_map[r['record_id']] = r

    tax_map = {}
    with open('Fishguard_AI/fishguard_taxonomy_review.csv', encoding='utf-8') as f:
        for r in csv.DictReader(f):
            tax_map[r['record_id']] = r

    with open('dataset_pipeline/reports/phase_12_1/url_reachability_results.json', encoding='utf-8') as f:
        url_reach = json.load(f)

    direct_tested = url_reach.get('direct_urls_tested', {})
    domain_reach = url_reach.get('domain_reachability', {})

    audited_rows = []

    for r in inv_rows:
        rec_id = r['record_id']
        prio_info = prio_map.get(rec_id, {})
        tax_info = tax_map.get(rec_id, {})

        # Determine URL reachability
        d_url = r.get('direct_image_url', '').strip()
        p_url = r.get('source_page_url', '').strip()
        
        reach_status = "NO_DIRECT_URL"
        if d_url:
            if d_url in direct_tested:
                reach_status = direct_tested[d_url]['status']
            else:
                reach_status = "DIRECT_URL_NOT_TESTED"
        else:
            # check page domain reachability
            if p_url:
                dom = urlparse(p_url).netloc
                page_st = domain_reach.get(dom, "UNKNOWN_DOMAIN")
                reach_status = f"PAGE_ONLY_{page_st}"
            else:
                reach_status = "NO_URL_PROVIDED"

        # Determine priority tier & action
        prio_tier = prio_info.get('priority_tier', 'EXCLUDED_REJECTED' if r['acquisition_status'] == 'REJECTED' else 'UNASSIGNED')
        prio_action = prio_info.get('action', 'Excluded from priority list' if r['acquisition_status'] == 'REJECTED' else 'Unassigned')

        # Determine taxonomic review status
        post2025 = tax_info.get('post2025_review_required', r.get('post2025_review_flag', 'NO'))
        tax_decision = tax_info.get('reviewer_decision', 'NOT_APPLICABLE' if r['acquisition_status'] == 'REJECTED' else 'PENDING')
        tax_triggers = tax_info.get('review_triggers', 'None')

        # Determine download eligibility verdict
        acq = r['acquisition_status']
        if acq == 'REJECTED':
            eligibility = 'REJECTED_EXCLUDED'
        elif acq == 'OOD_REFERENCE':
            eligibility = 'OOD_REFERENCE_ONLY'
        elif acq == 'PERMISSION_REQUIRED':
            eligibility = 'PERMISSION_FIRST_REQUIRED'
        elif acq == 'TAXONOMY_REVIEW':
            eligibility = 'HOLD_PENDING_TAXONOMY_REVIEW'
        elif acq == 'READY_FOR_REVIEW':
            if prio_tier == 'P1':
                eligibility = 'ELIGIBLE_P1_SELECTIVE_DOWNLOAD'
            elif prio_tier == 'P2':
                eligibility = 'ELIGIBLE_P2_RESEARCH_USE_ONLY'
            else:
                eligibility = 'ELIGIBLE_REVIEW_REQUIRED'
        else:
            eligibility = 'UNKNOWN'

        audited_row = {
            'record_id': rec_id,
            'target_class': r['target_class'],
            'target_species': r['target_species'],
            'source_name': r['source_name'],
            'record_type': r['record_type'],
            'license_tier': r['license_tier'],
            'license_label': r['license_label'],
            'rights_holder': r['rights_holder_photographer'],
            'direct_image_url': d_url,
            'source_page_url': p_url,
            'url_reachability': reach_status,
            'acquisition_status': acq,
            'download_eligibility': eligibility,
            'priority_tier': prio_tier,
            'priority_action': prio_action,
            'dup_group': r['dup_group'],
            'post2025_review_required': post2025,
            'taxonomic_confidence': r['taxonomic_confidence'],
            'taxonomy_triggers': tax_triggers,
            'reviewer_decision': tax_decision,
            'gate_before_training': prio_info.get('gate_before_training', 'Species ID, Condition, Dedup'),
            'status_reason': r['status_reason'],
            'evidence_source': r['evidence_source']
        }
        audited_rows.append(audited_row)

    # Write output CSV
    fieldnames = [
        'record_id', 'target_class', 'target_species', 'source_name', 'record_type',
        'license_tier', 'license_label', 'rights_holder', 'direct_image_url', 'source_page_url',
        'url_reachability', 'acquisition_status', 'download_eligibility', 'priority_tier',
        'priority_action', 'dup_group', 'post2025_review_required', 'taxonomic_confidence',
        'taxonomy_triggers', 'reviewer_decision', 'gate_before_training', 'status_reason',
        'evidence_source'
    ]

    out_path = 'dataset_pipeline/reports/phase_12_1/public_image_inventory_audited.csv'
    with open(out_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(audited_rows)

    print(f"Successfully generated {out_path} with {len(audited_rows)} records.")

if __name__ == '__main__':
    build_audited_csv()
