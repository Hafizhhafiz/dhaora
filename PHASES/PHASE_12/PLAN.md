# PHASE 12 — DATASET CONSTRUCTION & YOLO PREPARATION PLAN
**Status:** IN PROGRESS  
**Fase Pemilik:** Data Engineer, AI Engineer, Research Data Integrity Auditor  
**Tujuan Utama:** Mengonsolidasi seluruh sumber data terverifikasi (referensi bersih, dataset sintetis bebas kebocoran, dan set OOD), melakukan audit ulang historis 207 citra GBIF, menetapkan pembagian split tanpa kebocoran (*leakage-free split by specimen/session*), membekukan versi dataset imutabel `datasets/fishguard_v001/`, dan menyiapkan `data.yaml` YOLO.

---

## 1. Rincian 11 Tugas Phase 12
1. **12-T1 Source Consolidation:** Konsolidasi seluruh citra referensi terverifikasi (30 citra publik bersih), 30 sprite transparan, dan 125 citra komposit multi-spesies fotorealistik beserta metadata lisensi dan provenance.
2. **12-T2 GBIF Re-audit (Issue A2):** Audit ulang 207 record GBIF historis; klasifikasikan status akseptasi/penolakan dan relokasi sebagai data evaluasi Out-of-Distribution (OOD).
3. **12-T3 Cleaning, Duplicate Detection & Quality Filter:** Pemfilteran duplikasi pHash dan ketajaman citra.
4. **12-T4 Annotation Guidelines:** Panduan anotasi bounding box YOLO (kerapatan tepi, penanganan oklusi, dan pemotongan tepi).
5. **12-T5 Keypoint Decision Experiment (Issue A5):** Analisis komparatif box-based vs keypoint-based untuk estimasi panjang, pencatatan log keputusan DEC-008.
6. **12-T6 Annotation & QC Verification:** Verifikasi format anotasi YOLO $[class\_id, x_c, y_c, w, h]$ dinormalisasi $0.0 - 1.0$.
7. **12-T7 Ground-Truth Length Table:** Menghubungkan ID spesimen dengan panjang manual dan ID citra.
8. **12-T8 Split Design & Leakage Prevention (Issue A7 & A8):** Pemisahan data berbasis `specimen_id` dan `session_id`, pembentukan subset evaluasi OOD (*look-alike non-target species*).
9. **12-T9 Class Distribution & Imbalance Analysis:** Analisis rasio kelimpahan kelas (Class 0, 1, 2) dan strategi penyeimbangan bobot.
10. **12-T10 Versioned Dataset Construction (`datasets/fishguard_v001/`):** Pembuatan struktur direktori imutabel, manifest SHA-256, `data.yaml`, dan split manifests.
11. **12-T11 Reproducibility Documentation & Automated Leakage Check:** Skrip pengujian otomatis $0\%$ overlap antar-split dan dokumentasi keterulangan.

---

## 2. Kriteria Penerimaan Phase 12
- Seluruh 207 record GBIF tercatat statusnya (0 digunakan untuk target class training, 175 dialokasikan ke OOD, 32 rejected).
- Pembagian Train/Val/Test terbukti $0\%$ overlap pada level individu spesimen dan sesi.
- Peta kelas tepat sesuai 3 kelas terkunci (0 *R. brachysoma*, 1 *S. leptolepis*, 2 *U. sulphureus*).
- Direktori `datasets/fishguard_v001/` terbentuk lengkap dengan manifest hash SHA-256.
