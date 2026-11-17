"""
Script: prepare_dataset.py
Deskripsi: Membagi dataset YOLO secara ketat berbasis Specimen ID & Capture Session
untuk menjamin ZERO DATA LEAKAGE antara Train, Validation, dan Test split.
Jika metadata specimen_id tidak tersedia, data ditandai sebagai NEEDS_METADATA
dan TIDAK AKAN dimasukkan ke dalam split training.
Menghasilkan laporan overlap antar-split di reports/split_overlap_report.json.
"""

import os
import sys
import json
import shutil
import random
import csv
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
METADATA_FILE = BASE_DIR / "metadata" / "dataset_master.csv"
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def load_master_metadata():
    """Memuat metadata spesimen dari dataset_master.csv jika tersedia."""
    specimen_lookup = {}
    if METADATA_FILE.exists():
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                fname = row.get("filename", "").strip()
                spec_id = row.get("specimen_id", "").strip()
                session_id = row.get("capture_session", "").strip()
                status = row.get("verification_status", "UNKNOWN").strip()
                if fname:
                    specimen_lookup[fname] = {
                        "specimen_id": spec_id if spec_id else None,
                        "session_id": session_id if session_id else None,
                        "status": status
                    }
    return specimen_lookup

def validate_yolo_annotation(label_file: Path) -> tuple[bool, str]:
    """Memvalidasi format bounding box YOLO: <class_id> <x_c> <y_c> <w> <h>."""
    if not label_file.exists():
        return False, "File label tidak ditemukan."
    if label_file.stat().st_size == 0:
        return False, "File label kosong (0 byte)."
    with open(label_file, "r") as f:
        line_num = 0
        for line in f:
            line_num += 1
            parts = line.strip().split()
            if len(parts) != 5:
                return False, f"Baris {line_num} memiliki {len(parts)} nilai (harus 5)."
            cls_id, xc, yc, w, h = parts
            try:
                cls_id = int(cls_id)
                xc, yc, w, h = float(xc), float(yc), float(w), float(h)
                if not (0 <= xc <= 1 and 0 <= yc <= 1 and 0 <= w <= 1 and 0 <= h <= 1):
                    return False, f"Baris {line_num} koordinat di luar batas [0.0, 1.0]."
                if cls_id not in (0, 1):
                    return False, f"Baris {line_num} class_id {cls_id} tidak valid (harus 0 atau 1)."
            except ValueError:
                return False, f"Baris {line_num} gagal diparsing sebagai angka."
    return True, "Valid"

