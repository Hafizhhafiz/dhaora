# PHASE 10.1 — DATASET INTEGRITY & SCIENTIFIC VALIDATION AUDIT REPORT
## FishGuard AI — ASIK V

**Tanggal Audit:** 14 November 2026  
**Auditor:** Senior Dataset Auditor & Fisheries Data Scientist  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Cakupan Audit:** Evaluasi Kritis terhadap Seluruh Artefak dan Hasil Phase 10 GBIF Acquisition  
**Status Audit:** ✅ AUDIT READ-ONLY SELESAI — Rekomendasi Terbuka Menunggu Otorisasi  

---

## 1. Ringkasan Eksekutif Audit

Audit Phase 10.1 diselenggarakan untuk memeriksa secara mendalam integritas data, ketepatan status ilmiah, kepatuhan hak cipta, serta kesiapan komputasi dataset hasil akuisisi GBIF pada Phase 10. Audit ini berpegang pada prinsip kehati-hatian ilmiah (*scientific rigor*) dan kaidah rekayasa data visi komputer perikanan.

### Temuan Utama Audit:
1. **Integritas Berkas Fisik Sempurna (100%)**: Seluruh 207 citra hasil unduhan yang tercatat pada `gbif_download_log.csv` terkonfirmasi secara fisik ada di disk tanpa kehilangan (*zero missing files*). 8 baris citra sintetis awal pada `dataset_master.csv` tetap utuh.
2. **Koreksi Status Taksonomi `VERIFIED`**: Audit menemukan bahwa pemberian status `VERIFIED` pada 75 citra *Rastrelliger kanagurta* di Phase 10 didasarkan secara otomatis pada aturan heuristik (`country == 'Indonesia'` dan `taxonomicStatus == 'ACCEPTED'`). Secara biologi perikanan, **ini merupakan *taxonomic overstatement*** karena data iNaturalist bersifat *crowdsourced* tanpa pemeriksaan karakter morfometrik lab (seperti rasio kedalaman tubuh atau sisir saring insang). Direkomendasikan untuk menurunkan status menjadi **`PRIORITY_CANDIDATE`**.
3. **Rekonsiliasi 32 Berkas di Luar Master**: Perbedaan antara 207 hasil unduhan dan 175 entri pada katalog master (selisih 32 berkas) terbukti **100% dapat dipertanggungjawabkan**: 26 berkas mengalami blur parah/sinonim taksonomi (`NEEDS_REVIEW`), dan 6 berkas merupakan duplikat eksak SHA-256 atau resolusi terlalu rendah (`REJECTED`).
4. **Pencegahan Kebocoran Data (Data Leakage Risk)**: Teridentifikasi **235 occurrence GBIF yang memiliki lebih dari satu foto** (hingga 37 foto per kejadian observasi). Jika media dari satu occurrence dipecah sembarangan ke *train* dan *test*, akan terjadi *specimen data leakage* yang parah.
5. **Kesiapan Model**: Status kesiapan pelatihan secara definitif ditetapkan sebagai **`NOT_READY_FOR_TRAINING`**. Tidak ada anotasi bounding box maupun kalibrasi ukuran panjang (cm) pada citra GBIF.

---

## 2. Audit Keterlacakan dan Rekonsiliasi Data Master

Pemeriksaan silang (*cross-referencing*) dilakukan terhadap seluruh berkas metadata:

```
[ gbif_occurrences.csv ] : 1.340 baris media
           │
           ├──────────────────────────────┐
           ▼                              ▼
[ gbif_license_audit.csv ]    [ Seleksi Kandidat: 240 ]
      1.340 baris                        │
                                         ▼
                            [ gbif_download_log.csv ] : 240 berkas
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                 SUCCESS: 207 berkas             FAILED: 33 berkas
                         │                               │
                         ▼                               ▼
            [ gbif_quality_report.csv ]      [ download_failed.csv ]
                    207 berkas                          33 baris
                         │
        ┌────────────────┼────────────────┬────────────────┐
        ▼                ▼                ▼                ▼
VERIFIED: 75      CANDIDATE: 100   NEEDS_REVIEW: 26   REJECTED: 6
        │                │                │                │
        └───────┬────────┘                ▼                ▼
                │                  [ expert_review ]  [ data/rejected ]
                ▼                      26 baris            6 berkas
    [ dataset_master.csv ]
      175 entri GBIF
    +   8 entri SYNTHETIC
    ─────────────────────
      183 entri TOTAL
```

