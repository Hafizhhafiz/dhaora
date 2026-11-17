import requests
import json

urls = {
    'Rastrelliger kanagurta': 'https://api.gbif.org/v1/occurrence/search?scientificName=Rastrelliger%20kanagurta&mediaType=StillImage&limit=5',
    'Decapterus macarellus': 'https://api.gbif.org/v1/occurrence/search?scientificName=Decapterus%20macarellus&mediaType=StillImage&limit=5'
}

for name, url in urls.items():
    try:
        r = requests.get(url, timeout=20)
        print(f"Species: {name}")
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"  Total Occurrences with StillImage: {data.get('count')}")
            print(f"  endOfRecords: {data.get('endOfRecords')}")
            print(f"  Results in this page: {len(data.get('results', []))}")
            if data.get('results'):
                sample = data['results'][0]
                print(f"  Sample gbifID: {sample.get('gbifID')}")
                print(f"  Sample scientificName: {sample.get('scientificName')}")
                print(f"  Sample acceptedScientificName: {sample.get('acceptedScientificName')}")
                print(f"  Sample taxonKey: {sample.get('taxonKey')}")
                print(f"  Sample basisOfRecord: {sample.get('basisOfRecord')}")
                print(f"  Sample license: {sample.get('license')}")
                print(f"  Sample media count: {len(sample.get('media', []))}")
                if sample.get('media'):
                    for idx, m in enumerate(sample['media']):
                        print(f"    Media [{idx}] format: {m.get('format')}, license: {m.get('license')}")
                        print(f"    Media [{idx}] identifier: {m.get('identifier')}")
        print("-" * 50)
    except Exception as e:
        print(f"Error for {name}: {e}")
