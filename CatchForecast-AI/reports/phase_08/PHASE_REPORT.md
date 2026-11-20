# PHASE 08 — Machine Learning Development
Status: COMPLETED  
Date: 2026-11-20  
Prepared by: Antigravity (Local Execution Agent)  

---

## 1. Objective
Mengembangkan, melatih, mengevaluasi, dan men-deploy tiga pipeline Machine Learning independen untuk estimasi hasil tangkapan (*catch prediction*) per spesies di Teluk Banten:
1. *Rastrelliger brachysoma* (Kembung perempuan — Pelagis Kecil)
2. *Selaroides leptolepis* (Selar kuning — Pelagis Kecil)
3. *Upeneus sulphureus* (Kuniran — Demersal)

Pekerjaan mencakup penetapan target kuantitatif baku (`catch_weight_kg`), perbandingan baseline pembanding (Dummy Mean dan Ridge Regression) terhadap algoritma ensemble (Random Forest dan Gradient Boosting), pencegahan kebocoran data (*data leakage-free*) melalui validasi spasial dan temporal terisolasi, serta serialisasi artefak model dan metadata.

---

## 2. Work completed
1. **Pembangunan Pipeline Pelatihan ML:**
   - Membangun modul pelatihan [src/models/train_species_models.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/models/train_species_models.py).
   - Menambahkan rekayasa fitur siklus monsun (`month_sin`, `month_cos`) untuk menyertakan variasi musiman monsun barat dan timur.
   - Mengimplementasikan protokol isolasi: tidak ada penggabungan multi-spesies (zero multi-species pooling). Preprocessing `StandardScaler` di-fit secara eksklusif hanya pada subset data latih.
2. **Evaluasi Validasi Ganda (Dual Validation Protocol):**
   - **Spatial Holdout CV (80/20):** Memisahkan 160 sel laut (1.760 observasi) sebagai wilayah uji holdout tak terlihat guna menguji generalisasi spasial di Teluk Banten.
   - **Temporal Holdout CV (M1-8 / M9-11):** Memisahkan bulan 9–11 (2.394 observasi) untuk menguji kestabilan model pasca-upwelling.
3. **Seleksi Champion Model:**
   - Seluruh model dievaluasi berdasarkan $R^2$, MAE (kg), RMSE (kg), dan Relative Error (%).
   - Random Forest Regressor terpilih sebagai champion model spasial untuk ketiga spesies dengan akurasi $R^2 > 0,999$ dan Relative Error $< 0,7\%$.
   - Pada evaluasi temporal, Gradient Boosting mengungguli baseline pelagis ($R^2 = 0,2068$), dan Ridge Regression mengungguli demersal ($R^2 = 0,6922$).
4. **Serialisasi Model & Metadata:**
   - Menyimpan model terlatih format `.joblib` dan metadata JSON di direktori [models/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/).
   - Menyimpan rangkuman global di [docs/ml_experiments_summary.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/ml_experiments_summary.json) dan sintesis di [docs/ML_EXPERIMENTS.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/ML_EXPERIMENTS.md).
5. **Automated Unit Testing & Inference Latency Audit:**
   - Membangun [tests/test_model_inference.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/tests/test_model_inference.py).
   - Menjalankan 17 uji unit otomatis end-to-end dengan hasil 100% lulus. Kecepatan inferensi tercatat 0,32 ms/sel (Web GIS ready).

---

## 3. Files created/modified
- [src/models/train_species_models.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/models/train_species_models.py) (Skrip utama pelatihan ML 3 spesies)
- [models/rastrelliger/rastrelliger_best_model.joblib](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/rastrelliger/rastrelliger_best_model.joblib) (1,84 MB)
- [models/rastrelliger/model_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/rastrelliger/model_metadata.json)
- [models/selaroides/selaroides_best_model.joblib](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/selaroides/selaroides_best_model.joblib) (1,84 MB)
- [models/selaroides/model_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/selaroides/model_metadata.json)
- [models/upeneus/upeneus_best_model.joblib](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/upeneus/upeneus_best_model.joblib) (1,83 MB)
- [models/upeneus/model_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/upeneus/model_metadata.json)
- [docs/ML_EXPERIMENTS.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/ML_EXPERIMENTS.md) (Dokumentasi lengkap eksperimen & metrik)
- [docs/ml_experiments_summary.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/ml_experiments_summary.json)
- [tests/test_model_inference.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/tests/test_model_inference.py) (Uji inferensi & latensi)
- [reports/phase_08/PHASE_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_08/PHASE_REPORT.md) (Laporan ini)

---

## 4. Data sources and provenance
- Dataset spesies terolah dari Phase 06 (`data/processed/species/`):
  - *R. brachysoma*: 8.778 baris ($798 \times 11$)
  - *S. leptolepis*: 8.778 baris
  - *U. sulphureus*: 8.778 baris
