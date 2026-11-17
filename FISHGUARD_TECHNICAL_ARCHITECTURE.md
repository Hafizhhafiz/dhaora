# FISHGUARD AI — TECHNICAL ARCHITECTURE
**Cetabiru Arsitektur Sistem, Integrasi Perangkat Lunak, Pipeline AI, dan Aliran Data**

---

## 1. Diagram Aliran Data & Komponen Sistem

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           RIG AKUISISI FISIK / LAPANGAN                         │
│  [Kamera Top-down 90° H=90cm] ──► [Latar Kontras / Papan Ukur] ──► [Marker ArUco 50mm]│
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Citra Tegak Lurus + Metadata Exif
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        INGESTION, QC & DATASET PIPELINE                         │
│  • Pengecekan Kualitas Citra (Blur Laplacian, Over/Underexposure, Glare)         │
│  • Partisi Bebas Leakage: GroupShuffleSplit (berbasis specimen_id & session_id)  │
│  • Format Anotasi: YOLO Normalized [class_id xc yc w h]                         │
│  • Penyimpanan Dataset Versi Imutabel: datasets/fishguard_vNNN/ (SHA-256)       │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Anotasi & Citra
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             DEEP LEARNING MODEL ENGINE                          │
│  • Arsitektur Dasar: Ultralytics YOLOv8 (nano/small)                            │
│  • Target Kelas Terkunci: 0: R. brachysoma, 1: S. leptolepis, 2: U. sulphureus  │
│  • Output State: Bounding Boxes, Confidence Scores, Low-conf "Unverified/OOD"    │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Koordinat Deteksi & Kelas Spesies
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICE LAYER (FastAPI)                         │
│  • Endpoints: POST /api/detect, GET /api/statistics, GET /api/history           │
│  • Logika Agregat: Penghitungan Individu (Counting) & Rasio Komposisi Tangkapan │
│  • Modul Kalibrasi Optik: OpenCV cv2.aruco (DICT_4X4_50, 50mm, Quiet Zone 10mm) │
│  • Database Lokal: SQLite (backend/fishguard_history.db)                        │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ JSON Response API
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER (React)                      │
│  • Stack: React.js (Vite) + Tailwind CSS + Lucide Icons + Recharts              │
│  • Halaman Utama: Dashboard, Detection & Counting, Composition Analysis,        │
│    Dataset Benchmarks, Analysis History, System Info                            │
│  • Status Estimasi Panjang: EXPERIMENTAL / VALIDATION-GATED BANNER              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Spesifikasi Antarmuka API Backend (`backend/app`)
- `GET /api/health`: Memeriksa kesehatan server, status model aktif, dan integritas direktori statis.
- `GET /api/model/status`: Menampilkan informasi bobot model aktif, mode (`MODEL_NOT_TRAINED` vs `CUSTOM_SPECIES_MODEL`), dan daftar 3 target spesies MVP.
- `POST /api/detect`: Menerima unggahan citra tunggal atau batch, menjalankan inferensi YOLO, menghitung komposisi spesies secara otomatis, dan menyimpan rekaman ke SQLite.
- `GET /api/statistics`: Menyediakan metrik agregat untuk visualisasi dashboard (total ikan, cacah per spesies).
- `GET /api/history`: Riwayat rekaman analisis pendaratan tersimpan.

---

## 3. Skema Basis Data Relasional (`backend/fishguard_history.db`)
Tabel `analyses`:
- `id` (TEXT, PK): Identifikasi unik analisis (UUID 8-karakter).
- `timestamp` (TEXT): Waktu eksekusi inferensi.
- `filename` (TEXT): Nama file citra asli yang diunggah.
- `image_url` (TEXT): URL akses citra asli di static cache.
- `result_image_url` (TEXT): URL citra beranotasi bounding box visual.
- `total_count` (INTEGER): Jumlah total individu ikan terdeteksi.
- `brachysoma_count` (INTEGER): Cacah *Rastrelliger brachysoma*.
- `leptolepis_count` (INTEGER): Cacah *Selaroides leptolepis*.
- `sulphureus_count` (INTEGER): Cacah *Upeneus sulphureus*.
- `other_count` (INTEGER): Cacah ikan non-target / baseline.
- `detections_json` (TEXT): Rincian bounding box dan confidence score.
- `species_breakdown_json` (TEXT): Rincian numerik cacah spesies.
- `composition_json` (TEXT): Persentase komposisi hasil tangkapan.
- `inference_time_ms` (REAL): Waktu latensi pemrosesan model.
- `model_mode` (TEXT): Status model (`MODEL_NOT_TRAINED` / `CUSTOM_SPECIES_MODEL`).
- `total_length_cm` (REAL, Nullable): Nilai estimasi panjang (jika diaktifkan).
- `measurement_status` (TEXT): Status kalibrasi pengukuran fisik.
