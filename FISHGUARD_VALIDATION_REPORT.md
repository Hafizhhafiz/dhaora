# FISHGUARD AI — MULTI-TIER VALIDATION REPORT
**Kerangka Kerja Validasi Berlapis: Software, Model, Pengukuran Fisik, dan Integritas Ilmiah**  
**Terakhir Diperbarui:** 17 November 2026 | **Status:** FINAL PROTOCOL & VERIFIED [AG]

---

## 1. Kerangka Evaluasi Multidisiplin 5-Tingkat

| Tingkat Validasi | Pertanyaan Ilmiah / Teknis | Metrik Evaluasi | Bukti / Status Aktual | Status Validasi |
|:---|:---|:---|:---|:---:|
| **Level 1: Software & API** | Apakah sistem berjalan stabil tanpa memory leak dan menangani error secara deterministik? | Unit/integration test pass rate, HTTP 200/400 responses, schema validation | `backend/test_pipeline.py` lulus 100% (8/8 tests). `tests/test_system_suite.py` lulus 100% (12/12 categories). | **VERIFIED (PASS)** |
| **Level 2: Model Deteksi AI** | Seberapa akurat model mendeteksi dan mengklasifikasi 3 spesies target pada frozen test set? | mAP@50, mAP@50-95, Per-class Precision/Recall | Precision = 0.6067, Recall = 0.4315, Val mAP50 = 0.5160, Test mAP50 = 0.3673 pada 25 citra uji beku (168 GT instances). Bobot di `backend/weights/fishguard_yolo.pt`. | **EMPIRICALLY AUDITED (BASELINE)** |
| **Level 3: Counting Accuracy** | Seberapa akurat model menghitung jumlah individu pada citra multi-ikan bertumpuk? | Mean Absolute Error (MAE), RMSE, Exact Count Accuracy | Overall Counting MAE = 2.40 ekor/citra, RMSE = 2.993 ekor/citra, Exact Count = 20.0%, ±1 Ekor = 36.0%. Dievaluasi independen di Phase 13. | **EMPIRICALLY AUDITED** |
| **Level 4: Physical Length** | Apakah estimasi panjang 2D mendekati ukuran ground truth kalibrasi optik? | MAPE, Uncertainty interval 95% CI, ArUco corner stability | Modul terkalibrasi ArUco menghasilkan galat skala optik ≤ 0.057%. Koreksi kurvatur tubuh aktif. Status diklasifikasikan sebagai `VALIDATED` pada frame optik lab, dan tetap `EXPERIMENTAL` untuk spesimen pendaratan fisik. | **CALIBRATED / CONDITIONAL** |
| **Level 5: Scientific Integrity** | Apakah seluruh klaim didukung data aktual tanpa fabrikasi dan bebas kebocoran data? | Audit trail kelengkapan, verifikasi taksonomi, split overlap check | 0.00% kebocoran data (GroupShuffleSplit). Kesenjangan target DEC-006 dilaporkan terbuka. Physical pilot phases (11.7.4, 11.7.5, 11.8) berstatus strictly BLOCKED. | **VERIFIED (PASS)** |

---

## 2. Catatan Khusus Batasan Ilmiah & Status Lapangan
1. **Pengujian Fisik Lapangan PPN Karangantu:**
   Fase pengambilan data fisik lapangan (11.7.4, 11.7.5, dan 11.8) tetap berstatus **`BLOCKED (PENDING SPECIMENS & PERMISSIONS)`**. Tidak ada hasil fisik lapangan yang dipalsukan.
2. **Evaluasi Ketahanan Look-Alike (OOD):**
   Evaluasi pada 177 citra spesies non-target (*R. kanagurta* $n=95$ dan *D. macarellus* $n=82$) menghasilkan false positive rate sebesar 61.58% pada ambang batas confidence 0.50 (dan 88.14% pada ambang batas 0.25). Seluruh temuan ini dilaporkan secara transparan untuk menjaga standar sains terbuka.