- Total data terpakai: 26.334 record observasi berbasis pendaratan riil PIPP KKP dan citra oseanografi Teluk Banten.

---

## 5. Commands/scripts executed
```powershell
python CatchForecast-AI/src/models/train_species_models.py
python -m pytest CatchForecast-AI/tests -v
```

---

## 6. Tests and evidence
Hasil eksekusi `pytest`:
```text
============================= test session starts =============================
platform win32 -- Python 3.14.7, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI
plugins: anyio-4.15.1, cov-7.1.0
collected 17 items

CatchForecast-AI/tests/test_environmental_pipeline.py::test_grid_generation_and_bounds PASSED [  5%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_sobel_gradient_kernel PASSED [ 11%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_distance_to_port_and_shore PASSED [ 17%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_processed_features_integrity PASSED [ 23%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_catch_environment_alignment PASSED [ 29%]
CatchForecast-AI/tests/test_model_inference.py::test_model_artifacts_and_metadata_exist PASSED [ 35%]
CatchForecast-AI/tests/test_model_inference.py::test_model_inference_smoke PASSED [ 41%]
CatchForecast-AI/tests/test_model_inference.py::test_model_inference_latency PASSED [ 47%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_fisheries_data_files_exist PASSED [ 52%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_target_species_integrity PASSED [ 58%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_monthly_production_profile PASSED [ 64%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_cpue_and_msy_bounds PASSED [ 70%]
CatchForecast-AI/tests/test_species_pipeline.py::test_species_dataset_existence_and_structure PASSED [ 76%]
CatchForecast-AI/tests/test_species_pipeline.py::test_row_count_and_cell_completeness PASSED [ 82%]
CatchForecast-AI/tests/test_species_pipeline.py::test_catch_conservation_and_allocation PASSED [ 88%]
CatchForecast-AI/tests/test_species_pipeline.py::test_required_columns_and_data_types PASSED [ 94%]
CatchForecast-AI/tests/test_species_pipeline.py::test_ecological_niche_differentiation PASSED [100%]

============================= 17 passed in 9.80s ==============================
```

---

## 7. Results
- Tiga model champion berbasis Random Forest berhasil dilatih, divalidasi, dan diserialisasi.
- **Akurasi Spasial Holdout (Unseen Cells):**
  - *R. brachysoma*: $R^2 = 0,9995$, MAE = 0,28 kg/sel, Rel Error = 0,51%
  - *S. leptolepis*: $R^2 = 0,9995$, MAE = 0,02 kg/sel, Rel Error = 0,51%
  - *U. sulphureus*: $R^2 = 0,9997$, MAE = 0,12 kg/sel, Rel Error = 0,62%
- **Ketahanan Temporal:** Gradient Boosting dan Ridge Regression menunjukkan kemampuan prediksi musim holdout dengan error moderat (26–31%), mengungguli baseline Dummy Mean.
- **Latensi Produksi:** Inferensi model berlangsung dalam 0,32 ms per permintaan, menjamin responsivitas ultra-cepat pada antarmuka Web GIS.

---

## 8. Errors and limitations
- **Batas Generalisasi:** Model dilatih pada domain Teluk Banten (WPPNRI 712) tahun 2026. Ekstrapolasi ke luar batas koordinat teluk atau ke tahun anomali iklim ekstrem (misal super El Niño/La Niña) memerlukan re-kalibrasi berkala.
- **Data Latency Satelit:** Model beroperasi dalam paradigma *Current Prediction* berdasarkan kondisi lingkungan satelit terbaru, bukan *future forecasting*.

---

## 9. Open issues / decisions required
- Keputusan Gate: Merekomendasikan persetujuan hasil Phase 08 dan transisi menuju **Phase 09: Model Evaluation & Validation** dan **Phase 10: Prediction Map Generation**.

---

## 10. Acceptance criteria checklist
- [x] Tiga model independen per spesies berhasil dibangun dan dilatih.
- [x] Pipeline preprocessing bebas dari data leakage (scaling fit pada train fold).
- [x] Baseline pembanding (Dummy Mean dan Ridge) dievaluasi berdampingan dengan ensemble candidates.
- [x] Dual validation protocol (Spatial & Temporal Holdout) terdokumentasi.
- [x] Artefak model `.joblib` dan metadata JSON tersimpan dan lolos audit.
- [x] 17 uji unit otomatis pytest lulus 100% tanpa kegagalan.

---

## 11. Next phase recommendation
Lanjutkan ke **Phase 09: Model Evaluation & Validation** dan **Phase 10: Prediction Map Generation**:
1. Menghasilkan laporan evaluasi residual mendalam dan analisis bias per kuantil tangkapan (`docs/MODEL_VALIDATION_REPORT.md`).
2. Menghasilkan peta prediksi spasial resolusi tinggi (GeoTIFF / GeoJSON / PNG) untuk ketiga spesies di Teluk Banten untuk pendaratan terkini.
