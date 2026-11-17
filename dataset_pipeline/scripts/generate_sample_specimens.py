"""
Script untuk membuat citra uji spesimen sintetis terkalibrasi (ikan kembung dan ikan layang)
lengkap dengan papan ukur/grid metrik untuk pengujian deteksi, pencacahan, dan estimasi panjang.
"""

import cv2
import numpy as np
from pathlib import Path

def create_sample_specimens():
    out_dir = Path(__file__).resolve().parent.parent / "sample_calibrated_images"
    out_dir.mkdir(parents=True, exist_ok=True)

    # 1. Sample 1: Ikan Kembung Tunggal dengan papan ukur metrik (Skala: 20 piksel = 1 cm)
    # Panjang ikan dibuat ~22 cm (440 piksel)
    img1 = np.full((600, 900, 3), (240, 245, 248), dtype=np.uint8)

    # Buat grid papan ukur di latar belakang
    for x in range(50, 850, 20): # Setiap 1 cm (20 px)
        cv2.line(img1, (x, 50), (x, 550), (220, 225, 230), 1)
        if (x - 50) % 100 == 0: # Setiap 5 cm
            cm_val = (x - 50) // 20
            cv2.putText(img1, f"{cm_val}cm", (x + 2, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (120, 130, 140), 1)

    # Gambar penggaris acuan di bagian bawah (50 to 650 = 30 cm)
    cv2.rectangle(img1, (50, 480), (650, 520), (200, 210, 215), -1)
    cv2.rectangle(img1, (50, 480), (650, 520), (100, 110, 120), 2)
    for x in range(50, 650, 20):
        cv2.line(img1, (x, 500), (x, 520), (80, 90, 100), 1)
        if (x - 50) % 100 == 0:
            cv2.line(img1, (x, 480), (x, 520), (50, 60, 70), 2)
            cv2.putText(img1, f"{(x-50)//20}", (x - 6, 475), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (40, 50, 60), 1)

    # Gambar siluet realistis ikan kembung (Fusiform, kepala meruncing, ekor bercagak)
    pts_kembung = np.array([
        [180, 300],  # Moncong (Snout)
        [240, 230],  # Kepala atas
        [360, 210],  # Punggung depan
        [460, 230],  # Punggung belakang
        [540, 275],  # Pangkal ekor atas
        [620, 220],  # Ujung sirip ekor atas (TL)
        [570, 300],  # Lekukan ekor (Fork Length)
        [620, 370],  # Ujung sirip ekor bawah (TL)
        [540, 325],  # Pangkal ekor bawah
        [440, 370],  # Perut bawah
        [320, 370],  # Dada bawah
        [220, 340],  # Rahang bawah
    ], np.int32)
    pts_kembung = pts_kembung.reshape((-1, 1, 2))
    cv2.fillPoly(img1, [pts_kembung], (60, 110, 150)) # Warna keperakan/kebiruan
    cv2.polylines(img1, [pts_kembung], True, (30, 60, 90), 2)
    # Mata ikan
    cv2.circle(img1, (240, 280), 8, (20, 30, 40), -1)
    cv2.circle(img1, (242, 278), 2, (255, 255, 255), -1)
    # Garis insang
    cv2.ellipse(img1, (280, 300), (15, 45), 0, -60, 60, (40, 70, 100), 2)
    # Label watermark
    cv2.putText(img1, "FishGuard AI - Kalibrasi Sampel Kembung (TL ~22 cm)", (30, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (15, 23, 42), 2)

    p1 = out_dir / "sample_kembung_calibrated.jpg"
    cv2.imwrite(str(p1), img1)
    print(f"[GENERATED] {p1}")

    # 2. Sample 2: Multi-spesies (3 Ikan: 2 Kembung, 1 Layang) untuk uji deteksi & pencacahan
    img2 = np.full((700, 1000, 3), (230, 235, 240), dtype=np.uint8)
    
    # Ikan 1 (Kembung atas)
    shift1 = np.array([50, -50])
    pts_fish1 = pts_kembung + shift1
    cv2.fillPoly(img2, [pts_fish1], (70, 120, 160))
    cv2.polylines(img2, [pts_fish1], True, (30, 60, 90), 2)
    cv2.circle(img2, (240 + 50, 280 - 50), 8, (20, 30, 40), -1)

    # Ikan 2 (Layang tengah - bentuk lebih silindris ramping)
    pts_layang = np.array([
        [150, 420],  # Moncong
        [220, 375],
        [380, 360],
        [520, 380],
        [600, 410],
        [670, 370],  # Ekor atas
        [630, 420],
        [670, 470],  # Ekor bawah
        [600, 430],
        [500, 460],
        [360, 460],
        [210, 445],
    ], np.int32).reshape((-1, 1, 2))
    cv2.fillPoly(img2, [pts_layang], (80, 140, 100)) # Warna kehijauan khas layang
    cv2.polylines(img2, [pts_layang], True, (20, 70, 40), 2)
    cv2.circle(img2, (215, 410), 7, (20, 30, 40), -1)

    # Ikan 3 (Kembung bawah)
    shift3 = np.array([120, 250])
    pts_fish3 = pts_kembung + shift3
    cv2.fillPoly(img2, [pts_fish3], (60, 110, 150))
    cv2.polylines(img2, [pts_fish3], True, (30, 60, 90), 2)
    cv2.circle(img2, (240 + 120, 280 + 250), 8, (20, 30, 40), -1)

    cv2.putText(img2, "FishGuard AI - Uji Multi-Spesies (2 Kembung, 1 Layang)", (30, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.65, (15, 23, 42), 2)

    p2 = out_dir / "sample_catch_multi_species.jpg"
    cv2.imwrite(str(p2), img2)
    print(f"[GENERATED] {p2}")

if __name__ == "__main__":
    create_sample_specimens()
