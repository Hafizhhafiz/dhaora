# LAPORAN UTAMA AUDIT PRA-PENERBANGAN FISIK & KESIAPAN PILOT (PHASE 11.7.2)
## Proyek: FishGuard AI — ASIK V
### Lokasi Penelitian: Pelabuhan Perikanan Nusantara (PPN) Karangantu, Teluk Banten, Indonesia
**Institusi:** Program Studi Sistem Informasi Kelautan (SIK), Universitas Pendidikan Indonesia — Kampus Serang  
**Tanggal Audit:** 16 November 2026  
**Status Evaluasi:** **`CONDITIONALLY_READY_FOR_PILOT`**  
**Tim Auditor:** Senior Computer Vision Engineer, Fisheries Data Engineer, Research Data Integrity Auditor  

---

## 1. RINGKASAN EKSEKUTIF

Phase 11.7.2 (**Physical Pre-Flight Verification & Pilot Execution Readiness**) dilaksanakan sebagai audit teknis ketat terhadap kesiapan pengujian perangkat keras fisik sebelum tim peneliti turun ke dermaga Tempat Pelelangan Ikan (TPI) Karangantu.

Audit ini menindaklanjuti temuan Phase 11.7.1 dengan melakukan **verifikasi geometrik optik mendalam pada sistem kamera**, membakukan prosedur pemeriksaan fisik penanda ArUco dan rig horizontal boom, serta menyusun **10 gerbang keputusan kelulusan (*Pilot Execution Gates*)** yang transparan dan dapat dipertanggungjawabkan secara ilmiah.

### Hasil Utama Audit Phase 11.7.2:
1. **Penemuan & Koreksi Kesalahan Matematis FoV Kamera:**
   - Ditemukan bahwa klaim jarak kamera $50\text{ cm}$ pada lensa $35\text{ mm}$ APS-C menghasilkan FoV horizontal $55\text{ cm}$ adalah **keliru secara optik**. Perhitungan geometri proyeksi aktual membuktikan FoV hanya mencapai **$33,57\text{ cm}$**, sehingga papan ukur $50\text{ cm}$ akan terpotong sepanjang **$16,43\text{ cm}$**.
   - Dibuat kalkulator optik presisi [camera_fov_calculator.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/camera_fov_calculator.py) dan ditetapkan konfigurasi yang benar: **jarak kerja kamera dinaikkan menjadi $H = 90,0\text{ cm}$** untuk menghasilkan FoV horizontal **$60,43\text{ cm}$** (mencakup sempurna papan ukur $50\text{ cm}$ + marker ArUco + margin aman $10\text{ cm}$).
2. **Standardisasi Fisik Penanda ArUco 50 mm:**
   - Disusun protokol [aruco_physical_validation_protocol.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/aruco_physical_validation_protocol.md) yang mewajibkan kartu cetak memiliki batas putih keliling (*quiet zone*) minimal $10,0\text{ mm}$ dan toleransi cetak sisi penanda $50,00\text{ mm} \pm 0,20\text{ mm}$.
3. **Instrumen Verifikasi Rig & Kualitas Citra:**
   - Dihasilkan checklist 8 komponen rig mekanik [physical_rig_checklist.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/physical_rig_checklist.csv) dan pedoman penerimaan citra [image_quality_acceptance_criteria.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/image_quality_acceptance_criteria.md).
4. **Matriks 10 Gerbang Kelulusan (Go/No-Go Gate):**
   - Ditetapkan 10 kriteria kuantitatif pada [pilot_execution_gate.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/pilot_execution_gate.csv) untuk mengontrol izin keberangkatan pilot sampling.
5. **Penetapan Status:** Ditetapkan **`CONDITIONALLY_READY_FOR_PILOT`** dengan transparansi penuh bahwa pengujian mekanik fisik di lapangan masih berstatus `NOT_TESTED_IN_FIELD`.

---

## 2. AUDIT LAPANGAN FoV KAMERA & KALKULATOR OPTIK

### 2.1 Perbandingan Preset Optik Kamera

| Konfigurasi Preset | Sensor Kamera | Panjang Fokus ($f$) | Jarak Kerja ($H$) | FoV Horizontal ($FoV_w$) | Status Kesesuaian Papan 50 cm | Keterangan Evaluasi |
|---|---|:---:|:---:|:---:|:---:|---|
| **Klaim Awal Phase 11.7.1** | Sony A6400 (APS-C) | 35 mm | 50 cm | **33,57 cm** | ❌ **FAIL (Terpotong 16.4 cm)** | Keliru secara matematis |
| **Opsi A (Rekomendasi Utama)** | Sony A6400 (APS-C) | 35 mm | **90 cm** | **60,43 cm** | ✅ **PASS_FIT (Margin 10.4 cm)** | Resolusi 99.3 px/cm (0.10 mm/px) |
| **Opsi B (Lensa Wide)** | Sony A6400 (APS-C) | **18 mm** | 50 cm | **65,28 cm** | ✅ **PASS_FIT (Margin 15.3 cm)** | Resolusi 91.9 px/cm (0.11 mm/px) |
| **Opsi C (Full-Frame)** | Full-Frame (36x24mm) | 35 mm | **60 cm** | **61,71 cm** | ✅ **PASS_FIT (Margin 11.7 cm)** | Resolusi 97.2 px/cm (0.10 mm/px) |
| **Opsi D (Smartphone)** | Sensor 1/1.33" (9.6mm) | 6.8 mm | 50 cm | **70,59 cm** | ✅ **PASS_FIT (Margin 20.6 cm)** | Resolusi 56.7 px/cm (0.18 mm/px) |

---

## 3. KESIMPULAN & INSTRUKSI TINDAKAN

1. **Revisi Pengaturan Rig Fisik:** Tinggi tiang tripod boom arm wajib dinaikkan dari $50\text{ cm}$ menjadi **$90,0\text{ cm} \pm 1,0\text{ cm}$** bila menggunakan lensa prime $35\text{ mm}$ APS-C.
2. **Verifikasi Pra-Penerbangan di Lab:** Tim lapangan wajib menyelesaikan pemeriksaan fisik di laboratorium kampus menggunakan lembar periksa [physical_rig_checklist.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/physical_rig_checklist.csv) sebelum berangkat ke PPN Karangantu.
3. **Gerbang Eksekusi Pilot:** Keputusan Go/No-Go keberangkatan pilot wajib mematuhi seluruh 10 kriteria pada [pilot_execution_gate.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/pilot_execution_gate.csv).
