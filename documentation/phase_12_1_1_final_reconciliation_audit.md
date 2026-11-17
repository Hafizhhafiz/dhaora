# PHASE 12.1.1 — FINAL REPORT RECONCILIATION & CLOSURE AUDIT
## Proyek: FishGuard AI — ASIK V
**Lokasi Referensi Operasional:** Pelabuhan Perikanan Nusantara (PPN) Karangantu, Kota Serang, Banten  
**Ruang Lingkup MVP Terkunci:**
1. Identifikasi Spesies Ikan (*Species Identification*)
2. Penghitungan Jumlah Individu (*Fish Counting*)
3. Analisis Komposisi Hasil Tangkapan (*Catch Composition Analysis*)  
*(Catatan Teknis: Estimasi panjang dan estimasi bobot secara tegas DIEKSKLUSI dari ruang lingkup MVP)*

**Target Spesies MVP (Terkunci Ketat):**
- **Class 0:** *Rastrelliger brachysoma* (Kembung Perempuan)
- **Class 1:** *Selaroides leptolepis* (Selar Kuning)
- **Class 2:** *Upeneus sulphureus* (Kuniran)

---

## 1. PENETAPAN CLOSURE & STATUS AKHIR FASE

Berdasarkan audit rekonsiliasi menyeluruh terhadap seluruh bukti fisik, berkas manifest, hash kriptografis SHA-256, dan catatan lisensi:

```
┌────────────────────────────────────────────────────────────────────────────┐
│              STATUS PENETAPAN PENUTUPAN (CLOSURE STATUS)                   │
├────────────────────────────────────────────────────────────────────────────┤
│  STATUS CLOSURE PHASE 12.1.1   : COMPLETED                                 │
│  STATUS REKONSILIASI DOKUMEN   : FULLY RECONCILED (ZERO DISCREPANCY)       │
│  TOTAL KANDIDAT AKUISISI       : 22 RECORD (11 CLASS 0 + 11 CLASS 1)       │
│  GAMBAR BERHASIL DIUNDUH       : 21 GAMBAR (10 CLASS 0 + 11 CLASS 1)       │
│  KEGAGALAN UNDUH SERVER        : 1 RECORD (FG-C0-009, 0-BYTE BODY)         │
│  GAMBAR MASUK KARANTINA        : 1 GAMBAR (FG-C1-019, UNDERWATER DIVE)     │
│  REFERENSI MORFOLOGI BERSIH    : 20 GAMBAR (10 CLASS 0 + 10 CLASS 1)       │
│  KANDIDAT CLASS 2 DITAHAN      : 10 RECORD (TAXONOMY_REVIEW, UIBLEIN 2025) │
│  KELAYAKAN TRAINING YOLO       : STRICT NO-GO (DILARANG KERAS TRAINING)    │
└────────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Dasar Penetapan Status COMPLETED:**  
> Penutupan (*closure*) Phase 12.1.1 ditetapkan sebagai **COMPLETED** karena seluruh ketidaksesuaian dokumentasi, percampuran peristilahan lisensi vs status akuisisi, dan keterkaitan klaster spesimen biologis telah berhasil direkonsiliasi dan didokumentasikan secara transparan berbasis bukti aktual. Penetapan ini **bukan** berarti seluruh kandidat harus berhasil diunduh, melainkan membuktikan bahwa batasan hukum, kualitas citra, dan kriteria eliminasi telah ditegakkan dengan integritas ilmiah tertinggi.

---

## 2. REKONSILIASI JUMLAH KANDIDAT & PEMISAHAN CLASS 2

### 2.1 Pemisahan Tegas Antara 22 Kandidat Akuisisi dan 10 Kandidat Class 2
Audit menegaskan pemisahan struktural yang tidak boleh dicampuradukkan:
- **Kelompok Akuisisi Phase 12.1.1 (22 Record):** Terdiri dari kandidat Class 0 dan Class 1 yang telah berstatus `READY_FOR_REVIEW` pada prioritas P1 dan P2:
  - Class 0 (*Rastrelliger brachysoma*): 11 record (1 P1 Open + 10 P2 Research).
  - Class 1 (*Selaroides leptolepis*): 11 record (2 P1 Open + 9 P2 Research).
  - **Total dieksekusi akuisisinya:** Tepat 22 kandidat.
- **Kelompok Ditahan Taksonomi (10 Record Class 2 — *Upeneus sulphureus*):**
  - Record: `FG-C2-019` (P1 dalam ranking unduh) serta `FG-C2-010`, `FG-C2-011`, `FG-C2-012`, `FG-C2-013`, `FG-C2-014`, `FG-C2-020`, `FG-C2-021`, `FG-C2-022`, `FG-C2-023` (P2 dalam ranking unduh).
  - **Status Operasional:** Seluruh 10 record kuniran ini merupakan **kelompok terpisah** yang berstatus `HOLD_PENDING_TAXONOMY_REVIEW` akibat revisi taksonomi Uiblein et al. (Agustus 2025).
  - **PENEGASAN AUDITOR:** Kesepuluh kandidat Class 2 ini **BUKAN bagian dari 22 kandidat akuisisi** Phase 12.1.1, dan tidak dieksekusi pengunduhannya sebagai referensi terverifikasi.

### 2.2 Konsistensi Angka Akuisisi
Angka-angka berikut kini telah terverifikasi konsisten di seluruh dokumentasi proyek:
$$\begin{aligned}
\text{Total Kandidat Akuisisi Dieksekusi} &= 22 \\
\text{Gambar Berhasil Diunduh} &= 21 \\
\text{Gambar Gagal Diunduh (Server 0-Byte)} &= 1 \quad (\text{FG-C0-009}) \\
\text{Gambar Terunduh Masuk Karantina} &= 1 \quad (\text{FG-C1-019, underwater}) \\
\text{Gambar Referensi Morfologi Bersih} &= 20 \quad (10 \text{ Class 0} + 10 \text{ Class 1})
\end{aligned}$$

---

## 3. REKONSILIASI LISENSI: INVESTIGASI 52 TIER D VS 41 PERMISSION REQUIRED

### 3.1 Akar Perbedaan Angka (Discrepancy Investigation)
Pada laporan Phase 12.1 dicatat terdapat **52 record Tier D**, sedangkan pada tabel ringkasan Phase 12.1.1 awal tercantum *"Ditahan karena Lisensi: 41 record Tier D"*.

Audit membuktikan adanya perbedaan konseptual antara **Kategori Lisensi (`license_tier`)** dan **Status Akuisisi (`acquisition_status`)**:

| `license_tier` (Tingkat Lisensi) | `acquisition_status` (Status Tindakan) | Jumlah Record | Penjelasan Teknis Relasional |
|---|---|:---:|---|
| **`D_NONE_OR_RESERVED`** | `PERMISSION_REQUIRED` | **41** | Foto spesimen ikan darat yang valid, namun hak ciptanya dipegang penuh oleh fotografer FishBase (*All Rights Reserved*). **Inilah angka 41 yang ditahan!** |
| **`D_NONE_OR_RESERVED`** | `REJECTED` | **7** | Berlisensi hak cipta/tanpa izin, namun sudah ditolak sejak awal karena non-foto (`FG-C0-004` GIF FAO, `FG-C0-005` prangko, `FG-C1-006` GIF FAO, `FG-C1-036` larva, `FG-C2-007` ilustrasi, `FG-C2-008` GIF, `FG-C2-026` stargazer Uranoscopus). |
| **`D_NONE_OR_RESERVED`** | `OOD_REFERENCE` | **4** | Foto kontrol luar domain (`FG-C1-035` underwater dive, `FG-OOD-001` *R. faughni*, `FG-OOD-002` *U. moluccensis*, `FG-OOD-003` *R. faughni*). |
| **SUBTOTAL TIER D** | — | **52** | **Tepat 52 record Tier D terdistribusi secara matematis.** |

### 3.2 Rekonsiliasi Matriks Lengkap Inventaris Master (91 Record)
Cross-tabulation lengkap antara `license_tier` dan `acquisition_status` dari seluruh 91 baris master inventaris adalah sebagai berikut:

```
Tabel Silang Lisensi vs Status Akuisisi (Total 91 Record Inventaris):
┌───────────────────────────┬─────────────────────┬───────────┬────────────────────┬───────────────┬───────┐
│ License Tier              │ PERMISSION_REQUIRED │ REJECTED  │  READY_FOR_REVIEW  │TAXONOMY_REVIEW│ Total │
├───────────────────────────┼─────────────────────┼───────────┼────────────────────┼───────────────┼───────┤
│ Tier A (Open: CC0 / CC-BY)│          0          │     2     │         3          │       1       │   8*  │
│ Tier B (NC / SA / Ambigu) │          0          │     2     │        19          │       9       │  31*  │
│ Tier D (None / Reserved)  │         41          │     7     │         0          │       0       │  52*  │
├───────────────────────────┼─────────────────────┼───────────┼────────────────────┼───────────────┼───────┤
│ TOTAL                     │         41          │    11     │        22          │      10       │  91   │
└───────────────────────────┴─────────────────────┴───────────┴────────────────────┴───────────────┴───────┘
*(Catatan: 7 record OOD_REFERENCE terdistribusi ke: Tier A = 2, Tier B = 1, Tier D = 4; total 91 record pas).
```

### 3.3 Audit Ketidakpastian Lisensi Individual FishBase User
Audit terhadap 11 gambar kontributor FishBase User (`FG-C0-006`, `008`, `FG-C1-007`, `017`, `019`, `020`, `021`, `022`, `026`, `028`, `029`) menemukan:
1. **Ambiguitas Hyperlink:** Pada antarmuka thumbnail FishBase, teks label tertulis *"CC-BY"* atau *"CC-BY-NC"*, namun tautan URL seluruhnya secara seragam mengarah ke `http://creativecommons.org/licenses/by-nc/4.0/`.
2. **Ketiadaan Halaman Ketentuan Terpisah:** Halaman per-foto tidak menyediakan dokumen lisensi tersendiri yang ditandatangani fotografer.
3. **Sikap Hukum Konservatif:** FishGuard AI memperlakukan seluruh citra FishBase User strictly sebagai **Bahan Penelitian Akademik Non-Komersial** sesuai ketentuan Pasal 44 UU Hak Cipta No. 28 Tahun 2014 Republik Indonesia, dengan kewajiban mencantumkan takarir atribusi fotografer secara permanen.