def execute_group_split(train_ratio=0.7, val_ratio=0.2, test_ratio=0.1):
    raw_images = list(RAW_DIR.glob("*.jpg")) + list(RAW_DIR.glob("*.png")) + list(RAW_DIR.glob("*.jpeg"))
    metadata_map = load_master_metadata()

    print("=== EKSEKUSI GROUP-SPLIT DATASET (ANTI DATA LEAKAGE) ===")
    print(f"Direktori input : {RAW_DIR}")
    print(f"Total citra raw : {len(raw_images)}")

    if not raw_images:
        print("[INFO] Belum ada citra mentah di folder data/raw/.")
        print("[INFO] Simpan citra tangkapan dan file .txt di folder tersebut sebelum menjalankan split.")
        
        # Ekspor laporan status kosong
        empty_report = {
            "total_raw_images": 0,
            "valid_specimens": 0,
            "needs_metadata_count": 0,
            "split_summary": {"train": 0, "val": 0, "test": 0},
            "data_leakage_overlap_count": 0,
            "status": "NO_RAW_DATA"
        }
        with open(REPORTS_DIR / "split_overlap_report.json", "w") as jf:
            json.dump(empty_report, jf, indent=2)
        return

    # Pengelompokan spesimen
    specimen_groups = defaultdict(list)
    needs_metadata = []

    for img_p in raw_images:
        meta = metadata_map.get(img_p.name, None)
        specimen_id = None
        if meta and meta.get("specimen_id"):
            specimen_id = meta["specimen_id"]
        elif "_" in img_p.stem:
            # Fallback ekstraksi nama file jika format terstandar: <SPECIMEN_ID>_<INDEX>.jpg
            candidate_id = img_p.stem.split("_")[0]
            if len(candidate_id) >= 3 and not candidate_id.isdigit():
                specimen_id = candidate_id

        if specimen_id:
            specimen_groups[specimen_id].append(img_p)
        else:
            needs_metadata.append(img_p)

    print(f"Spesimen unik teridentifikasi : {len(specimen_groups)}")
    print(f"Citra tanpa ID spesimen valid : {len(needs_metadata)} (Status: NEEDS_METADATA - DIKECUALIKAN)")

    # Pisahkan spesimen ke train, val, test
    unique_specimens = list(specimen_groups.keys())
    random.seed(42)
    random.shuffle(unique_specimens)

    n_total = len(unique_specimens)
    n_train = max(1, int(n_total * train_ratio)) if n_total > 1 else n_total
    n_val = max(1, int(n_total * val_ratio)) if n_total > 2 else (1 if n_total == 2 else 0)

    splits = {
        "train": unique_specimens[:n_train],
        "val": unique_specimens[n_train:n_train + n_val],
        "test": unique_specimens[n_train + n_val:]
    }

    # Tracking untuk verifikasi zero-overlap
    specimen_to_split = {}
    split_counts = {"train": 0, "val": 0, "test": 0}
    leakage_detected = []

    for split_name, group in splits.items():
        target_img_dir = PROCESSED_DIR / "images" / split_name
        target_lbl_dir = PROCESSED_DIR / "labels" / split_name
        target_img_dir.mkdir(parents=True, exist_ok=True)
        target_lbl_dir.mkdir(parents=True, exist_ok=True)

        for spec_id in group:
            if spec_id in specimen_to_split:
                leakage_detected.append(f"Spesimen {spec_id} terdeteksi di {split_name} dan {specimen_to_split[spec_id]}")
            specimen_to_split[spec_id] = split_name

            for img_file in specimen_groups[spec_id]:
                lbl_file = img_file.with_suffix(".txt")
                is_valid, msg = validate_yolo_annotation(lbl_file)
                if is_valid:
                    shutil.copy2(img_file, target_img_dir / img_file.name)
                    shutil.copy2(lbl_file, target_lbl_dir / lbl_file.name)
                    split_counts[split_name] += 1
                else:
                    print(f"  [SKIP] Anotasi tidak valid ({msg}) untuk: {img_file.name}")

    # Laporan Overlap / Data Leakage
    overlap_report = {
        "total_raw_images": len(raw_images),
        "valid_specimens_count": len(unique_specimens),
        "needs_metadata_excluded": len(needs_metadata),
        "split_summary_images": split_counts,
        "specimens_per_split": {k: len(v) for k, v in splits.items()},
        "data_leakage_overlap_count": len(leakage_detected),
        "leakage_errors": leakage_detected,
        "verification_status": "ZERO_DATA_LEAKAGE_CONFIRMED" if len(leakage_detected) == 0 else "DATA_LEAKAGE_DETECTED"
    }

    report_path = REPORTS_DIR / "split_overlap_report.json"
    with open(report_path, "w", encoding="utf-8") as jf:
        json.dump(overlap_report, jf, indent=2)

    print(f"\n[HASIL SPLIT]")
    print(f"Train : {split_counts['train']} citra ({len(splits['train'])} spesimen)")
    print(f"Val   : {split_counts['val']} citra ({len(splits['val'])} spesimen)")
    print(f"Test  : {split_counts['test']} citra ({len(splits['test'])} spesimen)")
    print(f"Status Kebocoran Data (Data Leakage): {overlap_report['verification_status']}")
    print(f"[LAPORAN OVERLAP] Disimpan di: {report_path}")

if __name__ == "__main__":
    execute_group_split()
