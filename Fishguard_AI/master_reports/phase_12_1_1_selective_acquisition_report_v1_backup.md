# PHASE 12.1.1 — SELECTIVE PUBLIC IMAGE ACQUISITION REPORT
## Proyek: FishGuard AI — ASIK V
**Lokasi Referensi Operasional:** Pelabuhan Perikanan Nusantara (PPN) Karangantu, Kota Serang, Banten  
**Fokus Target Ruang Lingkup MVP:**
1. Identifikasi Spesies Ikan (*Species Identification*)
2. Penghitungan Jumlah Individu (*Fish Counting*)
3. Analisis Komposisi Hasil Tangkapan (*Catch Composition Analysis*)  
*(Catatan Teknis: Estimasi panjang dan estimasi bobot secara tegas DIEKSKLUSI dari ruang lingkup MVP)*

**Target Spesies MVP (Terkunci Ketat):**
- **Class 0:** *Rastrelliger brachysoma* (Kembung Perempuan)
- **Class 1:** *Selaroides leptolepis* (Selar Kuning)
- **Class 2:** *Upeneus sulphureus* (Kuniran)

---

## 1. RINGKASAN EKSEKUTIF DAN STATUS GATE

Phase 12.1.1 (Selective Public Image Acquisition) telah berhasil dilaksanakan untuk merealisasikan pengunduhan terkontrol terhadap kandidat prioritas P1 dan P2 yang telah lolos audit integritas Phase 12.1.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      STATUS GATE PHASE 12.1.1                              │
├────────────────────────────────────────────────────────────────────────────┤
│  STATUS OPERASIONAL            : PARTIALLY_COMPLETED                       │
│  TOTAL KANDIDAT DIPROSES       : 22 RECORD (P1: 3, P2: 19)                 │
│  BERHASIL DIUNDUH & VERIFIKASI : 21 GAMBAR (95.5%)                         │
│  GAGAL DIUNDUH (SERVER ERROR)  : 1 GAMBAR (FG-C0-009, 0-BYTE RESPONSE)     │
│  DIKARANTINA (QUARANTINE)      : 1 GAMBAR (FG-C1-019, UNDERWATER DIVE)     │
│  REFERENSI BERSIH TERVERIFIKASI: 20 GAMBAR (10 CLASS 0, 10 CLASS 1)       │
│  DITAHAN KARENA TAKSONOMI      : 10 RECORD (CLASS 2, UIBLEIN ET AL. 2025)  │
│  KELAYAKAN TRAINING YOLO       : STRICT NO-GO (DILARANG UNTUK TRAINING)    │
└────────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> **BATASAN PENGGUNAAN MUTLAK:**  
> Seluruh gambar publik yang diperoleh dalam fase ini **HANYA DIGUNAKAN SEBAGAI REFERENSI MORFOLOGI DAN BENCHMARK VISUAL LABORATORIUM**. Gambar-gambar ini **DILARANG KERAS** untuk dilatihkan ke model YOLO (*STRICT NO-GO FOR TRAINING*), dilarang dibuatkan `dataset.yaml`, dan dilarang dibuatkan partisi train/val/test split. Seluruh data latih FishGuard AI wajib bersumber dari data primer sampling tegak lurus 90° di PPN Karangantu.

---

## 2. REKAPITULASI KUANTITATIF AKUISISI

| Metrik Evaluasi | Target / Jumlah | Persentase | Keterangan & Rincian |
|---|:---:|:---:|---|
| **Total Kandidat Awal** | **22** | 100.0% | 3 kandidat P1 (CC0) + 19 kandidat P2 (non-komersial riset). |
| **Lolos Verifikasi Pra-Akuisisi** | **22** | 100.0% | Seluruh 22 record tervalidasi hak cipta dan URL dasarnya. |
| **Gambar Berhasil Diunduh** | **21** | 95.5% | 10 record Class 0 + 11 record Class 1. |
| **Gambar Gagal Diunduh** | **1** | 4.5% | `FG-C0-009`: Server FishBase mengembalikan respons kosong 0-byte. |
| **Gambar Masuk Karantina** | **1** | 4.5% | `FG-C1-019`: Foto bawah air (*underwater*) di Tulamben Bali. |
| **Referensi Bersih Lolos QC** | **20** | 90.9% | 10 record Class 0 + 10 record Class 1 (foto spesimen darat). |
| **Ditahan karena Taksonomi** | **10** | — | Seluruh 10 kandidat Class 2 (*Upeneus sulphureus*) ditahan di `TAXONOMY_REVIEW`. |
| **Ditahan karena Lisensi** | **41** | — | 41 record inventaris berlisensi Tier D (*All Rights Reserved*) tetap tidak disentuh. |

