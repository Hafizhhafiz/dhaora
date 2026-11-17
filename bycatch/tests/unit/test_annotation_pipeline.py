"""
Unit tests for ByCatch AI Annotation and Split Pipeline (Phase 5).
"""

import pytest
from pathlib import Path
from src.annotation.validate_yolo_labels import validate_yolo_label_file, compute_box_iou
from src.annotation.build_splits import assign_group_ids, build_stratified_group_split
from src.annotation.prepare_dataset import prepare_yolo_dataset

@pytest.fixture
def fixtures_yolo_dir():
    root = Path(__file__).resolve().parents[2]
    d = root / "tests" / "fixtures" / "synthetic_yolo_dataset"
    assert d.exists(), "Synthetic YOLO fixtures missing! Run make_synthetic_yolo.py."
    return d

def test_box_iou():
    b1 = (0.5, 0.5, 0.2, 0.2)
    b2 = (0.5, 0.5, 0.2, 0.2)
    assert pytest.approx(compute_box_iou(b1, b2), 0.001) == 1.0

    b3 = (0.1, 0.1, 0.1, 0.1)
    b4 = (0.9, 0.9, 0.1, 0.1)
    assert compute_box_iou(b3, b4) == 0.0

def test_validate_valid_yolo_label(fixtures_yolo_dir):
    lbl_file = fixtures_yolo_dir / "labels" / "train" / "synth_001.txt"
    val = validate_yolo_label_file(lbl_file)
    assert val["is_valid"]
    assert val["box_count"] == 1
    assert val["boxes"][0][0] in (0, 1, 2)

def test_validate_invalid_yolo_label(tmp_path):
    # Invalid class ID 99
    bad_lbl = tmp_path / "bad.txt"
    bad_lbl.write_text("99 0.5 0.5 0.2 0.2\n", encoding="utf-8")
    val = validate_yolo_label_file(bad_lbl)
    assert not val["is_valid"]
    assert any("Invalid class ID" in err for err in val["errors"])

    # Out of bounds coordinate
    oob_lbl = tmp_path / "oob.txt"
    oob_lbl.write_text("0 1.5 0.5 0.2 0.2\n", encoding="utf-8")
    val_oob = validate_yolo_label_file(oob_lbl)
    assert not val_oob["is_valid"]
    assert any("out of bounds" in err for err in val_oob["errors"])

    # Empty file = legitimate negative background image
    empty_lbl = tmp_path / "empty.txt"
    empty_lbl.write_text("", encoding="utf-8")
    val_empty = validate_yolo_label_file(empty_lbl)
    assert val_empty["is_valid"]
    assert val_empty["is_negative_image"]

def test_split_leakage_prevention():
    records = [
        {"image_id": f"img_{i:03d}", "file_path": f"path_{i}.jpg", "class_label": f"cls_{i%3}", "trip_id": f"trip_{i%4}"}
        for i in range(20)
    ]
    records = assign_group_ids(records)
    splits, stats = build_stratified_group_split(records, train_ratio=0.7, val_ratio=0.15, test_ratio=0.15, seed=42)

    assert not stats["has_leakage"]
    train_groups = {r["group_id"] for r in splits["train"]}
    val_groups = {r["group_id"] for r in splits["val"]}
    test_groups = {r["group_id"] for r in splits["test"]}

    assert len(train_groups & val_groups) == 0
    assert len(train_groups & test_groups) == 0
    assert len(val_groups & test_groups) == 0

def test_prepare_yolo_dataset(fixtures_yolo_dir, tmp_path):
    root = Path(__file__).resolve().parents[2]
    classes_yaml = root / "configs" / "classes.yaml"

    img_files = list((fixtures_yolo_dir / "images" / "train").glob("*.bmp"))
    records = [
        {"image_id": f"img_{p.stem}", "file_path": str(p), "class_label": "kembung_perempuan", "group_id": f"grp_{p.stem}"}
        for p in img_files
    ]
    splits = {"train": records[:4], "val": records[4:5], "test": records[5:]}

    dsv_dir, dsv_name, stats = prepare_yolo_dataset(splits, tmp_path / "processed", classes_yaml)

    assert dsv_dir.exists()
    assert (dsv_dir / "data.yaml").exists()
    assert (dsv_dir / "dataset_stats.json").exists()
    assert dsv_name.startswith("dsv_")
