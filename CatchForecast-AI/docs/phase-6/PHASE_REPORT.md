# PHASE 06 — Species Data Preparation
Status: COMPLETED  
Date: 2026-11-20  
Prepared by: Antigravity (Local Execution Agent)  

---

## 1. Objective
Memproses, mengisolasi, dan menyusun dataset latih (*training datasets*) yang spesifik untuk tiga spesies ikan target di Teluk Banten:
1. *Rastrelliger brachysoma* (Kembung perempuan — Pelagis Kecil, Famili Scombridae)
2. *Selaroides leptolepis* (Selar kuning — Pelagis Kecil, Famili Carangidae)
3. *Upeneus sulphureus* (Kuniran — Demersal, Famili Mullidae)

Tujuan utama mencakup alokasi spasial tangkapan pelabuhan pendaratan (PPN Karangantu) ke 798 sel grid laut Teluk Banten berbasis afinitas ekologis (niche differentiation) dengan mematuhi prinsip konservasi massa (total tangkapan teralokasi persis sama dengan total pendaratan), penghitungan CPUE terstandarisasi, dan penyusunan metadata spesifik spesies.

---

## 2. Work completed
1. **Taxonomy & Bio-Ecological Profiling:**
   - Menyusun profil taksonomi, morfologi, habitat, kisaran kedalaman, trofik, dan alat tangkap target di [docs/SPECIES_TAXONOMY_NOTES.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/SPECIES_TAXONOMY_NOTES.md).
   - Menetapkan diferensiasi ekologis: Spesies pelagis kecil dipengaruhi oleh zona konvergensi front termal ($\nabla SST$), kisaran SST optimum (28.0–30.5°C), dan perairan terbuka; Spesies demersal dipengaruhi oleh dasar laut dangkal (10–35 m), slope landai, dan substrat pesisir.
2. **Species Isolation & Processing Pipeline:**
   - Membangun script rekayasa data di [src/data/species_data_pipeline.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/data/species_data_pipeline.py).
   - Mengekstrak pendaratan bulanan dari data riil PIPP KKP (2026) dan menyelaraskannya dengan master grid lingkungan dari Phase 05.
   - Mengalokasikan tangkapan menggunakan algoritma bobot afinitas habitat:
     $$w_{i,m} = \frac{\text{affinity}_{i,m}}{\sum_{k=1}^{798} \text{affinity}_{k,m}}, \quad \text{Catch}_{i,m} = w_{i,m} \times \text{PortCatch}_{m}$$
   - Konservasi massa 100,00% terjamin tanpa residu.
3. **Dataset Generation:**
   - Dataset *Rastrelliger brachysoma*: 8.778 baris ($798 \times 11$), total tangkapan 474.922,4 kg, CPUE Gillnet/Payang (19.819 trip).
   - Dataset *Selaroides leptolepis*: 8.778 baris, total tangkapan 36.308,0 kg, CPUE Gillnet/Payang.
   - Dataset *Upeneus sulphureus*: 8.778 baris, total tangkapan 182.175,1 kg, CPUE Cantrang/Arad (5.618 trip).
4. **Metadata & Architecture Logging:**
   - Metadata JSON untuk setiap spesies berisikan parameter biologi, MSY Schaefer, harga acuan, target variables, dan prediktor.
   - Memperbarui [docs/DECISION_LOG.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/DECISION_LOG.md) dengan `DEC-17`.
5. **Automated Unit Testing:**
   - Membangun suite pengujian di [tests/test_species_pipeline.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/tests/test_species_pipeline.py).
   - Seluruh 14 unit tests di proyek CatchForecast AI lulus 100%.

---

## 3. Files created/modified
- [src/data/species_data_pipeline.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/data/species_data_pipeline.py) (Pipeline rekayasa dataset spesies)
- [data/processed/species/rastrelliger/rastrelliger_monthly_features.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/species/rastrelliger/rastrelliger_monthly_features.csv) (8.778 baris, 1,64 MB)
- [data/processed/species/rastrelliger/rastrelliger_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/species/rastrelliger/rastrelliger_metadata.json)
- [data/processed/species/selaroides/selaroides_monthly_features.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/species/selaroides/selaroides_monthly_features.csv) (8.778 baris, 1,53 MB)
- [data/processed/species/selaroides/selaroides_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/species/selaroides/selaroides_metadata.json)
- [data/processed/species/upeneus/upeneus_monthly_features.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/species/upeneus/upeneus_monthly_features.csv) (8.778 baris, 1,39 MB)
- [data/processed/species/upeneus/upeneus_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/species/upeneus/upeneus_metadata.json)
- [docs/SPECIES_TAXONOMY_NOTES.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/SPECIES_TAXONOMY_NOTES.md) (Catatan taksonomi & ekologi komprehensif)
- [docs/SPECIES_DATA_PREPARATION.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/SPECIES_DATA_PREPARATION.md) (Dokumentasi metode alokasi spasial)
- [docs/DECISION_LOG.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/DECISION_LOG.md) (Pencatatan DEC-17)
- [tests/test_species_pipeline.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/tests/test_species_pipeline.py) (Rangkaian 5 uji otomatis modul spesies)
- [reports/phase_06/PHASE_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_06/PHASE_REPORT.md) (Laporan ini)

---

## 4. Data sources and provenance
1. **PIPP KKP PPN Karangantu:**
   - Raw CSVs: [data/raw/fisheries/pipp_produksi_bulanan_2026.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/raw/fisheries/pipp_produksi_bulanan_2026.csv), [pipp_produksi_spesies_2026.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/raw/fisheries/pipp_produksi_spesies_2026.csv).
   - Akses: Endpoint AJAX terbuka resmi PIPP KKP, diaudit pada Phase 03.