---

## 3. DISTRIBUSI HASIL PER SPESIES TARGET

```
Distribusi Koleksi Citra Referensi Publik:
├── Class 0 (Rastrelliger brachysoma)
│   ├── Target Kandidat     : 11 record
│   ├── Berhasil Diunduh    : 10 gambar (1 P1 Open + 9 P2 Research)
│   ├── Gagal Diunduh       : 1 record (FG-C0-009)
│   └── Status Koleksi      : 10 referensi morfologi bersih
├── Class 1 (Selaroides leptolepis)
│   ├── Target Kandidat     : 11 record
│   ├── Berhasil Diunduh    : 11 gambar (2 P1 Open + 9 P2 Research)
│   ├── Masuk Karantina     : 1 gambar (FG-C1-019, underwater dive domain)
│   └── Status Koleksi      : 10 referensi morfologi bersih + 1 karantina
└── Class 2 (Upeneus sulphureus)
    ├── Target Kandidat     : 10 record (1 P1, 9 P2)
    ├── Status Unduh        : 0 diunduh (STRICT HOLD)
    └── Alasan Penahanan    : Terikat revisi taksonomi Uiblein et al. (Agustus 2025)
```

---

## 4. DISTRIBUSI LISENSI & KETENTUAN PENGGUNAAN

Distribusi status lisensi dari 21 gambar yang berhasil diunduh tercatat dalam `phase_12_1_1_license_attribution_register.csv`:

| Kategori Lisensi | Jumlah Gambar | Record ID | Hak Cipta / Kontributor | Ketentuan Penggunaan Legal |
|---|:---:|---|---|---|
| **Tier A: CC0 1.0 Universal** | **3** | `FG-C0-018`, `FG-C1-031`, `FG-C1-032` | Judgefloro (Wikimedia Commons) | Dedikasi Domain Publik; bebas digunakan tanpa pembatasan hak cipta komersial/non-komersial. |
| **Tier B: CC BY-NC 4.0** | **4** | `FG-C0-011`, `FG-C0-012`, `FG-C0-013`, `FG-C0-015` | Kontributor iNaturalist Open Data | Riset akademik non-komersial; wajib atribusi fotografer & ID observasi. |
| **Tier B: CC BY-SA 4.0** | **1** | `FG-C0-014` | Ong Jyh Seng (iNaturalist) | Wajib atribusi fotografer & pemenuhan klausul Share-Alike. |
| **Tier B: CC BY-NC-SA 4.0**| **2** | `FG-C0-016`, `FG-C0-017` | Sutthikhun Phaengphongsai (iNaturalist)| Riset non-komersial; wajib atribusi & klausul Share-Alike. |
| **Tier B: FishBase User (CC-BY/NC)** | **11** | `FG-C0-006`, `FG-C0-008`, `FG-C1-007`, `FG-C1-017`, `FG-C1-019`, `FG-C1-020`, `FG-C1-021`, `FG-C1-022`, `FG-C1-026`, `FG-C1-028`, `FG-C1-029` | Pengguna FishBase (fatma, rif, Osmany, Ratmuangkhwang, Charoensuk, dll.) | Digunakan strictly untuk riset internal laboratorium kampus; wajib menyertakan nama kontributor & sumber FishBase. |

---

## 5. PENANGANAN KENDALA TEKNIS & RESOLUSI URL AKSES RESMI

Selama proses pra-akuisisi dan pengunduhan, tim berhasil menyelesaikan beberapa kendala akses tanpa melakukan bypass ilegal:

### 5.1 Resolusi Akses Resmi `FG-C0-018` (Judgefloro - Kembung Perempuan)
- **Kendala Awal:** URL cermin EOL (`content.eol.org`) mengembalikan `HTTP 403 Forbidden` akibat proteksi anti-hotlink.
- **Solusi Resmi:** Dilakukan penelusuran asal usul (*provenance*) ke basis data primer Wikimedia Commons melalui MediaWiki API resmi. Ditemukan berkas asli: `File:8683Photos taken 2020 coronavirus pandemic Baliuag, Bulacan 28.jpg` dengan lisensi CC0 1.0 Universal karya Judgefloro.
- **Hasil:** Berhasil mengunduh berkas asli beresolusi penuh $4608 \times 3456$ piksel (ukuran 6,92 MB) langsung dari server Wikimedia Commons tanpa melanggar proteksi apa pun.

