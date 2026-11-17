# LAPORAN UTAMA AUDIT TEKNIS & SIMULASI PRA-PILOT (PHASE 11.7.1)
## Proyek: FishGuard AI — ASIK V
### Lokasi Simulasi: Laboratorium Komputasi & Iktiologi SIK UPI Kampus Serang
**Tanggal Eksekusi:** 16 November 2026  
**Status Evaluasi:** **CONDITIONALLY_READY_FOR_PILOT**  
**Tim Auditor:** Senior Computer Vision Engineer, Fisheries Data Engineer, Research Data Integrity Auditor  

---

## 1. RINGKASAN EKSEKUTIF

Sebagai tindak lanjut dari penetapan status `READY_FOR_PILOT` pada Phase 11.7, **Phase 11.7.1 (Laboratory Dry Run & Pre-Pilot System Validation)** dilaksanakan untuk melakukan audit teknis empiris dan simulasi menyeluruh terhadap seluruh komponen komputasi, visi komputer, dan integritas data sebelum tim peneliti turun ke dermaga TPI PPN Karangantu.

Audit ini memisahkan secara tegas antara **pengujian perangkat lunak aktual yang benar-benar dieksekusi secara komputasional** dan **pengujian fisik lapangan yang hanya dapat disimulasikan di laboratorium**, guna mempertahankan integritas penelitian dan mencegah klaim palsu.

### Hasil Utama Dry Run:
1. **Validasi Empiris Kalibrasi ArUco (OpenCV 5.0.0):**
   - Skrip deteksi marker `DICT_4X4_50` ukuran $50\text{ mm}$ berhasil dieksekusi dengan presisi skala $40,00\text{ px/cm}$.
   - **Temuan Kritis Terbukti:** Ditemukan bahwa marker yang digunting mepet (*flush cut*) mengalami kegagalan deteksi $100\%$ (`corners=None`). Ditambahkan instruksi wajib *quiet zone* margin putih $\ge 10\text{ mm}$ pada SOP.
2. **Uji Ketahanan Distorsi (Stress Testing):**
   - Algoritma terbukti tahan terhadap Gaussian blur hingga $\sigma=5.0$ dan kemiringan perspektif hingga $8^\circ$.
   - Glare basah seluas $30\%$ pada sudut marker berhasil ditolak oleh detektor (mencegah salah estimasi skala).
3. **Pemberantasan Data Leakage (0.0% Overlap):**
   - Simulasi partisi data 100 spesimen ($300\text{ citra}$) menggunakan `GroupShuffleSplit` membuktikan $0,00\%$ kebocoran individu antara train, val, dan test set.
4. **Simulasi Alur Kerja 3 Dummy Spesimen Target:**
   - Berhasil memvalidasi alur logging lengkap untuk *R. brachysoma* (Kelas 0), *S. leptolepis* (Kelas 1), dan *U. sulphureus* (Kelas 2) pada file [pilot_simulation_results.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/pilot_simulation_results.csv).
5. **Log Temuan Masalah:** Seluruh 5 potensi hambatan operasional dan mitigasinya dicatat resmi pada [pre_pilot_issue_log.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/pre_pilot_issue_log.csv).
6. **Keputusan Akhir:** Sistem ditetapkan berstatus **`CONDITIONALLY_READY_FOR_PILOT`** menunggu 3 butir verifikasi pra-penerbangan fisik.

---

## 2. DAFTAR ARTEFAK YANG DIHASILKAN PADA PHASE 11.7.1

Seluruh file hasil pengujian disimpan pada direktori [dataset_pipeline/reports/phase_11_7_1/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/) dan disinkronkan ke [documentation/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/):

1. 📑 **[phase_11_7_1_dry_run_report.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/phase_11_7_1_dry_run_report.md)** — Dokumen laporan utama ini.
2. 📷 **[camera_rig_validation.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/camera_rig_validation.md)** — Evaluasi sudut ortogonal 90°, leveling waterpas, FoV, dan pencahayaan diffuse 5500K.
3. 📏 **[aruco_calibration_validation.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/aruco_calibration_validation.md)** — Hasil empiris stress testing OpenCV ArUco detector dan kalkulasi pixel-to-cm.
4. 🐟 **[biometric_workflow_validation.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/biometric_workflow_validation.md)** — Validasi alur pengukuran manual dan evaluasi skema 6 keypoints.
5. 🔗 **[metadata_linkage_validation.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/metadata_linkage_validation.md)** — Uji relasi 1-to-many dan pembuktian empiris pencegahan kebocoran data (0% leakage).
6. 📊 **[pilot_simulation_results.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/pilot_simulation_results.csv)** — Tabel hasil simulasi pencatatan 3 dummy spesimen target MVP.
7. ⚠️ **[pre_pilot_issue_log.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/pre_pilot_issue_log.csv)** — Log 5 isu kritis/tinggi beserta bukti pengujian dan mitigasinya.
8. 📋 **[phase_11_7_1_readiness_assessment.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_1/phase_11_7_1_readiness_assessment.md)** — Penilaian formal penetapan status `CONDITIONALLY_READY_FOR_PILOT`.

---

## 3. KESIMPULAN & REKOMENDASI TINDAKAN

Phase 11.7.1 telah berhasil membuktikan secara teknis dan komputasional bahwa **seluruh logika algoritma, kalibrasi skala metrik, skema anotasi, dan pipeline data FishGuard AI siap digunakan**. 

Tim peneliti direkomendasikan menyelesaikan 3 butir *pre-flight physical conditions* (margin putih ArUco $\ge 10\text{ mm}$, kalibrasi waterpas fisik di lab, dan surat izin), kemudian melanjutkan eksekusi **Uji Coba Pilot Lapangan (45 spesimen)** di TPI Karangantu.
