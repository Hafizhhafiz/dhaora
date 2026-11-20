# CatchForecast AI — ASIK Vol. VI

> **Sistem Prediksi Hasil Tangkapan Ikan Berbasis AI & Data Lingkungan Oseanografi di Teluk Banten**  
> *Mata Kuliah ASIK Vol. VI | Workflow: Claude Web + Antigravity + Google Earth Engine*  
> **Status Proyek:** **100% SELESAI (Phase 01 – Phase 12 COMPLETED & VERIFIED)**

---

## 1. Ringkasan Eksekutif

**CatchForecast AI** adalah sistem kecerdasan buatan dan Web GIS prediktif untuk estimasi hasil tangkapan tiga spesies ikan target di perairan semi-tertutup **Teluk Banten (Banten Bay)**, Provinsi Banten, Indonesia (WPPNRI 712).

Sistem mengintegrasikan data oseanografi satelit resolusi tinggi ($1\text{ km}^2$) dengan data pendaratan perikanan historis dan aktual dari pangkalan pendaratan ikan lokal di **PPN Karangantu** tahun 2026.

Sistem menerapkan strategi **Species-Specific Prediction** (tiga model independen dan tiga lapisan peta spasial terpisah):
1. **Kembung perempuan** (*Rastrelliger brachysoma*) — Famili Scombridae (Pelagis Kecil)
2. **Selar kuning** (*Selaroides leptolepis*) — Famili Carangidae (Pelagis Kecil)
3. **Kuniran / Biji Nangka** (*Upeneus sulphureus*) — Famili Mullidae (Demersal Dasar Laut)

---

## 2. Status Roadmap 12-Fase (100% Selesai)

| Fase | Nama Fase | Status Gate | Ringkasan Pencapaian & Bukti |
|---|---|---|---|
| **Phase 01** | Project Definition & Research Foundation | **COMPLETED** | Konfigurasi struktur proyek, domain Teluk Banten, DEC-01–DEC-11 |
| **Phase 02** | Data Source Discovery | **COMPLETED** | Audit portal PIPP KKP Karangantu, pembuktian 3 spesies Latin, penemuan endpoint AJAX |
| **Phase 03** | Public & Institutional Dataset Inspection | **COMPLETED** | Ekstraksi 6 CSV pendaratan 2026, penghitungan bioekonomi MSY Schaefer/Fox |
| **Phase 04** | Google Earth Engine Preparation | **COMPLETED** | 3 skrip GEE v0.3 (JRC GSW, MUR SST 1 km, Sobel thermal front, ETOPO1), 0 bocor kredensial |
| **Phase 05** | Environmental Data Engineering | **COMPLETED** | Master grid 1 km (798 sel laut murni, 628 darat), 15.686 baris fitur spasio-temporal |
| **Phase 06** | Species Data Preparation | **COMPLETED** | 3 dataset mandiri (*Rastrelliger*, *Selaroides*, *Upeneus*), 100% konservasi massa |
| **Phase 07** | Exploratory Data Analysis (EDA) | **COMPLETED** | Deteksi Moran's I tinggi ($I > 0,75$), bukti empiris pemisahan niche pelagis vs demersal |
| **Phase 08** | Machine Learning Development | **COMPLETED** | Pelatihan model mandiri, Random Forest Champion ($R^2 \ge 0,999$), latensi 0,32 ms/sel |
| **Phase 09** | Model Evaluation & Validation | **COMPLETED** | Audit residual homoskedastis, MBE $< 0,001\text{ kg}$, status **PASS** ketiga spesies |
| **Phase 10** | Prediction Map Generation | **COMPLETED** | 3 GeoJSON poligon 1 km² (RFC 7946, EPSG:4326), 4 peta kartografis PNG 300 DPI |
| **Phase 11** | Backend & Web GIS Development | **COMPLETED** | Server FastAPI (7 rute REST API), antarmuka Web GIS Leaflet interaktif, zero dummy data |
| **Phase 12** | System Testing & Final Evaluation | **COMPLETED** | Matriks acceptance 12 syarat Master Brief (**PASS**), 33 unit test 100% lulus |

---

## 3. Hasil Pengujian Unit Otomatis (33/33 Tests Passed)

Suite pengujian otomatis berbasis `pytest` mencakup seluruh lapisan sistem:
```text
======================= 33 passed, 1 warning in 10.34s ========================
- test_backend_api.py (7 passed)
- test_end_to_end_system.py (5 passed)
- test_environmental_pipeline.py (5 passed)
- test_model_inference.py (3 passed)
- test_pipp_ingest_and_msy.py (4 passed)
- test_prediction_maps.py (4 passed)
- test_species_pipeline.py (5 passed)
```

---

## 4. Cara Menjalankan Aplikasi Web GIS Secara Lokal

### Cara Cepat (Satu Baris Perintah):
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Atau klik ganda berkas `run_app.bat`.

Buka peramban web (*Chrome, Edge, Firefox*):
- **Dashboard Web GIS Interaktif:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Dokumentasi REST API (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Dokumentasi Redoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 5. Dokumentasi Lengkap Proyek

- **Panduan Pengguna (Nelayan & Operator):** [docs/USER_GUIDE.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/USER_GUIDE.md)
- **Panduan Pengembang & Retraining:** [docs/DEVELOPER_GUIDE.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/DEVELOPER_GUIDE.md)
- **Panduan Backend & Web GIS:** [docs/BACKEND_WEBGIS_GUIDE.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/BACKEND_WEBGIS_GUIDE.md)
- **Laporan Akhir Sistem:** [docs/FINAL_SYSTEM_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/FINAL_SYSTEM_REPORT.md)
- **Laporan Penerimaan Syarat (Acceptance Matrix):** [reports/phase_12/FINAL_ACCEPTANCE_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_12/FINAL_ACCEPTANCE_REPORT.md)
- **Log Keputusan Arsitektur (DEC-01 s/d DEC-21):** [docs/DECISION_LOG.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/docs/DECISION_LOG.md)