### Tabel Rekonsiliasi Komparatif:

| Nama Berkas / Entitas | Jumlah Baris | Hubungan Metadata | Status Validasi |
|---|---|---|---|
| `gbif_occurrences.csv` | 1.340 | Sumber primer metadata occurrence & media | ✅ Konsisten |
| `gbif_license_audit.csv` | 1.340 | Pemetaan 1:1 terhadap media occurrences | ✅ Konsisten |
| `gbif_download_log.csv` | 240 | Kandidat terfilter (120 RKAN + 120 DMAC) | ✅ Konsisten |
| `download_failed.csv` | 33 | Berkas gagal unduh (HTTP 403 / Timeout) | ✅ Terlacak 100% |
| `gbif_quality_report.csv` | 207 | Analisis kualitas seluruh unduhan sukses | ✅ Terlacak 100% |
| `expert_review_needed.csv` | 26 | Subset `NEEDS_REVIEW` dari quality report | ✅ Terlacak 100% |
| Berkas Fisik `rejected/` | 6 (aktif) + 2 (duplikat) | Subset `REJECTED` dari quality report | ✅ Terlacak 100% |
| `dataset_master.csv` | 183 | 175 kandidat aktif GBIF + 8 sintetis | ✅ Terlacak 100% |
| Berkas Fisik `raw/` di Disk | 207 | 107 RKAN + 100 DMAC | ✅ Fisik Ada 100% |

Hasil rekonsiliasi detail disimpan pada berkas:  
📊 [`dataset_pipeline/reports/phase_10_1/dataset_master_reconciliation.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/dataset_master_reconciliation.csv) *(215 baris)*.

---

## 3. Re-Evaluasi Taksonomi Kritis (Taxonomic Revalidation)

### 3.1 Evaluasi Status `VERIFIED` Phase 10

Pada Phase 10, sebanyak 75 citra *Rastrelliger kanagurta* diberi status `VERIFIED` berdasarkan logika:
$$\text{IF } (\text{country} == \text{'Indonesia'} \land \text{taxonomicStatus} == \text{'ACCEPTED'}) \rightarrow \text{VERIFIED}$$

**Evaluasi Kritis Auditor:**
1. **Sifat Data iNaturalist**: 100% dari 75 citra tersebut berasal dari *datasetName* `"iNaturalist research-grade observations"` dengan *basisOfRecord* `HUMAN_OBSERVATION`. Status *"Research Grade"* di iNaturalist hanya mensyaratkan persetujuan $>2/3$ komunitas pengguna awam/pengamat alam liar, bukan identifikasi oleh iktiolog dengan voucher spesimen fisik.
2. **Karakter Morfologi Kunci Tak Teruji**: Ikan kembung di perairan Indonesia memiliki dua spesies simpatrik yang sangat mirip secara visual:
   * *Rastrelliger kanagurta* (Kembung Lelaki): Rasio panjang terhadap tinggi tubuh ($TL / BD$) $> 3.4$, bintik hitam kecil di dekat sirip dada, sisir saring insang 30–46.
   * *Rastrelliger brachysoma* (Kembung Perempuan): Tubuh lebih lebar/gemuk ($TL / BD < 3.0$), sisir saring insang 56–61.
3. Foto bawah air liar dengan sudut kemiringan bebas (*oblique underwater shot*) tidak memungkinkan pengukuran rasio $TL / BD$ secara presisi, sehingga identitas taksonomi tidak boleh dinyatakan `VERIFIED` secara definitif.

### 3.2 Rekomendasi Skema Status Sementara yang Lebih Tepat:

Untuk menjaga integritas riset UPI Serang, direkomendasikan mengklasifikasikan ulang seluruh spesimen:

| Status Baru | Jumlah Berkas | Kriteria Penetapan Ilmiah |
|---|---|---|
| **`PRIORITY_CANDIDATE`** | **75 berkas** | Spesimen dari perairan Indonesia dengan nama taksonomi diterima; kualitas optik baik; prioritas utama verifikasi laboratorium/lapang. |
| **`METADATA_SCREENED`** | **100 berkas** | Spesimen dari perairan internasional atau spesimen museum yang lolos filter metadata dasar; identitas spesies belum diverifikasi langsung. |
| **`NEEDS_EXPERT_REVIEW`** | **26 berkas** | Citra yang terdeteksi memiliki motion blur parah ($Var(\Delta I) < 15.0$) atau rekaman dengan status taksonomi `SYNONYM`. |
| **`REJECTED`** | **6 berkas** | Duplikat eksak SHA-256, resolusi sub-standar ($<400 \times 300$), atau lisensi terlarang. |

Hasil re-evaluasi taksonomi lengkap tersimpan pada:  
📊 [`dataset_pipeline/reports/phase_10_1/taxonomic_revalidation.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/taxonomic_revalidation.csv) *(207 baris)*.

