# PHASE 10 — GBIF DATASET ACQUISITION, VALIDATION & CURATION REPORT
## FishGuard AI — ASIK V

**Tanggal Eksekusi & Audit:** 13 November 2026  
**Fase Proyek:** Phase 10 — GBIF Dataset Acquisition, Validation & Curation  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Status Fase:** ✅ SELESAI (Akuisisi, Kurasi Kualitas, dan Katalogisasi Master Selesai)  

---

## 1. Ringkasan Eksekutif

Phase 10 bertujuan mengatasi ketiadaan citra spesimen nyata dari fase-fase sebelumnya dengan mengakses **GBIF Occurrence API** secara terprogram untuk mengunduh, mengaudit lisensi, memeriksa kualitas optik, mendeteksi duplikasi, dan mengurasi citra kandidat bagi dua spesies target FishGuard AI:
1. **Kelas 1**: Ikan Kembung Lelaki (*Rastrelliger kanagurta*)
2. **Kelas 2**: Ikan Layang (*Decapterus macarellus*)

Dari penelusuran API resmi GBIF, ditemukan **707 record occurrence** (*R. kanagurta*) dan **256 record occurrence** (*D. macarellus*) yang memiliki media citra (*StillImage*). Sebanyak **1.340 entri media** berhasil diekstrak metadatanya. 

