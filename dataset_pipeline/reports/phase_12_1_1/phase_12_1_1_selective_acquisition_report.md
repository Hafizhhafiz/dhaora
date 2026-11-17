# PHASE 12.1.1 — SELECTIVE PUBLIC IMAGE ACQUISITION REPORT (RECONCILED)
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

Phase 12.1.1 (Selective Public Image Acquisition) telah berhasil dilaksanakan dan diaudit rekonsiliasinya secara tuntas.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      STATUS GATE PHASE 12.1.1                              │
├────────────────────────────────────────────────────────────────────────────┤
│  STATUS OPERASIONAL FASE       : COMPLETED (FULLY RECONCILED)              │
│  TOTAL KANDIDAT AKUISISI       : 22 RECORD (11 CLASS 0 + 11 CLASS 1)       │
│  BERHASIL DIUNDUH & VERIFIKASI : 21 GAMBAR (95.5%)                         │
│  GAGAL DIUNDUH (SERVER ERROR)  : 1 GAMBAR (FG-C0-009, 0-BYTE RESPONSE)     │
│  DIKARANTINA (QUARANTINE)      : 1 GAMBAR (FG-C1-019, UNDERWATER DIVE)     │
│  REFERENSI BERSIH TERVERIFIKASI: 20 GAMBAR (10 CLASS 0 + 10 CLASS 1)       │
│  KELOMPOK TERPISAH (CLASS 2)   : 10 RECORD (DITAHAN DI TAXONOMY_REVIEW)    │
│  KELAYAKAN TRAINING YOLO       : STRICT NO-GO (DILARANG UNTUK TRAINING)    │
└────────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> **BATASAN PENGGUNAAN MUTLAK:**  
> Seluruh 20 gambar referensi publik yang diperoleh dalam fase ini **HANYA DIGUNAKAN SEBAGAI REFERENSI MORFOLOGI DAN BENCHMARK VISUAL LABORATORIUM**. Gambar-gambar ini **DILARANG KERAS** untuk dilatihkan ke model YOLO (*STRICT NO-GO FOR TRAINING*), dilarang dibuatkan `dataset.yaml`, dan dilarang dibuatkan partisi train/val/test split. Seluruh data latih FishGuard AI wajib bersumber dari data primer sampling tegak lurus 90° di PPN Karangantu.

---

## 2. REKAPITULASI KUANTITATIF & REKONSILIASI KANDIDAT

### 2.1 Pemisahan Kelompok Kandidat
1. **Kelompok Kandidat Akuisisi (22 Record):**
   - Terdiri dari 11 kandidat Class 0 (*Rastrelliger brachysoma*) dan 11 kandidat Class 1 (*Selaroides leptolepis*) yang berstatus `READY_FOR_REVIEW` pada prioritas P1 dan P2.
   - Hanya 22 kandidat ini yang dieksekusi proses pengunduhannya pada Phase 12.1.1.
2. **Kelompok Terpisah yang Ditahan Taksonomi (10 Record Class 2 — *Upeneus sulphureus*):**
   - Terdiri dari `FG-C2-019` (P1) serta `FG-C2-010`–`014` dan `FG-C2-020`–`023` (P2).
   - **Bukan bagian dari 22 kandidat akuisisi.** Seluruh 10 record kuniran ini dipisahkan dan ditahan secara ketat di status `HOLD_PENDING_TAXONOMY_REVIEW` akibat revisi taksonomi Uiblein et al. (Agustus 2025).

### 2.2 Tabel Rekapitulasi Metrik
| Metrik Evaluasi | Target / Jumlah | Persentase | Keterangan & Rincian Relasional |
|---|:---:|:---:|---|
| **Total Kandidat Akuisisi Dieksekusi** | **22** | 100.0% | 11 Class 0 + 11 Class 1 (3 P1 CC0 + 19 P2 non-komersial riset). |
| **Lolos Verifikasi Pra-Akuisisi** | **22** | 100.0% | Seluruh 22 record tervalidasi hak cipta dan URL dasarnya. |
| **Gambar Berhasil Diunduh** | **21** | 95.5% | 10 record Class 0 + 11 record Class 1. |
| **Gambar Gagal Diunduh** | **1** | 4.5% | `FG-C0-009`: Server FishBase mengembalikan respons kosong 0-byte. |
| **Gambar Masuk Karantina** | **1** | 4.5% | `FG-C1-019`: Foto bawah air (*underwater*) di Tulamben Bali. |
| **Referensi Bersih Lolos QC** | **20** | 90.9% | 10 record Class 0 + 10 record Class 1 (foto spesimen darat). |
| **Kelompok Ditahan karena Taksonomi** | **10** | — | Seluruh 10 kandidat Class 2 (*Upeneus sulphureus*) terpisah di `TAXONOMY_REVIEW`. |
| **Ditahan karena Status Lisensi** | **41** | — | 41 record berstatus `PERMISSION_REQUIRED` (bagian dari 52 record Tier D master inventaris). |

