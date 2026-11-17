# FISHGUARD AI — MASTER PROGRESS TRACKER
**Single Source of Truth for Project Status and Audit Trail**  
**Terakhir Diperbarui:** 17 November 2026 | **Fase Aktif:** Phase 17 (Prototype Completion & Codebase Freeze) — **SELESAI (100%)**

---

## 1. Reconstructed Status Table (Phases 1 — 17)

| Fase ID | Judul Fase | Status | Lokasi Bukti (Evidence Path) | Tingkat Keyakinan | Catatan Kunci Auditor |
|:---:|:---|:---:|:---|:---:|:---|
| **Phase 1–8** | Foundation, Backend Scaffolding & Initial Protocol | **VERIFIED** | `documentation/PHASE_7_AUDIT.md`, `PHASE_8_DATASET_REPORT.md`, `backend/` | HIGH (100%) | Arsitektur backend FastAPI dan struktur direktori pipeline terverifikasi. |
| **Phase 9** | DeepFish Public Dataset Inspection | **VERIFIED** | `documentation/PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md` | HIGH (100%) | Domain gap diverifikasi (underwater coral vs market landing). Eksklusi tepat. |
| **Phase 10** | GBIF Public Dataset Acquisition | **VERIFIED** | `dataset_pipeline/reports/phase_10/phase_10_summary.json` | HIGH (100%) | 207 record GBIF historis tercatat mentah, bukan dataset siap latih. |
| **Phase 10.1** | GBIF Data Integrity & Duplicate Audit | **VERIFIED** | `dataset_pipeline/reports/phase_10_1/taxonomic_revalidation.csv` | HIGH (100%) | Audit duplikasi dan taksonomi terlaksana; direkonsiliasi di Phase 11.6. |
| **Phase 11** | Species Prioritization & Feasibility | **VERIFIED** | `documentation/phase_11_species_prioritization_report.md` | HIGH (100%) | Analisis data pendaratan PIPP PPN Karangantu menghasilkan prioritas lokal. |
| **Phase 11.6** | Scientific & Data Integrity Closure | **VERIFIED** | `dataset_pipeline/reports/phase_11_6/phase_11_6_integrity_audit_report.md` | HIGH (100%) | Mengunci 3 target kelas MVP (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*). |
| **Phase 11.7** | Field Sampling Preparation & Protocol | **VERIFIED** | `documentation/phase_11_7_field_sampling_preparation_report.md` | HIGH (100%) | SOP sampling tegak lurus 90°, checklist peralatan lapangan, template CSV. |
| **Phase 11.7.1**| Laboratory Dry Run & Pre-Pilot Validation | **VERIFIED** | `documentation/phase_11_7_1_dry_run_report.md` | HIGH (100%) | Simulasi kering laboratorium. Status model awal `MODEL_NOT_TRAINED`. |
| **Phase 11.7.2**| Preflight Verification & FoV Audit | **VERIFIED** | `documentation/phase_11_7_2_preflight_audit_report.md`, `camera_fov_calculator.py` | HIGH (100%) | Jarak rig $H=90$ cm untuk FoV $60.4$ cm (lensa 35mm APS-C). |
| **Phase 12.1** | Public Image Inventory Integrity Audit | **VERIFIED** | `documentation/phase_12_1_public_image_inventory_audit.md` | HIGH (100%) | 91 inventaris diaudit: 3 P1, 19 P2, 10 Class 2 tertahan review taksonomi. |
| **Phase 12.1.1**| Selective Public Image Acquisition | **VERIFIED** | `documentation/phase_12_1_1_final_reconciliation_audit.md` | HIGH (100%) | 21 citra diunduh: 20 referensi bersih (10 C0, 10 C1), 1 karantina (FG-C1-019). |
| **Phase 12.1.2**| Class 2 Clearance & Acquisition | **VERIFIED** | `dataset_pipeline/reports/phase_12_1_2/phase_12_1_2_taxonomy_clearance_class2.md` | HIGH (100%) | 10/10 citra Class 2 diunduh dan diverifikasi via Uiblein et al. (2025). Akumulasi: 30 citra referensi bersih. |
| **Phase 12.2** | MVP Realignment & Synthetic Multi-Fish | **VERIFIED** | `dataset_pipeline/reports/phase_12_2_mvp_alignment_report.md` | HIGH (100%) | Backend & SQLite schema aligned ke 3 kelas; 125 citra sintetis multi-ikan + anotasi YOLO dibuat. |
| **Phase 11.7.3**| Laboratory Physical Rig Validation | **COMPLETED & APPROVED [AG]** | [PHASES/PHASE_11_7_3/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_11_7_3/) | HIGH (100%) | Disetujui resmi oleh User [AG]. Rig spec $H=90$ cm, FoV $60.4$ cm, skala error $0.057\%$. |
| **Phase 11.7.4**| Controlled Specimen Pilot | **BLOCKED (PENDING SPECIMENS)** | [PHASES/PHASE_11_7_4/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_11_7_4/) | HIGH (100%) | Protokol, template metadata, dan `qc_ingest_pilot.py` siap. Eksekusi fisik menunggu spesimen fisik riil. |
| **Phase 11.7.5**| Pilot Data Integrity Audit | **BLOCKED (PENDING PILOT)** | [PHASES/PHASE_11_7_5/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_11_7_5/) | HIGH (100%) | Menunggu hasil pengambilan data fisik spesimen pilot 11.7.4. |
| **Phase 11.8** | Field Sampling Execution | **BLOCKED (PENDING PERMITS)** | [PHASES/PHASE_11_8/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_11_8/) | HIGH (100%) | Memerlukan perizinan tertulis instansi/PPN Karangantu dan ekspedisi fisik lapangan. |
| **Phase 12**   | Dataset Construction & YOLO Preparation| **COMPLETED & VERIFIED**| [datasets/fishguard_v001/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/datasets/fishguard_v001/), [PHASES/PHASE_12/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_12/) | HIGH (100%) | Dataset v001 dibekukan (80 train, 20 val, 25 frozen test; 808 bboxes). Leakage $0.00\%$. 177 GBIF dialokasikan ke OOD. |
| **Phase 13**   | YOLO Baseline Training & Evaluation | **COMPLETED & VERIFIED**| [PHASES/PHASE_13/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_13/) | HIGH (100%) | 10 epoch training selesai (val mAP50=0.5160, test mAP50=0.3673); bobot `fishguard_yolo.pt` (6.19 MB) aktif. OOD FPR teruji (66.4%). |
| **Phase 14**   | Length Estimation & Catch Analysis | **COMPLETED & VERIFIED**| [PHASES/PHASE_14/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_14/) | HIGH (100%) | `length_estimator.py` terimplementasi: ArUco scale factor, kompensasi kurvatur ($C>1.03$), 95% CI uncertainty, status ladder VALIDATED/LIMITED/EXP. |
| **Phase 15**   | Backend & Dashboard Integration | **COMPLETED & VERIFIED**| [PHASES/PHASE_15/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_15/) | HIGH (100%) | FastAPI otomatis memuat `CUSTOM_SPECIES_MODEL`; 8/8 test integrasi via `backend/test_pipeline.py` lulus 100%; UI React Vite terhubung. |
| **Phase 16**   | System Testing & Validation | **COMPLETED & VERIFIED**| [PHASES/PHASE_16/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_16/) | HIGH (100%) | 12 kategori pengujian terverifikasi via `tests/test_system_suite.py` (latensi steady 189 ms, penanganan edge case dan blank frame tervalidasi). |
| **Phase 17**   | Prototype Completion (Final Milestone)| **COMPLETED & FROZEN [AG]**| [PHASES/PHASE_17/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/PHASES/PHASE_17/) | HIGH (100%) | Codebase dibekukan; 15 deliverables prototipe lengkap; `FISHGUARD_FINAL_REPORT.md` terbit; serah terima prototipe ASIK V resmi ditutup. |

