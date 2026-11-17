import requests
import json

species_list = [
    {"name": "Rastrelliger brachysoma", "query": "Rastrelliger brachysoma"},
    {"name": "Leiognathus leuciscus", "query": "Leiognathus leuciscus"},
    {"name": "Equulites leuciscus", "query": "Equulites leuciscus"},
    {"name": "Upeneus sulphureus", "query": "Upeneus sulphureus"},
    {"name": "Selaroides leptolepis", "query": "Selaroides leptolepis"},
    {"name": "Stolephorus commersonii", "query": "Stolephorus commersonii"}
]

base_url = "https://api.gbif.org/v1/occurrence/search"

results = {}

for sp in species_list:
    params = {
        "scientificName": sp["query"],
        "mediaType": "StillImage",
        "limit": 10
    }
    try:
        r = requests.get(base_url, params=params, timeout=20)
        if r.status_code == 200:
            data = r.json()
            count = data.get("count", 0)
            sample_recs = data.get("results", [])
            licenses = {}
            basis_counts = {}
            for rec in sample_recs:
                lic = rec.get("license", "Unknown")
                licenses[lic] = licenses.get(lic, 0) + 1
                basis = rec.get("basisOfRecord", "Unknown")
                basis_counts[basis] = basis_counts.get(basis, 0) + 1
                
            results[sp["name"]] = {
                "total_occurrences_with_image": count,
                "sample_licenses": licenses,
                "sample_basis_of_record": basis_counts
            }
            print(f"Species: {sp['name']} -> Count with StillImage: {count}")
        else:
            print(f"Error {sp['name']}: HTTP {r.status_code}")
    except Exception as e:
        print(f"Exception {sp['name']}: {e}")

out_path = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\dataset_pipeline\reports\phase_11_gbif_candidates_check.json"
with open(out_path, "w") as f:
    json.dump(results, f, indent=2)
print("Saved GBIF candidate check to:", out_path)
