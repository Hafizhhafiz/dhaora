# PHASE 10 — Prediction Map Generation
Status: COMPLETED  
Date: 2026-11-20  
Prepared by: Antigravity (Local Execution Agent)  

---

## 1. Objective
Membangun pipeline visualisasi dan kartografi geospasial yang menerjemahkan inferensi model Machine Learning yang telah lulus validasi independen pada Phase 09 menjadi peta prediksi spasial (*catch prediction maps*) mandiri per spesies di perairan Teluk Banten, mematuhi standar CRS EPSG:4326, memproduksi format GeoJSON poligon sel laut 1 km², peta kartografis PNG resolusi 300 DPI, serta menyematkan metadata dan klausul etika riset.

---

## 2. Work completed
1. **Pembangunan Pipeline Kartografi & Pemetaan Spasial:**
   - Membangun skrip [src/mapping/generate_prediction_maps.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/mapping/generate_prediction_maps.py).
   - Menghubungkan model champion Random Forest dari [models/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/models/) dengan 798 sel laut aktif Teluk Banten pada kondisi oseanografi terkini (November 2026).
2. **Produksi Tiga Lapisan Peta GeoJSON Independen:**
   - Menghasilkan 3 berkas GeoJSON terpisah di [data/processed/maps/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/maps/):
     - `rastrelliger_prediction_map.geojson` (843 KB)
     - `selaroides_prediction_map.geojson` (834 KB)
     - `upeneus_prediction_map.geojson` (827 KB)
   - Setiap berkas memuat 798 fitur poligon teratur dengan atribut lengkap: `predicted_catch_kg`, `predicted_cpue_kg_per_trip`, SST, front gradient, batimetri, dan jarak ke pantai/pelabuhan.
3. **Pembangkitan Peta Kartografis Resolusi Tinggi (300 DPI):**
   - Menghasilkan 3 peta tematik tunggal dan 1 peta multi-spesies komparatif di [reports/phase_10/maps/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_10/maps/):
     - `rastrelliger_prediction_map.png` (279 KB, colormap: *YlOrRd*)
     - `selaroides_prediction_map.png` (268 KB, colormap: *YlGnBu*)
     - `upeneus_prediction_map.png` (261 KB, colormap: *viridis*)
     - `04_comparative_prediction_map.png` (656 KB, panel 3 spesies berdampingan)
   - Dilengkapi grid koordinat, petunjuk arah utara (*North Arrow*), lokasi PPN Karangantu, skala bar, dan klausul batas ilmiah.
4. **Automated Unit Testing:**
   - Membangun [tests/test_prediction_maps.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/tests/test_prediction_maps.py) yang mengaudit skema RFC 7946, penutupan ring poligon, dan validitas nilai.
   - Seluruh rangkaian uji unit proyek kini mencapai **21 pengujian otomatis** dengan hasil **100% lulus (PASSED)**.

---

## 3. Files created/modified
- [src/mapping/generate_prediction_maps.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/src/mapping/generate_prediction_maps.py)
- [data/processed/maps/rastrelliger_prediction_map.geojson](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/maps/rastrelliger_prediction_map.geojson)
- [data/processed/maps/selaroides_prediction_map.geojson](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/maps/selaroides_prediction_map.geojson)
- [data/processed/maps/upeneus_prediction_map.geojson](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/maps/upeneus_prediction_map.geojson)
- [data/processed/maps/map_metadata.json](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/data/processed/maps/map_metadata.json)
- [reports/phase_10/maps/rastrelliger_prediction_map.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_10/maps/rastrelliger_prediction_map.png)
- [reports/phase_10/maps/selaroides_prediction_map.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_10/maps/selaroides_prediction_map.png)
- [reports/phase_10/maps/upeneus_prediction_map.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_10/maps/upeneus_prediction_map.png)
- [reports/phase_10/maps/04_comparative_prediction_map.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_10/maps/04_comparative_prediction_map.png)
- [docs/PREDICTION_MAPPING_METHODOLOGY.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/PREDICTION_MAPPING_METHODOLOGY.md)
- [tests/test_prediction_maps.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/tests/test_prediction_maps.py)
- [reports/phase_10/PHASE_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_10/PHASE_REPORT.md) (Laporan ini)

