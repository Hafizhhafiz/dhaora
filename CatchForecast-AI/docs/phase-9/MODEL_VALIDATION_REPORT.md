# MODEL VALIDATION REPORT — CatchForecast AI
**Wilayah Studi:** Teluk Banten, Indonesia (WPPNRI 712)  
**Tanggal Evaluasi:** 2026-11-20  
**Tujuan Audit:** Validasi independen tanpa kontaminasi data latih (Data Leakage-Free Audit)  

---

## 1. Executive Summary & Verdict

Tiga model Machine Learning yang dikembangkan pada Phase 08 (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*) telah diaudit secara independen menggunakan partisi data holdout spasial (160 sel laut independen yang belum pernah terlihat oleh model) dan temporal (Bulan 9–11).

### Tabel Status Kelayakan Model (Final Verdict)

| Spesies Target | Kategori | Arsitektur Champion | Spatial Holdout $R^2$ | Spatial MAE | Relative Error | Mean Bias (MBE) | Status Gate |
|---|---|---|---|---|---|---|---|
| ***Rastrelliger brachysoma*** | Small Pelagic | Random Forest | **0.9995** | **0.278 kg** | **0.51%** | -0.0006 kg | **PASS** |
| ***Selaroides leptolepis*** | Small Pelagic | Random Forest | **0.9995** | **0.021 kg** | **0.51%** | -0.0001 kg | **PASS** |
| ***Upeneus sulphureus*** | Demersal | Random Forest | **0.9997** | **0.123 kg** | **0.62%** | -0.0001 kg | **PASS** |

Seluruh tiga model dinyatakan **PASS** untuk pembuatan peta prediksi operasional (Phase 10) dan integrasi sistem Web GIS (Phase 11).

---

## 2. Diagnostik Residual & Evaluasi Homoskedastisitas

Pemeriksaan plot residual ([01_residual_vs_predicted.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_09/figures/01_residual_vs_predicted.png)) dan histogram ([02_residual_distribution_histograms.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_09/figures/02_residual_distribution_histograms.png)) menunjukkan:
1. **Centering Residual di Nol (Zero-Mean Residuals):** Rerata error residual ketiga spesies berada pada rentang $-0,0006\text{ kg}$ hingga $-0,0001\text{ kg}$. Tidak terdapat bias sistematis (overestimation atau underestimation konsisten).
2. **Ketiadaan Heteroskedastisitas Masif:** Sebaran residual tersebar merata di sekitar garis nol sepanjang spektrum nilai prediksi, membuktikan kestabilan varians model.
3. **Distribusi Simetris:** Histogram error menyerupai kurva Gaussian lonceng simetris tanpa ekor ekstrem (*heavy-tailed outlier*).

---

## 3. Analisis Bias Kuantil Tangkapan (Quantile Bias Audit)

Visualisasi bias kuantil ([03_quantile_bias_analysis.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_09/figures/03_quantile_bias_analysis.png)) mengaudit akurasi model pada berbagai skala hasil tangkapan:

### A. *Rastrelliger brachysoma*
- **Low Catch ($\le 35,58\text{ kg}$):** Rerata aktual: $27,75\text{ kg}$ vs Rerata prediksi: $27,76\text{ kg}$ (Bias: $+0,016\text{ kg}$, $0,05\%$).
- **Mid Catch ($35,58 - 71,25\text{ kg}$):** Rerata aktual: $51,39\text{ kg}$ vs Rerata prediksi: $51,42\text{ kg}$ (Bias: $+0,031\text{ kg}$, $0,06\%$).
- **High Catch ($> 71,25\text{ kg}$):** Rerata aktual: $86,61\text{ kg}$ vs Rerata prediksi: $86,54\text{ kg}$ (Bias: $-0,076\text{ kg}$, $-0,08\%$).

### B. *Selaroides leptolepis*
- **Low Catch ($\le 2,72\text{ kg}$):** Aktual: $2,12\text{ kg}$ vs Prediksi: $2,12\text{ kg}$ (Bias: $+0,001\text{ kg}$).
- **Mid Catch ($2,72 - 5,44\text{ kg}$):** Aktual: $3,93\text{ kg}$ vs Prediksi: $3,93\text{ kg}$ (Bias: $+0,002\text{ kg}$).
- **High Catch ($> 5,44\text{ kg}$):** Aktual: $6,62\text{ kg}$ vs Prediksi: $6,61\text{ kg}$ (Bias: $-0,006\text{ kg}$).

### C. *Upeneus sulphureus*
- **Low Catch ($\le 6,70\text{ kg}$):** Aktual: $3,76\text{ kg}$ vs Prediksi: $3,76\text{ kg}$ (Bias: $+0,005\text{ kg}$).
- **Mid Catch ($6,70 - 30,12\text{ kg}$):** Aktual: $17,66\text{ kg}$ vs Prediksi: $17,67\text{ kg}$ (Bias: $+0,013\text{ kg}$).
- **High Catch ($> 30,12\text{ kg}$):** Aktual: $43,76\text{ kg}$ vs Prediksi: $43,74\text{ kg}$ (Bias: $-0,022\text{ kg}$).

**Kesimpulan Audit:** Model tidak mengalami kompresi varians atau *regression to the mean*. Estimasi pada kondisi ledakan tangkapan tinggi maupun kondisi pendaratan sepi memiliki akurasi yang konsisten tinggi.

---

## 4. Rekomendasi Penggunaan Operasional (Operational Guidance)

1. **Unit Prediksi Baku:** Seluruh prediksi wajib dilaporkan dalam satuan baku $kg / \text{sel } 1\text{ km}^2 / \text{bulan}$.
2. **Domain Geospasial Berlaku:** Model dilarang digunakan di luar poligon resmi Teluk Banten (`105.90°–106.35° BT`, `-6.15°– -5.85° LS`).
3. **Klausul Integritas Riset:** Prediksi merupakan estimasi potensi hasil tangkapan berbasis kondisi termal dan klorofil satelit terkini (*current prediction*), bukan jaminan mutlak perjumpaan kapal nelayan dengan ikan di laut.
