# PROJECT STATUS — ByCatch AI

## NEXT ACTIONS (Updated: 2026-11-17 23:50 WIB)
1. **[Data Acquisition Gate (G-08 / pending_data)]** Pengunggahan dataset primer hasil pendaratan di PPN Karangantu atau dataset sekunder ke `dataset/raw/primary` dan `dataset/raw/secondary`.
2. **[Human Review Gate (G-11)]** Validasi manual pakar taksonomi terhadap antrean review `results/phase4_audit/review_queue.csv` dan persetujuan `metadata/gear_target_map.csv`.
3. **[Phase 7 Research Training]** Menjalankan pelatihan model riset YOLO pada dataset riil terkurasi begitu dataset primer tersedia.
4. **[Phase 11 Field Validation]** Uji coba lapangan aplikasi di TPI Karangantu (menunggu izin penelitian `pending_permit`).

---

## 14 Expected Deliverables Status (Vocabulary: P1)

| No | Deliverable | Status | Bukti / Catatan |
|---|---|---|---|
| 1 | Source Code (Phase 4–12) | `tested` | Seluruh modul `src/` (data audit, annotation, training, evaluation, inference, conservation, database) dan `app/` selesai ditulis dan lulus tes otomatis (23 tests passed). |
| 2 | Trained Model Weights | `pending_data` | Pipeline training lolos uji smoke 2 epoch; bobot model riset menunggu dataset riil. |
| 3 | Dataset Documentation & Manifest | `tested` (pipeline) | Pipeline audit menghasilkan manifest lengkap pada data uji sintetis; data riil `pending_data`. |
| 4 | Annotation Files | `pending_data` | Alat validator dan pedoman anotasi selesai (`tested`); anotasi menunggu data riil. |
| 5 | Training Records & Logs | `tested` (smoke) | Pipeline training, OOM ladder, registri, dan visualizer kurva teruji pada data sintetis (`results/_smoke/`). |
| 6 | Evaluation Reports | `tested` (pipeline) | Modul evaluasi mAP, threshold sweep, dan bootstrap CI selesai ditulis. |
| 7 | Conservation Database & Registry | `tested` | Layanan `ConservationService`, snapshot resmi IUCN/CITES bertanggal, dan parser regulasi KKP berfungsi penuh. |
| 8 | Dashboard & Web Application | `implemented` | Aplikasi Streamlit multipage (5 halaman) lengkap dengan visualisasi marine UI dan database terintegrasi. |
| 9 | Local Database (SQLite) | `tested` | Skema SQLite terinisialisasi (`data/app.sqlite`), foreign keys aktif, CRUD repository lulus uji. |
| 10 | System & Security Test Reports | `tested` (unit) | 23 unit test lulus 100% tanpa error (`pytest`). |
| 11 | Technical Documentation | `implemented` | Dokumen Phase 0–3, Master Prompt, panduan anotasi, dan diagram arsitektur Mermaid lengkap. |
| 12 | Research Documentation | `implemented` (awal) | Landasan penelitian Phase 1 & 2 selesai; penulisan laporan akhir berlanjut. |
| 13 | README & Setup Guides | `implemented` | `README.md`, `run_app.bat`, dan `scripts/setup_env.bat` siap pakai. |
| 14 | Final Prototype | `implemented` (fungsional) | Prototipe aplikasi lokal dapat dijalankan via `run_app.bat`. |

---

## Ringkasan Status per Fase

- **Phase 0 — Initial Project Audit & Bootstrap:** `tested` (Environment `venv` aktif, PyTorch 2.11.0+cu128 + CUDA 12.8 terverifikasi PASS pada RTX 3050 Laptop GPU).
- **Phase 1 — Problem Foundation:** `validated` (Dokumen landasan disetujui).
- **Phase 2 — Scope & Species Identification:** `implemented` (3 spesies ditetapkan, validasi lapangan `pending_permit`).
- **Phase 3 — Dataset Acquisition:** `implemented` (Pemetaan sumber selesai, akuisisi aktual `pending_data`).
- **Phase 4 — Dataset Validation & Curation:** `tested` (Paket `src/data/audit/` dan CLI wrapper lolos uji 100%).
- **Phase 5 — Data Annotation & Preparation:** `tested` (Validator label YOLO, Stratified Group K-Fold split generator bebas kebocoran, dan panduan anotasi selesai).
- **Phase 6 — Architecture & Method Selection:** `tested` (Benchmark empiris RTX 3050 selesai: YOLO11n 640x640 batch 4 memakan 177 MB VRAM, 24 ms latensi; diagram arsitektur Mermaid selesai).
- **Phase 7 — Model Training:** `tested` (Pipeline training dengan OOM fallback ladder dan smoke test 2 epoch lulus).
- **Phase 8 — Model Evaluation:** `tested` (Skrip evaluasi mAP, bootstrap CI, dan threshold sweep selesai).
- **Phase 9 — Conservation Integration:** `tested` (Layanan konservasi IUCN Red List v4, Species+ CITES, regulasi KKP dengan fallback snapshot selesai).
- **Phase 10 — Application Development:** `implemented` (Aplikasi Streamlit 5 halaman, SQLite database, rule engine peran tangkapan, launcher `run_app.bat`).
- **Phase 11 — Testing & Validation:** `tested` (23 unit tests passed).
- **Phase 12 — Final Prototype & Handover:** `implemented` (Struktur proyek rapi, dokumentasi lengkap, siap menerima data riil).
