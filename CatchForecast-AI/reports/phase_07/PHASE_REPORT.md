# PHASE 07 — Exploratory Data Analysis (EDA)
Status: COMPLETED  
Date: 2026-11-20  
Prepared by: Antigravity (Local Execution Agent)  

---

## 1. Objective
Melakukan Exploratory Data Analysis (EDA) mendalam dan saintifik pada master dataset oseanografi lingkungan dan tiga dataset perikanan tangkap spesifik spesies (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*) di Teluk Banten, memverifikasi ketiadaan data leakage, mendeteksi korelasi fitur oseanografi-tangkapan, memeriksa multikolinearitas (VIF), dan merumuskan arsitektur cross-validation untuk Machine Learning (Phase 08).

---

## 2. Work completed
1. **Pipeline Ekstraksi Statistik & Visualisasi EDA:**
   - Membangun skrip [src/features/eda_analysis.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/features/eda_analysis.py) yang memproses 26.334 catatan observasi ($8.778 \times 3$ spesies).
   - Menghitung statistik deskriptif lengkap (mean, median, IQR, std, skewness, kurtosis) untuk variabel target tangkapan (`catch_weight_kg`), CPUE terstandarisasi, dan 7 prediktor lingkungan.
2. **Korelasi Linier & Monotonik Non-Linier:**
   - Menghitung matriks korelasi Pearson dan Spearman per spesies.
   - Menemukan bukti empiris *niche differentiation*: Pelagis kecil (*R. brachysoma*, *S. leptolepis*) berkorelasi negatif kuat dengan SST ($r_s = -0,371$) dan positif dengan Klorofil-a ($r = +0,405$); Demersal (*U. sulphureus*) berkorelasi negatif sangat kuat dengan kedalaman batimetri ($r_s = -0,704$) dan jarak pantai ($r_s = -0,680$).
3. **Audit Multikolinearitas (VIF Analysis):**
   - Menghitung VIF menggunakan inversi matriks korelasi murni.
   - Mengidentifikasi kolinearitas tinggi pada fitur batimetri vs slope, menyimpulkan keunggulan algoritma Tree-based Ensemble (Random Forest / Gradient Boosting) dibandingkan Linear OLS.