Melalui proses seleksi bertingkat (menghindari duplikasi observasi per `gbifID`, memprioritaskan spesimen Indonesia dan perairan Indo-Pasifik, serta status taksonomi *ACCEPTED*), sebanyak **240 berkas kandidat utama** diajukan ke pipeline unduhan paralel. Sebanyak **207 citra berhasil diunduh** (tingkat keberhasilan 86,25%), dievaluasi kualitasnya (resolusi, rasio aspek, Laplacian blur variance, hash SHA-256, dan perceptual dHash), serta diklasifikasikan ke dalam status kurasi ilmiah. Sebanyak **175 citra kandidat terpilih** berhasil didaftarkan ke dalam katalog master [`dataset_pipeline/metadata/dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv) tanpa menghilangkan 8 baris data sintetis uji sebelumnya.

> [!IMPORTANT]
> **Status Kesiapan Pelatihan (Training Readiness): `NOT_READY_FOR_TRAINING`**  
> Citra GBIF berfungsi sebagai **data pengayaan visual dan referensi morfologi taksonomi**, BUKAN pengganti foto spesimen di atas papan ukur/nampan TPI Karangantu, Teluk Banten. Bobot model YOLO (`backend/weights/fishguard_yolo.pt`) **BELUM DILATIH** dan status sistem tetap transparan: **`MODEL_NOT_TRAINED`**.

---

## 2. Audit Workspace Sebelum Eksekusi

Sebelum proses penarikan data massal, audit sistem memastikan integritas lingkungan kerja:

| Parameter | Kondisi Awal | Kondisi Pasca Phase 10 | Keterangan |
|---|---|---|---|
| **Kapasitas Disk C:** | 67.11 GB Free | 66.85 GB Free | Penggunaan disk: ~260 MB (sangat aman) |
| **Katalog Master** | 8 entri (`SYNTHETIC_TEST`) | 183 entri (8 sintetis + 175 GBIF) | Data sintetis awal tetap utuh |
| **Dataset DeepFish (Phase 9)** | ~442 MB (1.290 JSON label, 1 zip citra) | Utuh di `data/public/deepfish/` | Dipertahankan sebagai referensi metodologi |
| **Model YOLO Weights** | Tidak ada (`MODEL_NOT_TRAINED`) | Tidak ada (`MODEL_NOT_TRAINED`) | Tidak ada training prematur tanpa anotasi valid |
| **Struktur Folder GBIF** | Belum ada | `raw/`, `candidate/`, `verified/`, `rejected/` | Terstruktur rapi per spesies |

---

## 3. Metodologi Akuisisi Data GBIF

### 3.1 Endpoint dan Parameter Query

Akuisisi memanfaatkan GBIF Occurrence Search API resmi:
* **Base URL**: `https://api.gbif.org/v1/occurrence/search`
* **Dokumentasi API**: [GBIF Occurrence API OpenAPI Spec](https://techdocs.gbif.org/en/openapi/occurrence)
* **Parameter Query**:
  * `scientificName`: Dijalankan terpisah untuk *Rastrelliger kanagurta* dan *Decapterus macarellus*
  * `mediaType`: `StillImage`
  * `limit`: 300 (batas maksimum per request GBIF)
  * `offset`: Paging otomatis (0, 300, 600) hingga seluruh rekaman terambil

### 3.2 Statistik Penelusuran Metadata API

| Spesies Target | TaxonKey Resmi | Total Occurrence di GBIF | Media StillImage Terekstrak | Unique gbifID Terambil | Negara Asal Dominan |
|---|---|---|---|---|---|
| **Ikan Kembung Lelaki** (*Rastrelliger kanagurta*) | 2374317 | **707** | **937** | 600 | Mesir (279), Kaledonia Baru (122), **Indonesia (122)**, Filipina (122), Fiji (77) |
| **Ikan Layang** (*Decapterus macarellus*) | 2391064 | **256** | **403** | 256 | Amerika Serikat (126), Tidak terdata (74), Afrika Selatan (40), Meksiko (30) |
| **TOTAL** | — | **963** | **1.340** | **856** | Metadata lengkap tersimpan di `gbif_occurrences.csv` |

---

## 4. Audit Lisensi dan Hak Cipta Granular

Audit hak cipta dilakukan per media record dan disimpan pada [`dataset_pipeline/metadata/gbif_license_audit.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_license_audit.csv).

### Distribusi Lisensi Media GBIF:

| Lisensi Terstandarisasi | Jumlah Rekaman | Penggunaan Riset Akademis | Status Kompatibilitas FishGuard AI |
|---|---|---|---|
| **CC BY-NC 4.0** | 961 | Diizinkan (Non-Komersial) | ✅ `COMPATIBLE_ACADEMIC` (Riset ASIK V UPI) |
| **CC BY 4.0** | 168 | Diizinkan Penuh | ✅ `COMPATIBLE_OPEN` |
| **Usage Conditions Apply / Restrictive** | 77 | Perlu Izin Khusus | ❌ `REJECTED_RESTRICTIVE` (Dikecualikan dari kandidat) |
| **CC0 1.0 (Public Domain)** | 76 | Bebas Tanpa Syarat | ✅ `COMPATIBLE_OPEN` |
| **CC BY-NC-ND 4.0** | 26 | Dilarang Modifikasi/Turunan | ⚠️ `RESTRICTIVE_NO_DERIVS` (Hanya referensi visual) |
| **CC BY-NC-SA 4.0 / 3.0** | 20 | Share-Alike Non-Komersial | ✅ `COMPATIBLE_ACADEMIC_SHAREALIKE` |
| **Copyright by Creator / NABU** | 7 | Tertutup | ❌ `REJECTED_UNKNOWN_LICENSE` |
| **CC BY-SA 4.0** | 5 | Share-Alike Terbuka | ✅ `COMPATIBLE_SHAREALIKE` |

> Seluruh citra yang masuk ke status `VERIFIED` atau `CANDIDATE` dipastikan memiliki lisensi terbuka (`CC0`, `CC BY`, `CC BY-NC`) dengan atribusi fotografer/institusi penerbit yang terekam pada metadata master.

---

## 5. Hasil Unduhan Citra Kandidat

Proses unduhan dijalankan menggunakan `ThreadPoolExecutor` (12 concurrent workers) dengan penanganan timeout, verifikasi ukuran berkas minimal (>1 KB), serta pencatatan log HTTP lengkap pada [`dataset_pipeline/metadata/gbif_download_log.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_download_log.csv).

### Statistik Eksekusi Unduhan:

| Metrik Unduhan | *Rastrelliger kanagurta* | *Decapterus macarellus* | Total Gabungan |
|---|---|---|---|
| **Kandidat Diajukan** | 120 | 120 | **240** |
| **Berhasil Diunduh (`SUCCESS`)** | 107 (89,17%) | 100 (83,33%) | **207 (86,25%)** |
| **Gagal Diunduh (`FAILED`)** | 13 (10,83%) | 20 (16,67%) | **33 (13,75%)** |
| **Waktu Unduhan Total** | — | — | 483,08 detik (~8 menit) |
| **Rata-rata Waktu per Berkas** | ~2,1 detik | ~2,4 detik | ~2,3 detik |
| **Ukuran Total Citra Terunduh** | ~142 MB | ~118 MB | **~260 MB** |

**Penyebab Kegagalan Unduhan (33 berkas):**
* HTTP 403 Forbidden / Broken Link pada server repositori museum eksternal tertentu (misalnya server koleksi spesimen lama di luar iNaturalist S3).
* Read Timeout (>25 detik) pada repositori server lambat.
* Seluruh URL gagal dicatat secara transparan pada [`dataset_pipeline/reports/phase_10/download_failed.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/download_failed.csv).

---

## 6. Pemeriksaan Kualitas Citra & Deteksi Duplikasi

Setiap citra yang berhasil diunduh melewati inspeksi komputasi:
1. **Verifikasi Integritas**: Pembukaan berkas via `PIL.Image.verify()` dan dekompresi piksel.
2. **Kriptografi SHA-256**: Deteksi salinan eksak (*exact byte-level duplicate*).
3. **Perceptual dHash (Difference Hash 64-bit)**: Deteksi kemiripan visual (*near duplicate*).
4. **Metrik Ketajaman Optik**: Varian Laplacian OpenCV ($Var(\Delta I)$) untuk mengukur derajat blur.
5. **Dimensi & Rasio Aspek**: Lebar, tinggi, dan rasio $W/H$.

Hasil inspeksi disimpan pada [`dataset_pipeline/metadata/gbif_quality_report.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_quality_report.csv).

### 6.1 Deteksi Duplikasi

* **Exact Duplicates (Identical SHA-256)**: Ditemukan **3 berkas duplikat** (merupakan foto identik yang diunggah ulang pada rekaman occurrence terpisah). Berkas langsung diberi status `REJECTED` dan dialokasikan ke `data/public/gbif/rejected/`.
* **Perceptual Near-Duplicates**: **0 berkas** yang melebihi ambang batas kemiripan dHash tanpa perbedaan sudut pandang.

### 6.2 Distribusi Kualitas Optik

| Tingkat Kualitas | Kriteria | Jumlah Berkas | Persentase |
|---|---|---|---|
| **HIGH** | Resolusi $\ge 1200 \times 800$ px, Laplacian variance $\ge 50.0$ | 158 citra | 76,3% |
| **MEDIUM** | Resolusi $\ge 600 \times 400$ px, Laplacian variance $\ge 25.0$ | 29 citra | 14,0% |
| **LOW** | Resolusi $< 400 \times 300$ px atau blur parah ($Var < 15.0$) | 20 citra | 9,7% |

---

## 7. Klasifikasi dan Kurasi Dataset Akhir

Berdasarkan integrasi status taksonomi, basis rekaman, lisensi, lokasi geografis, dan ketajaman visual, setiap citra dikurasi ke dalam salah satu dari empat status:

| Status Kurasi | *Rastrelliger kanagurta* | *Decapterus macarellus* | Total | Keterangan & Tindak Lanjut |
|---|---|---|---|---|
| **`VERIFIED`** | **75** | **0** | **75** | Spesimen terkonfirmasi dari perairan Indonesia dengan taksonomi `ACCEPTED`, lisensi terbuka, dan kualitas tajam. Disalin ke `data/public/gbif/verified/`. |
| **`CANDIDATE`** | **20** | **80** | **100** | Spesimen valid dari perairan internasional atau spesimen museum berformalin. Layak sebagai referensi visual morfologi. Disalin ke `data/public/gbif/candidate/`. |
| **`NEEDS_REVIEW`** | **10** | **16** | **26** | Spesimen dengan blur tinggi, status taksonomi `SYNONYM`, atau sudut pandang ambigu. Didaftarkan ke `reports/phase_10/expert_review_needed.csv`. |
| **`REJECTED`** | **2** | **4** | **6** | Duplikat eksak, lisensi tidak kompatibel, atau resolusi di bawah batas minimal. Dipindahkan ke `data/public/gbif/rejected/`. |
| **TOTAL TERUNDUH** | **107** | **100** | **207** | — |

> [!NOTE]
> Mengapa *Decapterus macarellus* memiliki 0 `VERIFIED`?  
> Seluruh rekaman *D. macarellus* dari GBIF berasal dari perairan non-Indonesia (Amerika Serikat, Meksiko, Pasifik Tengah) atau berupa spesimen awetan museum (*preserved specimen* dalam toples alkohol/formalin). Sesuai prinsip kehati-hatian ilmiah, seluruh spesimen ini dikategorikan sebagai **`CANDIDATE`** (80 citra) atau **`NEEDS_REVIEW`** (16 citra), dan tidak dinyatakan `VERIFIED` sebelum diverifikasi morfometriknya oleh ahli iktiologi lokal.

---

## 8. Pembaruan Katalog Master (`dataset_master.csv`)

Katalog master diperbarui secara terprogram dengan ketentuan:
1. **Zero Data Loss**: 8 baris citra sintetis awal (`IMG-SYNTH-001` s/d `IMG-VAR-006`) **tetap dipertahankan 100%**.
2. **Kandidat GBIF yang Memenuhi Syarat**: Sebanyak **175 berkas** (75 `VERIFIED` + 100 `CANDIDATE`) ditambahkan dengan skema 25 kolom lengkap.
3. Total baris aktif pada [`dataset_pipeline/metadata/dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv): **183 baris**.

---

## 9. Contact Sheet Visual Inspeksi

Sebagai fasilitas inspeksi visual cepat, contact sheet beresolusi tinggi telah digenerate:
* **Kembung Lelaki**: [`dataset_pipeline/reports/phase_10/contact_sheet_rkan.jpg`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/contact_sheet_rkan.jpg) (Grid 4x5 menampilkan 20 sampel utama *R. kanagurta*)
* **Ikan Layang**: [`dataset_pipeline/reports/phase_10/contact_sheet_dmac.jpg`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/contact_sheet_dmac.jpg) (Grid 4x5 menampilkan 20 sampel utama *D. macarellus*)

---

## 10. Keterbatasan Ilmiah Dataset GBIF & Kesiapan Pelatihan

Meskipun Phase 10 berhasil mengumpulkan 207 citra nyata berlisensi resmi, evaluasi kritis menunjukkan:

1. **Domain Mismatch Substantial**: Sebagian besar citra GBIF merupakan foto *underwater* saat ikan berenang di alam liar (*in-situ observation*) atau spesimen awetan museum (*preserved jar specimens*). Hal ini berbeda signifikan dengan skenario operasional FishGuard AI: **ikan mati di atas nampan sortir atau papan ukur TPI Karangantu**.
2. **Ketiadaan Bounding Box & Label Keypoint**: GBIF adalah repositori biodiversitas, bukan repositori computer vision beranotasi. Belum ada bounding box YOLO maupun titik moncong/ekor.
3. **Ketiadaan Kalibrasi Skala Panjang**: Citra GBIF tidak menyertakan penanda skala fisik (ArUco marker atau penggaris kalibrasi) yang diperlukan untuk modul *Length Estimation*.

### Rekomendasi Langkah Selanjutnya (Phase 11):
1. **Pelaksanaan Pengambilan Data Lapangan Teluk Banten**: Mengikuti SOP ketat pada [`field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md) di TPI Karangantu (target: 200 foto kembung + 200 foto layang di atas papan ukur standar).
2. **Anotasi Bounding Box YOLO**: Anotasi manual ortogonal menggunakan format YOLOv8 standard (label 0: kembung, label 1: layang).
3. **Pemanfaatan Citra GBIF**: Digunakan sebagai data augmentasi latar belakang (*domain generalization*) atau uji ketahanan *out-of-distribution* (OOD), bukan dataset latih primer.

---

## 11. Daftar Artefak yang Dihasilkan pada Phase 10

1. 📄 **Laporan Akuisisi & Kurasi**: [`documentation/phase_10_dataset_acquisition_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_10_dataset_acquisition_report.md)
2. 📊 **Metadata Occurrence GBIF**: [`dataset_pipeline/metadata/gbif_occurrences.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_occurrences.csv) (1.340 baris)
3. 📥 **Log Unduhan HTTP**: [`dataset_pipeline/metadata/gbif_download_log.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_download_log.csv) (240 rekaman)
4. ⚖️ **Audit Lisensi Granular**: [`dataset_pipeline/metadata/gbif_license_audit.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_license_audit.csv) (1.340 rekaman)
5. 🔍 **Laporan Kualitas & Duplikasi**: [`dataset_pipeline/metadata/gbif_quality_report.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/gbif_quality_report.csv) (207 citra teruji)
6. 🗃️ **Katalog Master Terkini**: [`dataset_pipeline/metadata/dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv) (183 entri aktif)
7. 📈 **Ringkasan Eksekusi JSON**: [`dataset_pipeline/reports/phase_10/phase_10_summary.json`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/phase_10_summary.json)
8. 🖼️ **Contact Sheet Kembung**: [`dataset_pipeline/reports/phase_10/contact_sheet_rkan.jpg`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/contact_sheet_rkan.jpg)
9. 🖼️ **Contact Sheet Layang**: [`dataset_pipeline/reports/phase_10/contact_sheet_dmac.jpg`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/contact_sheet_dmac.jpg)
10. ⚠️ **Daftar Rekomendasi Uji Ahli**: [`dataset_pipeline/reports/phase_10/expert_review_needed.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/expert_review_needed.csv) (26 berkas)
11. ❌ **Daftar Unduhan Gagal**: [`dataset_pipeline/reports/phase_10/download_failed.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_10/download_failed.csv) (33 berkas)

---

*Laporan ini disusun berdasarkan eksekusi nyata pipeline pengunduhan dan analisis komputasi citra. Tidak ada data sintetis yang diklaim sebagai spesimen nyata.*  
*FishGuard AI Research Team — ASIK V, Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
