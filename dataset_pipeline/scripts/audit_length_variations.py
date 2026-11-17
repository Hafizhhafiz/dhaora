"""
Audit Script: Menguji algoritma estimasi panjang terhadap 6 variasi kondisi:
1. Ikan horizontal (baseline)
2. Ikan miring (rotasi 30 derajat)
3. Ikan dengan ekor terbuka (forked)
4. Ikan dengan ekor melengkung/terlipat
5. Ikan dengan latar belakang kompleks (tekstur dek kapal / kayu)
6. Ikan dengan pencahayaan tidak merata (shadow & specular highlight)
"""

import cv2
import numpy as np
import math
import sys
from pathlib import Path

# Add root directory to sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.services.length_service import LengthEstimationService
from backend.app.models.schemas import LengthMeasurementRequest, CalibrationData

def generate_test_variations():
    test_dir = Path("dataset_pipeline/test_audit_variations")
    test_dir.mkdir(parents=True, exist_ok=True)
    scale = 20.0 # 20 px/cm -> Ikan 440 px ~ 22.0 cm

    # Base fish contour points (snout at 180,300, tail at 620,300 -> dx=440px -> 22.0cm)
    base_pts = np.array([
        [180, 300], [240, 230], [360, 210], [460, 230],
        [540, 275], [620, 220], [570, 300], [620, 370],
        [540, 325], [440, 370], [320, 370], [220, 340],
    ], np.int32)

    results = {}

    # 1. Horizontal standard
    img1 = np.full((600, 900, 3), (245, 245, 245), dtype=np.uint8)
    cv2.fillPoly(img1, [base_pts], (70, 110, 150))
    p1 = test_dir / "1_horizontal.jpg"
    cv2.imwrite(str(p1), img1)
    results["1_horizontal"] = (str(p1.resolve()), 22.0)

    # 2. Slanted (rotated 30 degrees around center 400, 300)
    img2 = np.full((600, 900, 3), (245, 245, 245), dtype=np.uint8)
    center = (400, 300)
    angle = 30.0
    rad = math.radians(angle)
    cos_a, sin_a = math.cos(rad), math.sin(rad)
    rot_pts = []
    for x, y in base_pts:
        tx, ty = x - center[0], y - center[1]
        rx = tx * cos_a - ty * sin_a + center[0]
        ry = tx * sin_a + ty * cos_a + center[1]
        rot_pts.append([int(rx), int(ry)])
    rot_pts = np.array(rot_pts, np.int32)
    cv2.fillPoly(img2, [rot_pts], (70, 110, 150))
    p2 = test_dir / "2_slanted_30deg.jpg"
    cv2.imwrite(str(p2), img2)
    results["2_slanted"] = (str(p2.resolve()), 22.0)

    # 3. Open tail (lebar ekor diperlebar)
    img3 = np.full((600, 900, 3), (245, 245, 245), dtype=np.uint8)
    pts3 = base_pts.copy()
    pts3[5] = [620, 190] # Ujung atas lebih lebar
    pts3[7] = [620, 400] # Ujung bawah lebih lebar
    cv2.fillPoly(img3, [pts3], (70, 110, 150))
    p3 = test_dir / "3_open_tail.jpg"
    cv2.imwrite(str(p3), img3)
    results["3_open_tail"] = (str(p3.resolve()), 22.0)

    # 4. Folded tail (ekor melengkung/terlipat ke bawah 40 px)
    img4 = np.full((600, 900, 3), (245, 245, 245), dtype=np.uint8)
    pts4 = base_pts.copy()
    pts4[5] = [580, 260] # Memendek karena terlipat
    pts4[6] = [560, 300]
    pts4[7] = [580, 340]
    cv2.fillPoly(img4, [pts4], (70, 110, 150))
    p4 = test_dir / "4_folded_tail.jpg"
    cv2.imwrite(str(p4), img4)
    results["4_folded_tail"] = (str(p4.resolve()), 22.0) # Fisik 22cm tapi terlipat

    # 5. Complex background (tekstur dek kapal / papan bergaris kontras)
    img5 = np.zeros((600, 900, 3), dtype=np.uint8)
    for y in range(0, 600, 25): # Garis papan
        c = (140, 160, 180) if (y // 25) % 2 == 0 else (100, 120, 140)
        cv2.rectangle(img5, (0, y), (900, y + 25), c, -1)
        cv2.line(img5, (0, y), (900, y), (50, 60, 70), 2)
    # Tambah noise
    noise = np.random.randint(0, 40, (600, 900, 3), dtype=np.uint8)
    img5 = cv2.add(img5, noise)
    cv2.fillPoly(img5, [base_pts], (70, 110, 150))
    p5 = test_dir / "5_complex_bg.jpg"
    cv2.imwrite(str(p5), img5)
    results["5_complex_bg"] = (str(p5.resolve()), 22.0)

    # 6. Varied lighting (gradien bayangan gelap di kiri, specular glare di kanan)
    img6 = np.full((600, 900, 3), (240, 240, 240), dtype=np.uint8)
    cv2.fillPoly(img6, [base_pts], (70, 110, 150))
    # Bayangan gelap di sisi kiri
    shadow_mask = np.tile(np.linspace(0.3, 1.0, 900), (600, 1))
    for c in range(3):
        img6[:, :, c] = (img6[:, :, c] * shadow_mask).astype(np.uint8)
    # Glare di tengah
    cv2.circle(img6, (400, 280), 50, (255, 255, 255), -1)
    p6 = test_dir / "6_varied_lighting.jpg"
    cv2.imwrite(str(p6), img6)
    results["6_varied_lighting"] = (str(p6.resolve()), 22.0)

    return results

def run_audit():
    service = LengthEstimationService()
    test_cases = generate_test_variations()
    print("\n=== HASIL PENGUJIAN ALGORITMA ESTIMASI PANJANG (OPENCV) ===")
    print(f"{'Kondisi Pengujian':<25} | {'Ground Truth':<12} | {'Hasil CV (TL)':<14} | {'Error (cm)':<10} | {'Status Akurasi'}")
    print("-" * 85)

    audit_summary = []

    for name, (img_path, gt_cm) in test_cases.items():
        req = LengthMeasurementRequest(
            image_path=img_path,
            calibration=CalibrationData(mode="pixels_per_cm", pixels_per_cm=20.0),
            auto_contour=True
        )
        resp = service.measure_length(req)
        measured_cm = resp.total_length_cm if resp.total_length_cm is not None else 0.0
        err = round(abs(measured_cm - gt_cm), 2)
        status = "AKURAT (<5% deviasi)" if err <= 1.1 else ("DEVIASI TINGGI" if err <= 5.0 else "GAGAL TOTAL")
        print(f"{name:<25} | {gt_cm:<12.1f} | {measured_cm:<14.2f} | {err:<10.2f} | {status}")
        audit_summary.append({
            "name": name,
            "gt": gt_cm,
            "measured": measured_cm,
            "error": err,
            "warnings": resp.warnings,
            "contour_found": resp.contour_detected
        })

    return audit_summary

if __name__ == "__main__":
    run_audit()
