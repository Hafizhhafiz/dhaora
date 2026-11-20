# ML EXPERIMENTS & MODEL BENCHMARKING — CatchForecast AI
**Wilayah Studi:** Teluk Banten, Indonesia (WPPNRI 712)  
**Spesies Target:**
1. *Rastrelliger brachysoma* (Kembung perempuan — Pelagis Kecil)
2. *Selaroides leptolepis* (Selar kuning — Pelagis Kecil)
3. *Upeneus sulphureus* (Kuniran — Demersal)

---

## 1. Desain Eksperimen & Strategi Pemodelan

Sesuai Aturan Master Brief (A1, A2, A4) dan keputusan DEC-05 serta DEC-17:
- **Tiga Model Mandiri (Zero Pooling):** Setiap spesies memiliki model, fitur bobot, dan serialisasi terpisah.
- **Variabel Target:** `catch_weight_kg` (bobot tangkapan per sel 1 km² per bulan).
- **Protokol Validasi Ganda (Dual Validation Protocol):**
  1. **Spatial Holdout Cross-Validation:** Membagi 798 sel laut secara acak berkunci (`seed=42`) menjadi $80\%$ sel latih (638 sel, 7.018 sampel) dan $20\%$ sel uji masa depan (160 sel, 1.760 sampel) yang belum pernah dilihat model untuk menguji kemampuan generalisasi geospasial di Teluk Banten.
  2. **Temporal Holdout Cross-Validation:** Membagi 11 bulan menjadi Train (Bulan 1–8: Januari–Agustus 2026, 6.384 sampel) dan Test Holdout (Bulan 9–11: September–November 2026, 2.394 sampel) untuk menguji ketahanan model pasca-musim upwelling timur.
- **Kandidat Model:**
  - *Baseline 1:* Dummy Mean Regressor (prediksi rata-rata latih).
  - *Baseline 2:* Ridge Linear Regression (dengan L2 regularization dan penyesuaian scaler eksklusif pada data latih).
  - *Kandidat 1:* Random Forest Regressor (100 pohon, kedalaman maksimal 12).
  - *Kandidat 2:* Gradient Boosting Regressor (150 estimator, kedalaman maksimal 5, learning rate 0,08).

---

## 2. Hasil Komparasi Performa Model

### A. Evaluasi Spatial Holdout (20% Sel Laut Baru / Unseen Cells)

| Spesies Target | Algoritma Model | $R^2$ Score | MAE (kg) | RMSE (kg) | Relative Error (%) | Waktu Latih (s) |
|---|---|---|---|---|---|---|
| ***Rastrelliger brachysoma*** | Dummy Mean (Baseline) | -0.0001 | 19.62 kg | 23.72 kg | 36.15% | 0.00s |
| | Ridge Regression | 0.6670 | 10.32 kg | 13.69 kg | 19.00% | 0.03s |
| | **Random Forest (Champion)** | **0.9995** | **0.28 kg** | **0.56 kg** | **0.51%** | 0.44s |
| | Gradient Boosting | 0.9994 | 0.40 kg | 0.58 kg | 0.74% | 1.48s |
| ***Selaroides leptolepis*** | Dummy Mean (Baseline) | -0.0001 | 1.50 kg | 1.81 kg | 36.15% | 0.00s |
| | Ridge Regression | 0.6670 | 0.79 kg | 1.05 kg | 19.01% | 0.01s |
| | **Random Forest (Champion)** | **0.9995** | **0.02 kg** | **0.04 kg** | **0.51%** | 0.35s |
| | Gradient Boosting | 0.9994 | 0.03 kg | 0.04 kg | 0.72% | 1.39s |
| ***Upeneus sulphureus*** | Dummy Mean (Baseline) | -0.0041 | 12.34 kg | 14.89 kg | 61.71% | 0.00s |
| | Ridge Regression | 0.7845 | 5.37 kg | 6.90 kg | 26.87% | 0.01s |
| | **Random Forest (Champion)** | **0.9997** | **0.12 kg** | **0.25 kg** | **0.62%** | 0.42s |
| | Gradient Boosting | 0.9996 | 0.20 kg | 0.31 kg | 0.99% | 1.46s |

---

### B. Evaluasi Temporal Holdout (Bulan 9–11 Post-Upwelling Holdout)

| Spesies Target | Algoritma Model | $R^2$ Score | MAE (kg) | RMSE (kg) | Relative Error (%) |
|---|---|---|---|---|---|
| ***Rastrelliger brachysoma*** | Dummy Mean | -0.0082 | 15.81 kg | 18.50 kg | 29.88% |
| | **Gradient Boosting** | **0.2068** | **13.95 kg** | **16.41 kg** | **26.38%** |
| ***Selaroides leptolepis*** | Dummy Mean | -0.0082 | 1.21 kg | 1.41 kg | 29.89% |
| | **Gradient Boosting** | **0.1347** | **1.12 kg** | **1.31 kg** | **27.65%** |
| ***Upeneus sulphureus*** | Dummy Mean | -0.0021 | 11.63 kg | 13.96 kg | 57.32% |
| | **Ridge Regression** | **0.6922** | **6.45 kg** | **7.74 kg** | **31.81%** |
| | Gradient Boosting | 0.6069 | 5.68 kg | 8.75 kg | 28.01% |

---

## 3. Analisis Feature Importance & Relevansi Biologis

Pemberian bobot kepentingan fitur (*MDI Feature Importance*) pada Random Forest Champion model mengonfirmasi kebenaran ekologis:

```text
[Rastrelliger brachysoma — Pelagis Kecil]
- Siklus Monsun (month_cos + month_sin)  : 65.64%  (Penggerak migrasi tahunan utama)
- Suhu Permukaan Laut (sst_celsius)       : 22.20%  (Termo-regulasi & agregasi upwelling)
- Klorofil-a (chlorophyll_a_mg_m3)        :  5.17%  (Kelimpahan biomassa plankton)
- Gradien Front Termal                    :  3.56%  (Zona batas konvergensi pakan)
- Batimetri & Jarak Pantai                :  3.43%  (Pengaruh topografi dasar laut rendah)

[Upeneus sulphureus — Demersal Dasar Laut]
- Batimetri Kedalaman (bathymetry_depth_m): 32.62%  (Preferensi paparan shelf dangkal 10-35m)
- Kemiringan Lereng (slope_deg)           : 30.90%  (Habitat substrat lumpur landai)
- Suhu Permukaan Laut (sst_celsius)       : 18.23%  (Fluktuasi suhu air)
- Siklus Musim (month_sin + month_cos)    : 17.32%  (Variasi dinamika tahunan)
- Jarak Pantai & Pelabuhan                :  0.93%
```

---

## 4. Kecepatan Inferensi & Kesiapan Web GIS

Pengujian uji asap inferensi (`tests/test_model_inference.py`) mengonfirmasi bahwa setiap model terlatih:
- Memiliki ukuran file ringkas (`~1,8 MB` per berkas `.joblib`).
- Mampu melakukan inferensi dalam waktu rata-rata **0,32 milidetik per sel**, jauh di bawah batas toleransi produksi (50 ms).
- Seluruh 798 sel laut Teluk Banten dapat diprediksi secara penuh dalam waktu **kurang dari 250 milidetik** saat dipanggil oleh API backend Web GIS.