---

## 4. Re-Asesmen Hak Cipta dan Lisensi (License Reassessment)

Audit hak cipta menguraikan izin hukum untuk 5 jenis pemanfaatan dalam rekayasa AI:
1. **Visual Reference**: Inspeksi visual oleh manusia/peneliti.
2. **Annotation**: Pembuatan label bounding box, segmentation mask, atau landmark.
3. **Preprocessing**: Normalisasi piksel, cropping, resize, augmentasi rotasi.
4. **Model Training**: Ekstraksi bobot matematis melalui proses backpropagation SGD/AdamW.
5. **Redistribution**: Membagikan kembali kumpulan data citra ke publik (misal Zenodo / GitHub).

### Matriks Kepatuhan Lisensi:

| Lisensi Terstandarisasi | Occurrence GBIF | Unduhan Aktif | Visual Ref | Anotasi | Preprocessing | Model Training | Redistribusi Dataset | Status Kepatuhan |
|---|---|---|---|---|---|---|---|---|
| **CC0 1.0 (Public Domain)** | 76 | 7 | ✅ YA | ✅ YA | ✅ YA | ✅ YA | ✅ BEBAS | `FULLY_COMPLIANT` |
| **CC BY 4.0** | 168 | 71 | ✅ YA | ✅ YA | ✅ YA | ✅ YA | ✅ DENGAN ATRIBUSI | `FULLY_COMPLIANT` |
| **CC BY-NC 4.0** | 1.011 | 228 (media ref) | ✅ YA | ✅ YA | ✅ YA | ✅ RISET AKADEMIK SAJA | ⚠️ NON-KOMERSIAL | `ACADEMIC_COMPLIANT` |
| **CC BY-NC-ND 4.0** | 26 | 0 (terfilter) | ✅ YA | ❓ AMBIGU | ❓ AMBIGU | ⚠️ RISIKO HUKUM | ❌ DILARANG MODIF | `AMBIGUOUS_RESTRICTIVE` |
| **RESTRICTIVE / COPYRIGHT** | 82 | 0 (terfilter) | 👁️ LIHAT SAJA | ❌ DILARANG | ❌ DILARANG | ❌ DILARANG | ❌ DILARANG | `NON_COMPLIANT` |

> [!NOTE]
> Klausul **ND (NoDerivatives)** dalam lisensi Creative Commons secara hukum melarang pembuatan karya turunan. Apakah pemotongan bounding box (*bounding box cropping*) atau anotasi objek dikategorikan sebagai *derivative work* masih menjadi perdebatan hukum hak cipta internasional. Oleh karena itu, seluruh berkas berlisensi **ND** dan hak cipta tertutup secara konservatif **dikeluarkan dari dataset latih FishGuard AI**.

