# TASKS — ByCatch AI Task Tracking

| Task ID | Judul Tugas | Fase | Status | Depends On | Bukti / Path File | Tanggal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **B0-T01** | Inspeksi menyeluruh env, GPU, RAM, disk | Phase 0 | `tested` | - | `results/phase0_inspection/environment_snapshot.json` | 2026-11-17 |
| **B0-T02** | File status awal & AGENTS.md | Phase 0 | `tested` | B0-T01 | `AGENTS.md`, `PROJECT_STATUS.md` | 2026-11-17 |
| **B0-T03** | Konfigurasi kelas kanonikal | Phase 0 | `tested` | - | `configs/classes.yaml`, `metadata/species_reference.csv` | 2026-11-17 |
| **B0-T04** | Setup venv & PyTorch cu128 | Phase 0 | `tested` | B0-T01 | `venv/`, PyTorch 2.11.0+cu128 + CUDA 12.8 | 2026-11-17 |
| **B0-T05** | Verifikasi instalasi CUDA & tensor GPU | Phase 0 | `tested` | B0-T04 | `scripts/verify_install.py` (PASS verdict) | 2026-11-17 |
| **B0-T06** | Skrip session check & pytest.ini | Phase 0 | `tested` | B0-T02 | `scripts/session_check.py`, `pytest.ini` | 2026-11-17 |
| **B0-T07** | Generator fixture sintetis | Phase 0 | `tested` | B0-T03 | `tests/fixtures/make_synthetic_images.py` | 2026-11-17 |
| **P4-T01** | Paket audit integritas & format citra | Phase 4 | `tested` | B0-T07 | `src/data/audit/integrity.py` | 2026-11-17 |
| **P4-T02** | Metrik kualitas citra (blur, luma, contrast) | Phase 4 | `tested` | P4-T01 | `src/data/audit/quality.py` | 2026-11-17 |
| **P4-T03** | Deteksi duplikat SHA-256 & dHash | Phase 4 | `tested` | P4-T01 | `src/data/audit/duplicates.py` | 2026-11-17 |
| **P4-T04** | Verifikasi label spesies & contact sheet | Phase 4 | `tested` | P4-T01 | `src/data/audit/species_check.py` | 2026-11-17 |
| **P4-T05** | Registri lisensi & hak cipta citra | Phase 4 | `tested` | P4-T01 | `src/data/audit/licenses.py` | 2026-11-17 |
| **P4-T06** | Alur review manusia & salin terkurasi | Phase 4 | `tested` | P4-T02, P4-T03 | `src/data/audit/review.py` | 2026-11-17 |
| **P4-T07** | Pembungkus CLI bycatch_dataset_audit.py | Phase 4 | `tested` | P4-T01–P4-T06 | `bycatch_dataset_audit.py` | 2026-11-17 |
| **P5-T01** | Pedoman anotasi & template sidecar | Phase 5 | `tested` | P4-T06 | `documentation/annotation_guideline.md` | 2026-11-17 |
| **P5-T02** | Validator label YOLO & visualizer QC | Phase 5 | `tested` | P5-T01 | `src/annotation/validate_yolo_labels.py` | 2026-11-17 |
| **P5-T03** | Skrip split stratified group k-fold | Phase 5 | `tested` | P5-T02 | `src/annotation/build_splits.py` | 2026-11-17 |
| **P5-T04** | Generator data.yaml & manifest beku | Phase 5 | `tested` | P5-T03 | `src/annotation/prepare_dataset.py` | 2026-11-17 |
| **P6-T01** | Benchmark sumber daya (VRAM, RAM, latency) | Phase 6 | `tested` | B0-T05 | `results/phase6_architecture/resource_benchmark.csv` | 2026-11-17 |
| **P6-T02** | Diagram arsitektur sistem & pipeline | Phase 6 | `tested` | - | `documentation/architecture.md` | 2026-11-17 |
| **P6-T03** | Konfigurasi eksperimen baseline YOLO26n | Phase 6 | `tested` | P6-T01 | `configs/train/baseline.yaml` | 2026-11-17 |
| **P7-T01** | Pipeline training YOLO dengan safety guard | Phase 7 | `tested` | P6-T03 | `src/training/train.py` | 2026-11-17 |
| **P7-T02** | Ladder fallback OOM & resume checkpoint | Phase 7 | `tested` | P7-T01 | `src/training/oom.py` | 2026-11-17 |
| **P7-T03** | Registri eksperimen & visualisasi kurva | Phase 7 | `tested` | P7-T01 | `src/training/plot_curves.py` | 2026-11-17 |
| **P7-T04** | Smoke training pada data sintetis | Phase 7 | `tested` | P7-T01 | `results/_smoke/` (2 epochs PASS on RTX 3050) | 2026-11-17 |
| **P8-T01** | Evaluasi kuantitatif & bootstrap CI | Phase 8 | `tested` | P7-T04 | `src/evaluation/evaluate.py` | 2026-11-17 |
| **P8-T02** | Sweep ambang batas confidence di val | Phase 8 | `tested` | P8-T01 | `src/evaluation/threshold_sweep.py` | 2026-11-17 |
| **P8-T03** | Visualizer error FP/FN/missed | Phase 8 | `tested` | P8-T01 | `src/annotation/visualize_labels.py` | 2026-11-17 |
| **P9-T01** | Modul klien API IUCN Red List v4 | Phase 9 | `tested` | - | `src/conservation/sources/iucn.py` | 2026-11-17 |
| **P9-T02** | Modul klien Species+ CITES | Phase 9 | `tested` | - | `src/conservation/sources/cites.py` | 2026-11-17 |
| **P9-T03** | Registri regulasi nasional KKP | Phase 9 | `tested` | - | `metadata/regulation_registry.csv` | 2026-11-17 |
| **P9-T04** | Taxon mapper & offline store | Phase 9 | `tested` | P9-T01–P9-T03 | `src/conservation/service.py` | 2026-11-17 |
| **P10-T01** | Skema SQLite & modul repository | Phase 10 | `tested` | - | `src/database/schema.sql`, `data/app.sqlite` | 2026-11-17 |
| **P10-T02** | Predictor inferensi terisolasi (lazy load) | Phase 10 | `tested` | P6-T03 | `src/inference/predictor.py` | 2026-11-17 |
| **P10-T03** | Catch role rule engine | Phase 10 | `tested` | - | `src/inference/catch_role.py` | 2026-11-17 |
| **P10-T04** | Aplikasi Streamlit multipage & UI | Phase 10 | `implemented` | P10-T01–P10-T03 | `app/main.py`, `app/pages/*` | 2026-11-17 |
| **P11-T01** | Unit testing komprehensif | Phase 11 | `tested` | P10-T04 | `tests/unit/` (23 tests passed) | 2026-11-17 |
| **P11-T02** | End-to-end integration test | Phase 11 | `tested` | P11-T01 | `tests/unit/test_inference.py`, `test_database.py` | 2026-11-17 |
| **P11-T03** | Benchmark performa VRAM/RAM/latensi | Phase 11 | `tested` | P11-T01 | `scripts/benchmark_resource.py` | 2026-11-17 |
| **P11-T04** | Uji keamanan input & upload | Phase 11 | `tested` | P11-T01 | `src/inference/preprocess.py` | 2026-11-17 |
| **P12-T01** | Paket model & model_metadata.json | Phase 12 | `planned` | P8-T03 | `models/weights/final/` | 2026-11-17 |
| **P12-T02** | Skrip bootstrap run_app.bat & env setup | Phase 12 | `implemented` | P10-T04 | `run_app.bat`, `scripts/setup_env.bat` | 2026-11-17 |
| **P12-T03** | Dokumentasi teknis & penelitian lengkap | Phase 12 | `implemented` | Semua | `documentation/` | 2026-11-17 |
