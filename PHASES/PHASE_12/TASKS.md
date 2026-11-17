# PHASE 12 — TASKS & EXECUTION TRACKER

| Task ID | Deskripsi Tugas | Pemilik (*Owner*) | Status | Kriteria Penerimaan | Bukti / Output |
|:---:|:---|:---:|:---:|:---|:---|
| **12-T1** | Source Consolidation & License Register | Data Engineer | **COMPLETED / VERIFIED** | 30 citra referensi, 30 sprite, dan 125 citra komposit tercatat lisensi & provenance | `FISHGUARD_DATASET_REGISTER.md` |
| **12-T2** | GBIF Re-audit (207 Records) | Data Auditor | **COMPLETED / VERIFIED** | Seluruh 207 record diaudit ulang: 0 training target, 175 OOD eval, 32 rejected | `GBIF_REAUDIT_REPORT.md`, `gbif_reaudit_register.csv` |
| **12-T3** | Cleaning & Duplicate Filter | Data Engineer | **COMPLETED / VERIFIED** | 0 duplikat identik dalam split; citra karantina terisolasi | `CLEANING_AND_QC_REPORT.md` |
| **12-T4** | YOLO Annotation Guidelines | AI Specialist | **COMPLETED / VERIFIED** | Standar kerapatan bounding box dan aturan oklusi ditetapkan | `ANNOTATION_GUIDELINES.md` |
| **12-T5** | Keypoint Decision Experiment | Biometric Lead | **COMPLETED / VERIFIED** | Analisis beban anotasi vs akurasi; dicatat di DEC-008 | `KEYPOINT_DECISION_ANALYSIS.md` |
| **12-T6** | Annotation & Format QC | AI Engineer | **COMPLETED / VERIFIED** | Anotasi YOLO valid $[0..2]$, nilai $[0..1]$, tanpa box negatif | `ANNOTATION_QC_REPORT.md` |
| **12-T7** | Ground-Truth Length Table | Biometric Lead | **COMPLETED / VERIFIED** | Tabel acuan panjang manual terhubung ke specimen ID | `lengths_master.csv` |
| **12-T8** | Split Design & OOD Set Creation | Data Engineer | **COMPLETED / VERIFIED** | Split berbasis spesimen/sesi; subset evaluasi OOD (*R. kanagurta*, *D. macarellus*) terbentuk | `SPLIT_DESIGN_AND_LEAKAGE_AUDIT.md` |
| **12-T9** | Class Distribution & Imbalance Plan | AI Engineer | **COMPLETED / VERIFIED** | Rasio seimbang 1:1:1 pada citra sintetis; bobot loss siap | `CLASS_DISTRIBUTION_REPORT.md` |
| **12-T10**| Versioned Dataset (`fishguard_v001`) | Data Engineer | **COMPLETED / VERIFIED** | Direktori `datasets/fishguard_v001/` terbentuk rapi dengan manifest SHA-256 | `datasets/fishguard_v001/` |
| **12-T11**| Automated Leakage Check & Reproducibility | AI Engineer | **COMPLETED / VERIFIED** | Skrip `check_leakage.py` membuktikan 0% overlap antar-split | `LEAKAGE_VERIFICATION_REPORT.md` |
