# PENILAIAN KESIAPAN PELATIHAN MODEL (TRAINING READINESS ASSESSMENT)
## FishGuard AI — ASIK V (Phase 11.6)

**Lokasi Studi**: PPN Karangantu, Teluk Banten  
**Institusi**: Program Studi Sistem Informasi Kelautan (SIK), UPI Kampus Serang  
**Tanggal Penilaian**: 16 November 2026  
**Auditor**: Tim Multidisiplin FishGuard AI (Taxonomist, Data Scientist, CV Specialist, Integrity Auditor, AI Engineer)

---

## 1. STATUS KESIAPAN KESELURUHAN

| Dimensi Penilaian | Status Kesiapan | Keterangan & Bukti Lapangan |
|---|:---:|---|
| **Kesiapan Pelatihan Model YOLO (Phase 12)** | **`NOT_READY`** | Belum ada citra spesimen lapangan primer dari 3 kelas target di atas meja sortir/papan ukur berkalibrasi. |
| **Kesiapan Ekspedisi Pengambilan Data Lapangan** | **`READY_FOR_FIELD_SAMPLING`** | Protokol SOP, checklist alat, template metadata CSV, dan target taksa telah tervalidasi 100%. |
| **Infrastruktur Pipeline & Kode Training** | **`PARTIALLY_READY`** | Skrip `train_yolo.py`, `prepare_dataset.py`, dan backend API siap, namun data latih nyata belum terisi. |

> [!CAUTION]
> **Larangan Pelatihan Dini (Pre-Mature Training Ban)**:
> Model machine vision untuk estimasi biometrik panjang ikan tidak boleh dilatih hanya menggunakan citra sintetis atau citra GBIF underwater. Melatih model tanpa data domain operasional nampan sortir akan menghasilkan *catastrophic domain failure* saat diuji di pelabuhan pendaratan Karangantu.

---

## 2. EVALUASI DETAIL PARAMETER KESIAPAN DATASET

Berdasarkan audit inventaris fisik repositori `dataset_pipeline/`:

### 2.1 Ketersediaan Citra Spesimen Primer Lapangan
- **Jumlah Citra Spesimen 3 Kelas Target**: **0 citra**.
  - *Rastrelliger brachysoma*: 0 citra lapangan.
  - *Selaroides leptolepis*: 0 citra lapangan.
  - *Upeneus sulphureus*: 0 citra lapangan.
- **Identitas Individu (Specimen-Level ID)**: Belum ada individu yang terdaftar di lapangan.
- **Verifikasi Ahli Lapangan (Ichthyologist On-Site Sign-Off)**: Belum dilaksanakan.

### 2.2 Ketersediaan Anotasi & Ground Truth Biometrik
- **Bounding Box Lapangan**: **0 bounding box**.
- **Keypoint Ujung Moncong (Snout Tip) & Ujung Ekor (Fork/Caudal Tip)**: **0 keypoint**.
- **Pengukuran Panjang Total (Total Length / TL) Aktual**: **0 pengukuran** metrik (cm/mm).
- **Kalibrasi Skala Metrik (Pixel-to-Millimeter Calibration)**: Papan ukur bergaris milimeter dan koin/checkerboard referensi telah ditentukan dalam SOP, namun belum ada foto operasional riil.

### 2.3 Evaluasi Citra Publik GBIF sebagai Pengganti
- Total citra publik GBIF untuk 3 kelas target:
  - *Selaroides leptolepis*: 179 citra (mayoritas bawah air / terumbu karang).
  - *Upeneus sulphureus*: 67 citra (bawah air dan spesimen pasar non-standar).
  - *Rastrelliger brachysoma*: 35 citra (pasar lokal Asia Tenggara dan preserved jar).
- **Evaluasi Domain Gap**:
  - Sudut kamera bervariasi dari 0° hingga 180° (tidak ortogonal 90°).
  - Tidak ada skala ukur metrik terkalibrasi di samping tubuh ikan.
  - Ikan sering terpotong oleh batas bingkai atau tertutup pasir/karang.
- **Kesimpulan Fungsional**: Citra GBIF diklasifikasikan sebagai **`MORPHOLOGY_REFERENCE`** dan **`OOD_TEST_CANDIDATE`** (Out-of-Distribution testing), **bukan sebagai training dataset primer**.

### 2.4 Status Arsitektur Model & Bobot Pelatihan
- File `backend/weights/fishguard_yolo.pt`: **`NOT_PRESENT`** (status: `MODEL_NOT_TRAINED`).
- File dummy/sintetis sebelumnya: Hanya ditujukan untuk verifikasi integrasi end-to-end FastAPI, bukan model operasional.

---

## 3. CHECKLIST PRASYARAT MUTLAK SEBELUM PHASE 12

Sebelum memasuki Phase 12 (YOLO Baseline Training & Validation), prasyarat berikut wajib dipenuhi:

- [ ] **Pelaksanaan Ekspedisi Lapangan di TPI PPN Karangantu**:
  - Mengambil foto spesimen 3 kelas target (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*).
  - Target minimal: 150 spesimen per kelas (total minimal 450 spesimen unik).
- [ ] **Penerapan Standar Operasional Prosedur (SOP)**:
  - Sudut kamera tegak lurus 90° (*top-down orthogonal*).
  - Papan ukur milimeter terkalibrasi ditempatkan sejajar dengan tubuh ikan.
  - Pencahayaan merata untuk menghindari bayangan tajam (*harsh glare*).
- [ ] **Pencatatan Metadata Primer**:
  - Mengisi `dataset_pipeline/templates/field_data_collection_template.csv` untuk setiap foto.
  - Mencatat nomor spesimen unik, TL (cm), FL (cm), berat (gram), dan nama verifikator taksonomi.
- [ ] **Anotasi Data Presisi Tinggi**:
  - Anotasi bounding box 2D dengan label class_id: 0, 1, 2.
  - Anotasi keypoint 2-titik (Snout & Caudal Tip) untuk estimasi panjang total.
- [ ] **Pemisahan Partisi Bebas Kebocoran (*Leakage-Free Splitting*)**:
  - Pemisahan data Train (70%), Validation (15%), dan Test (15%) dilakukan pada **tingkat ID spesimen unik** (*specimen-level*), bukan secara acak per frame/foto, guna mencegah overfitting foto dari individu ikan yang sama.

---

## 4. KESIMPULAN REKOMENDASI AUDIT

Tim audit merekomendasikan:
1. **Tunda Pembagian Data Train/Val/Test**: Jangan membagi dataset atau membuat file YAML konfigurasi YOLO sebelum citra lapangan primer terkumpul.
2. **Fokuskan Sumber Daya pada Sampling Lapangan (Phase 11.7)**: Tim peneliti UPI Kampus Serang diarahkan segera turun ke TPI PPN Karangantu dengan membawa panduan SOP dan checklist yang telah disahkan pada Phase 11.
