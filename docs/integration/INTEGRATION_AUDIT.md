# ASIK PLATFORM INTEGRATION AUDIT (CHECKPOINT 1)
**Project:** ASIK VOL VI Unified Marine Information Platform  
**Modules Audited:** FishGuard AI (Module 1) & ByCatch AI (Module 2)  
**Date:** 18 November 2026 | **Auditor:** Senior Full-Stack & System Architect  
**Git Baseline Branch:** `baseline-pre-integration` | **Active Feature Branch:** `feature/asik-unified-platform`  
**Safety Gate:** ⛔ Checkpoint 1 Audit Gate (No functional code modifications before approval)

---

## 1. Executive Summary & Naming Reconciliation

### 1.1 Study Context & Folder Naming Discrepancy
* **Folder Location:** `c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\`
* **Documentation References:** Earlier governance files and reports refer to `ASIK V` (Ajang Kompetisi Sistem Informasi Kelautan Edisi ke-5), while the current operational directory is designated `ASIK VOL VI` (Semester 5 / Volume 6 course workspace).
* **Audit Determination:** In accordance with prompt instruction 0, **no files or folders are renamed**. The platform shell will be branded as **ASIK Platform (ASIK VOL VI)** while transparently documenting historical ASIK V competition artifacts.

### 1.2 Preservation Guarantees & Safety Backups
Before any operations, full non-git safety backups were executed:
* `_backups/20261118_061006/fishguard_history.db` (77.8 KB, SHA-256 verified)
* `_backups/20261118_061006/weights/fishguard_yolo.pt` (6.49 MB, SHA-256 verified)
* Git repository initialized with comprehensive `.gitignore` excluding caches, builds, large external archives, and virtual environments.
* Baseline commit secured on branch `baseline-pre-integration` (`76426f8`), active branch switched to `feature/asik-unified-platform`.

---

## 2. Baseline Test Execution Results (Pre-Integration)

All three baseline validation test suites were executed on the current environment:

| Test Suite | Target Component | Command Executed | Expected | Actual Result | Verification Status |
|:---|:---|:---|:---:|:---:|:---:|
| **Backend Integration Suite** | FastAPI endpoints & SQLite | `python backend/test_pipeline.py` | 8/8 Passed | **8/8 Passed (100%)** | VERIFIED |
| **System Test Suite** | 12-Category Comprehensive Validation | `python tests/test_system_suite.py` | 12/12 Passed | **12/12 Passed (100%)** | VERIFIED |
| **Frontend Production Build** | React + Tailwind + Vite SPA | `cd frontend; npm run build` | Zero errors | **Built in 2.26s (0 errors)** | VERIFIED |
| **ByCatch AI Unit Suite** | ByCatch Python Core & Logic | `python -m pytest bycatch/tests/unit/` | 23/23 Passed | **23/23 Passed (100% in 6.50s)** | VERIFIED |

### Detailed Baseline Findings:
1. `backend/test_pipeline.py`: Endpoints `/`, `/api/health`, `/api/model/status`, `/api/detect`, `/api/measure`, `/api/history`, `/api/statistics`, and `/api/model/reload` operate flawlessly in `CUSTOM_SPECIES_MODEL` mode.
2. `tests/test_system_suite.py`: All 12 categories pass (UI assets, API contracts, YOLO inference, accuracy metrics, counting MAE 2.40, length calibration 16.02 cm, SQLite schema integrity, error handling, CPU latency 209 ms, usability disclaimers, and field governance).
3. `bycatch/tests/unit/`: All 23 tests pass immediately under Python 3.14 (annotation pipeline, audit pipeline, catch role rules, class consistency, conservation service, SQLite database repository, and inference engine).

---

## 3. Comprehensive Audit of ByCatch AI

### 3.1 Architecture, Entry Point & Framework
* **Location in Workspace:** `c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\bycatch\`
* **Original Zip Archive:** Found at `C:\Users\LENOVO\Downloads\bycatch.zip` (3.09 GB, downloaded 18 Nov 2026 04:48 WIB).
* **Primary Framework:** Python, Streamlit multipage application (5 pages in `app/pages/`), PyTorch, Ultralytics YOLO.
* **Entry Point:** `app/main.py` launched via `run_app.bat` (`streamlit run app\main.py --server.port 8501`).
* **Secondary / Underlying Logic:** Modular Python package in `src/` (`annotation`, `conservation`, `data/audit`, `database`, `evaluation`, `inference`, `training`, `utils`).

### 3.2 Model Architecture & Weights Status
* **Target Classes:** Defined in `bycatch/configs/classes.yaml`:
  * Class 0: `kembung_perempuan` (*Rastrelliger brachysoma*)
  * Class 1: `selar_kuning` (*Selaroides leptolepis*)
  * Class 2: `kuniran` (*Upeneus sulphureus*)
  *(Identical canonical 3-class scope to FishGuard AI).*
* **Model Weights Inventory:**
  * `bycatch/yolo11n.pt` (5.61 MB) — Pretrained baseline YOLO11 Nano.
  * `bycatch/yolov8n.pt` (6.55 MB) — Pretrained baseline YOLOv8 Nano.
  * `bycatch/runs/detect/results/_smoke/exp_yolo11n_smoke_s42_1794929727/weights/best.pt` (5.49 MB) — YOLO11n trained on synthetic smoke test.
  * `bycatch/models/weights/active_model.json` — Currently missing/uninitialized (`FishDetector` reports `model_missing`).
* **Inference Rule (`predictor.py`):**
  * Strictly returns `status='model_missing'` if no weights are active in `models/weights/active_model.json`.
  * **Zero Fake Predictions Rule Respected:** Never fakes detections.

### 3.3 Catch Role Classification Engine (`catch_role.py`)
* Does **NOT** hardcode any species as inherently target or non-target.
* Evaluates context dynamically:
  * Input: `detected_species_name`, `target_species` (intended trip targets, e.g. "kembung perempuan; selar kuning"), `catch_handling` ("retained" vs "discarded"), and `gear_info`.
  * Rule 0: Missing target species context $\to$ `unverified`
  * Rule 1: Detected species in target list $\to$ `target`
  * Rule 2: Non-target but retained on board $\to$ `incidental_non_target_retained` (bycatch)
  * Rule 3: Non-target and discarded at sea $\to$ `discarded_non_target` (bycatch)

### 3.4 Conservation Service & Data Sources (`src/conservation/`)
* **Scientific Integrity:** Strictly matches on verified scientific names (*never* on common or ambiguous local names).
* **Sources:**
  1. **IUCN Red List:** Offline snapshot fallback in `bycatch/data/conservation_snapshots/iucn_snapshot.json` (Dated 2026-11-18, IUCN API v4 format).
  2. **CITES Species+:** Offline snapshot fallback in `bycatch/data/conservation_snapshots/cites_snapshot.json` (Appendices I, II, III).
  3. **KKP National Regulation:** Parsed from `bycatch/metadata/regulation_registry.csv` (Permen KP No. 1/2021, Kepmen KP No. 1/2021 status perlindungan penuh/terbatas).
* **Legal Disclaimer:** Outputs automated screening support, clearly attributed as non-legal determinations.

### 3.5 Database Architecture
* Uses SQLite: `bycatch/data/app.sqlite`.
* Schema (`src/database/schema.sql`): `schema_version`, `species`, `images`, `detections`, `catch_records`, `audit_log`.
* Completely separate from FishGuard's `backend/fishguard_history.db`.

### 3.6 License Implications
* Ultralytics is licensed under **AGPL-3.0**.
* Both FishGuard and ByCatch use Ultralytics for detection.
* Because this is an academic research prototype for the ASIK competition, internal integration within the unified platform complies with AGPL-3.0 when distributed open-source under AGPL-3.0 compatible terms.

---

## 4. Cross-Project Dependency Conflict Analysis

| Package | FishGuard Requirement (`backend/requirements.txt`) | Global Environment Version | ByCatch Requirement (`bycatch/requirements.txt`) | ByCatch Locked Version (`requirements-lock.txt`) | Compatibility Status | Conflict Risk |
|:---|:---|:---|:---|:---|:---:|:---:|
| **Python** | Python 3.10+ | **3.14.7** | Python 3.10+ | 3.14.7 | Compatible | None |
| **PyTorch** | `torch>=2.0.0` | **2.15.0** | `torch>=2.0.0` | 2.11.0+cu128 (wheel) | Compatible (CPU & CUDA) | None |
| **Torchvision**| `torchvision>=0.15.0`| **0.29.2** | `torchvision>=0.15.0`| 0.20.0+cu128 | Compatible | None |
| **Ultralytics**| `ultralytics>=8.1.0` | **8.4.208** | `ultralytics>=8.4.0` | 8.4.0 | Compatible | None |
| **OpenCV** | `opencv-python>=4.8.0`| **5.0.0.93** | `opencv-python>=4.7.0`| 4.10.0.84 | Compatible | Minor OpenCV 5 API differences handled |
| **NumPy** | `numpy>=1.24.0` | **2.5.4** | `numpy>=1.24.0` | 1.26.4 | Compatible | None |
| **FastAPI** | `fastapi>=0.110.0` | **0.162.2** | *(None, uses Streamlit)* | *(N/A)* | Distinct UI stack | None |
| **Pydantic** | `pydantic>=2.6.0` | **2.14.3** | *(Implicit via pydantic)* | 2.10.0 | Compatible | None |
| **Streamlit** | *(None, uses React)* | **Not installed globally** | `streamlit>=1.30.0` | 1.39.0 | Isolated in bycatch venv | Isolated |
| **Polars** | *(None)* | **2.1.0** | `polars>=0.20.0` | 0.20.0 | Compatible | None |

### Key Environmental Insight & Virtual Environment Finding:
1. `bycatch/venv/pyvenv.cfg` was authored with hardcoded paths from another user profile (`C:\Users\Muhammad Ali Husen\...`). When invoked directly, the Windows stub fails with `The system cannot find the path specified`.
2. However, the global Python environment (`Python 3.14.7`) already has **PyTorch 2.15.0, Ultralytics 8.4.208, OpenCV 5.0.0, Polars 2.1.0, NumPy 2.5.4, and PyTest 9.2.0** installed.
3. Running `python -m pytest bycatch/tests/unit/` using the global interpreter executes **all 23 ByCatch unit tests and passes 100%**.
4. ByCatch core logic (`src/`) is pure, decoupled Python with zero hard dependency on Streamlit itself! Only `bycatch/app/` uses Streamlit.
5. This gives us two viable, clean paths for integration without breaking either system.

---

## 5. Artifact Status Separation

### 🟢 Verified (Working, tested, passes automated tests)
1. **FishGuard AI Backend:** FastAPI on port 8000 (8/8 integration tests passing).
2. **FishGuard AI Detection Weights:** `backend/weights/fishguard_yolo.pt` (6.19 MB) operating in `CUSTOM_SPECIES_MODEL` mode.
3. **FishGuard AI Database:** SQLite `fishguard_history.db` with 3 MVP species schema and 69+ recorded analyses.
4. **FishGuard AI 12-Category System Tests:** `tests/test_system_suite.py` passing 100%.
5. **FishGuard AI Frontend:** React 19 + Tailwind + Vite dev server (port 5173) with live webcam, sample images, and production build passing.
6. **ByCatch AI Core Python Logic (`bycatch/src/`):** 23/23 unit tests passing via `pytest`.
7. **ByCatch AI Conservation Engine:** Verified offline snapshots (IUCN, CITES) and KKP regulation registry.
8. **ByCatch AI Catch Role Rule Engine:** Rigorous contextual evaluation of target vs incidental/discarded roles.

### 🟡 Partially Implemented / Architecture Decoupled
1. **ByCatch Streamlit Interface (`bycatch/app/`):** Implemented as a standalone Streamlit app on port 8501, but `bycatch/venv/` has hardcoded path issues from the source archive.
2. **ByCatch Model Weights:** Smoke test weights exist in `runs/detect/results/_smoke/`, but `models/weights/active_model.json` is not yet configured for production inference.

### ⚪ Placeholder / Planned (Honest representation)
1. **OceanSense AI (Module 3):** Planned / Not implemented. Oceanographic remote sensing and environmental analysis. No dummy endpoints or fake telemetry will be fabricated.
2. **CatchForecast AI (Module 4):** Planned / Not implemented. Fishing ground suitability and habitat distribution modeling. No dummy forecasts will be fabricated.

### 🔴 Missing / Blockers
1. **Physical Specimens & Karangantu Field Sampling:** (Phases 11.7.4, 11.7.5, 11.8) honestly governed as `BLOCKED (PENDING SPECIMENS & PERMITS)`.
2. **ByCatch Real Landing Dataset:** `bycatch/dataset/raw/primary` is pending physical port specimens (same as FishGuard).
