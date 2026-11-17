# PANDUAN MENJALANKAN PLATFORM TERPADU ASIK VOL VI
**Sains Informasi Kelautan — Universitas Pendidikan Indonesia Kampus Serang**

Dokumen ini memuat panduan lengkap menjalankan platform ASIK VOL VI secara lokal pada Windows PowerShell.

---

## 1. Arsitektur & Port Komunikasi
Platform berjalan dengan arsitektur decoupled client-server:
- **Backend API (FastAPI):** `http://127.0.0.1:8000` (Melayani FishGuard AI dan ByCatch AI)
- **Frontend SPA (React + Vite):** `http://127.0.0.1:5173` (Reverse proxy otomatis ke port 8000 untuk `/api` dan `/static`)
- **Dokumentasi API Interaktif (Swagger):** `http://127.0.0.1:8000/docs`

---

## 2. Prasyarat Lingkungan
Pastikan perangkat Anda memiliki:
- Python 3.10+ (atau Python 3.14 sistem) dengan pustaka: `torch`, `ultralytics`, `opencv-python`, `fastapi`, `uvicorn`, `pydantic`.
- Node.js v18+ dan npm.

---

## 3. Langkah Menjalankan Aplikasi (Lokal)

### Langkah A: Menjalankan Backend API (Terminal 1)
Buka terminal PowerShell baru, arahkan ke folder proyek, dan jalankan:
```powershell
cd "c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI"
python backend\run.py
```
*Tanda Berhasil:*
```text
Starting FishGuard AI Backend on http://127.0.0.1:8000 ...
INFO:     Started server process [...]
INFO:     Waiting for application startup.
[YOLOService] Memuat bobot custom FishGuard: ...\backend\weights\fishguard_yolo.pt
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Langkah B: Menjalankan Frontend Web (Terminal 2)
Buka terminal PowerShell kedua, arahkan ke subfolder `frontend`, dan jalankan:
```powershell
cd "c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\frontend"
npm run dev -- --host 127.0.0.1
```
*Tanda Berhasil:*
```text
  VITE v8.3.6  ready in ... ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: http://127.0.0.1:5173/
```

### Langkah C: Membuka Aplikasi
Buka peramban (browser) Anda dan akses:
👉 **`http://localhost:5173`** atau **`http://127.0.0.1:5173`**

---

## 4. Cara Mengoperasikan Fitur Platform

### 1. Beranda Platform ASIK (`asik-home`)
- Menampilkan ringkasan status 3 modul intelijen:
  - **Modul 1: FishGuard AI** (Status: Aktif)
  - **Modul 2: ByCatch AI** (Status: Aktif)
  - **Modul 3: OceanSense AI** (Status: Planned / Dalam Riset)

### 2. Modul 1: FishGuard AI
- **Deteksi AI & Penghitungan:** Unggah citra pendaratan atau gunakan tombol cepat sampel (`sample_test_01`, `02`, `03`) untuk mendeteksi 3 spesies target MVP (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*).
- **Estimasi Panjang ArUco:** Ukur Total Length (TL) ikan secara otomatis terkalibrasi penanda optik ArUco 50 mm.
- **Riwayat & Statistik:** Tinjau riwayat analisis dan komposisi hasil tangkapan di basis data `backend/fishguard_history.db`.

### 3. Modul 2: ByCatch AI
- **Screening ByCatch:** Unggah citra pendaratan, tentukan spesies target trip nelayan, alat tangkap, dan status penanganan (Disimpan/Retained vs Dibuang/Discarded). Sistem akan membedakan Target Catch dari ByCatch secara otomatis berdasarkan pedoman FAO.
- **Mesin Aturan FAO:** Uji logika aturan klasifikasi peran operasional secara interaktif.
- **Status Konservasi:** Periksa status perlindungan spesies dari basis data otoritatif (IUCN Red List v4, CITES Species+, dan JDIH KKP RI).
- **Pencatatan Trip:** Catat log pendaratan dan pantau riwayat tangkapan di basis data `bycatch/data/app.sqlite`.

### 4. Modul 3: OceanSense AI
- Tinjau desain sensor dan parameter oseanografi satelit (SST & Klorofil-a Sentinel-3/MODIS) tanpa data rekaan.

---

## 5. Menjalankan Pengujian Otomatis (Regression & Verification)
Untuk memastikan seluruh modul berfungsi sempurna tanpa regresi:
```powershell
# 1. Pipeline Backend FishGuard (8/8)
python backend\test_pipeline.py

# 2. Sistem Test Suite Lengkap FishGuard (12/12)
python tests\test_system_suite.py

# 3. Unit Test Suite ByCatch AI (23/23)
python -m pytest bycatch\tests\unit\

# 4. Master Unified Platform Integration Test (5/5)
python tests\test_unified_platform_suite.py

# 5. Build Produksi Frontend
cd frontend; npm run build
```
Semua rangkaian pengujian di atas telah diverifikasi dengan tingkat kelulusan **100% (PASSED)**.
