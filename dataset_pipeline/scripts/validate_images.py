"""
Script: validate_images.py
Deskripsi: Memvalidasi kualitas citra dataset:
  - Verifikasi integritas header & dekoder (cv2 & PIL)
  - Pemeriksaan dimensi (lebar, tinggi, megapiksel)
  - Deteksi citra terlalu kecil (< 320x320 px)
  - Perhitungan skor keburaman / blur score (varians Laplacian)
  - Ekspor laporan kualitas ke format CSV
"""

import os
import sys
import csv
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

BLUR_THRESHOLD = 100.0  # Nilai varians Laplacian < 100 dianggap berpotensi buram (blurry)
MIN_WIDTH = 320
MIN_HEIGHT = 320

def calculate_blur_score(img_bgr: np.ndarray) -> float:
    """Menghitung skor ketajaman citra berdasarkan varians Laplacian."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    return round(float(laplacian_var), 2)

def validate_image_file(image_path: Path) -> dict:
    """Memvalidasi integritas dan parameter kualitas satu file citra."""
    result = {
        "file_name": image_path.name,
        "relative_path": str(image_path.relative_to(BASE_DIR)),
        "file_size_kb": round(image_path.stat().st_size / 1024, 2),
        "is_readable": False,
        "width": 0,
        "height": 0,
        "channels": 0,
        "aspect_ratio": 0.0,
        "blur_score": 0.0,
        "is_blurry": False,
        "is_too_small": False,
        "status": "VALID",
        "notes": []
    }

    # Uji 1: Verifikasi dengan Pillow (integritas format file)
    try:
        with Image.open(image_path) as pil_img:
            pil_img.verify()
    except Exception as e:
        result["status"] = "CORRUPT_HEADER"
        result["notes"].append(f"Pillow verify error: {str(e)}")
        return result

    # Uji 2: Pembacaan decoding piksel dengan OpenCV
    img_bgr = cv2.imread(str(image_path))
    if img_bgr is None:
        result["status"] = "UNREADABLE_DECODE_FAILED"
        result["notes"].append("OpenCV gagal mendecode piksel berkas citra.")
        return result

    result["is_readable"] = True
    h, w = img_bgr.shape[:2]
    c = img_bgr.shape[2] if len(img_bgr.shape) > 2 else 1
    result["width"] = w
    result["height"] = h
    result["channels"] = c
    result["aspect_ratio"] = round(w / (h + 1e-5), 3)

    # Uji 3: Pemeriksaan resolusi minimum
    if w < MIN_WIDTH or h < MIN_HEIGHT:
        result["is_too_small"] = True
        result["status"] = "TOO_SMALL"
        result["notes"].append(f"Dimensi {w}x{h} di bawah standar minimum {MIN_WIDTH}x{MIN_HEIGHT} px.")

    # Uji 4: Skor ketajaman / blur
    blur_score = calculate_blur_score(img_bgr)
    result["blur_score"] = blur_score
    if blur_score < BLUR_THRESHOLD:
        result["is_blurry"] = True
        if result["status"] == "VALID":
            result["status"] = "BLURRY_WARNING"
        result["notes"].append(f"Skor Laplacian {blur_score} < ambang batas {BLUR_THRESHOLD} (potensi motion blur/out of focus).")

    if not result["notes"]:
        result["notes"].append("Kualitas citra memenuhi standar inspeksi.")

    return result

def scan_and_validate(target_dirs=None):
    if target_dirs is None:
        target_dirs = [
            BASE_DIR / "sample_calibrated_images",
            BASE_DIR / "test_audit_variations",
            BASE_DIR / "data" / "raw"
        ]

    report_rows = []
    total_scanned = 0
    valid_count = 0
    warning_count = 0
    corrupt_count = 0

    print("=== MEMULAI VALIDASI KUALITAS CITRA DATASET FISHGUARD AI ===")
    
    for d in target_dirs:
        if not d.exists():
            continue
        image_files = list(d.glob("*.jpg")) + list(d.glob("*.png")) + list(d.glob("*.jpeg"))
        for img_path in image_files:
            total_scanned += 1
            res = validate_image_file(img_path)
            report_rows.append(res)
            
            if res["status"] == "VALID":
                valid_count += 1
            elif "WARNING" in res["status"]:
                warning_count += 1
            else:
                corrupt_count += 1

    # Ekspor laporan ke CSV
    out_csv = REPORTS_DIR / "image_quality_report.csv"
    fieldnames = [
        "file_name", "relative_path", "file_size_kb", "is_readable",
        "width", "height", "channels", "aspect_ratio",
        "blur_score", "is_blurry", "is_too_small", "status", "notes"
    ]

    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in report_rows:
            row_copy = row.copy()
            row_copy["notes"] = "; ".join(row["notes"])
            writer.writerow(row_copy)

    print(f"\n[RINGKASAN VALIDASI CITRA]")
    print(f"Total Citra Diperiksa  : {total_scanned}")
    print(f"Status VALID (Optimal) : {valid_count}")
    print(f"Status PERINGATAN      : {warning_count}")
    print(f"Status RUSAK / DITOLAK : {corrupt_count}")
    print(f"[LAPORAN CSV] Berhasil diekspor ke: {out_csv}")

    return report_rows

if __name__ == "__main__":
    scan_and_validate()
