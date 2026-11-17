import os
import pandas as pd

base = r'Fishguard_AI'
df_inv = pd.read_csv(os.path.join(base, 'fishguard_public_image_inventory.csv'))
df_prio = pd.read_csv(os.path.join(base, 'fishguard_download_priority.csv'))
df_tax = pd.read_csv(os.path.join(base, 'fishguard_taxonomy_review.csv'))
df_lic = pd.read_csv(os.path.join(base, 'fishguard_source_license_audit.csv'))

print('=== 1. URL STATUS IN INVENTORY ===')
print(df_inv['direct_url_status'].value_counts(dropna=False))

print('\n=== 2. DIRECT IMAGE URLS (NULL, FORMAT, EXTENSIONS) ===')
null_urls = df_inv['direct_image_url'].isnull().sum()
print(f'Null direct_image_url: {null_urls}')
print('Sample direct URLs:')
print(df_inv['direct_image_url'].dropna().head(5))

print('\n=== 3. DUP GROUP ANALYSIS ===')
print(df_inv['dup_group'].value_counts(dropna=False))
dup_records = df_inv[df_inv['dup_group'].notnull() & (df_inv['dup_group'] != 'NONE')]
print(f'Total records in dup groups: {len(dup_records)}')
print(dup_records[['record_id', 'target_species', 'dup_group', 'source_name', 'direct_image_url']])

print('\n=== 4. DUPLICATE URLS IN INVENTORY ===')
dup_urls = df_inv[df_inv['direct_image_url'].duplicated(keep=False) & df_inv['direct_image_url'].notnull()]
print(f'Records with duplicate direct_image_url: {len(dup_urls)}')
if len(dup_urls) > 0:
    print(dup_urls[['record_id', 'direct_image_url', 'dup_group']])

print('\n=== 5. TAXONOMY REVIEW: UPENEUS SULPHUREUS DETAILS ===')
upeneus = df_tax[df_tax['target_species'].str.contains('Upeneus', na=False)]
print(f'Total Upeneus in taxonomy review: {len(upeneus)}')
print('Post-2025 review required in Upeneus:')
print(upeneus['post2025_review_required'].value_counts(dropna=False))
print('\nUnique review_triggers for Upeneus:')
for tr in upeneus['review_triggers'].unique():
    print(f' - {tr}')
print('\nUnique diagnostic_checks for Upeneus:')
for dc in upeneus['diagnostic_checks'].unique():
    print(f' - {dc}')

print('\n=== 6. TAXONOMY REVIEW FOR RASTRELLIGER & SELAROIDES ===')
print('Rastrelliger review triggers:')
print(df_tax[df_tax['target_species'].str.contains('Rastrelliger', na=False)]['review_triggers'].value_counts())
print('Selaroides review triggers:')
print(df_tax[df_tax['target_species'].str.contains('Selaroides', na=False)]['review_triggers'].value_counts())

print('\n=== 7. SOURCE LICENSE AUDIT TABLE ===')
print(df_lic[['source_id', 'source', 'license_regime_observed', 'legal_risk', 'recommended_action']])

print('\n=== 8. EXCLUDED RECORDS FROM PRIORITY (11 RECORDS) ===')
inv_ids = set(df_inv['record_id'])
prio_ids = set(df_prio['record_id'])
excluded_prio = df_inv[df_inv['record_id'].isin(inv_ids - prio_ids)]
print(excluded_prio[['record_id', 'target_class', 'target_species', 'acquisition_status', 'status_reason']])
