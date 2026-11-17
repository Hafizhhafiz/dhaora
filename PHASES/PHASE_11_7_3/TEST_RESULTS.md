# PHASE 11.7.3 — TEST RESULTS & STATISTICAL VERIFICATION
**Hasil Pengujian Geometri Optik, Keterulangan Kalibrasi, dan Stabilitas Rig**  
*Label Pengujian: SIMULATION / SYNTHETIC VERIFICATION (PHYSICAL LAB TEST PENDING HUMAN OPERATOR)*

---

## 1. Ringkasan Pengujian Terhadap Kriteria Penerimaan

| Parameter Uji | Target Pre-registrasi [AG] | Hasil Pengujian (Simulasi/Sintetis) | Status Hasil |
|---|:---:|:---:|:---:|
| **Deviasi Skala Optik (Scale Accuracy)** | $\le 1,00\%$ | **$0,057\%$** (Scale: $0,25014$ mm/px vs GT $0,25000$) | **PASS (SIMULATION)** |
| **Error Pengukuran Objek Acuan 150 mm** | $\le 2,00\%$ atau $\le 3,0$ mm | **$0,09\text{ mm}$ ($0,06\%$)** | **PASS (SIMULATION)** |
| **Keterulangan 5x Re-mount Rig (CV)** | $\le 1,00\%$ | **$0,200\%$** (Mean: $0,25115$, SD: $0,000502$) | **PASS (SIMULATION)** |
| **Keseragaman Eksposur 10x Tembakan (CV)**| $\le 3,00\%$ | **$1,24\%$** (Mean Lum: $49,84$, SD: $0,620$) | **PASS (SIMULATION)** |
| **Ortogonalitas & Aspek Rasio Marker** | $0,98 - 1,02$ | **Aspect: $1,0000$, Diag: $1,0000$** | **PASS (ORTHOGONAL)** |

---

## 2. Bukti Artefak yang Dihasilkan
1. `PHASES/PHASE_11_7_3/EVIDENCE/synthetic_calibration_frame.png` — Citra uji sintetis resolusi 1920x1080 memuat marker ArUco 50 mm dan mistar 150 mm.
2. `PHASES/PHASE_11_7_3/EVIDENCE/calibrated_synthetic_calibration_frame.png` — Citra hasil deteksi OpenCV dengan visualisasi 4 sudut marker sub-pixel dan anotasi scale factor.
3. `PHASES/PHASE_11_7_3/EVIDENCE/remount_test_trial_1.png` s.d. `trial_5.png` — Rangkaian 5 citra simulasi uji pelepasan dan pemasangan kembali bodi kamera pada rig.
4. `PHASES/PHASE_11_7_3/EVIDENCE/calibration_test_summary.json` — Rekam data kuantitatif machine-readable.

---

## 3. Catatan Kepatuhan Integritas Ilmiah (Golden Rule #1 & #3)
Sesuai kaidah integritas riset, hasil uji di atas dicatat secara tegas sebagai **`SIMULATION / SYNTHETIC TEST`**. Sistem tidak mengklaim pengujian fisik telah selesai pada perangkat keras riil sebelum operator manusia melakukan pemotretan pada bodi dan lensa kamera fisik di laboratorium.
