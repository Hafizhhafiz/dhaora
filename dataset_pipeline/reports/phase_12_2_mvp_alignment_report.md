# PHASE 12.2 — MVP ARCHITECTURAL REALIGNMENT & SYNTHETIC DATASET GENERATION
## FishGuard AI — ASIK V (Ajang Kompetisi Sistem Informasi Kelautan)
**Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia**  
**Tanggal Pelaksanaan:** 16 November 2026  
**Status Implementasi:** `PHASE_12_2_COMPLETED_READY_FOR_EVALUATION`

---

## 1. Executive Summary

Menindaklanjuti arahan resmi pengalihan teknis proyek (*Handover to Gemini Antigravity*), tim telah berhasil menyelesaikan 5 pilar pekerjaan strategis tanpa melanggar batasan ilmiah:
1. **Audit Taksonomi & Akuisisi Class 2 (*Upeneus sulphureus*):** 10 dari 10 citra publik kandidat Class 2 berhasil diunduh (100% success), divalidasi integritas file (PIL & SHA-256), dan dinyatakan `APPROVED_TAXONOMY_CLEARED` berdasarkan kriteria diagnostik morfologis Uiblein et al. (2025). Akumulasi citra referensi bersih proyek kini berjumlah **30 citra spesimen lateral resolusi tinggi** (10 Class 0, 10 Class 1, 10 Class 2).
2. **Penyelarasan Backend & Engine:** Mengunci 3 target kelas MVP (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*) pada `backend/app/config.py`, `backend/app/models/schemas.py`, `backend/app/services/yolo_service.py`, `backend/app/routers/detection.py`, dan `backend/app/main.py`.
3. **Migrasi Skema Database SQLite:** Menjalankan `backend/migrate_db_mvp.py` untuk menambahkan kolom `brachysoma_count`, `leptolepis_count`, dan `sulphureus_count` pada tabel `analyses` di `backend/fishguard_history.db` dengan backup otomatis.
4. **Deaktivasi Estimasi Panjang di UI Frontend:** Menghapus tab/rute `MeasurementPage.jsx` dari navigasi aktif `frontend/src/components/Sidebar.jsx` dan `frontend/src/App.jsx`. Memperbarui visualisasi, kartu metrik, diagram komposisi, dan taksonomi pada `Dashboard.jsx`, `DetectionPage.jsx`, `CountingPage.jsx`, `HistoryPage.jsx`, `DatasetPage.jsx`, dan `AboutPage.jsx`. Verifikasi build Vite lulus 100% dalam 2.83 detik tanpa error.
5. **Implementasi Generator Komposisi Multi-Ikan Sintetis:** Mengekstrak 30 transparent cutout sprites dari citra referensi dan mengompilasi 125 citra sintetis multi-ikan (100 train, 25 val) dengan latar belakang realistis pendaratan TPI (stainless steel, krat biru HDPE, talenan kayu basah, hamparan es) lengkap dengan anotasi bounding box YOLO ternormalisasi dan `dataset.yaml`.

---

## 2. Rincian Pelaksanaan Pilar Pekerjaan

### A. Audit Taksonomi & Akuisisi Class 2 (*Upeneus sulphureus*)
- **Kandidat diuji:** `FG-C2-010` s.d. `FG-C2-014`, `FG-C2-019` s.d. `FG-C2-023` (10 record).
- **Hasil Unduh:** 10 berhasil diunduh, 0 gagal, 0 corrupt.
- **Kriteria Morfologis (Uiblein et al., 2025):**
  - Sirip ekor polos tanpa garis melintang gelap (*plain caudal fin*), membedakan secara tegas dari *U. tragula* atau *U. vittatus*.
  - Sungut dagu putih pucat (*white barbels*).
  - Dua pita kuning membujur pada sisi tubuh (*two yellow lateral stripes*).
  - Ujung sirip punggung pertama berpigmen gelap (D VIII, 9).
- **Status Taksonomi:** Seluruh 10 citra dinyatakan `TAXONOMY_CLEARED_UIBLEIN_2025`.
- **Lokasi Penyimpanan:** `dataset_pipeline/public_reference_images/class_2_upeneus_sulphureus/`.

### B. Penyelarasan Backend & Database
- `backend/app/config.py`:
  - `MVP_CLASSES = {0: "brachysoma", 1: "leptolepis", 2: "sulphureus"}`
  - `TAXONOMY_INFO`: memetakan nama umum, nama ilmiah, famili, dan kode warna UI untuk ketiga spesies.
- `backend/app/models/schemas.py`:
  - `DetectionResponse`: memuat `brachysoma_count`, `leptolepis_count`, `sulphureus_count`, `other_count` (disertai kompatibilitas ke belakang).
  - `AnalysisSummary`: agregat statistik untuk ketiga spesies MVP.
- `backend/app/services/storage_service.py` & `backend/migrate_db_mvp.py`:
  - Migrasi skema SQLite selesai tanpa menghapus data historis (backup: `fishguard_history_backup_20261116_134058.db`).