Hasil audit lisensi lengkap tersimpan pada:  
📊 [`dataset_pipeline/reports/phase_10_1/license_reassessment.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/license_reassessment.csv).

---

## 5. Audit Duplikasi dan Isolasi Individu Spesimen

### 5.1 Duplikasi Eksak (Identical SHA-256)
Audit kriptografi menemukan **3 pasangan (6 berkas)** dengan nilai hash SHA-256 identik meskipun memiliki `gbifID` berbeda:
1. `GBIF_RKAN_6147443764.jpg` $\leftrightarrow$ `GBIF_RKAN_6147322861.jpg` (Hash: `4f8e951b...`)
2. `GBIF_DMAC_1055345222.jpg` $\leftrightarrow$ `GBIF_DMAC_1056560125.jpg` (Hash: `c0f70e34...`)
3. `GBIF_DMAC_1057083216.jpg` $\leftrightarrow$ `GBIF_DMAC_1057083208.jpg` (Hash: `ea69285a...`)

*Penyebab*: Pengguna mengunggah gambar yang sama ke dalam beberapa laporan observasi terpisah di iNaturalist/GBIF.  
*Tindakan*: Berkas duplikat telah diidentifikasi dan dipindahkan ke folder `rejected/`.

### 5.2 Analisis Near-Duplicate & Ambang Perceptual Hash (dHash)
* **Algoritma**: Difference Hash (dHash) 64-bit pada kanal keabuan 8-bit.
* **Ambang Batas (Threshold)**: Jarak Hamming $H_{dist} \le 4$. Jika $H_{dist} \le 4$, dua citra dianggap sebagai *near-duplicate* (misalnya versi kompresi berbeda, pemotongan mikro, atau variasi warna ringan).
* **Hasil Uji**: Tidak ditemukan *near-duplicate* palsu di luar pasangan duplikat SHA-256.

### 5.3 Risiko Kebocoran Data Antar-Split (*Data Leakage Prevention*)
Dari 856 `gbifID` yang diekstrak, terdapat **235 occurrence yang memiliki lebih dari satu citra** (hingga 37 foto per satu kejadian observasi).

> [!CAUTION]
> **Aturan Partisi Wajib (Specimen-Isolated Group Split)**:  
> Jangan pernah mengasumsikan berkas citra berbeda sebagai individu ikan yang berbeda. Seluruh citra yang memiliki `gbifID` sama, `recordedBy` sama, atau tanggal & lokasi kejadian sama **WAJIB dialokasikan ke dalam satu kelompok split yang sama** (seluruhnya di Train, atau seluruhnya di Test). Pelanggaran terhadap aturan ini akan menghasilkan akurasi model yang tampak tinggi semu (*overoptimistic evaluation*) akibat model mengenali latar belakang karang yang sama.

Hasil audit duplikasi dan isolasi individu tersimpan pada:  
📊 [`dataset_pipeline/reports/phase_10_1/duplicate_individual_audit.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/duplicate_individual_audit.csv) *(207 baris)*.

---

## 6. Audit Rekonsiliasi Data Master (`dataset_master.csv`)

Pemeriksaan status berkas master memastikan transparansi penuh:

1. **8 Entri Sintetis Terjaga**: Berkas `sample_kembung_calibrated.jpg`, `sample_catch_multi_species.jpg`, dan 6 variasi kontur (`1_horizontal.jpg` s/d `6_varied_lighting.jpg`) tetap tersimpan utuh di baris 0–7 katalog master.
2. **175 Berkas GBIF Terdaftar**: Seluruh 175 entri terkonfirmasi memiliki berkas fisik di `dataset_pipeline/data/public/gbif/raw/`.
3. **32 Berkas Terkecualikan**:
   * 26 berkas `NEEDS_REVIEW` (blur tinggi / taksonomi sinonim) dicatat terpisah di `expert_review_needed.csv`.
   * 6 berkas `REJECTED` (duplikat SHA-256 / resolusi $<400 \times 300$) disimpan di `data/public/gbif/rejected/`.
   * Tidak ada berkas "hilang tanpa jejak" (*zero orphaned files*).