4. **Deteksi Autokorelasi Spasial (Moran's I):**
   - Menghitung Moran's I global pada bulan puncak upwelling (Agustus): $I = 0,7546$ (pelagis) dan $I = 0,9497$ (demersal).
   - Menetapkan larangan Random Cross-Validation untuk mencegah data leakage spasial di Phase 08.
5. **Pembangkitan Visualisasi Resolusi Tinggi:**
   - Menghasilkan 5 grafik di [reports/phase_07/figures/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/).
6. **Dokumentasi & Sintesis:**
   - Menyusun [docs/EDA_FINDINGS.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/EDA_FINDINGS.md) dan [docs/eda_metrics_summary.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/eda_metrics_summary.json).

---

## 3. Files created/modified
- [src/features/eda_analysis.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/features/eda_analysis.py) (Pipeline mandiri komputasi EDA)
- [docs/eda_metrics_summary.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/eda_metrics_summary.json) (Hasil metrik statistik lengkap)
- [docs/EDA_FINDINGS.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/EDA_FINDINGS.md) (Laporan saintifik temuan oseanografi-perikanan)
- [reports/phase_07/figures/01_species_catch_distributions.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/01_species_catch_distributions.png) (Distribusi target)
- [reports/phase_07/figures/02_environmental_feature_distributions.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/02_environmental_feature_distributions.png) (Distribusi prediktor)
- [reports/phase_07/figures/03_correlation_matrices_per_species.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/03_correlation_matrices_per_species.png) (Perbandingan korelasi Pearson vs Spearman)
- [reports/phase_07/figures/04_seasonal_upwelling_catch_trends.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/04_seasonal_upwelling_catch_trends.png) (Tren monsun & upwelling timur)
- [reports/phase_07/figures/05_spatial_catch_allocation_maps.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/05_spatial_catch_allocation_maps.png) (Peta kepadatan tangkapan 798 sel laut)
- [reports/phase_07/PHASE_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/PHASE_REPORT.md) (Laporan ini)

---

## 4. Data sources and provenance
- Tiga dataset spesies terolah dari Phase 06:
  - `data/processed/species/rastrelliger/rastrelliger_monthly_features.csv`
  - `data/processed/species/selaroides/selaroides_monthly_features.csv`
  - `data/processed/species/upeneus/upeneus_monthly_features.csv`
- Total sampel: 26.334 baris data spatio-temporal aktual.

---

## 5. Commands/scripts executed
```powershell
python CatchForecast-AI/src/features/eda_analysis.py
```

---

## 6. Tests and evidence
Hasil eksekusi terverifikasi:
- Output log konfirmasi: `Task 541 finished with code 0`.
- 5 file gambar biner PNG ter-generate lengkap dengan ukuran 298 KB – 1,18 MB.
- File metrik JSON terisi 128 baris nilai numerik valid.

---

## 7. Results
- **Bukan Zero-Inflated Masif:** Seluruh 798 sel marine di Teluk Banten memiliki estimasi tangkapan kontinu non-zero, memungkinkan pemodelan regresi langsung tanpa model hurdle dua tahap.
- **Validasi Hipotesis Ekologi:**
  - Puncak upwelling terjadi pada bulan Agustus (SST minimum 28,48°C, thermal front 0,084°C/km), memicu ledakan tangkapan pendaratan pelabuhan (420.859 kg).
  - Spesies demersal dipandu oleh paparan dasar laut dangkal (<35m), sedangkan spesies pelagis dipandu oleh dinamika massa air (SST & front termal).
- **Protokol Validasi Silang (CV):** Karena Moran's I tinggi ($I > 0,75$), validasi silang pada Phase 08 wajib menggunakan Temporal Holdout Validation (misal train Jan–Jul vs test Agt–Nov) atau Spatial Block CV.

---

## 8. Errors and limitations
- **Korelasi Bukan Kausalitas:** Korelasi Pearson/Spearman yang tinggi antara klorofil/SST dan tangkapan tidak menyiratkan hubungan kausal instan, melainkan proksi kondisi habitat agregat bulanan.
- **Resolusi Temporal:** Amplitudo amatan berbasis resolusi bulanan (11 bulan pada 2026). Dinamika harian disaring ke dalam rata-rata bulanan.

---

## 9. Open issues / decisions required
- Keputusan Gate: Menyetujui hasil analisis EDA dan membuka gate menuju **Phase 08: Machine Learning Development**.

---

## 10. Acceptance criteria checklist
- [x] Skrip EDA berjalan 100% tanpa error pada 26.334 total records.
- [x] 5 gambar visualisasi ter-generate dalam format PNG resolusi tinggi.
- [x] Matriks korelasi Pearson dan Spearman terhitung lengkap tanpa missing value.
- [x] Analisis multikolinearitas (VIF) dan autokorelasi spasial (Moran's I) terdokumentasi.
- [x] Rekomendasi skema validasi silang (cross-validation) terbukti secara saintifik untuk mencegah data leakage.

---

## 11. Next phase recommendation
Lanjutkan ke **Phase 08: Machine Learning Development**:
1. Bangun pipeline pelatihan terisolasi untuk 3 spesies target (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*).
2. Terapkan Temporal Holdout Split (misal: Bulan 1–8 untuk Training/Tuning, Bulan 9–11 untuk Evaluation/Testing) guna mengeliminasi data leakage akibat tingginya Moran's I.
3. Latih baseline model (Ridge / Decision Tree) dan bandingkan dengan non-linear models (Random Forest Regressor dan Gradient Boosting / LightGBM).
4. Catat metrik evaluasi baku: $R^2$, MAE (kg), RMSE (kg), dan MAE relative (%).