### 5.2 Resolusi Akses Resmi `FG-C1-031` & `FG-C1-032` (Judgefloro - Selar Kuning)
- **Kendala Awal:** URL cermin OsmAnd (`download.osmand.net`) mengembalikan `HTTP 404 Not Found`.
- **Solusi Resmi:** Dilakukan query metadata MediaWiki API untuk judul berkas `File:1401Salay_salay_batang_Yellowstripe_scad_10.jpg` dan `...35.jpg`. Kedua berkas ditemukan dalam kondisi aktif di Wikimedia Commons.
- **Hasil:** Berhasil mengunduh kedua berkas beresolusi penuh $4608 \times 3456$ piksel (ukuran 6,35 MB dan 5,35 MB) dengan lisensi resmi CC0 1.0.

### 5.3 Optimalisasi Resolusi Asli iNaturalist S3 Open Data
- **Kendala Awal:** URL yang tercantum pada inventaris awal hanya mengarah pada thumbnail kecil (`small.jpeg`, 240 piksel, ~25 KB).
- **Solusi:** Memanfaatkan arsitektur penyimpanan resmi iNaturalist Open Data di AWS S3 dengan meminta varian `original.jpeg` / `original.jpg`.
- **Hasil:** Seluruh 7 citra iNaturalist (`FG-C0-011` s.d. `FG-C0-017`) berhasil diperoleh dalam resolusi kamera asli ($2048 \times 1365$ hingga $2048 \times 2048$ piksel) dengan ukuran file 721 KB hingga 2,63 MB.

### 5.4 Penanganan Kegagalan Unduh `FG-C0-009` (Sahat Ratmuangkhwang)
- **Temuan Fisik:** Permintaan HTTP ke endpoint FishBase `https://fishbase.se/tools/display_image.php?fw=n&imgName=1486612840_172.68.106.90.jpeg` menghasilkan respons kosong (`Content-Length: 0`, body 0 byte).
- **Tindakan Auditor:** Dicatat secara transparan sebagai kegagalan teknis server backend pada `phase_12_1_1_download_failures.csv`. Tim menolak secara tegas untuk mengganti file dengan gambar spekulatif dari internet.

### 5.5 Deteksi Domain Bawah Air & Karantina `FG-C1-019`
- **Temuan Fisik:** Foto karya Carlos Faria diambil di lokasi penyelaman Tulamben, Bali. Analisis nilai piksel rata-rata menunjukkan dominasi spektrum biru-hijau yang ekstrem ($R=43,6, G=118,7, B=102,3$).
- **Tindakan Auditor:** Foto dipindahkan dari folder kelas utama ke folder `quarantine/FG-C1-019_1_selaroides_leptolepis.jpg` karena domain bawah air (*underwater diving photo*) tidak relevan dengan sistem inspeksi ikan di atas meja sortir TPI.

---

## 6. INVENTARISASI HASH SHA-256 & ANALISIS DUPLIKASI

### 6.1 Keunikan Biner (Zero Binary Duplication)
Pengujian kriptografis SHA-256 terhadap seluruh 21 berkas gambar yang berhasil diunduh menunjukkan:
$$\text{Total File Unik SHA-256} = 21 \quad (\text{Duplikasi Biner} = 0,0\%)$$
Tidak ditemukan adanya file identik atau file yang terunduh ganda.

### 6.2 Klaster Observasi & Spesimen yang Sama
Meskipun file binernya berbeda (sudut pemotretan berbeda), metadata biologis mencatat adanya keterkaitan spesimen:
1. **Klaster `DUP-INAT-4f48550b`:** Record `FG-C0-016` (SHA256: `c5eb3a15e9dc...`) dan `FG-C0-017` (SHA256: `9b4ca1e3c4db...`) merupakan dua sudut foto dari satu observasi individu kembung perempuan yang sama di Thailand oleh Sutthikhun Phaengphongsai.
2. **Klaster `DUP-OSMANY-20130318`:** Record `FG-C1-020` (SHA256: `e81605582df0...`) dan `FG-C1-021` (SHA256: `feac247b4189...`) merupakan foto spesimen selar kuning 16 cm bertanggal 18 Maret 2013 di Pelabuhan Karachi oleh H.B. Osmany.
3. **Klaster `DUP-OSMANY-20130625`:** Record `FG-C1-022` (SHA256: `687d9576f04e...`) merupakan foto spesimen 13 cm bertanggal 25 Juni 2013 di Karachi.

> [!IMPORTANT]
> Jika data ini di masa depan dijadikan acuan benchmarking analitik, anggota dalam klaster yang sama **wajib dikelompokkan bersama (*Group Partitioning*)** untuk mencegah kebocoran informasi visual antarpartisi evaluasi.

---

