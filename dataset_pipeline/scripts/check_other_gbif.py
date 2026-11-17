import requests
import json

other_species = [
    "Anodontostoma chacunda",
    "Sardinella brachysoma",
    "Encrasicholina devisi",
    "Saurida tumbil",
    "Euthynnus affinis",
    "Otolithes ruber",
    "Nemipterus aurora",
    "Alepes djedaba",
    "Caranx sexfasciatus"
]

base_url = "https://api.gbif.org/v1/occurrence/search"
counts = {}

for sp in other_species:
    params = {"scientificName": sp, "mediaType": "StillImage", "limit": 1}
    try:
        r = requests.get(base_url, params=params, timeout=15)
        if r.status_code == 200:
            c = r.json().get("count", 0)
            counts[sp] = c
            print(f"{sp}: {c}")
    except Exception as e:
        print(f"Err {sp}: {e}")

out_path = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\dataset_pipeline\reports\phase_11_gbif_other_species.json"
with open(out_path, "w") as f:
    json.dump(counts, f, indent=2)