---

## 4. Data sources and provenance
- Model Machine Learning terlatih dari Phase 08 (`models/`): *Random Forest Champion Regressors*.
- Parameter spasial master grid dari Phase 05: 798 sel laut reguler $1\text{ km}^2$.
- Telemetri satelit lingkungan terkini: November 2026 (kondisi pasca-*upwelling* terkini).

---

## 5. Commands/scripts executed
```powershell
python CatchForecast-AI/src/mapping/generate_prediction_maps.py
python -m pytest CatchForecast-AI/tests -v
```

---

## 6. Tests and evidence
Hasil uji otomatis `pytest CatchForecast-AI/tests -v`:
```text
============================= test session starts =============================
platform win32 -- Python 3.14.7, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI
plugins: anyio-4.15.1, cov-7.1.0
collected 21 items

CatchForecast-AI/tests/test_environmental_pipeline.py (5 passed)
CatchForecast-AI/tests/test_model_inference.py (3 passed)
CatchForecast-AI/tests/test_pipp_ingest_and_msy.py (4 passed)
CatchForecast-AI/tests/test_prediction_maps.py (4 passed)
CatchForecast-AI/tests/test_species_pipeline.py (5 passed)

============================= 21 passed in 10.13s =============================
```

---

## 7. Results
- **Estimasi Total Biomassa Tangkapan (November 2026):**
  - *R. brachysoma*: Total prediksi $26.009,73\text{ kg}$, rerata sel $32,59\text{ kg/km}^2$, maksimum $39,47\text{ kg/km}^2$.
  - *S. leptolepis*: Total prediksi $1.988,50\text{ kg}$, rerata sel $2,49\text{ kg/km}^2$, maksimum $3,01\text{ kg/km}^2$.
  - *U. sulphureus*: Total prediksi $9.967,20\text{ kg}$, rerata sel $12,49\text{ kg/km}^2$, maksimum $21,48\text{ kg/km}^2$.
- **Diferensiasi Spasial:**
  - Ikan kembung (*Rastrelliger*) dan selar (*Selaroides*) terdistribusi meluas di perairan tengah dan mulut teluk tempat terjadinya percampuran air dan front termal.
  - Ikan kuniran (*Upeneus*) terpusat sangat padat pada paparan dasar laut dangkal di sepanjang pesisir timur dan selatan dekat estuari Karangantu.

---

## 8. Errors and limitations
- **Penanganan Nilai Daratan:** Seluruh daratan (628 sel) secara tegas tidak diinterpolasi dan diwarnai abu-abu terang (*no-data*) untuk mencegah kesalahan interpretasi bahwa ada potensi penangkapan di darat.

---

## 9. Open issues / decisions required
- Gate Phase 10 terpenuhi penuh. Siap melangkah ke **Phase 11: Backend & Web GIS Development**.

---

## 10. Acceptance criteria checklist
- [x] Tiga peta prediksi terpisah untuk masing-masing spesies target.
- [x] Grid dan domain terkunci pada 798 sel laut Teluk Banten; daratan dimask sebagai no-data.
- [x] Format GeoJSON valid RFC 7946 (EPSG:4326) terbit dengan atribut kuantitatif lengkap.
- [x] Peta tematik PNG resolusi 300 DPI terbit dengan legenda, skala, dan arah utara.
- [x] Klausul etika riset disematkan secara eksplisit pada peta dan metadata.
- [x] Seluruh 21 uji unit otomatis pytest lulus 100%.

---

## 11. Next phase recommendation
Melangkah ke **Phase 11: Backend & Web GIS Development**:
1. Membangun backend REST API berbasis FastAPI untuk melayani metadata dan lapisan GeoJSON prediksi secara dinamis.
2. Membangun antarmuka interaktif Web GIS (Leaflet.js / HTML5 modern) dengan kendali lapisan spesies (*layer control*), peta dasar satelit/OSM, penunjuk titik koordinat, *inspector popup*, dan ringkasan bioekonomi tangkapan.
