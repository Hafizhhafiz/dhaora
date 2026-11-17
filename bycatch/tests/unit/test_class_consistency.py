"""
Unit test for class consistency between configs/classes.yaml and metadata/species_reference.csv.
Ensures single source of truth for all three target species.
"""

import csv
from pathlib import Path

def test_classes_yaml_and_csv_consistency():
    root = Path(__file__).resolve().parents[2]
    yaml_path = root / "configs" / "classes.yaml"
    csv_path = root / "metadata" / "species_reference.csv"

    assert yaml_path.exists(), f"Missing {yaml_path}"
    assert csv_path.exists(), f"Missing {csv_path}"

    # Read CSV
    csv_classes = {}
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cid = int(row["class_id"])
            csv_classes[cid] = {
                "class_name": row["species_label"].strip(),
                "scientific_name": row["scientific_name"].strip(),
                "common_name": row["common_name"].strip()
            }

    assert len(csv_classes) == 3, f"Expected 3 classes in CSV, found {len(csv_classes)}"

    # Parse YAML manually (no dependency on pyyaml required)
    yaml_text = yaml_path.read_text(encoding="utf-8")
    for cid, data in csv_classes.items():
        assert f"class_id: {cid}" in yaml_text, f"class_id {cid} missing in YAML"
        assert f'"{data["class_name"]}"' in yaml_text, f'class_name {data["class_name"]} missing in YAML'
        assert f'"{data["scientific_name"]}"' in yaml_text, f'scientific_name {data["scientific_name"]} missing in YAML'

    # Check canonical IDs: 0, 1, 2
    assert set(csv_classes.keys()) == {0, 1, 2}
    assert csv_classes[0]["class_name"] == "kembung_perempuan"
    assert csv_classes[1]["class_name"] == "selar_kuning"
    assert csv_classes[2]["class_name"] == "kuniran"
    print("test_classes_yaml_and_csv_consistency: PASSED")

if __name__ == "__main__":
    test_classes_yaml_and_csv_consistency()
