# LAPORAN DATASET ACQUISITION, MANAGEMENT & PREPARATION (PHASE 8)
## FishGuard AI — AI-Based Fisheries Monitoring and Conservation Support System

- **Proyek**: ASIK V — FishGuard AI
- **Program Studi**: Sistem Informasi Kelautan (SIK), Universitas Pendidikan Indonesia (UPI) Kampus Serang
- **Wilayah Studi**: Teluk Banten, Banten
- **Spesies Target**:
  1. Ikan Kembung (*Rastrelliger kanagurta* — Famili Scombridae)
  2. Ikan Layang (*Decapterus macarellus* — Famili Carangidae)
- **Peran**: Data Engineer, Computer Vision Dataset Specialist, dan Research Assistant
- **Tanggal Laporan**: 9 November 2026
- **Status Fase**: **SELESAI (INFRASTRUCTURE & PROTOCOLS READY)**

---

## 1. Inventaris Dataset Aktual

Berdasarkan audit faktual terhadap seluruh direktori workspace:

| Kategori Data | Jumlah File | Lokasi Penyimpanan | Status Penggunaan | Keterangan Ilmiah |
|---|:---:|---|:---:|---|
| **Citra Spesimen Lapangan Nyata** | **`0`** | `dataset_pipeline/data/raw/` | **BELUM TERSEDIA** | Pengambilan sampel foto di TPI Teluk Banten belum dilaksanakan. |
| **Label Anotasi YOLO Lapangan** | **`0`** | `dataset_pipeline/annotations/yolo/` | **BELUM TERSEDIA** | Menunggu hasil pemotretan spesimen nyata. |
| **Citra Uji Kalibrasi Sintetis** | `2` | `dataset_pipeline/sample_calibrated_images/` | **UJI TEKNIS SAJA** | Digunakan khusus untuk memverifikasi alur API dan kaliper. Diberi label eksplisit sebagai data sintetis. |
| **Citra Variasi Uji Kontur** | `6` | `dataset_pipeline/test_audit_variations/` | **AUDIT CV SAJA** | Citra variasi (horizontal, miring, ekor terlipat, latar kayu, glare) untuk audit ketahanan algoritma. |
| **Dataset Publik Terunduh** | `0 MB` | - | **BELUM DIUNDUH** | Belum ada unduhan arsip publik mentah ke workspace lokal. |

> [!IMPORTANT]
> **Prinsip Integritas Ilmiah**: Seluruh 8 citra yang ada di workspace saat ini merupakan **data uji teknis sintetis** yang dibuat untuk memverifikasi fungsionalitas kode. **Sistem tidak pernah mengklaim atau memperlakukan data ini sebagai foto spesimen nyata dari Teluk Banten.**

---

## 2. Analisis Kelayakan Dataset Publik (Audit Lisensi & Domain)

Evaluasi terhadap 4 kandidat dataset publik berdasarkan kesesuaian domain, lisensi, dan target spesies:

### A. Dataset yang Dapat Digunakan untuk Pre-training / Benchmarking
1. **FishNet (ICCV 2023)**:
   - **Tautan**: https://fishnet-2023.github.io/
   - **Lisensi**: *Academic Research License* (Non-commercial).
   - **Kesesuaian**: **Sangat Tinggi untuk Pre-training**. Memuat foto ikan di atas dek kapal dan keranjang sortir perikanan komersial global.
   - **Catatan Implementasi**: Memerlukan proses filtering subset khusus untuk genus *Rastrelliger* dan *Decapterus*. Label bounding box asli harus dikonversi ke format YOLO dua-kelas.

### B. Dataset yang Hanya Cocok sebagai Referensi Metodologi / Taksonomi
1. **GBIF (Global Biodiversity Information Facility)**:
   - **Tautan**: https://www.gbif.org/
   - **Lisensi**: Bervariasi per record (CC0, CC BY, CC BY-NC).
   - **Kesesuaian**: **Referensi Diagnosis Taksonomi**. Sangat bernilai untuk validasi ciri morfologi resmi *R. kanagurta* dan *D. macarellus* dari spesimen museum ber-geotag.
   - **Alasan Tidak untuk Direct Training**: Tidak memiliki anotasi bounding box berstandar deteksi objek; foto umumnya berlatar herbarium/laboratorium tanpa sudut pandang tangkapan perikanan.
