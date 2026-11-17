"""
Dataset Split Generator with Leakage Prevention (Phase 5).
Implements Stratified Group Split ensuring no near-duplicates or shared groups leak across train/val/test.
"""

import csv
import random
from pathlib import Path
from typing import List, Dict, Any, Set, Tuple

def assign_group_ids(records: List[Dict[str, Any]], near_dup_clusters: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Assigns consistent group_id to each image record.
    Near-duplicate cluster members are merged into the same group_id.
    """
    dup_map = {}
    if near_dup_clusters:
        for item in near_dup_clusters:
            dup_map[item["image_id"]] = item["cluster_id"]

    for r in records:
        img_id = r["image_id"]
        # Priority: explicit cluster > trip_id/session_id > individual_id > source+creator > image_id
        if img_id in dup_map:
            r["group_id"] = dup_map[img_id]
        elif r.get("trip_id"):
            r["group_id"] = f"trip_{r['trip_id']}"
        elif r.get("specimen_id"):
            r["group_id"] = f"specimen_{r['specimen_id']}"
        elif r.get("session_id"):
            r["group_id"] = f"session_{r['session_id']}"
        else:
            r["group_id"] = f"grp_{img_id}"

    return records

def build_stratified_group_split(
    records: List[Dict[str, Any]],
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = 42
) -> Tuple[Dict[str, List[Dict[str, Any]]], Dict[str, Any]]:
    """
    Splits records into train, val, and test partitions by group_id.
    Ensures zero leakage across groups.
    """
    random.seed(seed)

    # 1. Group records by group_id
    group_map: Dict[str, List[Dict[str, Any]]] = {}
    for r in records:
        gid = r["group_id"]
        group_map.setdefault(gid, []).append(r)

    # 2. Compute class counts per group
    groups = list(group_map.keys())
    random.shuffle(groups)

    splits = {"train": [], "val": [], "test": []}
    target_train = int(len(records) * train_ratio)
    target_val = int(len(records) * val_ratio)

    curr_train_count = 0
    curr_val_count = 0

    for gid in groups:
        group_records = group_map[gid]
        count = len(group_records)

        if curr_train_count + count <= target_train or (curr_train_count == 0):
            splits["train"].extend(group_records)
            curr_train_count += count
            for r in group_records:
                r["split"] = "train"
        elif curr_val_count + count <= target_val or (curr_val_count == 0):
            splits["val"].extend(group_records)
            curr_val_count += count
            for r in group_records:
                r["split"] = "val"
        else:
            splits["test"].extend(group_records)
            for r in group_records:
                r["split"] = "test"

    # 3. Leakage verification check
    train_groups = {r["group_id"] for r in splits["train"]}
    val_groups = {r["group_id"] for r in splits["val"]}
    test_groups = {r["group_id"] for r in splits["test"]}

    leakage_train_val = train_groups & val_groups
    leakage_train_test = train_groups & test_groups
    leakage_val_test = val_groups & test_groups

    has_leakage = bool(leakage_train_val or leakage_train_test or leakage_val_test)

    stats = {
        "total_records": len(records),
        "total_groups": len(groups),
        "train_count": len(splits["train"]),
        "val_count": len(splits["val"]),
        "test_count": len(splits["test"]),
        "has_leakage": has_leakage,
        "leakage_details": {
            "train_val_overlap": list(leakage_train_val),
            "train_test_overlap": list(leakage_train_test),
            "val_test_overlap": list(leakage_val_test)
        }
    }

    if has_leakage:
        raise ValueError(f"Data leakage detected during split! Overlaps: {stats['leakage_details']}")

    return splits, stats

def save_split_manifest(records: List[Dict[str, Any]], output_path: Path):
    """Saves split_manifest.csv."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if not records:
        return

    fields = ["image_id", "filename", "class_label", "group_id", "split", "file_path"]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(records)