---

## 3. DISTRIBUSI HASIL PER SPESIES TARGET

```
Distribusi Koleksi Citra Referensi Publik:
├── Kelompok Dieksekusi Akuisisi (22 Kandidat)
│   ├── Class 0 (Rastrelliger brachysoma)
│   │   ├── Target Kandidat     : 11 record
│   │   ├── Berhasil Diunduh    : 10 gambar (1 P1 Open + 9 P2 Research)
│   │   ├── Gagal Diunduh       : 1 record (FG-C0-009, 0-byte server backend)
│   │   └── Status Koleksi      : 10 referensi morfologi bersih
│   └── Class 1 (Selaroides leptolepis)
│       ├── Target Kandidat     : 11 record
│       ├── Berhasil Diunduh    : 11 gambar (2 P1 Open + 9 P2 Research)
│       ├── Masuk Karantina     : 1 gambar (FG-C1-019, underwater dive domain)
│       └── Status Koleksi      : 10 referensi morfologi bersih + 1 karantina
└── Kelompok Terpisah Ditahan (10 Kandidat)
    └── Class 2 (Upeneus sulphureus)
        ├── Target Terdaftar    : 10 record (1 P1, 9 P2 pada prioritas)
        ├── Status Unduh        : 0 diunduh (STRICT HOLD)
        └── Alasan Penahanan    : Terikat revisi taksonomi Uiblein et al. (Agustus 2025)
```

---

## 4. REKONSILIASI LISENSI & KETENTUAN PENGGUNAAN

### 4.1 Rekonsiliasi 52 Record Tier D vs 41 Record Permission Required
Pemeriksaan silang master inventaris (91 record) menunjukkan:
- **Total Record Berlisensi Tier D (`D_NONE_OR_RESERVED`): 52 record**.
  - **41 record** berstatus `PERMISSION_REQUIRED` (foto ikan darat sah di FishBase di mana hak cipta dilindungi penuh oleh fotografer). Inilah angka 41 yang dilaporkan ditahan karena lisensi.
  - **7 record** berstatus `REJECTED` (ilustrasi morfologi/prangko pos/stargazer Uranoscopus).
  - **4 record** berstatus `OOD_REFERENCE` (spesies di luar taksa target).
  - Total: $41 + 7 + 4 = 52$ record.

### 4.2 Distribusi Lisensi 21 Gambar Terunduh
| Kategori Lisensi | Jumlah Gambar | Record ID | Hak Cipta / Kontributor | Ketentuan Penggunaan Legal |
|---|:---:|---|---|---|
| **Tier A: CC0 1.0 Universal** | **3** | `FG-C0-018`, `FG-C1-031`, `FG-C1-032` | Judgefloro (Wikimedia Commons) | Dedikasi Domain Publik; bebas digunakan tanpa pembatasan hak cipta. |
| **Tier B: CC BY-NC 4.0** | **4** | `FG-C0-011`, `FG-C0-012`, `FG-C0-013`, `FG-C0-015` | Kontributor iNaturalist Open Data | Riset akademik non-komersial; wajib atribusi fotografer & ID observasi. |
| **Tier B: CC BY-SA 4.0** | **1** | `FG-C0-014` | Ong Jyh Seng (iNaturalist) | Wajib atribusi fotografer & Share-Alike. |
| **Tier B: CC BY-NC-SA 4.0**| **2** | `FG-C0-016`, `FG-C0-017` | Sutthikhun Phaengphongsai (iNaturalist)| Riset non-komersial; wajib atribusi & Share-Alike. |
| **Tier B: FishBase User (CC-BY/NC)** | **11** | `FG-C0-006`, `FG-C0-008`, `FG-C1-007`, `FG-C1-017`, `FG-C1-019`, `FG-C1-020`, `FG-C1-021`, `FG-C1-022`, `FG-C1-026`, `FG-C1-028`, `FG-C1-029` | Pengguna FishBase (fatma, rif, Osmany, Ratmuangkhwang, Charoensuk, dll.) | Digunakan strictly untuk riset internal laboratorium kampus; wajib menyertakan nama kontributor & sumber FishBase. |