## 7. AUDIT KUALITAS CITRA & KESENJANGAN DOMAIN OPERASIONAL

Hasil audit kendali mutu pada `phase_12_1_1_image_quality_audit.csv` menyimpulkan:
1. **Integritas Format Berkas:** Seluruh 21 berkas lolos validasi `PIL.Image.verify()` sebagai berkas JPEG RGB yang valid (tidak ada file korup atau file teks/HTML yang tersamar).
2. **Kualitas Resolusi:**
   - Resolusi Tinggi ($\ge 3000$ px): 5 gambar ($4608 \times 3456$ dan $3984 \times 2656$).
   - Resolusi Menengah ($1500 - 2048$ px): 10 gambar.
   - Resolusi Standar ($600 - 1024$ px): 6 gambar.
3. **Karakteristik Tipe Skenario:**
   - 20 gambar menampilkan **ikan tunggal terisolasi (*single specimen*)** di atas meja laboratorium, papan potong, atau dipegang tangan.
   - **NOL (0) gambar** yang menampilkan tumpukan ikan multi-spesies campur (*dense clutter*), lendir, es curah, atau pencahayaan khas TPI Karangantu.

---

## 8. STRUKTUR ARSIP FISIK BERKAS HASIL AKUISISI

```
dataset_pipeline/
├── public_reference_images/
│   ├── class_0_rastrelliger_brachysoma/       [10 files, total 18.7 MB]
│   │   ├── FG-C0-006_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-008_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-011_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-012_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-013_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-014_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-015_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-016_0_rastrelliger_brachysoma.jpg
│   │   ├── FG-C0-017_0_rastrelliger_brachysoma.jpg
│   │   └── FG-C0-018_0_rastrelliger_brachysoma.jpg
│   ├── class_1_selaroides_leptolepis/         [10 files, total 18.8 MB]
│   │   ├── FG-C1-007_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-017_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-020_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-021_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-022_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-026_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-028_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-029_1_selaroides_leptolepis.jpg
│   │   ├── FG-C1-031_1_selaroides_leptolepis.jpg
│   │   └── FG-C1-032_1_selaroides_leptolepis.jpg
│   ├── class_2_upeneus_sulphureus/            [0 files, held in TAXONOMY_REVIEW]
│   ├── ood_reference/                         [0 files]
│   ├── quarantine/                            [1 file, 903 KB]
│   │   └── FG-C1-019_1_selaroides_leptolepis.jpg
│   └── public_reference_image_manifest.csv    [21 records]
└── reports/
    └── phase_12_1_1/
        ├── phase_12_1_1_selective_acquisition_report.md
        ├── public_reference_image_manifest.csv
        ├── phase_12_1_1_download_failures.csv
        ├── phase_12_1_1_license_attribution_register.csv
        └── phase_12_1_1_image_quality_audit.csv
```

---

## 9. KESIMPULAN DAN REKOMENDASI TAHAP SELANJUTNYA

### 9.1 Kesimpulan
1. **Akuisisi Terkendali Selesai:** Telah terkumpul 20 citra referensi morfologi terverifikasi (10 kembung perempuan dan 10 selar kuning) beserta 1 citra karantina bawah air. Seluruh aset memiliki provenance, hash SHA-256, dan atribusi lisensi yang tercatat secara permanen.
2. **Keterbatasan Mutlak Data Publik:** Ketiadaan citra kuniran (*Upeneus sulphureus*) yang tervalidasi taksonomi dan ketiadaan foto tumpukan operasional TPI membuktikan secara ilmiah bahwa dataset publik **tidak dapat menggantikan pengambilan data primer lapangan**.
3. **Integritas Riset Terjaga:** Tidak ada gambar yang dipaksakan, tidak ada scraping agresif, dan tidak ada training spekulatif.

### 9.2 Rekomendasi Tahap Selanjutnya
1. **Fokus Penuh pada Verifikasi Fisik Pra-Penerbangan (Phase 11.7.2):** Menyiapkan pengujian fisik rig kamera dengan sensor APS-C lensa 35mm pada jarak kerja 90 cm serta papan kalibrasi ArUco 50 mm di laboratorium SIK UPI Kampus Serang.
2. **Pelaksanaan Ekspedisi Pilot Sampling di PPN Karangantu:** Mengumpulkan 45 spesimen primer unik (15 spesimen per spesies) dengan sudut pengambilan tegak lurus 90° sebagai fondasi dataset training pertama yang sah bagi FishGuard AI.

---
*Laporan ini disusun secara objektif dan berbasis bukti fisik artefak repositori oleh Tim Multidisiplin FishGuard AI — ASIK V.*
