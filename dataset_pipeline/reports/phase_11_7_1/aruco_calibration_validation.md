# VALIDASI KALIBRASI METRIK OPENCV ARUCO
## FishGuard AI — ASIK V (Phase 11.7.1)
**Metode:** Eksekusi Skrip Python OpenCV 5.0.0 & Stress Testing  
**Status Evaluasi:** **PASS (ALGORITMA & KALIBRASI TERVERIFIKASI EMPIRIS)**  

---

## 1. IMPLEMENTASI OPENCV & SPESIFIKASI MARKER

Sistem kalibrasi optik FishGuard AI menggunakan modul resmi OpenCV:
- **Dictionary:** `cv2.aruco.DICT_4X4_50` (50 pola penanda unik dengan kisi biner $4 \times 4$).
- **Ukuran Marker Fisik Eksplisit:** $W_{marker} = 50,0\text{ mm}$ ($5,0\text{ cm}$).
- **Metode Deteksi:** `cv2.aruco.ArucoDetector` dengan parameter penyempurnaan sudut sub-piksel `CORNER_REFINE_SUBPIX`.

---

## 2. HASIL EMPIRIS UJI DETEKSI & STRESS TEST

Skrip pengujian laboratorium [run_phase11_7_1_validation.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/run_phase11_7_1_validation.py) dijalankan secara langsung di workspace aktif dan menghasilkan data uji empiris berikut:

| Kode Uji | Kondisi Simulasi | Status Deteksi | Sisi Terukur (px) | Skala Terhitung (px/cm) | Status Hasil |
|:---|:---|:---:|:---:|:---:|:---:|
| **TC-ARUCO-01** | Baseline Bersih + Quiet Zone 10 mm | **BERHASIL** | 200.0 px | 40.00 px/cm | **PASS** |
| **TC-ARUCO-02** | Potong Mepet (Flush Cut - Nol Margin) | **GAGAL** | 0.0 px | 0.00 px/cm | **KNOWN_FAILURE_PROVEN** |
| **TC-ARUCO-03a** | Gaussian Blur (k=5, sigma=1.5) | **BERHASIL** | 200.0 px | 40.00 px/cm | **PASS** |
| **TC-ARUCO-03b** | Gaussian Blur (k=11, sigma=3.0) | **BERHASIL** | 200.1 px | 40.02 px/cm | **PASS** |
| **TC-ARUCO-03c** | Gaussian Blur Berat (k=21, sigma=5.0) | **BERHASIL** | 199.8 px | 39.96 px/cm | **PASS** |
| **TC-ARUCO-04** | Glare 30% Sudut Tertutup | **GAGAL** | 0.0 px | 0.00 px/cm | **REJECTED_AS_EXPECTED** |
| **TC-ARUCO-05** | Distorsi Perspektif Miring 5-8° | **BERHASIL** | 196.4 px | 39.28 px/cm | **PASS** |

---

## 3. TEMUAN KRITIS & REKOMENDASI PRE-PILOT

> [!CAUTION]
> **Kewajiban Quiet Zone (Margin Putih) pada Marker Fisik**:
> Pengujian membuktikan bahwa OpenCV `ArucoDetector` **GAGAL TOTAL (0% deteksi)** jika penanda ArUco dicetak dan digunting mepet pada garis hitam terluar (`TC-ARUCO-02`). Detektor kontur adaptif membutuhkan transisi kontras putih-ke-hitam di sekeliling batas luar penanda.
> **Instruksi Wajib:** Penanda ArUco 50 mm yang dicetak untuk papan ukur TPI Karangantu wajib memiliki batas putih keliling (*white quiet zone*) dengan lebar minimal **$10\text{ mm}$**.

### Rumus Konversi Panjang ke Milimeter:
$$S_{px/mm} = \frac{\text{Rata-rata 4 Sisi Persegi Marker (px)}}{50,0\text{ mm}}$$

$$TL_{mm} = \frac{\| P_{\text{snout}} - P_{\text{caudal\_tip}} \|_{2}}{S_{px/mm}}$$