- `backend/test_pipeline.py`:
  - Seluruh endpoint API (`/api/health`, `/api/model/status`, `/api/statistics`, `/api/history`, `/api/detect`) teruji lulus dengan status `MODEL_NOT_TRAINED` yang jujur tanpa memalsukan kelas target.

### C. Penyelarasan Frontend UI
- `frontend/src/components/Sidebar.jsx` & `frontend/src/App.jsx`:
  - Tombol dan rute `Length Estimation` dinonaktifkan dari navigasi aktif untuk memfokuskan 100% alur kerja pada pilar MVP: **Spesies Deteksi, Penghitungan Ikan, dan Komposisi Tangkapan**.
- Halaman `Dashboard.jsx`, `DetectionPage.jsx`, `CountingPage.jsx`, `HistoryPage.jsx`, `DatasetPage.jsx`, `AboutPage.jsx`:
  - Seluruh kartu statistik, diagram lingkaran (PieChart), diagram batang kelimpahan, filter riwayat, dan panel taksonomi telah menampilkan ketiga target spesies terkunci:
    - **Class 0:** Kembung Perempuan (*Rastrelliger brachysoma*) — Biru Langit (`#0ea5e9`)
    - **Class 1:** Selar Kuning (*Selaroides leptolepis*) — Kuning Emas (`#eab308`)
    - **Class 2:** Kuniran (*Upeneus sulphureus*) — Oranye Jingga (`#f97316`)
- `npm run build`: Kompilasi produksi Vite berhasil sempurna (2,442 modul tertransformasi, 0 syntax error).

### D. Generator Komposisi Multi-Ikan Sintetis (Copy-Paste Augmentation)
Untuk mengatasi kelangkaan citra tangkapan multi-ikan publik yang merepresentasikan TPI Karangantu tanpa harus menunggu sampling lapangan:
- **Ekstraksi Sprite:** 30 sprite transparan (RGBA PNG) berhasil diekstrak menggunakan segmentasi adaptif kontur morfologis pada `dataset_pipeline/data/sprites/` (10 sprite/kelas).
- **Substrat Latar Belakang:** Sintesis prosedural untuk 4 lingkungan pendaratan: meja *brushed stainless steel*, krat ikan biru HDPE berusuk, talenan kayu pemotong basah, dan hamparan es curai.
- **Augmentasi Fotorealistik:** Random scaling ($0.18$ - $0.32$), orientasi natural horizontal ($\pm 30^\circ$, flip horizontal), contact drop-shadow lembut, dan partial overlap.
- **Dataset Sintetis YOLO:**
  - 100 citra latih (`train`) + 100 file anotasi `.txt`.
  - 25 citra validasi (`val`) + 25 file anotasi `.txt`.
  - File konfigurasi resmi Ultralytics YOLO: `dataset_pipeline/data/synthetic_multispecies/dataset.yaml`.

---

## 3. Matriks Status Verifikasi Komponen

| Komponen | Status Sebelum | Status Sesudah (Phase 12.2) | Keterangan Verifikasi |
|---|---|---|---|
| **Class 0 (*R. brachysoma*)** | 10 gambar | 10 gambar bersih | Diverifikasi SHA-256 |
| **Class 1 (*S. leptolepis*)** | 10 gambar (+1 karantina) | 10 gambar bersih (+1 karantina) | FG-C1-019 tetap diisolasi |
| **Class 2 (*U. sulphureus*)** | 10 kandidat ditahan | **10 gambar bersih diakuisisi** | Lulus audit Uiblein et al. (2025) |
| **Total Referensi Bersih** | 20 gambar | **30 gambar** | 100% siap untuk sprite R&D |
| **Backend Config & Routers** | Legacy (kembung/layang) | **Locked MVP (3 Spesies)** | Uji coba unit test lulus 100% |
| **SQLite Schema** | Legacy columns | **Migrasi Sukses (brachysoma/leptolepis/sulphureus)** | Backup tersimpan aman |
| **Frontend UI Navigation** | Tab Length Estimation aktif | **Estimasi Panjang Dinonaktifkan** | Fokus 100% pada 3 pilar MVP |
| **Frontend Build** | Belum diuji pasca-edit | **Passed (Vite build 2.83s)** | Zero error |
| **Multi-Fish Catch Generator** | Belum ada | **125 Citra + Anotasi YOLO Lengkap** | Siap untuk evaluasi model |

---

## 4. Rekomendasi Langkah Selanjutnya

1. **Evaluasi Pipeline Two-Stage:** Membangun evaluasi detektor umum (misal fine-tuned YOLOv8n pada kelas ikan generik) yang dikombinasikan dengan classifier fitur spesies (ResNet / MobileNet / Metric Embedder) menggunakan sprite dan scene sintetis yang baru dihasilkan.
2. **Uji Coba Antarmuka Langsung:** Menguji proses unggah citra pada antarmuka web `frontend` dan memastikan respons visual deteksi dan pengelompokan komposisi tangkapan berjalan mulus bagi pengguna.