---

## 2. Status Istilah & Definisi (Status Vocabulary)
- **PLANNED:** Fase/tugas telah terdefinisi dalam roadmap, prasyarat belum terpenuhi atau belum dieksekusi.
- **IN PROGRESS:** Pekerjaan teknis sedang berjalan aktif.
- **BLOCKED:** Terhenti karena membutuhkan input fisik (alat, izin lapangan, spesimen riil, tindakan manusia).
- **COMPLETED:** Seluruh pekerjaan teknis tugas/fase telah selesai dilaksanakan.
- **VERIFIED:** Bukti artefak dan hasil pengujian telah divalidasi silang terhadap kriteria penerimaan objektif.
- **APPROVED:** Telah memperoleh persetujuan eksplisit tertulis dari Operator Manusia (*Human Project Owner*).
- **FROZEN:** Repositori dan bobot model dikunci permanen untuk rilis prototipe resmi.

---

## 3. Rangkuman Pencapaian Milestone Akhir Prototipe
1. **Target Spesies Terkunci:** 3 spesies MVP Karangantu (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*).
2. **Bobot Model Terverifikasi:** `backend/weights/fishguard_yolo.pt` (6.19 MB) beroperasi dalam mode `CUSTOM_SPECIES_MODEL`.
3. **Pengujian Mandiri Otomatis:**
   - `python backend/test_pipeline.py` -> 8/8 uji integrasi lulus (100%).
   - `python tests/test_system_suite.py` -> 12/12 kategori uji sistem lulus (100%).
4. **Kepatuhan Mutlak Integritas Ilmiah:** Nol fabrikasi data fisik pendaratan; fase lapangan fisik (11.7.4, 11.7.5, 11.8) berstatus strictly `BLOCKED (PENDING SPECIMENS & PERMITS)`.
