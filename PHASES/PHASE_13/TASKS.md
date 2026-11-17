# PHASE 13 — TASKS & EXECUTION TRACKER

| Task ID | Deskripsi Tugas | Pemilik (*Owner*) | Status | Kriteria Penerimaan | Bukti / Output |
|:---:|:---|:---:|:---:|:---|:---|
| **13-T0** | Pre-registered Targets Check | AI Lead | **COMPLETED / VERIFIED** | DEC-006 disetujui resmi oleh Human Owner [AG] | `FISHGUARD_DECISION_LOG.md` |
| **13-T1** | Environment & Hardware Lock | AI Engineer | **COMPLETED / VERIFIED** | Seed 42 dikunci, konfigurasi yaml terdefinisi | `training_config.yaml` |
| **13-T2** | Model Selection: YOLOv8n Pretrained | AI Specialist | **COMPLETED / VERIFIED** | Bobot baseline `yolov8n.pt` diverifikasi utuh (6.5 MB) | `yolov8n.pt` |
| **13-T3** | Controlled Training Execution | AI Engineer | **COMPLETED / VERIFIED** | 10 epoch training dijalankan pada dataset beku | `runs/baseline_yolov8n_v001/` |
| **13-T4** | Validation Metric Tracking | AI Engineer | **COMPLETED / VERIFIED** | Kurva loss & mAP terekam di results.csv (val mAP50=0.516) | `results.csv` |
| **13-T5** | Independent Test Evaluation | Research Auditor | **COMPLETED / VERIFIED** | Evaluasi 1x pada 25 citra test independen (test mAP50=0.3673) | `TEST_EVALUATION_REPORT.md` |
| **13-T6** | OOD Evaluation (False-Positive Rate)| AI Specialist | **COMPLETED / VERIFIED** | Uji ketahanan pada 128 citra look-alike (FPR 66.4% @ 0.50) | `OOD_EVALUATION_REPORT.md` |
| **13-T7** | Error Analysis & Failure Taxonomy | AI Specialist | **COMPLETED / VERIFIED** | Analisis visual bounding box meleset & kluster padat | `TEST_EVALUATION_REPORT.md` |
| **13-T8** | Model Export & Inference Module | Software Engineer| **COMPLETED / VERIFIED** | Bobot `fishguard_yolo.pt` & `inference/fishguard_infer.py` | `inference/`, `backend/weights/` |
| **13-T9** | Experiment Log Entry | AI Lead | **COMPLETED / VERIFIED** | Log resmi EXP-001 dicatat di master register | `FISHGUARD_EXPERIMENT_LOG.md` |
