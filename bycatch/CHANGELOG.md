# CHANGELOG — ByCatch AI

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added - 2026-11-17
- Master Execution Prompt documentation in `documentation/ANTIGRAVITY_MASTER_PROMPT.md`.
- Phase 0 Bootstrap inspection outputs (`results/phase0_inspection/environment_snapshot.json` and `project_inventory.md`).
- Operating protocol rulebook `AGENTS.md` (38 lines) and `.agents/rules/bycatch-rules.md`.
- Canonical class schema `configs/classes.yaml` and `metadata/species_reference.csv` (Classes: 0 kembung_perempuan, 1 selar_kuning, 2 kuniran).
- Baseline project tracking files: `PROJECT_STATUS.md`, `TASKS.md`, `DECISIONS.md`, `KNOWN_ISSUES.md`.
- Standard project `.gitignore` and `pytest.ini`.
- Virtual environment `venv/` with official PyTorch 2.11.0+cu128, torchvision 0.26.0+cu128, and Ultralytics 8.4.215 verified on NVIDIA GeForce RTX 3050 Laptop GPU (CUDA 12.8, tensor matmul PASS).
- Operational verification scripts: `scripts/verify_install.py` and `scripts/session_check.py`.
- Synthetic fixture generators in `tests/fixtures/`: `make_synthetic_images.py` and `make_synthetic_yolo.py`.
- Phase 4 Dataset Audit & Curation engine (`src/data/audit/`: scanner, integrity, hashing, quality, duplicates, species_check, licenses, manifest, review, cli) with backward-compatible CLI wrapper `bycatch_dataset_audit.py`.
- Audit thresholds configuration in `configs/audit_thresholds.yaml`.
- Phase 5 Annotation & Split Engine (`src/annotation/`: validate_yolo_labels, visualize_labels, build_splits with Stratified Group K-Fold, prepare_dataset with versioned frozen manifests).
- Phase 5 Annotation Guidelines in `documentation/annotation_guideline.md` and sidecar template `metadata/annotation_attributes.csv`.
- Conservative augmentation configuration preserving diagnostic yellow stripe in `configs/train/aug_conservative.yaml`.
- Phase 6 Empirical Benchmark on RTX 3050 Laptop GPU (`scripts/benchmark_resource.py`), measuring 177 MB peak VRAM, 24 ms latency on YOLO11n 640x640 batch 4.
- Phase 6 System architecture and Mermaid pipeline diagram in `documentation/architecture.md`.
- Phase 7 Training Pipeline (`src/training/train.py`, `oom.py`, `registry.py`, `plot_curves.py`) with successful smoke training test (2 epochs PASS on RTX 3050).
- Phase 8 Evaluation Engine (`src/evaluation/evaluate.py`, `threshold_sweep.py`).
- Phase 9 Conservation Services (`src/conservation/`: taxon_mapper, iucn, cites, kkp_regulation, service) with verified official snapshots.
- Phase 10 Local Database (`src/database/schema.sql`, `db.py`, `repository.py`, `scripts/init_db.py`, `data/app.sqlite`).
- Phase 10 Business Inference Logic (`src/inference/preprocess.py`, `catch_role.py`, `predictor.py`).
- Phase 10 Multipage Streamlit Application in `app/` (Dashboard, Fish Identification, Catch Monitoring, Conservation Info, History & Reports, System Status).
- Phase 10 One-click launchers: `run_app.bat` and `scripts/setup_env.bat`.
- Automated test suite expanded to 23 unit tests across all modules (100% pass rate in 6.27s).