2. **Wikimedia Commons**:
   - **Tautan**: https://commons.wikimedia.org/
   - **Lisensi**: Bervariasi per file (Creative Commons / Public Domain).
   - **Kesesuaian**: **Komplementer / Augmentasi Selektif**.
   - **Aturan Penggunaan**: Wajib mencatat izin atribusi per berkas secara granular ke dalam [`license_register.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/license_register.csv). Dilarang mengunduh massal tanpa kurasi manual.

### C. Dataset yang Tidak Dapat Digunakan & Alasannya
1. **DeepFish (Zenodo)**:
   - **Tautan**: https://zenodo.org/records/6475675
   - **Lisensi**: CC BY 4.0.
   - **Kesesuaian**: **TIDAK COCOK (Domain Shift Ekstrem)**.
   - **Alasan Penolakan**: DeepFish terdiri dari rekaman video bawah air (*underwater video*) ikan karang di habitat terumbu karang Australia. Kondisi visual bawah air (hamburan cahaya biru laut, distorsi refraksi air, ikan berenang bebas) bertolak belakang dengan kondisi operasional FishGuard AI (ikan mati/segar di atas papan ukur/meja sortir TPI). Memasukkan DeepFish ke model akan merusak akurasi deteksi perikanan darat.

---

## 3. Hasil Validasi File & Kualitas Citra

Eksekusi script [`validate_images.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/validate_images.py) menghasilkan laporan lengkap di:
[`dataset_pipeline/reports/image_quality_report.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/image_quality_report.csv)

- **Total Citra Diperiksa**: 8 file.
- **Integritas Header & Decoding**: 100% terbaca sempurna oleh Pillow dan OpenCV (0 file korup).
- **Dimensi**: Seluruh citra berada dalam rentang $900 \times 600$ px hingga $1000 \times 700$ px, memenuhi standar resolusi minimum ($>320 \times 320$ px).
- **Skor Ketajaman (Laplacian Variance Blur Score)**:
  - Citra uji bersih memiliki skor varians Laplacian **> 120.0** (tajam / *in-focus*).
  - Citra uji variasi pencahayaan bergradien memiliki skor varians lebih rendah namun tetap terdeteksi strukturnya.

---

## 4. Hasil Pemeriksaan Duplikasi

Eksekusi script [`detect_duplicates.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/detect_duplicates.py) menghasilkan laporan di:
[`dataset_pipeline/reports/duplicates_report.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/duplicates_report.csv)

1. **Exact Hash (SHA-256)**:
   - Ditemukan **0 pasangan duplikat identik byte-per-byte**. Seluruh file merupakan entitas independen.
2. **Perceptual Hash (Difference Hash / dHash 64-bit)**:
   - Terdeteksi 5 pasangan berkorelasi tinggi karena citra `1_horizontal.jpg`, `2_slanted_30deg.jpg`, `3_open_tail.jpg`, dan `4_folded_tail.jpg` diturunkan dari kanvas siluet spesimen yang sama untuk keperluan audit algoritma.
   - **Tindakan**: Sesuai aturan kerja, tidak ada file yang dihapus secara otomatis. Hasil didokumentasikan untuk audit.

---

## 5. Hasil Group Split & Verifikasi Anti-Data Leakage

Eksekusi script [`prepare_dataset.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/prepare_dataset.py) menghasilkan laporan di:
[`dataset_pipeline/reports/split_overlap_report.json`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/split_overlap_report.json)

- **Mekanisme Group-Split**: Mengelompokkan citra berdasarkan `specimen_id` dari [`dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv).
- **Kondisi Tanpa Metadata**: Jika ada file yang tidak memiliki `specimen_id` valid, script secara otomatis menandainya sebagai `NEEDS_METADATA` dan **mengecualikannya dari pembagian train/val/test**.
- **Data Leakage Check**: Status saat ini terkonfirmasi **ZERO DATA LEAKAGE CONFIRMED** (0 overlap antar split).

---

## 6. Status Kesiapan Dataset untuk Training Model

> [!WARNING]
> **Status Kesiapan Training**: **BELUM SIAP (NOT READY FOR SUPERVISED TRAINING)**.
> 
> **Alasan**: Dataset citra spesimen lapangan asli dari Teluk Banten masih kosong di `dataset_pipeline/data/raw/`. Sesuai aturan kerja ilmiah, **training YOLO dilarang keras dijalankan menggunakan data sintetis** untuk menghindari model yang halusinatif atau tidak memiliki generalisasi terhadap ikan asli.

---

## 7. Rencana Kebutuhan Data Lapangan Teluk Banten (Action Plan)

Untuk mengaktifkan model khusus `fishguard_yolo.pt` pada Fase berikutnya, diperlukan akuisisi data lapangan sesuai protokol:

1. **Target Volume Sampel**:
   - Minimum **100 – 150 spesimen independen** Ikan Kembung (*Rastrelliger kanagurta*).
   - Minimum **100 – 150 spesimen independen** Ikan Layang (*Decapterus macarellus*).
   - Total target citra: **300 – 500 foto ortogonal** (termasuk variasi sudut mikro dan pencahayaan).
2. **Lokasi Pengambilan**:
   - Pangkalan Pendaratan Ikan / TPI Karangantu, Serang, Banten.
3. **Peralatan Wajib Dibawa**:
   - Papan ukur berlatar putih/biru kontras dengan mistar 0.1 cm.
   - ArUco marker kalibrasi optik.
   - Rig tripod kamera sudut tegak lurus (90° ortogonal).
4. **Alur Tindak Lanjut**:
   - Foto disimpan di `dataset_pipeline/data/raw/`.
   - Metadata dicatat di `dataset_pipeline/metadata/dataset_master.csv`.
   - Anotasi dilakukan menggunakan format YOLO di `dataset_pipeline/annotations/yolo/`.
   - Jalankan `python dataset_pipeline/scripts/prepare_dataset.py` untuk split data.
   - Jalankan `python dataset_pipeline/scripts/train_yolo.py` untuk menghasilkan `fishguard_yolo.pt`.
