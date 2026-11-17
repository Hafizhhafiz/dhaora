# PHASE 11 — PRE-FIELD PREPARATION REPORT
## FishGuard AI — ASIK V

**Tanggal Dokumen:** 14 November 2026  
**Penyusun:** Senior Computer Vision Engineer & Fisheries Data Scientist  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Fokus Fase:** Phase 11 — Pre-Field Preparation (Persiapan Akuisisi Data Lapangan Teluk Banten)  
**Status Evaluasi:** ✅ SELESAI & SIAP DILAKSANAKAN DENGAN REVISI TERTENTU  

---

## 1. Ringkasan Eksekutif

Setelah penyelesaian audit integritas Phase 10.1 dan pembaruan status katalog master, pengembangan FishGuard AI beralih ke persiapan pengumpulan dataset primer spesimen lapangan dari Tempat Pelelangan Ikan (TPI) Karangantu, Teluk Banten. Tahap **Pre-Field Preparation** ini bertujuan mengaudit infrastruktur direktori, mengevaluasi Standard Operating Procedure (SOP) pengumpulan data lapangan yang telah ada, merancang instrumen pencatatan metadata primer, serta menetapkan mekanisme penanganan data rusak atau meragukan sebelum tim peneliti diterjunkan ke lapangan.

Berdasarkan audit teknis dan metodologis:
1. **Struktur Direktori**: Direktori target `dataset_pipeline/data/field/` telah siap, dan direktori template `dataset_pipeline/templates/` telah dibuat untuk menampung instrumen pencatatan lapangan.
2. **Evaluasi Dokumen SOP**: Dokumen [`field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md) **tersedia dan memiliki fondasi ilmiah yang sangat solid** (mencakup sudut ortogonal 90°, pembatas moncong nol, dan penamaan anti-data leakage). Namun, ditemukan **4 celah operasional (*gaps*)** yang perlu direvisi: diferensiasi taksonomi layang terhadap spesies simpatrik, pencatatan formal identitas verifikator, variasi pencahayaan terkontrol, dan mekanisme pencatatan foto buangan (*discard logging*).
3. **Instrumen Baru yang Dihasilkan**: Telah dibuat template pencatatan komprehensif 34 kolom ([`field_data_collection_template.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/templates/field_data_collection_template.csv)) dan lembar kendali operasional ([`field_data_collection_checklist.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_checklist.md)).
4. **Kesimpulan Kesiapan**: FishGuard AI dinyatakan **`SIAP BERSYARAT (FIELD_READY_WITH_REVISIONS)`** untuk melaksanakan survei pengambilan data lapangan di TPI Karangantu setelah revisi minor SOP diadopsi.

---

## 2. Audit Struktur Direktori Dataset Primer

Pemeriksaan direktori memastikan bahwa jalur penerimaan data lapangan telah tertata rapi dan terisolasi dari dataset publik maupun data sintetis:

```
dataset_pipeline/
├── data/
│   ├── field/                                  <-- ALOKASI DATA PRIMER TELUK BANTEN
│   │   ├── raw/                                # Citra asli langsung dari kamera (per sesi)
│   │   │   ├── rastrelliger_kanagurta/
│   │   │   └── decapterus_macarellus/
│   │   ├── calibrated/                         # Citra ber-marker ArUco & mistar ukur
│   │   └── multi_fish/                         # Citra nampan multi-ikan (uji pencacahan)
│   ├── public/                                 <-- TERISOLASI
│   │   ├── gbif/                               # [Phase 10] Referensi morfologi global
│   │   └── deepfish/                           # [Phase 9] Referensi metodologi nampan
│   └── processed/                              # Output split train/val/test
├── metadata/
│   ├── dataset_master.csv                      # Katalog master (183 baris terkini)
│   ├── ground_truth_measurements.csv           # Biometri panjang fisik terkalibrasi
│   ├── species_reference.csv                   # Taksonomi acuan
│   └── license_register.csv                    # Audit lisensi
├── templates/                                  <-- [DIBUAT BARU PADA PHASE 11]
│   └── field_data_collection_template.csv      # Template pencatatan 34 kolom
└── reports/
    ├── phase_10/
    └── phase_10_1/
```

---

## 3. Evaluasi Kritis SOP Lapangan (`field_data_collection_protocol.md`)

Audit komparatif dilakukan terhadap 8 parameter esensial yang dipersyaratkan untuk pengumpulan data visi komputer perikanan:

| Parameter Evaluasi | Kondisi dalam SOP Saat Ini | Status Evaluasi | Temuan & Rekomendasi Celah (*Gaps*) |
|---|---|---|---|
| **1. Identifikasi Spesies Target** | Memuat rasio $TL/BD > 3.4$ & bintik dada (*R. kanagurta*); gurat sisi berscute & finlet (*D. macarellus*). | ⚠️ **PERLU PENYEMPURNAAN** | Ciri kembung sudah baik. Namun ciri layang belum membedakan *D. macarellus* terhadap spesies simpatrik TPI Karangantu (*D. russelli* & *D. macrosoma*). Rekomendasi: tambahkan kunci jumlah scute (30–38) dan warna sirip ekor. |
| **2. Prosedur Foto Ortogonal 90°** | Mengatur rig/tripod dengan *bubble level*, sensor 180° sejajar papan, jarak 40–60 cm. | ✅ **SANGAT MEMADAI** | Sudah mencakup kontrol sudut elevasi dan toleransi deviasi mikro $\le 5^\circ$. |
| **3. Papan Ukur Terkalibrasi** | Ichthyometer pembagian 0.1 cm (1 mm) berlatar kontras, pembatas tegak nol (*headboard*), marker ArUco $5 \times 5$ cm. | ✅ **SANGAT MEMADAI** | Standar papan ukur sesuai kaidah FAO dan penelitian Computer Vision terindeks. |
| **4. Pengukuran Total Length (TL)** | Titik moncong rapat di nol hingga ujung cuping terpanjang sirip ekor; presisi 0.1 cm; pengulangan 2 observer. | ✅ **SANGAT MEMADAI** | Prosedur pengukuran fisik ground truth sangat jelas dan mengurangi variabilitas inter-observer. |
| **5. Pencatatan Identitas Individu** | Konvensi `TB_<TANGGAL>_<LOKASI>_<SPESIES>_<ID_SPESIMEN>_<INDEX_FOTO>.<ext>`. | ✅ **SANGAT MEMADAI** | Melindungi sistem dari kebocoran data (*data leakage prevention*) pada partisi *train/val/test*. |
| **6. Metadata Waktu & Lokasi** | Memuat tanggal dan kode lokasi (`KRN` = Karangantu). | ⚠️ **PERLU PENYEMPURNAAN** | Belum mencakup pencatatan jam pengambilan (HH:MM:SS), nama perahu nelayan, alat tangkap (bagan/payang), dan koordinat GPS TPI. |
| **7. Variasi Ukuran, Posisi, & Cahaya** | Mengatur foto multi-ikan dan variasi mikro sudut 5°. | ⚠️ **PERLU PENYEMPURNAAN** | Perlu penambahan variasi terstruktur: simulasi sirip ekor terlipat vs terentang, variasi pencahayaan (bayangan vs cahaya difus), dan pemotretan pada nampan basah berlendir. |
| **8. Dokumentasi Verifikator** | Hanya menyebutkan "petugas/tim". | ❌ **BELUM TERCANTUM** | SOP belum mewajibkan pencatatan formal nama peneliti / asisten laboratorium yang memverifikasi identitas taksonomi spesimen. |

---

## 4. Evaluasi & Desain Struktur Metadata Primer

### 4.1 Hubungan Antar-Tabel Metadata

Katalog metadata FishGuard AI dirancang dengan hubungan relasional yang erat:

```
[ field_data_collection_template.csv ] (Lembar Kerja Lapangan Komprehensif - 34 Kolom)
                 │
                 ├──────────────────────────────────────────┐
                 ▼                                          ▼
[ ground_truth_measurements.csv ]             [ dataset_master.csv ]
(Pengukuran Biometrik Fisik Lab)              (Katalog Induk Dataset FishGuard)
- measurement_id                               - image_id
- specimen_id  <─────────────────────────────> - specimen_id
- total_length_cm                              - total_length_cm
- fork_length_cm                               - verification_status (FIELD_VERIFIED)
- standard_length_cm                           - split (specimen-isolated)
- measuring_instrument                         - image_quality
- operator                                     - attribution & license
```

### 4.2 Struktur Template Lapangan Baru (`field_data_collection_template.csv`)
Telah dibuat template di [`dataset_pipeline/templates/field_data_collection_template.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/templates/field_data_collection_template.csv) dengan skema 34 kolom yang mencakup:
1. **Identitas Berkas**: `field_record_id`, `photo_filename`, `specimen_id`, `photo_variation_index`.
2. **Taksonomi**: `species_local`, `target_scientific_name`, `family`.
3. **Spatiotemporal**: `capture_date`, `capture_time`, `location_code`, `location_name`, `gps_latitude`, `gps_longitude`.
4. **Konteks Perikanan**: `landing_batch_id`, `gear_type`, `specimen_freshness`.
5. **Biometri Fisik Ground Truth**: `body_depth_cm`, `total_length_cm`, `fork_length_cm`, `standard_length_cm`, `total_weight_grams`.
6. **Kalibrasi & Pengukuran**: `measuring_device`, `calibration_marker_used`.
7. **Parameter Fotografi**: `camera_device`, `lens_focal_length_mm`, `camera_distance_cm`, `camera_angle_deg`, `lighting_condition`, `background_color`.
8. **Quality Assurance & Personil**: `photo_triage_status`, `taxonomic_verifier`, `measurement_operator`, `verification_status`, `field_notes`.

---

## 5. Mekanisme Penanganan Citra Gagal, Buram, Duplikat, & Meragukan

Untuk mencegah masuknya data berkualitas buruk ke dalam pipeline, ditetapkan mekanisme *Field Quality Triage Protocol*:

### A. Kategori Status Triage Lapangan

| Kode Status Triage | Definisi Kriteria | Tindakan Lapangan yang Wajib Dilakukan |
|---|---|---|
| **`USABLE`** | Foto tajam, sudut 90° tepat, marker ArUco terbaca, kontur ikan utuh dan jelas. | Masuk ke antrian dataset primer untuk anotasi. |
| **`BLURRY`** | Varian Laplacian rendah, kabur akibat getaran tangan atau gerakan ikan. | Foto ditandai di log; **langsung ambil foto ulang di tempat**. |
| **`SPECULAR_GLARE`** | Pantulan cahaya menyilaukan pada lendir basah yang menutupi sirip ekor atau scute. | Keringkan lendir spesimen menggunakan lap microfiber lembut; atur ulang diffuser lampu; foto ulang. |
| **`OCCLUDED_FIN`** | Sirip ekor terlipat tidak wajar, rusak, atau terpotong tepi frame. | Bentangkan sirip ekor wajar; jika sirip patah parah, tandai sebagai `DAMAGED_SPECIMEN` (tidak boleh dipakai untuk ground truth TL). |
| **`UNCERTAIN_SPECIES`** | Morfologi ambigu (misal rasio tubuh antara 3.0–3.4 atau sirip layang kemerahan). | Beri label `EXCLUDED_NON_TARGET` atau simpan spesimen dalam coolbox untuk pemeriksaan laboratorium kampus. |
| **`DUPLICATE_SHOT`** | Jepretan ganda tanpa perubahan sudut/variasi dari spesimen yang sama. | Dieliminasi dari direktori aktif untuk mencegah redundansi berlebih. |

---

## 6. Rekomendasi Revisi untuk SOP Lapangan

Sesuai instruksi untuk tidak menduplikasi berkas, berikut adalah **rekomendasi revisi spesifik** yang perlu disematkan pada dokumen panduan operasional [`field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md):

1. **Revisi Bagian 2 (Tahap 1 - Verifikasi Taksonomi)**:
   * Tambahkan kunci pembeda genus *Decapterus*:
     * *Decapterus macarellus*: Tubuh sangat silindris/membulat, 30–38 scute, sirip ekor abu-abu kehijauan, operkulum bertitik hitam kecil.
     * *Decapterus russelli*: Tubuh lebih tinggi, sirip ekor kekuningan terang $\rightarrow$ Bukan target (Eksklusi).
2. **Revisi Bagian 3 (Pengukuran Biometri Ground Truth)**:
   * Tambahkan pengukuran tinggi badan fisik (*Body Depth*) menggunakan kaliper untuk mencatat rasio kelangsingan secara pasti.
3. **Revisi Bagian 4 (Standar Metadata)**:
   * Wajibkan pencatatan nama personil: `taxonomic_verifier` (asisten yang memeriksa spesies) dan `measurement_operator` (yang membaca mistar).
4. **Tambahkan Bagian Baru (Bagian 6 - Penanganan & Pencatatan Berkas Gagal)**:
   * Mengadopsi tabel kode *photo_triage_status* dari laporan ini.

---

## 7. Checklist Kesiapan Pengumpulan Data Lapangan

Seluruh rincian operasional lapangan telah dituangkan dalam lembar kendali siap cetak:  
📋 [`documentation/field_data_collection_checklist.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_checklist.md)

Checklist tersebut mencakup 9 seksi operasional terstruktur:
1. Perlengkapan Lapangan (Alat ukur, kamera, rig, sanitasi)
2. Pra-Keberangkatan & Administrasi Perizinan (Surat izin UPI, koordinasi TPI Karangantu)
3. Penataan Rig & Kontrol Kualitas Optik di Lokasi (Waterpas, jarak 50 cm, no-glare)
4. Protokol Verifikasi Taksonomi Lapangan (Kembung vs Layang dan spesies simpatrik)
5. Prosedur Pengukuran Biometrik & Ground Truth (Mistar nol, snout-touch, caudal spread)
6. Protokol Pemotretan & Variasi Terkontrol (Baseline, kemiringan 5°, multi-ikan)
7. Penamaan Berkas & Aturan Anti-Data Leakage
8. Triage Kualitas di Lokasi (On-site QC & Logging)
9. Pasca-Survei & Penyerahan Data (Transfer berkas, hash SHA-256)

---

## 8. Kesimpulan Kesiapan Lapangan

$$\mathbf{KESIMPULAN:\ SIAP\ BERSYARAT\ (FIELD\_READY\_WITH\_REVISIONS)}$$

### Pernyataan Kesiapan Ilmiah:
FishGuard AI telah memiliki fondasi metodologis, instrumen pencatatan metadata, dan kontrol kualitas yang sangat matang untuk melaksanakan pengambilan data lapangan di TPI Karangantu, Teluk Banten. 

Kegiatan lapangan dapat **langsung dieksekusi pada Phase 11.1 (atau fase survei lapangan berikutnya)** setelah:
1. Rig kamera dan papan ukur terkalibrasi selesai dirakit fisik.
2. Surat pengantar penelitian resmi dari UPI Kampus Serang diterbitkan.
3. Tim survei memahami lembar kendali operasional ([`field_data_collection_checklist.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_checklist.md)).

---
*FishGuard AI Dataset Engineering Team — Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
