"""
Script: detect_duplicates.py
Deskripsi: Mendeteksi duplikasi citra menggunakan:
  1. Exact Hash (SHA-256) untuk duplikasi identik byte-per-byte.
  2. Difference Hash (dHash - Perceptual Hash 64-bit) untuk mendeteksi citra yang serupa secara visual (skala/kompresi).
Aturan: Tidak menghapus file secara otomatis; menghasilkan laporan kandidat duplikasi ke CSV.
"""

import os
import sys
import csv
import hashlib
from pathlib import Path
from collections import defaultdict
import cv2
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

DHASH_HAMMING_DISTANCE_THRESHOLD = 5  # Jarak Hamming <= 5 dianggap sangat serupa (kandidat duplikat visual)

def compute_sha256(filepath: Path) -> str:
    """Menghitung checksum SHA-256 berkas."""
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()

def compute_dhash(image_path: Path, hash_size=8) -> int:
    """
    Menghitung Difference Hash (dHash) 64-bit berbasis gradien horizontal.
    Tahan terhadap perubahan format JPEG/PNG dan kompresi ringan.
    """
    img = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if img is None:
        return 0
    # Resize ke (hash_size + 1, hash_size) -> (9, 8)
    resized = cv2.resize(img, (hash_size + 1, hash_size), interpolation=cv2.INTER_AREA)
    # Bandingkan piksel bersebelahan: resized[:, 1:] > resized[:, :-1]
    diff = resized[:, 1:] > resized[:, :-1]
    # Konversi boolean array 64 elemen ke integer 64-bit
    return sum([2 ** i for (i, v) in enumerate(diff.flatten()) if v])

def hamming_distance(hash1: int, hash2: int) -> int:
    """Menghitung selisih bit (Hamming distance) antara dua hash 64-bit."""
    return bin(hash1 ^ hash2).count('1')

def audit_duplicates(target_dirs=None):
    if target_dirs is None:
        target_dirs = [
            BASE_DIR / "sample_calibrated_images",
            BASE_DIR / "test_audit_variations",
            BASE_DIR / "data" / "raw"
        ]

    file_list = []
    for d in target_dirs:
        if not d.exists():
            continue
        file_list.extend(list(d.glob("*.jpg")) + list(d.glob("*.png")) + list(d.glob("*.jpeg")))

    print(f"=== AUDIT DUPLIKASI CITRA (Total file: {len(file_list)}) ===")

    # 1. Exact SHA-256 audit
    sha_map = defaultdict(list)
    dhash_map = {}

    for p in file_list:
        sha_val = compute_sha256(p)
        sha_map[sha_val].append(p)
        dhash_val = compute_dhash(p)
        dhash_map[p] = dhash_val

    exact_duplicates = []
    for sha, paths in sha_map.items():
        if len(paths) > 1:
            exact_duplicates.append(paths)

    # 2. Perceptual dHash pairwise comparison
    perceptual_duplicates = []
    file_count = len(file_list)
    for i in range(file_count):
        for j in range(i + 1, file_count):
            p1 = file_list[i]
            p2 = file_list[j]
            h1 = dhash_map[p1]
            h2 = dhash_map[p2]
            dist = hamming_distance(h1, h2)
            if dist <= DHASH_HAMMING_DISTANCE_THRESHOLD:
                # Cek apakah sudah terdeteksi di exact duplicate
                is_exact = compute_sha256(p1) == compute_sha256(p2)
                perceptual_duplicates.append({
                    "file_1": str(p1.relative_to(BASE_DIR)),
                    "file_2": str(p2.relative_to(BASE_DIR)),
                    "hamming_distance": dist,
                    "is_exact_match": is_exact,
                    "similarity_pct": round((1.0 - (dist / 64.0)) * 100, 2),
                    "recommendation": "Tinjau manual sebelum pemisahan train/test"
                })

    # Ekspor laporan ke CSV
    out_csv = REPORTS_DIR / "duplicates_report.csv"
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["file_1", "file_2", "hamming_distance", "is_exact_match", "similarity_pct", "recommendation"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in perceptual_duplicates:
            writer.writerow(row)

    print(f"[HASIL AUDIT DUPLIKASI]")
    print(f"- Pasangan Duplikasi Exact (SHA-256)       : {len(exact_duplicates)}")
    print(f"- Pasangan Serupa Visual (dHash dist <= {DHASH_HAMMING_DISTANCE_THRESHOLD}): {len(perceptual_duplicates)}")
    print(f"[LAPORAN CSV] Berhasil disimpan di: {out_csv}")

    return perceptual_duplicates

if __name__ == "__main__":
    audit_duplicates()
