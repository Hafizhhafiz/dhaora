# PHASE 15 — TASKS & EXECUTION TRACKER

| Task ID | Deskripsi Tugas | Pemilik | Status | Kriteria Penerimaan | Bukti / Output |
|:---:|:---|:---:|:---:|:---|:---|
| **15-T1** | Weight Auto-Detection Verification | Backend Lead | **COMPLETED / VERIFIED** | `yolo_service.py` otomatis memuat bobot dan beralih ke `CUSTOM_SPECIES_MODEL` | `backend/test_pipeline.py` (Test 02) |
| **15-T2** | Endpoint Detection & Composition | Backend Dev | **COMPLETED / VERIFIED** | `/api/detect` memproses 3 kelas target MVP + persistensi SQLite | `backend/test_pipeline.py` (Test 04) |
| **15-T3** | Endpoint Length & Uncertainty | CV Engineer | **COMPLETED / VERIFIED** | `/api/measure` mendukung ArUco marker, kurvatur, dan status ladder | `backend/test_pipeline.py` (Test 06) |
| **15-T4** | Endpoint History & Analytics | Backend Dev | **COMPLETED / VERIFIED** | `/api/history` dan `/api/statistics` menampilkan metrik 3 spesies | `backend/test_pipeline.py` (Test 07) |
| **15-T5** | Error Handling & Boundary Guard | QA Engineer | **COMPLETED / VERIFIED** | Penolakan citra kosong dan tipe non-gambar dengan HTTP 400 | `backend/test_pipeline.py` (Test 05) |
| **15-T6** | Frontend Alignment (React UI) | Frontend Dev | **COMPLETED / VERIFIED** | DetectionPage, CountingPage, dan MeasurementPage terhubung ke API riil | `frontend/src/pages/` |
| **15-T7** | End-to-End Pipeline Automation | QA Lead | **COMPLETED / VERIFIED** | 8/8 uji integrasi lulus 100% tanpa regresi | `backend/test_pipeline.py` |
