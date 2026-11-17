# DECISIONS — Architecture Decision Records (ADR)

## ADR-001: Penetapan Tiga Kelas Spesies Kanonikal
- **Tanggal:** 2026-11-17
- **Konteks:** Sistem ByCatch AI memerlukan target deteksi dan klasifikasi objek spesifik di PPN Karangantu (WPPNRI 712).
- **Opsi:**
  1. Kelompok Famili (Leiognathidae, Engraulidae, Scombridae).
  2. Tiga Spesies Tervalidasi (Kembung perempuan, Selar kuning, Kuniran).
- **Keputusan:** Menetapkan tiga kelas kanonikal: Class 0 (`kembung_perempuan` / *Rastrelliger brachysoma*), Class 1 (`selar_kuning` / *Selaroides leptolepis*), Class 2 (`kuniran` / *Upeneus sulphureus*).
- **Konsekuensi:** Konsistensi label di seluruh modul (`classes.yaml`, `species_reference.csv`, UI, DB). Spesies lain tidak dipaksakan masuk ke 3 kelas (open-set problem ditangani via ambang confidence dan unverified status).

## ADR-002: Arsitektur Detektor Baseline YOLO26n / YOLO11n
- **Tanggal:** 2026-11-17
- **Konteks:** Komputasi dibatasi oleh GPU NVIDIA RTX 3050 Laptop (4 GB VRAM) dan RAM sistem 8 GB (~700 MB–1,1 GB bebas).
- **Opsi:**
  1. YOLO besar (YOLOv8x, Vision Transformers).
  2. YOLO ringan (YOLO26n end-to-end NMS-free, YOLO11n, YOLOv8n).
- **Keputusan:** Menggunakan YOLO26n sebagai baseline utama, dengan pembanding YOLO11n dan YOLOv8n. Varian 's' hanya diuji jika VRAM terbukti cukup.
- **Konsekuensi:** Mencegah CUDA OOM. Pelatihan menggunakan resolusi 640x640 (fallback 512/416), batch size 2–4, `workers=0`, dan `cache=False`.

## ADR-003: Isolasi Virtual Environment dan Penggunaan PyTorch cu128
- **Tanggal:** 2026-11-17
- **Konteks:** Host OS Windows 11 memiliki Python 3.14.7 dan driver GPU 573.05 (CUDA 12.8 support).
- **Opsi:**
  1. Memodifikasi instalasi Python global.
  2. Membuat `venv` terisolasi di `C:\ali\tugas\asik\bycatch\venv` menggunakan PyTorch wheel `cu128`.
- **Keputusan:** Membangun virtual environment lokal mandiri di root proyek dengan wheel `cu128`.
- **Konsekuensi:** Menjaga kebersihan sistem host, kepatuhan isolasi dependensi P1, dan keterulangan build.

## ADR-004: Pemisahan Layer Antarmuka (Streamlit) dan Logika Bisnis (src/)
- **Tanggal:** 2026-11-17
- **Konteks:** UI lokal harus ringan, cepat dibangun, namun mudah dimigrasikan ke arsitektur client-server (FastAPI / React) di masa depan.
- **Opsi:**
  1. Menyatukan kode logika model dan SQLite di dalam skrip Streamlit.
  2. Memisahkan logika murni ke `src/` (inference, database, conservation) dan menjadikan `app/` murni layer presentasi.
- **Keputusan:** Opsi 2. Seluruh core functionality berada di `src/`.
- **Konsekuensi:** Pengujian unit dan integrasi dapat dijalankan via pytest tanpa memicu Streamlit runtime.