---

## 4. AUDIT KLASTER SPESIMEN & PERBEDAAN HASH SHA-256 VS INDIVIDU BIOLOGIS

> [!WARNING]
> **PRINSIP DASAR COMPUTER VISION & BIOINFORMATIKA:**  
> **Keunikan hash kriptografis SHA-256 HANYA membuktikan keunikan transfer berkas biner (integritas file). Keunikan hash SHA-256 TIDAK SAMA dengan keunikan individu spesimen biologis!** Dua berkas citra dengan hash SHA-256 yang berbeda 100% dapat berasal dari satu ekor ikan yang sama yang difoto dengan sudut, jarak, atau orientasi pencahayaan yang berbeda.

### 4.1 Klaster `DUP-INAT-4f48550b`
- **Anggota Terunduh:** `FG-C0-016` (SHA256: `c5eb3a15e9dc...`, $2048 \times 2048$ px) dan `FG-C0-017` (SHA256: `9b4ca1e3c4db...`, $2048 \times 2048$ px).
- **Hubungan Spesimen:** Dua sudut pemotretan dari **satu individu biologis kembung perempuan (*Rastrelliger brachysoma*) yang sama** pada observasi iNaturalist `4f48550b-fac6-4d33-8a2c-8076d91edc65` di Thailand oleh Sutthikhun Phaengphongsai.
- **Implikasi Analitik:** Kedua citra ini mewakili variasi pose dari 1 spesimen. Jika digunakan untuk benchmark, keduanya **wajib disatukan dalam satu grup (*group partition*)** agar tidak terjadi bias kebocoran data.

### 4.2 Klaster `DUP-OSMANY-20130318`
- **Anggota Terunduh:** `FG-C1-020` (SHA256: `e81605582df0...`, $730 \times 368$ px) dan `FG-C1-021` (SHA256: `feac247b4189...`, $727 \times 452$ px).
- **Hubungan Spesimen:** Dua foto dari **satu individu/lot spesimen selar kuning (*Selaroides leptolepis*) berukuran 16 cm yang sama** yang didokumentasikan oleh Hamid Badar Osmany di Pelabuhan Karachi pada tanggal 18 Maret 2013.

