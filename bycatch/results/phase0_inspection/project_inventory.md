# PROJECT INVENTORY & BASELINE INSPECTION (PHASE 0 BOOTSTRAP)

**Tanggal Inspeksi:** 17 November 2026  
**Lokasi Proyek:** `C:\ali\tugas\asik\bycatch`  
**Sistem Operasi:** Windows 11 Home 64-bit  
**Status Eksekusi:** Bootstrap Completed (Langkah 0)  

---

## 1. Inventarisasi File dan Direktori

| Direktori / File | Status | Keterangan |
| :--- | :--- | :--- |
| `dataset/raw/primary/*` | Ada (Folder kosong) | 0 gambar. Menunggu akuisisi primer PPN Karangantu. |
| `dataset/raw/secondary/*` | Ada (Folder kosong) | 0 gambar. Menunggu akuisisi data sekunder terverifikasi. |
| `dataset/curated/*` | Ada (Folder kosong) | 0 gambar. Target output Phase 4. |
| `dataset/annotated/` | Ada (Folder kosong) | Target output Phase 5. |
| `dataset/processed/` | Ada (Folder kosong) | Target output Phase 5 (`processed/<dsv>/`). |
| `docs/INITIAL_PROJECT_AUDIT.md` | Ada | Dokumentasi audit awal (Phase 0). |
| `docs/PHASE_1_RESEARCH_FOUNDATION.md` | Ada | Landasan penelitian dan kajian pustaka (Phase 1). |
| `docs/PHASE_2_SCOPE_SPECIES_IDENTIFICATION.md` | Ada | Ruang lingkup dan penentuan 3 kelas target (Phase 2). |
| `docs/PHASE_3_DATASET_ACQUISITION.md` | Ada | Rencana akuisisi dataset primer dan sekunder (Phase 3). |
| `documentation/ANTIGRAVITY_MASTER_PROMPT.md` | Ada | Master execution prompt lengkap untuk panduan Antigravity. |
| `metadata/species_reference.csv` | Ada | Acuan taksonomi 3 kelas target (0: kembung_perempuan, 1: selar_kuning, 2: kuniran). |
| `metadata/image_metadata.csv` | Ada | Skema metadata 18 kolom untuk pelacakan gambar. |
| `metadata/catch_metadata.csv` | Ada | Skema metadata kontekstual penangkapan dan peran tangkapan. |
| `metadata/source_registry.csv` | Ada | Registri 8 sumber data publik dan in-house. |
| `models/` | Ada | Direktori target bobot model. |
| `scripts/` | Ada | Skrip operasional, verifikasi, dan otomasi. |
| `results/` | Ada | Direktori log, metrik, dan snapshot per fase. |
| `README.md` | Ada | Ringkasan ekosistem proyek dan indeks dokumen. |

---

## 2. Kondisi Lingkungan Komputasi Aktual

* **GPU:** NVIDIA GeForce RTX 3050 Laptop GPU, 4096 MiB VRAM, Driver 573.05, CUDA 12.8, Suhu idle 41°C.
* **RAM:** Total 7,26 GB, RAM bebas saat idle ~713 MB. (*Catatan kritis: Kendala memori ketat. Wajib menjalankan batch size kecil 2–4, cache=False, workers=0, dan training terpisah dari UI.*)
* **Penyimpanan:** Drive C: Terpakai 354,26 GB, Tersedia 93,22 GB.
* **Python Runtime:** Python 3.14.7 (C:\Users\Muhammad Ali Husen\AppData\Local\Python\pythoncore-3.14-64\python.exe).
* **Virtual Environment:** `C:\ali\tugas\asik\bycatch\venv` (terisolasi).
* **PyTorch Setup:** Wheel resmi PyTorch `torch-2.11.0+cu128` dan `torchvision-0.26.0+cu128` dalam proses instalasi di `venv`.
* **Git CLI:** Belum terpasang/terdaftar pada sistem PATH.

---

## 3. Ringkasan Ketersediaan Data Riil

* Citra Primer (`dataset/raw/primary`): **0** citra (`pending_data`).
* Citra Sekunder (`dataset/raw/secondary`): **0** citra (`pending_data`).
* Kesimpulan Data: Seluruh modul kode dan pipeline Phase 4–12 akan dibangun dan diuji menggunakan **data sintetis/fixtures** bertanda `synthetic=true` hingga dataset riil diunggah.