### 4.3 Dokumentasi Ambiguitas Lisensi FishBase User
Pada halaman FishBase ID=109 dan ID=388, teks takarir mencantumkan "CC-BY" atau "CC-BY-NC", namun seluruh hyperlink menunjuk ke URL generik `http://creativecommons.org/licenses/by-nc/4.0/`. Sesuai asas kehati-hatian, seluruh citra FishBase User diperlakukan secara konservatif sebagai **Riset Non-Komersial (Tier B)** dengan atribusi wajib.

---

## 5. PENANGANAN KENDALA TEKNIS & RESOLUSI URL AKSES RESMI

1. **Resolusi Akses Resmi `FG-C0-018` (Judgefloro - Kembung Perempuan):** EOL mirror mengembalikan `HTTP 403 Forbidden`. Dilakukan penelusuran resmi ke basis data primer Wikimedia Commons via MediaWiki API. Berkas asli: `File:8683Photos taken 2020 coronavirus pandemic Baliuag, Bulacan 28.jpg` (CC0 1.0 Universal). Berhasil diunduh dalam resolusi penuh $4608 \times 3456$ px (6,92 MB).
2. **Resolusi Akses Resmi `FG-C1-031` & `FG-C1-032` (Judgefloro - Selar Kuning):** OsmAnd mirror mengembalikan `HTTP 404 Not Found`. Berkas asli ditemukan di Wikimedia Commons: `File:1401Salay_salay_batang_Yellowstripe_scad_10.jpg` dan `...35.jpg`. Berhasil diunduh dalam resolusi penuh $4608 \times 3456$ px (6,35 MB & 5,35 MB).
3. **Optimalisasi Resolusi Asli iNaturalist S3 Open Data:** Endpoint inventaris awal hanya mengarah pada thumbnail kecil (`small.jpeg`, 240 px, ~25 KB). Dilakukan permintaan ke varian `original.jpeg` / `original.jpg` pada bucket S3 iNaturalist Open Data. Berhasil memperoleh 7 citra resolusi kamera asli ($2048 \times 1365$ s.d. $2048 \times 2048$ px, 721 KB s.d. 2,63 MB).
4. **Penanganan Kegagalan Unduh `FG-C0-009` (Sahat Ratmuangkhwang):** Endpoint FishBase mengembalikan body kosong 0 byte (`Content-Length: 0`). Dicatat transparan pada `phase_12_1_1_download_failures.csv` tanpa mengarang aset pengganti.
5. **Deteksi Domain Bawah Air & Karantina `FG-C1-019`:** Foto Carlos Faria di Tulamben Bali memiliki nilai piksel $R=43,6, G=118,7, B=102,3$ khas foto selam bawah air. Dipindahkan ke folder `quarantine/` karena domain visual underwater tidak relevan dengan inspeksi ikan di TPI.

---

## 6. INVENTARISASI HASH SHA-256 VS INDIVIDU SPESIMEN BIOLOGIS

> [!WARNING]
> **PENEGASAN TAKSONOMI & INTEGRITAS DATA:**  
> **Keunikan hash kriptografis SHA-256 hanya menjamin integritas file transfer biner bebas korupsi dan bebas file kembar di penyimpanan disk. Keunikan hash SHA-256 TIDAK BOLEH disamakan dengan keunikan individu spesimen biologis!**

Pemeriksaan spesimen biologis mengidentifikasi 3 klaster keterkaitan individu:
1. **Klaster `DUP-INAT-4f48550b`:**
   - `FG-C0-016` (SHA256: `c5eb3a15e9dc...`) dan `FG-C0-017` (SHA256: `9b4ca1e3c4db...`).
   - Merupakan dua sudut foto dari **satu individu kembung perempuan yang sama** di Thailand oleh Sutthikhun Phaengphongsai.