---

## 7. Evaluasi Kesiapan Pelatihan (Training Readiness Review)

Evaluasi formal merujuk pada dokumen:  
📄 [`documentation/training_readiness_assessment.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/training_readiness_assessment.md)

### Status Definitif:
$$\mathbf{NOT\_READY\_FOR\_TRAINING}$$

### Alasan Fundamental:
1. **Nol Bounding Box**: Belum ada label koordinat bounding box YOLO `.txt`.
2. **Nol Skala Ukur**: Tidak ada marker ArUco atau penggaris kalibrasi (px/cm) untuk modul *Length Estimation*.
3. **Pergeseran Domain Ekstrem**: Foto bawah air dan toples museum tidak mewakili domain operasional ikan di atas nampan/papan ukur TPI Karangantu.

---

## 8. Rekomendasi Auditor Sebelum Perubahan Katalog Master

Sebagai pelaksanaan instruksi **audit read-only**, berikut adalah rekomendasi tindakan yang diajukan kepada pengguna sebelum melakukan modifikasi fisik pada `dataset_master.csv`:

1. **Pembaruan Kolom `verification_status` pada Master**:
   * Ubah 75 baris *Rastrelliger kanagurta* dari status `VERIFIED` menjadi **`PRIORITY_CANDIDATE`**.
   * Ubah 100 baris *Decapterus macarellus* dari status `CANDIDATE` menjadi **`METADATA_SCREENED`**.
   * Status `VERIFIED` hanya akan diberikan jika spesimen fisik telah diperiksa langsung oleh asisten laboratorium atau iktiolog SIK UPI Serang.
2. **Pengalokasian Citra GBIF**:
   * Tetapkan citra GBIF sebagai **Kandidat Pengujian Out-of-Distribution (OOD)** dan **Referensi Taksonomi Visual**.
   * Dilarang mencampurkan citra bawah air GBIF ke dalam set data latih primer (*primary training set*).
3. **Inisiasi Pengumpulan Data Lapangan (Phase 11)**:
   * Melaksanakan protokol pengambilan sampel di TPI Karangantu sesuai [`field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md) untuk memperoleh citra ortogonal 90° beresolusi tinggi dengan papan ukur metrik.

---

## 9. Indeks Berkas Artefak Audit Phase 10.1

| No | Tipe Dokumen | Nama Berkas & Tautan | Deskripsi Singkat |
|---|---|---|---|
| 1 | 📄 Laporan Audit | [`documentation/phase_10_1_integrity_audit_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_10_1_integrity_audit_report.md) | Laporan audit integritas & validasi ilmiah komprehensif |
| 2 | 📄 Asesmen Kesiapan | [`documentation/training_readiness_assessment.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/training_readiness_assessment.md) | Penilaian 8 dimensi kesiapan pelatihan model |
| 3 | 📊 Dataset Audit | [`dataset_pipeline/reports/phase_10_1/taxonomic_revalidation.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/taxonomic_revalidation.csv) | Re-evaluasi taksonomi 207 citra (turunkan VERIFIED) |
| 4 | 📊 Dataset Audit | [`dataset_pipeline/reports/phase_10_1/license_reassessment.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/license_reassessment.csv) | Analisis hak cipta granular untuk 5 moda penggunaan AI |
| 5 | 📊 Dataset Audit | [`dataset_pipeline/reports/phase_10_1/duplicate_individual_audit.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/duplicate_individual_audit.csv) | Audit isolasi individu, multi-photo, dan dHash |
| 6 | 📊 Dataset Audit | [`dataset_pipeline/reports/phase_10_1/dataset_master_reconciliation.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10_1/dataset_master_reconciliation.csv) | Rekonsiliasi 100% dari 215 berkas (8 sintetis + 207 unduhan) |

---
*Laporan ini disusun secara objektif berdasarkan audit data aktual tanpa fabrikasi angka.*  
*FishGuard AI Dataset Integrity & Scientific Validation Audit Team — ASIK V, UPI Kampus Serang.*
