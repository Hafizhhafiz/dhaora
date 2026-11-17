import requests
import json
import os
import pandas as pd
from datetime import datetime

# Configure species queries
queries = [
    {
        'species_code': 'RKAN',
        'common_name': 'Ikan Kembung Lelaki',
        'target_scientific': 'Rastrelliger kanagurta',
        'expected_taxon_key': 2374317,
        'search_name': 'Rastrelliger kanagurta',
        'output_subdir': 'rastrelliger_kanagurta'
    },
    {
        'species_code': 'DMAC',
        'common_name': 'Ikan Layang',
        'target_scientific': 'Decapterus macarellus',
        'expected_taxon_key': 2391064,
        'search_name': 'Decapterus macarellus',
        'output_subdir': 'decapterus_macarellus'
    }
]

base_url = "https://api.gbif.org/v1/occurrence/search"

all_occurrences = []

for q in queries:
    species_name = q['target_scientific']
    print(f"\n{'='*50}\nFetching metadata for: {species_name}")
    offset = 0
    limit = 300
    species_records = []
    
    while True:
        params = {
            'scientificName': species_name,
            'mediaType': 'StillImage',
            'limit': limit,
            'offset': offset
        }
        resp = requests.get(base_url, params=params, timeout=30)
        if resp.status_code != 200:
            print(f"Failed with status: {resp.status_code}")
            break
            
        data = resp.json()
        total_count = data.get('count', 0)
        results = data.get('results', [])
        print(f"Total available on GBIF: {total_count}, Fetched batch: {len(results)} (offset: {offset})")
        
        for rec in results:
            # Extract media items
            media_list = rec.get('media', [])
            still_images = [m for m in media_list if m.get('type') == 'StillImage' or (m.get('format') and 'image' in m.get('format').lower())]
            
            # Record base metadata
            rec_id = rec.get('gbifID')
            sc_name = rec.get('scientificName')
            acc_name = rec.get('acceptedScientificName')
            taxon_key = rec.get('taxonKey')
            acc_taxon_key = rec.get('acceptedTaxonKey')
            tax_status = rec.get('taxonomicStatus')
            basis = rec.get('basisOfRecord')
            dataset_key = rec.get('datasetKey')
            dataset_name = rec.get('datasetName')
            publisher = rec.get('publisher')
            recorded_by = rec.get('recordedBy')
            identified_by = rec.get('identifiedBy')
            event_date = rec.get('eventDate')
            country = rec.get('country')
            locality = rec.get('locality')
            lat = rec.get('decimalLatitude')
            lon = rec.get('decimalLongitude')
            license_val = rec.get('license')
            rights_holder = rec.get('rightsHolder')
            references = rec.get('references')
            
            for m_idx, m in enumerate(still_images):
                img_url = m.get('identifier')
                img_format = m.get('format')
                m_license = m.get('license', license_val)
                m_rights = m.get('rightsHolder', rights_holder)
                
                species_records.append({
                    'species_code': q['species_code'],
                    'target_species': q['target_scientific'],
                    'common_name': q['common_name'],
                    'gbifID': rec_id,
                    'media_index': m_idx,
                    'scientificName': sc_name,
                    'acceptedScientificName': acc_name,
                    'taxonKey': taxon_key,
                    'acceptedTaxonKey': acc_taxon_key,
                    'taxonomicStatus': tax_status,
                    'basisOfRecord': basis,
                    'datasetKey': dataset_key,
                    'datasetName': dataset_name,
                    'publisher': publisher,
                    'recordedBy': recorded_by,
                    'identifiedBy': identified_by,
                    'eventDate': event_date,
                    'country': country,
                    'locality': locality,
                    'decimalLatitude': lat,
                    'decimalLongitude': lon,
                    'media_identifier': img_url,
                    'media_format': img_format,
                    'record_license': license_val,
                    'media_license': m_license,
                    'rightsHolder': m_rights,
                    'references': references
                })
        
        offset += limit
        if offset >= total_count or offset >= 600 or data.get('endOfRecords', True):
            break

    print(f"Total image items extracted for {species_name}: {len(species_records)}")
    all_occurrences.extend(species_records)

df = pd.DataFrame(all_occurrences)
out_csv = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\dataset_pipeline\metadata\gbif_occurrences.csv"
df.to_csv(out_csv, index=False, encoding='utf-8')
print(f"\nSaved {len(df)} occurrence-media rows to: {out_csv}")

# Print summary
print("\n" + "="*50)
print("GBIF OCCURRENCE SUMMARY PER SPECIES:")
for sc in df['species_code'].unique():
    sub = df[df['species_code'] == sc]
    print(f"\nSpecies [{sc}] - {sub['target_species'].iloc[0]}:")
    print(f"  Total media records: {len(sub)}")
    print(f"  Unique gbifIDs: {sub['gbifID'].nunique()}")
    print("  Basis of record:")
    print(sub['basisOfRecord'].value_counts().to_string())
    print("  Media licenses:")
    print(sub['media_license'].value_counts(dropna=False).to_string())
    print("  Taxonomic status:")
    print(sub['taxonomicStatus'].value_counts(dropna=False).to_string())
    print("  Top countries:")
    print(sub['country'].value_counts(dropna=False).head(5).to_string())