### 4.3 Klaster `DUP-OSMANY-20130625` (Kasus Khusus `FG-C1-022` vs `FG-C1-023`)
- **Latar Belakang:** Keduanya merupakan foto spesimen selar kuning berukuran 13 cm dari sesi pemotretan bertanggal sama (25 Juni 2013) di Karachi oleh Hamid Badar Osmany.
- **Audit Status Terpisah:**
  1. **`FG-C1-022`:** Pada thumbnail summary FishBase tercantum label lisensi *"CC-BY"* $\rightarrow$ Diklasifikasikan sebagai Tier B $\rightarrow$ Masuk prioritas **P2** $\rightarrow$ **BERHASIL DIUNDUH** (SHA256: `687d9576f04e...`, ukuran 33.571 bytes).
  2. **`FG-C1-023`:** Pada thumbnail summary FishBase **TIDAK memiliki label lisensi terbuka** (tanpa takarir CC) $\rightarrow$ Diklasifikasikan sebagai Tier D (*All Rights Reserved*) $\rightarrow$ Masuk prioritas **P4** $\rightarrow$ Berstatus **`PERMISSION_REQUIRED`** $\rightarrow$ **DITAHAN DAN TIDAK DIUNDUH**.
- **Justifikasi Integritas:** Kasus ini membuktikan kepatuhan ketat FishGuard AI terhadap lisensi. Meskipun kedua gambar berasal dari spesimen bertanggal sama oleh fotografer yang sama, tim hanya mengunduh gambar yang memiliki label izin eksplisit dan menahan gambar yang tidak berlabel.

---

## 5. AUDIT KONSISTENSI MANIFEST & STRUKTUR PENYIMPANAN

Pemeriksaan fisik terhadap repositori memastikan kepatuhan mutlak:
1. **Manifest Lengkap:** Seluruh 21 file yang berhasil diunduh tercatat secara akurat pada [public_reference_image_manifest.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_12_1_1/public_reference_image_manifest.csv).
2. **Karantina `FG-C1-019`:** Berkas fisik `FG-C1-019_1_selaroides_leptolepis.jpg` berada di folder [dataset_pipeline/public_reference_images/quarantine/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/public_reference_images/quarantine/) dan tercatat berstatus `QUARANTINE_UNDERWATER_DOMAIN`.
3. **Kegagalan `FG-C0-009`:** Tercatat resmi pada [phase_12_1_1_download_failures.csv](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_download_failures.csv) dengan alasan `SERVER_EMPTY_RESPONSE (0 bytes received)` dan tidak ada berkas palsu yang dibuat di disk.
4. **Isolasi Class 2:** Folder [class_2_upeneus_sulphureus/](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/public_reference_images/class_2_upeneus_sulphureus/) kosong (0 files), menjaga integritas ilmiah dari revisi Uiblein et al. (2025).
5. **Pemisahan Data Historis:** Tidak ada data historis DeepFish/GBIF Phase 10 (*R. kanagurta*, *D. macarellus*) yang dimasukkan ke dalam folder tiga kelas target MVP.

---

## 6. SINKRONISASI ROADMAP UTAMA FISHGUARD AI

Workstream dataset publik telah selesai untuk tahap referensi laboratorium. Proyek FishGuard AI sekarang kembali berfokus penuh pada **Roadmap Utama Sampling Primer Lapangan**:

```
Roadmap Resmi FishGuard AI — ASIK V:
├── Phase 11.7.2: Physical Pre-Flight Verification & Rig Setup (SELESAI - FoV 60.4 cm pada 90 cm)
├── Phase 11.7.3: Laboratory Physical Rig Validation (PENGUJIAN FISIK DI LAB SIK UPI KAMPUS SERANG)
├── Phase 11.7.4: Controlled Specimen Pilot (PILOT TESTING 45 SPESIMEN)
├── Phase 11.7.5: Pilot Data Integrity Audit
├── Phase 11.8  : Field Sampling Execution (SAMPLING PENUH 450 SPESIMEN PPN KARANGANTU)
└── Phase 12    : Master Dataset Construction & YOLO Preparation
```

> [!CAUTION]
> **PENEGASAN ULANG:** Pengumpulan gambar publik adalah jalur sampingan (*parallel workstream*) untuk benchmarking visual, dan **BUKAN** pengganti tahapan validasi rig fisik laboratorium maupun ekspedisi sampling lapangan di PPN Karangantu!

---
*Laporan Rekonsiliasi dan Penutupan ini disusun oleh Tim Multidisiplin FishGuard AI (AI Engineer, Computer Vision Specialist, Ichthyologist, Data Integrity Auditor) pada 16 November 2026.*
