# ASIK VOL VI UNIFIED PLATFORM — LAPORAN PENYELESAIAN INTEGRASI (PHASE REPORT)
**Tanggal Laporan:** 18 November 2026  
**Institusi:** Program Studi Sains Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Proyek:** Evolusi Sistem Pemantauan Perikanan ASIK VOL VI — Integrasi Terpadu FishGuard AI & ByCatch AI

---

## 1. Latar Belakang & Mandat
Proyek ASIK VOL VI bertujuan menyatukan aplikasi pemantauan perikanan berbasis komputer visi yang telah ada (*FishGuard AI*) ke dalam kerangka platform terpadu (*Unified ASIK Shell*), serta mengintegrasikan proyek intelijen mitigasi tangkapan sampingan (*ByCatch AI*).

Sesuai arahan operator:
1. **FishGuard AI** dipertahankan secara utuh sebagai **Modul 1** tanpa merusak satu pun endpoint legasi (`/api/detect`, `/api/measure`, `/api/history`, `/api/statistics`), basis data historis, maupun bobot inferensi terkalibrasi.
2. **ByCatch AI** diintegrasikan sebagai **Modul 2** dengan mempertahankan model YOLO11n asli, mesin aturan kontekstual trip nelayan (FAO Framework), basis data konservasi resmi (IUCN Red List v4, CITES Species+, dan JDIH KKP RI), serta penyimpanan `app.sqlite`.
3. **OceanSense AI** ditampilkan secara jujur dengan status **Planned / Dalam Riset Akademik** yang mendokumentasikan spesifikasi penginderaan jauh satelit (Sentinel-3, MODIS Aqua) tanpa rekayasa data tiruan (*zero fabrication*).
4. **CatchForecast AI** dihentikan dan dihapus secara total (*terminated*) dari seluruh kartu status, antarmuka navigasi, dan rute backend.

---

## 2. Arsitektur Solusi Terintegrasi

### A. Frontend Shell (React + Tailwind CSS + Vite)
- **Navigasi Dua Tingkat (*Two-Level Navigation*):**
  - **Tingkat 1 (Pemilih Modul):** Beranda Platform ASIK, Modul 1 (FishGuard AI), Modul 2 (ByCatch AI), Modul 3 (OceanSense AI - Planned), dan Tentang Platform.
  - **Tingkat 2 (Sub-Navigasi Kontekstual):**
    - *FishGuard AI:* Dashboard, Deteksi AI, Penghitungan Ikan, Estimasi Panjang ArUco, Riwayat Analisis, Dataset & Taksonomi.
    - *ByCatch AI:* ByCatch Screening, Mesin Aturan FAO, Status Konservasi Otoritatif, Pencatatan & Riwayat Trip.
    - *OceanSense AI:* Roadmap Penelitian Oseanografi Satelit.
- **Header Dinamis (Navbar):** Menampilkan breadcrumb modul aktif, zona studi Teluk Banten, serta spesifikasi mesin AI yang sedang aktif.
- **Status Ganda Real-Time:** Bilah sisi (Sidebar) memantau detak kesehatan (*health check*) backend FishGuard dan ByCatch secara paralel setiap 15 detik.

### B. Backend API Terpadu (FastAPI pada Port 8000)
- Seluruh layanan AI disatukan di bawah port 8000 menggunakan router FastAPI modular:
  - `backend/app/routers/detection.py`: Endpoint legasi FishGuard (`/api/detect`).
  - `backend/app/routers/measurement.py`: Endpoint kalibrasi metrik panjang ArUco 50 mm (`/api/measure`).
  - `backend/app/routers/history.py`: Endpoint riwayat dan agregasi statistik (`/api/history`, `/api/statistics`).
  - `backend/app/routers/bycatch.py`: Router baru Modul 2 (`/api/bycatch/health`, `/api/bycatch/detect`, `/api/bycatch/roles`, `/api/bycatch/conservation/{name}`, `/api/bycatch/records`, `/api/bycatch/trips`).
- **Isolasi Database:**
  - Data FishGuard tersimpan pada `backend/fishguard_history.db`.
  - Data ByCatch tersimpan pada `bycatch/data/app.sqlite` (WAL mode).
  - Kedua database terisolasi secara ketat sehingga tidak ada risiko benturan skema (*schema collision*).

---

## 3. Hasil Pengujian & Verifikasi Kualitas
Rangkaian pengujian lengkap telah dieksekusi secara berurutan dengan hasil kelulusan **100% (54/54 Pengujian Lulus)**:
1. `backend/test_pipeline.py`: **8/8 PASSED (100%)**
2. `tests/test_system_suite.py`: **12/12 PASSED (100%)**
3. `bycatch/tests/unit/`: **23/23 PASSED (100%)**
4. `tests/test_bycatch_integration.py`: **5/5 PASSED (100%)**
5. `tests/test_unified_platform_suite.py`: **5/5 PASSED (100%)**
6. `cd frontend; npm run build`: **PASSED (1.71s, 0 errors)**

---

## 4. Status Modul & Roadmap Kedepan

| Modul | Status Implementasi | Deskripsi Teknis |
|---|:---:|---|
| **Modul 1: FishGuard AI** | **Selesai / Aktif** | Deteksi 3 spesies target MVP PPN Karangantu, penghitungan biomassa, komposisi tangkapan, dan kalibrasi panjang ArUco 50 mm. |
| **Modul 2: ByCatch AI** | **Selesai / Aktif** | Deteksi YOLO11n, aturan operasional FAO (Target vs Retained vs Discarded Bycatch), dan verifikasi konservasi IUCN/CITES/KKP. |
| **Modul 3: OceanSense AI** | **Planned (Riset)** | Penginderaan jauh satelit Sentinel-3 & MODIS Aqua untuk ekstraksi SPL dan Klorofil-a (tanpa data tiruan). |
| **CatchForecast AI** | **TERMINATED** | Dihapus secara permanen sesuai arahan operator. |

---

## 5. Pernyataan Penutup
Evolusi platform **ASIK VOL VI** telah berhasil diselesaikan dengan integritas ilmiah tertinggi, arsitektur perangkat lunak yang kokoh, keamanan berkas terjamin, dan tanpa degradasi performa pada sistem yang sudah ada.
