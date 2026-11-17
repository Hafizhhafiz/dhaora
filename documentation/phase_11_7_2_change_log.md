# LOG PERUBAHAN & AUDIT TRAIL PHASE 11.7.2
## FishGuard AI — ASIK V

**Tanggal Eksekusi:** 16 November 2026  
**Ruang Lingkup:** Physical Pre-Flight Verification & Pilot Execution Readiness  

---

## 1. FILE YANG DIPERIKSA (INSPECTED FILES)
1. `dataset_pipeline/reports/phase_11_7/field_sampling_sop.md`: SOP rig kamera $90^\circ$ dan jarak kerja awal 45–55 cm.
2. `dataset_pipeline/reports/phase_11_7_1/camera_rig_validation.md`: Dokumen klaim FoV horizontal 55 cm pada jarak 50 cm.
3. `dataset_pipeline/reports/phase_11_7_1/aruco_calibration_validation.md`: Hasil stress-test deteksi ArUco OpenCV.
4. `dataset_pipeline/reports/phase_11_7_1/pre_pilot_issue_log.csv`: Log isu pra-pilot (quiet zone, glare, boom arm).
5. `dataset_pipeline/templates/field_data_collection_template.csv`: Template metadata primer lapangan.
6. `dataset_pipeline/metadata/species_reference.csv`: Master katalog 3 kelas MVP (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*).

---

## 2. TEMUAN KOREKSI KRITIS & NILAI SEBELUM vs SESUDAH

### Koreksi Geometri Bidang Pandang Kamera (FoV Discrepancy Correction):
- **Nilai Sebelum (Klaim Phase 11.7 & 11.7.1):**
  - Jarak kamera kerja: $H = 45 - 55\text{ cm}$ (rekomendasi: $50\text{ cm}$).
  - Lensa: $f = 35\text{ mm}$ pada sensor APS-C ($23,5 \times 15,6\text{ mm}$).
  - Klaim cakupan horizontal: $55,0\text{ cm}$.
- **Hasil Audit Komputasional Aktual:**
  $$\text{FoV}_{w} = \frac{w_{sensor} \times H}{f} = \frac{23,5 \times 500}{35} = 335,7\text{ mm} \; (33,57\text{ cm})$$
  - Defisit Lebar: $60,0\text{ cm} - 33,57\text{ cm} = 26,43\text{ cm}$ terpotong!
  - Papan ukur $50\text{ cm}$ terpotong sebesar **$16,43\text{ cm}$** bila dipotret pada jarak $50\text{ cm}$ dengan lensa $35\text{ mm}$.
- **Nilai Sesudah (Koreksi Rekomendasi Phase 11.7.2):**
  - **Opsi A (Rekomendasi Utama - Pertahankan Lensa 35mm):**
    $$H_{baru} = \frac{\text{FoV}_{butuh} \times f}{w_{sensor}} = \frac{600 \times 35}{23,5} \approx 893,6\text{ mm} \; (89,4\text{ cm})$$
    - Jarak kamera kerja dinaikkan menjadi **$H = 90,0\text{ cm} \pm 1,0\text{ cm}$**.
    - FoV horizontal aktual: **$60,43\text{ cm}$** (mencakup sempurna papan ukur $50\text{ cm}$ + marker ArUco + margin $10\text{ cm}$).
    - Resolusi spasial: **$99,29\text{ px/cm}$** ($0,1007\text{ mm/px}$) pada sensor 24 MP.
  - **Opsi B (Alternatif - Pertahankan Jarak 50 cm):**
    - Gunakan lensa wide-angle $f = 18\text{ mm}$ ($f_{req} \le 19,6\text{ mm}$). FoV horizontal: $65,28\text{ cm}$.

---

## 3. ARTEFAK BARU YANG DIHASILKAN

Seluruh file disimpan di folder `dataset_pipeline/reports/phase_11_7_2/`:
1. `camera_fov_calculator.py`: Skrip kalkulator optik dan laporan preset sensor/lensa.
2. `physical_rig_checklist.csv`: Checklist 8 komponen mekanik rig, bubble level, dan vibrasi.
3. `biometric_ground_truth_validation_template.csv`: Template pembandingan pengukuran manual vs visi komputer.
4. `pilot_execution_gate.csv`: Matriks 10 kriteria evaluasi gerbang kelulusan Go/No-Go pilot.
5. `aruco_physical_validation_protocol.md`: Protokol validasi fisik penanda ArUco dan batas quiet zone.
6. `image_quality_acceptance_criteria.md`: Kriteria penerimaan dan penolakan kualitas citra di lapangan.
7. `phase_11_7_2_readiness_assessment.md`: Penilaian formal penetapan status `CONDITIONALLY_READY_FOR_PILOT`.
8. `phase_11_7_2_change_log.md`: Dokumen audit trail perubahan ini.
9. `phase_11_7_2_preflight_audit_report.md`: Laporan master eksekutif Phase 11.7.2.

---

## 4. FILE & DATA YANG DIPRESERVASI UTUH (NON-DESTRUCTIVE)
1. `species_reference.csv` (10 baris terharmonisasi): Tidak ada perubahan class ID atau nama takson.
2. `dataset_master.csv` (183 baris historis): Tidak tercemar data dummy/simulasi.
3. `backend/weights/`: Tetap berstatus `MODEL_NOT_TRAINED` (tidak ada pelatihan YOLO).
