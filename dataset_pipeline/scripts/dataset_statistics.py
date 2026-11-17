"""
Script: dataset_statistics.py
Deskripsi: Menghitung statistik komprehensif dataset FishGuard AI secara faktual:
  - Total citra terdata
  - Distribusi spesies target
  - Jumlah spesimen independen
  - Distribusi sumber data & lisensi
  - Kualitas citra & resolusi
  - Status verifikasi taksonomi
  - Distribusi split train/val/test
  - Distribusi pengukuran panjang fisik
Menghasilkan laporan format JSON dan tabular di reports/dataset_statistics.json.
"""

import os
import sys
import csv
import json
from pathlib import Path
from collections import Counter, defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
METADATA_FILE = BASE_DIR / "metadata" / "dataset_master.csv"
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def generate_statistics():
    print("=== PENGHITUNGAN STATISTIK DATASET AKTUAL FISHGUARD AI ===")

    if not METADATA_FILE.exists():
        print(f"[ERROR] File metadata tidak ditemukan di: {METADATA_FILE}")
        return

    records = []
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)

    total_images = len(records)
    species_counter = Counter()
    specimens_set = set()
    source_counter = Counter()
    source_type_counter = Counter()
    quality_counter = Counter()
    verification_counter = Counter()
    split_counter = Counter()
    length_values = []
    resolutions = []

    for r in records:
        sp = r.get("scientific_name", "UNKNOWN").strip() or "UNKNOWN"
        species_counter[sp] += 1

        spec_id = r.get("specimen_id", "").strip()
        if spec_id:
            specimens_set.add(spec_id)

        st = r.get("source_type", "UNKNOWN").strip() or "UNKNOWN"
        source_type_counter[st] += 1

        sn = r.get("source_name", "UNKNOWN").strip() or "UNKNOWN"
        source_counter[sn] += 1

        q = r.get("image_quality", "UNKNOWN").strip() or "UNKNOWN"
        quality_counter[q] += 1

        v = r.get("verification_status", "UNKNOWN").strip() or "UNKNOWN"
        verification_counter[v] += 1

        s = r.get("split", "UNASSIGNED").strip() or "UNASSIGNED"
        split_counter[s] += 1

        tl_str = r.get("total_length_cm", "").strip()
        if tl_str:
            try:
                length_values.append(float(tl_str))
            except ValueError:
                pass

        w = r.get("image_width", "").strip()
        h = r.get("image_height", "").strip()
        if w and h:
            try:
                resolutions.append((int(w), int(h)))
            except ValueError:
                pass

    # Hitung metrik panjang jika tersedia
    length_stats = {
        "count_measured": len(length_values),
        "mean_tl_cm": round(sum(length_values) / len(length_values), 2) if length_values else 0.0,
        "min_tl_cm": min(length_values) if length_values else 0.0,
        "max_tl_cm": max(length_values) if length_values else 0.0,
    }

    stats = {
        "total_images": total_images,
        "unique_specimens_count": len(specimens_set),
        "species_distribution": dict(species_counter),
        "source_types": dict(source_type_counter),
        "source_names": dict(source_counter),
        "quality_distribution": dict(quality_counter),
        "verification_status": dict(verification_counter),
        "split_distribution": dict(split_counter),
        "total_length_metrics": length_stats,
        "raw_data_ready_for_training": False,
        "field_specimens_count": source_type_counter.get("FIELD_SPECIMEN", 0),
        "synthetic_test_count": source_type_counter.get("SYNTHETIC_TEST", 0)
    }

    # Cetak ringkasan tabular
    print(f"\n1. Inventaris Total Citra Terdata     : {stats['total_images']}")
    print(f"   - Citra Spesimen Lapangan Nyata    : {stats['field_specimens_count']} (BELUM TERSEDIA)")
    print(f"   - Citra Uji Teknis Sintetis        : {stats['synthetic_test_count']} (Hanya untuk audit CV)")
    print(f"   - Jumlah Spesimen Unik Independen  : {stats['unique_specimens_count']}")

    print(f"\n2. Distribusi Spesies:")
    for sp, count in species_counter.items():
        print(f"   - {sp:<35}: {count} citra")

    print(f"\n3. Status Verifikasi Taksonomi:")
    for vs, count in verification_counter.items():
        print(f"   - {vs:<20}: {count}")

    print(f"\n4. Kualitas Visual Citra:")
    for q, count in quality_counter.items():
        print(f"   - {q:<10}: {count}")

    print(f"\n5. Distribusi Pengukuran Panjang Fisik:")
    print(f"   - Jumlah Spesimen Terukur: {length_stats['count_measured']}")
    if length_stats['count_measured'] > 0:
        print(f"   - Rentang TL: {length_stats['min_tl_cm']} - {length_stats['max_tl_cm']} cm (Mean: {length_stats['mean_tl_cm']} cm)")

    # Simpan JSON
    out_json = REPORTS_DIR / "dataset_statistics.json"
    with open(out_json, "w", encoding="utf-8") as jf:
        json.dump(stats, jf, indent=2)
    print(f"\n[OUTPUT] Statistik lengkap disimpan di: {out_json}")

    return stats

if __name__ == "__main__":
    generate_statistics()