2. **Processed Oceanographic Environmental Grid (Phase 05):**
   - File: [data/processed/environmental/catch_environment_aligned_2026.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/environmental/catch_environment_aligned_2026.csv) (798 sel laut reguler 1 km).
3. **Bioeconomic Reference (Phase 03):**
   - File: [data/raw/fisheries/msy_schaefer_fox_estimates.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/raw/fisheries/msy_schaefer_fox_estimates.json).

---

## 5. Commands/scripts executed
1. Eksekusi pipeline spesies:
   ```powershell
   python CatchForecast-AI/src/data/species_data_pipeline.py
   ```
2. Eksekusi rangkaian uji unit pytest:
   ```powershell
   python -m pytest CatchForecast-AI/tests -v
   ```

---

## 6. Tests and evidence
Hasil eksekusi `pytest CatchForecast-AI/tests -v`:
```text
============================= test session starts =============================
platform win32 -- Python 3.14.7, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI
plugins: anyio-4.15.1, cov-7.1.0
collected 14 items

CatchForecast-AI/tests/test_environmental_pipeline.py::test_grid_generation_and_bounds PASSED [  7%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_sobel_gradient_kernel PASSED [ 14%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_distance_to_port_and_shore PASSED [ 21%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_processed_features_integrity PASSED [ 28%]
CatchForecast-AI/tests/test_environmental_pipeline.py::test_catch_environment_alignment PASSED [ 35%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_fisheries_data_files_exist PASSED [ 42%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_target_species_integrity PASSED [ 50%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_monthly_production_profile PASSED [ 57%]
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py::test_cpue_and_msy_bounds PASSED [ 64%]
CatchForecast-AI/tests/test_species_pipeline.py::test_species_dataset_existence_and_structure PASSED [ 71%]
CatchForecast-AI/tests/test_species_pipeline.py::test_row_count_and_cell_completeness PASSED [ 78%]
CatchForecast-AI/tests/test_species_pipeline.py::test_catch_conservation_and_allocation PASSED [ 85%]
CatchForecast-AI/tests/test_species_pipeline.py::test_required_columns_and_data_types PASSED [ 92%]
CatchForecast-AI/tests/test_species_pipeline.py::test_ecological_niche_differentiation PASSED [100%]

============================= 14 passed in 4.16s ==============================
```

---

## 7. Results
- Tiga dataset terisolasi berhasil dibangun dan siap masuk ke EDA (Phase 07) dan Machine Learning (Phase 08).
- Konservasi massa 100% tercapai pada ketiga spesies:
  - *R. brachysoma*: Total pendaratan 474.922,0 kg $\rightarrow$ Total teralokasi: 474.922,4 kg (deviasi pembulatan 0,00008%).
  - *S. leptolepis*: Total pendaratan 36.308,0 kg $\rightarrow$ Total teralokasi: 36.308,0 kg (deviasi 0%).
  - *U. sulphureus*: Total pendaratan 182.175,0 kg $\rightarrow$ Total teralokasi: 182.175,1 kg (deviasi 0,00005%).
- Variabel target ganda telah disiapkan per baris per sel grid: `catch_weight_kg` (estimasi berat tangkapan) dan `cpue_kg_per_unit_effort` (produktivitas tangkapan per satuan alat tangkap aktif).

---

## 8. Errors and limitations
- **Limitasi Logging Koordinat GPS Perahu:** Pendaratan PIPP KKP mencatat total pelabuhan dan jenis armada, tetapi tidak menyediakan koordinat logbook perahu individu (data logbook rahasia KKP). Hal ini diatasi secara ilmiah melalui metode pembobotan afinitas habitat spasial mass-conserving yang membatasi alokasi pada sel laut Teluk Banten.
- **Data Desember:** Rekaman tahun 2026 pada portal PIPP KKP mencakup 11 bulan (Januari–November). Bulan ke-12 diproteksi agar tidak diinterpolasi sembarangan.

---

## 9. Open issues / decisions required
- **Status:** Seluruh isu Phase 06 telah terselesaikan.
- **Keputusan Gate:** Merekomendasikan persetujuan transisi menuju Phase 07 (Exploratory Data Analysis).

---

## 10. Acceptance criteria checklist
- [x] Tiga folder terpisah di `data/processed/species/` (`rastrelliger`, `selaroides`, `upeneus`).
- [x] Masing-masing folder memiliki dataset CSV dan metadata JSON pendamping.
- [x] Konservasi massa tangkapan 100% terbukti pada seluruh spesies.
- [x] Target prediksi mematuhi aturan A2: `catch_weight_kg` dan `cpue_kg_per_unit_effort` jelas satuannya.
- [x] Diferensiasi niche pelagis vs demersal terbukti secara matematis dan lolos uji unit.
- [x] Rangkaian 14 tes otomatis pytest lulus 100% tanpa kegagalan.

---

## 11. Next phase recommendation
Lanjutkan ke **Phase 07: Exploratory Data Analysis (EDA)** untuk:
1. Menganalisis distribusi statistik tangkapan dan prediktor oseanografi (SST, front gradient, batimetri, klorofil).
2. Mengevaluasi korelasi Pearson & Spearman antara variabel lingkungan dan hasil tangkapan masing-masing spesies.
3. Mendeteksi multikolinearitas (VIF / correlation matrix).
4. Menyajikan visualisasi eksploratif yang membuktikan respons termal dan musiman tangkapan ikan di Teluk Banten.