2. **Klaster `DUP-OSMANY-20130318`:**
   - `FG-C1-020` (SHA256: `e81605582df0...`) dan `FG-C1-021` (SHA256: `feac247b4189...`).
   - Merupakan dua sudut foto dari **satu spesimen selar kuning 16 cm yang sama** di Pelabuhan Karachi bertanggal 18 Maret 2013 oleh Hamid Badar Osmany.
3. **Klaster `DUP-OSMANY-20130625` (Status Terpisah `FG-C1-022` vs `FG-C1-023`):**
   - Dua foto spesimen selar kuning 13 cm bertanggal 25 Juni 2013 di Karachi oleh fotografer yang sama (Hamid Badar Osmany).
   - **`FG-C1-022`**: Memiliki label teks "CC-BY" pada FishBase $\rightarrow$ Tier B $\rightarrow$ Prioritas P2 $\rightarrow$ **BERHASIL DIUNDUH** (SHA256: `687d9576f04e...`).
   - **`FG-C1-023`**: Tidak memiliki label lisensi terbuka pada FishBase $\rightarrow$ Tier D (*All Rights Reserved*) $\rightarrow$ Prioritas P4 $\rightarrow$ **DITAHAN DI PERMISSION_REQUIRED DAN TIDAK DIUNDUH**.

---

## 7. AUDIT KUALITAS CITRA & KESENJANGAN DOMAIN OPERASIONAL

- **Format:** Seluruh 21 file lolos validasi `PIL.Image.verify()` sebagai berkas JPEG RGB valid.
- **Resolusi:** 5 gambar $\ge 3000$ px, 10 gambar $1500 - 2048$ px, 6 gambar $600 - 1024$ px.
- **Kondisi Visual:** 20 gambar adalah spesimen tunggal terisolasi (*single fish*); **NOL (0) gambar** yang menampilkan tumpukan ikan multi-spesies campur (*dense clutter*), lendir, es curah, atau pencahayaan khas TPI Karangantu.

---

## 8. STRUKTUR ARSIP FISIK BERKAS

```
dataset_pipeline/
├── public_reference_images/
│   ├── class_0_rastrelliger_brachysoma/       [10 files, total 18.7 MB]
│   ├── class_1_selaroides_leptolepis/         [10 files, total 18.8 MB]
│   ├── class_2_upeneus_sulphureus/            [0 files, held in TAXONOMY_REVIEW]
│   ├── ood_reference/                         [0 files]
│   ├── quarantine/                            [1 file, 903 KB: FG-C1-019]
│   └── public_reference_image_manifest.csv    [21 records]
└── reports/
    └── phase_12_1_1/
        ├── phase_12_1_1_selective_acquisition_report.md
        ├── phase_12_1_1_final_reconciliation_audit.md
        ├── public_reference_image_manifest.csv
        ├── phase_12_1_1_download_failures.csv
        ├── phase_12_1_1_license_attribution_register.csv
        └── phase_12_1_1_image_quality_audit.csv
```

---

## 9. KESIMPULAN PENUTUPAN & SINKRONISASI ROADMAP

- **Status Gate Phase 12.1.1:** **COMPLETED** (Seluruh 22 kandidat akuisisi telah diproses tuntas: 20 referensi bersih, 1 karantina, 1 gagal server, serta 10 kandidat Class 2 dipisahkan dan ditahan taksonomi secara tertib).
- **Vonis Pelatihan Model:** **STRICT NO-GO FOR YOLO TRAINING.**
- **Roadmap Resmi Proyek Berlanjut ke Tahap Validasi Fisik:**
  - **Phase 11.7.3:** *Laboratory Physical Rig Validation* (Pengujian fisik rig 90 cm di laboratorium SIK UPI Kampus Serang).
  - **Phase 11.7.4:** *Controlled Specimen Pilot* (Pengujian spesimen kontrol 45 ekor).
  - **Phase 11.7.5:** *Pilot Data Integrity Audit*.
  - **Phase 11.8:** *Field Sampling Execution* (Pengambilan data primer 450 spesimen di PPN Karangantu).
  - **Phase 12:** *Master Dataset Construction & YOLO Preparation*.

---
*Laporan Rekonsiliasi ini disusun secara objektif dan berbasis bukti fisik artefak repositori oleh Tim Multidisiplin FishGuard AI — ASIK V.*
