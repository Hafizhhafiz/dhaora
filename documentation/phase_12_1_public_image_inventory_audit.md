# PHASE 12.1 — PUBLIC IMAGE INVENTORY INTEGRITY AUDIT REPORT
## Proyek: FishGuard AI — ASIK V
**Lokasi Referensi Operasional:** Pelabuhan Perikanan Nusantara (PPN) Karangantu, Kota Serang, Banten  
**Fokus Target Ruang Lingkup MVP:**
1. Identifikasi Spesies Ikan (*Species Identification*)
2. Penghitungan Jumlah Individu (*Fish Counting*)
3. Analisis Komposisi Hasil Tangkapan (*Catch Composition Analysis*)  
*(Catatan Arsitektur: Estimasi panjang dan estimasi bobot secara tegas DIEKSKLUSI dari ruang lingkup MVP)*

**Target Spesies MVP (Terkunci Ketat):**
- **Class 0:** *Rastrelliger brachysoma* (Kembung Perempuan)
- **Class 1:** *Selaroides leptolepis* (Selar Kuning)
- **Class 2:** *Upeneus sulphureus* (Kuniran)

---

## RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

Audit Integritas Inventaris Gambar Publik (Phase 12.1) telah dilaksanakan secara komprehensif terhadap empat file CSV hasil riset dataset eksternal:
1. `fishguard_public_image_inventory.csv` (91 baris data)
2. `fishguard_download_priority.csv` (80 baris data)
3. `fishguard_taxonomy_review.csv` (83 baris data)
4. `fishguard_source_license_audit.csv` (15 baris data sumber)

### Temuan Utama Audit:
1. **Rekonsiliasi Integritas Record:** Seluruh 91 record memiliki `record_id` unik tanpa duplikasi primer. Selisih jumlah record antarfile terjustifikasi secara transparan: 11 record dieksklusi dari prioritas pengunduhan karena berstatus `REJECTED` (ilustrasi morfologi/gambar teknik, prangko, ikan matang/olahan, stadia larva, dan kesalahan genus/name collision). 8 record dieksklusi dari review taksonomi karena telah berstatus rejected non-foto atau salah taksa sejak awal.
2. **Audit Keterjangkauan URL (URL Reachability):** Dari 91 record inventaris, 47 record memiliki `direct_image_url` terisi, di mana 46 URL berhasil diakses secara live (`HTTP 200 OK`) dan 1 URL terblokir proteksi hotlink/agen (`HTTP 403 Forbidden` pada `FG-C0-018` EOL asset). Sebanyak 44 record tidak memiliki direct link (hanya landing page domain). Pada level domain, beberapa repositori publik (iNaturalist, Roboflow, MDPI) menerapkan proteksi Cloudflare/WAF (`HTTP 403`), sedangkan `beta.eol.org` mengalami kegagalan DNS (`NXDOMAIN`), dan `download.osmand.net` menghasilkan `HTTP 404`.
3. **Ketersediaan Kandidat Siap Pakai per Spesies:**
   - **Class 0 (*Rastrelliger brachysoma*):** 23 record total. Hanya **1 record** berlisensi terbuka penuh Tier A (`FG-C0-018` - CC0), **10 record** Tier B (riset non-komersial/ambigu), 8 record memerlukan izin hak cipta (*permission required*), 1 OOD, dan 3 rejected.
   - **Class 1 (*Selaroides leptolepis*):** 36 record total. Hanya **2 record** berlisensi terbuka penuh Tier A (`FG-C1-031`, `FG-C1-032` - CC0), **9 record** Tier B, 21 record memerlukan izin hak cipta, 2 OOD, dan 2 rejected.
   - **Class 2 (*Upeneus sulphureus*):** 28 record total. **0 record** yang berstatus `READY_FOR_REVIEW`. Sebanyak **10 record** ditahan dalam status `TAXONOMY_REVIEW` karena terikat revisi taksonomi masif Uiblein et al. (Agustus 2025), 12 record memerlukan izin hak cipta, dan 6 rejected.
   - **Class OOD (Out-of-Domain):** 4 record (*R. faughni*, *R. kanagurta*, *U. moluccensis*) dialokasikan ketat sebagai hard negative/OOD reference.
4. **Resiko Hukum dan Hak Cipta (Licensing Risk):** Sebagian besar gambar publik (52 record / 57,1%) tergolong Tier D (*All Rights Reserved* / Hak Cipta dilindungi penuh oleh fotografer individual di FishBase). Lisensi terbuka Tier A (CC0 / CC BY) hanya mencakup 8 record (8,8%). Lisensi Tier B mencakup 31 record (34,1%) yang mensyaratkan atribusi dan pembatasan non-komersial.
5. **Kesenjangan Domain Visual (*Visual Operational Domain Gap*):** Dari 91 record, 65 record merupakan foto spesimen tunggal terisolasi (individual fish) dan 0 record yang merepresentasikan kondisi operasional riil lantai sortasi/meja pembongkaran TPI Karangantu (tumpukan ikan campur multi-spesies yang saling tumpang tindih dengan pencahayaan alami/buatan campur dan pantulan air/lendir).
6. **Temuan Kritis Taksonomi:**
   - **Revisi Taksonomi Uiblein et al. (2025):** Publikasi resmi pada *Ichthyology & Herpetology* (Copeia) Vol. 113(3):453–486 (22 Agustus 2025) meredefinisi kelompok *Upeneus sulphureus* dan menetapkan adanya dimorfisme panjang sungut (*short/long morphs*), serta memisahkannya dari kompleks *U. moluccensis*, *U. doriae*, *U. quadrilineatus*, *U. nigromarginatus*, dan spesies baru *U. alama* & *U. brevianalis*. Seluruh foto kuniran publik pra-2025 tidak dapat digunakan untuk training sebelum diverifikasi morfologi sirip kaudal (polos tanpa garis hitam) dan warna sungut (putih).
   - **Jebakan Tabrakan Nama (*Name-Collision Trap*):** Record `FG-C2-026` dan `FG-C2-027` teridentifikasi sebagai *Uranoscopus sulphureus* (famili Uranoscopidae / stargazer / ikan bentik berkepala besar dan bermata atas), yang tertangkap oleh scraper teks karena kesamaan nama penunjuk spesies (*sulphureus*).
7. **Vonis Akhir Kelayakan (Verdict):**
   - **CONDITIONAL GO untuk Pengunduhan Selektif Terbatas:** Diizinkan mengunduh 3 record Tier P1 (CC0) dan 19 record Tier P2 (riset non-komersial) hanya sebagai *benchmark visual laboratorium* dan referensi morfologi.
   - **STRICT NO-GO untuk Training Model YOLO:** Dataset publik **TIDAK MEMADAI DAN TIDAK LAYAK** digunakan sebagai data latih model deteksi utama karena jumlah gambar bersih sangat minim (hanya 22 gambar, 0 gambar Class 2 yang tervalidasi taksonomi), serta ketiadaan representasi skenario multi-ikan operasional TPI. Pengambilan data primer lapangan (Phase 11.7.2 pre-flight -> Pilot Sampling PPN Karangantu) tetap menjadi pilar utama yang mutlak.

---

## 1. REKONSILIASI JUMLAH RECORD DAN INTEGRITAS RELASIONAL CSV

### 1.1 Matriks Rekapitulasi Berkas Input
Keempat file CSV yang disediakan di direktori `Fishguard_AI/` telah diperiksa secara skrip dan relasional:

| Nama File CSV | Jumlah Kolom | Jumlah Baris Data | Header Kunci | Status Integritas |
|---|:---:|:---:|---|:---:|
| `fishguard_public_image_inventory.csv` | 24 | 91 | `record_id`, `target_class`, `target_species`, `acquisition_status` | VALID (Master Inventory) |
| `fishguard_download_priority.csv` | 13 | 80 | `rank`, `priority_tier`, `record_id`, `action` | VALID (Priority Mapping) |
| `fishguard_taxonomy_review.csv` | 12 | 83 | `record_id`, `review_triggers`, `post2025_review_required` | VALID (Taxonomic Review) |
| `fishguard_source_license_audit.csv` | 9 | 15 | `source_id`, `source`, `license_regime_observed`, `legal_risk` | VALID (Source Repository Audit) |

### 1.2 Rekonsiliasi Perbedaan Record Antarfile
Pemeriksaan silang (*cross-referencing*) antara file master inventaris (91 record) dengan file prioritas dan taksonomi menunjukkan konsistensi relasional yang sempurna:

#### A. Rekord Inventaris yang Dieksklusi dari File Prioritas Pengunduhan (11 Record)
Tepat 11 record inventaris tidak dimasukkan ke dalam `fishguard_download_priority.csv` karena telah diputuskan berstatus `REJECTED` pada tahap pra-screening:
1. `FG-C0-004` (Class 0): Gambar format GIF FAO yang merupakan ilustrasi gambar teknis hitam-putih, bukan foto ikan riil.
2. `FG-C0-005` (Class 0): Gambar prangko pos (*philatelic stamp*), bukan foto spesimen biologis.
3. `FG-C0-019` (Class 0): Foto ikan olahan/matang (*steamed salted platu in bamboo baskets*), tidak relevan untuk pengenalan ikan hasil tangkapan segar di TPI.
4. `FG-C1-006` (Class 1): Ilustrasi GIF FAO, bukan foto spesimen.
5. `FG-C1-036` (Class 1): Rekaman stadia larva (*larval stage specimen*), bukan ikan dewasa komersial.
6. `FG-C2-007` (Class 2): Gambar ilustrasi morfologi FAO.
7. `FG-C2-008` (Class 2): Gambar GIF gambar teknik, bukan foto spesimen.
8. `FG-C2-024` (Class 2): Gambar ilustrasi sketsa biologis.
9. `FG-C2-026` (Class 2): *Uranoscopus sulphureus* — kesalahan genus total (stargazer, bukan Upeneus).
10. `FG-C2-027` (Class 2): *Uranoscopus sulphureus* — kesalahan genus total (stargazer, bukan Upeneus).
11. `FG-C2-028` (Class 2): Pelat ilustrasi historis multi-spesies (Day's *Fishes of India*).

#### B. Rekord Inventaris yang Dieksklusi dari File Review Taksonomi (8 Record)
Tepat 8 record inventaris tidak masuk dalam `fishguard_taxonomy_review.csv`:
- `FG-C0-004`, `FG-C0-005`, `FG-C1-006`, `FG-C2-007`, `FG-C2-008`, `FG-C2-024`, `FG-C2-028`: Merupakan ilustrasi/prangko yang ditolak sejak awal sehingga tidak memerlukan review taksonomi spesimen.
- `FG-C0-023`: Gambar montase komposit jurnal MDPI (Figure 1) yang berfungsi sebagai referensi perbandingan visual morfologi.

---

## 2. AUDIT SUMBER GAMBAR & KETERJANGKAUAN URL (URL REACHABILITY AUDIT)

Audit keterjangkauan dilakukan dengan membedah status teknis URL langsung (*direct image URL*) serta aksesibilitas repositori sumber (*source domain*):

### 2.1 Distribusi Status URL pada Master Inventaris (91 Record)
- **`VERIFIED_ON_PAGE`**: 36 record (URL aset teridentifikasi pada halaman sumber).
- **`NOT_VERIFIED`**: 39 record (URL langsung belum divalidasi).
- **`THUMBNAIL_ONLY_SMALL_SIZE_SEEN`**: 7 record (hanya thumbnail resolusi rendah yang tersedia).
- **`VERIFIED_ON_PAGE_PREFIX_t_MAY_BE_THUMBNAIL`**: 3 record (aset berawalan `t_` yang berpotensi merupakan thumbnail kecil).
- **`NO_DIRECT_URL_SEEN`**: 2 record (tidak ada link aset langsung pada landing page).
- **`LOGIN_OR_EXPORT_REQUIRED`**: 2 record (memerlukan akun terotentikasi/ekspor institusi).
- **`THUMBNAIL_ONLY_580x360_SEEN_ORIGINAL_NOT_SEEN`**: 1 record.
- **`NO_PUBLIC_DOWNLOAD`**: 1 record.
- **Null / Kosong pada `direct_image_url`**: 44 record (48,4% dari seluruh inventaris).

### 2.2 Hasil Pengujian Live HTTP Endpoint (Sample & Unique URLs)
Pengujian live HTTP dilakukan menggunakan skrip `audit_urls_phase12_1.py` terhadap 47 URL aset gambar langsung dan domain sumber unik:

| Target Uji | Total Ditest | Status Berhasil (`HTTP 200`) | Status Terblokir (`HTTP 403`) | Gagal Akses / Error Lain | Catatan Teknis |
|---|:---:|:---:|:---:|:---:|---|
| **Direct Image URLs** | 47 | 46 (97,9%) | 1 (2,1%) | 0 | Aset FishBase, MDPI, dan Fishes of Australia dapat dijangkau langsung. Record `FG-C0-018` pada `content.eol.org` mengembalikan `HTTP 403` akibat anti-hotlinking. |
| **Source Domains** | 15 | 8 (53,3%) | 4 (26,7%) | 3 (20,0%) | Domain iNaturalist, MDPI, EOL Media, dan Roboflow memblokir permintaan otomatis (`HTTP 403`). `beta.eol.org` mengalami dead DNS (`getaddrinfo failed`). `download.osmand.net` mengembalikan `HTTP 404`. |

### 2.3 Jebakan Kualitas Gambar (Thumbnail Traps & Resolution Bottlenecks)
Audit menemukan bahwa 11 record publik hanya menyediakan thumbnail resolusi rendah (kurang dari $600 \times 400$ piksel atau memiliki prefiks `t_` pada server FishBase/NRM). Penggunaan gambar thumbnail resolusi rendah untuk deteksi objek YOLO akan menimbulkan artefak interpolasi dan mengaburkan fitur diagnostik halus (seperti sisik gurat sisi, scute, dan finlet).

---

## 3. AUDIT KANDIDAT BERDASARKAN SPESIES MVP

Ruang lingkup prototipe FishGuard AI terkunci secara ketat pada tiga komoditas ikan hasil tangkapan di PPN Karangantu:

| Class ID | Nama Ilmiah | Nama Lokal | Total di Inventaris | Eligible Download (P1 + P2) | Gated / Taxonomy Review | Permission Required | Rejected / OOD |
|:---:|---|---|:---:|:---:|:---:|:---:|:---:|
| **0** | *Rastrelliger brachysoma* | Kembung Perempuan | 23 | 11 (1 P1, 10 P2) | 0 | 8 | 4 (3 Rej, 1 OOD) |
| **1** | *Selaroides leptolepis* | Selar Kuning | 36 | 11 (2 P1, 9 P2) | 0 | 21 | 4 (2 Rej, 2 OOD) |
| **2** | *Upeneus sulphureus* | Kuniran | 28 | **0** | **10** | 12 | 6 (Rej) |
| **OOD** | *Rastrelliger faughni*, *R. kanagurta*, *U. moluccensis* | Out-of-Domain Controls | 4 | 0 | 0 | 0 | 4 (OOD Ref) |
| **TOTAL** | — | — | **91** | **22** | **10** | **41** | **18** |

### Analisis Kritis Per Kelas:
- **Krisis Data Kuniran (*Upeneus sulphureus*):** Tidak ada satu pun gambar *Upeneus sulphureus* yang dapat langsung diunduh dan digunakan untuk training (`READY_FOR_REVIEW = 0`). Seluruh 10 kandidat non-komersial tertahan pada gerbang `TAXONOMY_REVIEW` karena terbitnya revisi taksonomi 2025.
- **Keterbatasan Kembung Perempuan (*R. brachysoma*):** Hanya terdapat 11 gambar yang berlisensi terbuka atau non-komersial riset. Seluruhnya adalah foto individu tunggal.
- **Keterbatasan Selar Kuning (*S. leptolepis*):** Terdapat 11 gambar yang memenuhi syarat tinjauan teknis. 21 gambar lainnya tertahan pada hak cipta fotografer FishBase.

---

## 4. AUDIT LISENSI SUMBER & RISIKO HUKUM KEKAYAAN INTELEKTUAL

Distribusi status lisensi dari 91 record inventaris dikelompokkan ke dalam tiga tier risiko hukum:

```
Distribusi Lisensi Inventaris Publik:
┌──────────────────────────────────────┬───────┬────────────┐
│ Kategori Lisensi                     │ Total │ Persentase │
├──────────────────────────────────────┼───────┼────────────┤
│ Tier A: Open (CC0, CC BY)            │   8   │    8.8%    │
│ Tier B: NC / SA / Ambigu             │  31   │   34.1%    │
│ Tier D: None / All Rights Reserved   │  52   │   57.1%    │
└──────────────────────────────────────┴───────┴────────────┘
```

### 4.1 Analisis Repositori Sumber (15 Sumber dari `fishguard_source_license_audit.csv`)
1. **SRC-01 (FishBase Official Photos):** Hak cipta dimiliki oleh masing-masing fotografer/institusi kontributor (*All Rights Reserved*). Syarat penggunaan secara tegas melarang scraping massal dan pemanfaatan tanpa izin tertulis. **Tingkat Risiko: TINGGI.**
2. **SRC-02 (FishBase User-Uploaded Photos):** Label lisensi per-foto (CC-BY, CC-BY-NC, atau tanpa label). Namun, seluruh tautan pada halaman thumbnail mengarah ke URL generik CC BY-NC 4.0. Foto tanpa label harus diperlakukan sebagai hak cipta penuh. **Tingkat Risiko: SEDANG.**
3. **SRC-03 (iNaturalist / GBIF):** Mayoritas menggunakan lisensi CC-BY-NC atau CC-BY-SA. Diperbolehkan untuk riset akademik non-komersial dengan kewajiban atribusi dan pemenuhan klausul share-alike jika model diturunkan secara publik. **Tingkat Risiko: SEDANG.**
4. **SRC-04 (Wikimedia Commons - Judgefloro):** Didedikasikan ke domain publik melalui lisensi **CC0 1.0 Universal**. Sangat aman secara hukum (**Risiko Hukum: RENDAH**), tetapi memiliki **Risiko Taksonomi TINGGI** karena identifikasi dilakukan oleh uploader umum tanpa verifikasi iktiologis formal.
5. **SRC-05 (Wikimedia Commons - Thanin Market Platu):** Lisensi CC BY-SA 3.0, tetapi record berstatus **REJECTED** karena merupakan foto ikan olahan/matang.
6. **SRC-06 (Kahaku - National Museum of Nature and Science Japan):** Basis data *Fishes of Andaman Sea / Libong*. Tidak menyertakan pernyataan lisensi terbuka pada halaman spesies. Memerlukan korespondensi izin institusional. **Tingkat Risiko: SEDANG.**
7. **SRC-07 (Fishes of Australia):** Situs memiliki lisensi umum CC BY 3.0 AU, namun takarir per-gambar (*per-image caption*) menimpa aturan situs (sebagian CC BY, CC BY-NC, atau hak cipta museum). **Tingkat Risiko: RENDAH-SEDANG.**
8. **SRC-08 (Swedish Museum of Natural History / NRM via FishBase):** Tidak ada lisensi terbuka yang dicantumkan. **Tingkat Risiko: SEDANG.**
9. **SRC-09 (Morphobank):** Halaman tidak dapat dimuat secara teks (*empty payload*). Status lisensi belum terverifikasi. **Tingkat Risiko: UNKNOWN.**
10. **SRC-10 (Jongjaraunsuk et al. 2024 - MDPI Fishes):** Artikel jurnal berlisensi CC BY 4.0, namun dataset gambar mentah (450 spesimen) berstatus *"available upon reasonable request from the corresponding author"*. Ini merupakan sumber data eksternal paling bernilai tinggi jika izin dataset diperoleh melalui email resmi. **Tingkat Risiko: RENDAH.**
11. **SRC-11 (Atlas of Living Australia / ANFC):** Kolom lisensi kosong dan berstatus **REJECTED** karena kesalahan genus (*Uranoscopus*).
12. **SRC-12 (Mendeley Data - Fish-gres / FFE):** Dataset citra ikan pasar tradisional Gresik (Prasetyo et al. 2021). Hanya dialokasikan sebagai data kontrol Out-of-Domain. **Tingkat Risiko: SEDANG.**
13. **SRC-13 (Roboflow Universe Projects):** Proyek publik *fish-1zesj* (label Indian mackerel / *R. kanagurta*). Lisensi CC BY 4.0, dialokasikan ketat sebagai hard negative OOD. **Tingkat Risiko: SEDANG.**
14. **SRC-14 (Third-Party Mirrors - OsmAnd, Biosurveys, EOL):** Cermin pihak ketiga mereproduksi lisensi tetapi bukan pemegang hak cipta primer. Setiap aset harus diverifikasi ke sumber primer sebelum digunakan. **Tingkat Risiko: SEDANG.**
15. **SRC-15 (Wikimedia Commons Category Pages):** Sumber potensial untuk penambahan data domain publik CC0/CC BY di masa depan melalui pencarian manual terarah.

### 4.2 Batasan Hukum Riset Akademik (UU No. 28/2014 & Fair Use)
Berdasarkan Pasal 44 UU Hak Cipta No. 28 Tahun 2014 (Indonesia), penggunaan ciptaan untuk keperluan pendidikan dan penelitian tidak dianggap sebagai pelanggaran hak cipta sepanjang sumbernya disebutkan secara lengkap dan tidak merugikan kepentingan wajar pencipta. Namun, jika model AI hasil pelatihan nantinya didistribusikan secara komersial atau diintegrasikan ke perangkat keras komersial, data Tier B (NC) dan Tier D (All Rights Reserved) akan menimbulkan sengketa hukum pelanggaran hak cipta.

---

## 5. AUDIT KOMPOSISI TIPE RECORD & KESENJANGAN SKENARIO VISUAL

### 5.1 Distribusi Tipe Record
Dari 91 record inventaris, tipe data visual terdistribusi sebagai berikut:
- **`INDIVIDUAL_FISH`**: 65 record (71,4%) — Foto ikan tunggal, mayoritas di atas latar belakang netral, penggaris, atau tangan.
- **`INDIVIDUAL_FISH_UNVERIFIED`**: 7 record (7,7%) — Foto ikan tunggal dengan metadata belum lengkap.
- **`ILLUSTRATION`**: 5 record (5,5%) — Sketsa/gambar morfologi biologis (**REJECTED**).
- **`COLLECTION`**: 5 record (5,5%) — Dataset batch atau kumpulan foto institusional.
- **`UNKNOWN_SINGLE_OR_MULTI`**: 3 record (3,3%).
- **`MULTI_FISH`**: 1 record (1,1%) — Foto tumpukan ikan olahan di keranjang bambu (**REJECTED**).
- **`STAMP`**: 1 record (1,1%) — Prangko filateli (**REJECTED**).
- **`COMPOSITE`**: 1 record (1,1%) — Gambar montase morfologi komparatif jurnal.
- **`LARVAL_STAGE_RECORD`**: 1 record (1,1%) — Spesimen larva mikroskopis (**REJECTED**).
- **`UNVERIFIED_GIF`**: 1 record (1,1%) — File GIF tidak terverifikasi (**REJECTED**).
- **`UNKNOWN`**: 1 record (1,1%).

### 5.2 Kesenjangan Domain Visual (Operational Domain Gap) yang Kritis
Audit konteks fisik menemukan bahwa:
1. Hanya 11 record yang menyebutkan lokasi pasar atau pendaratan ikan (*market / landing site*), dan dari 11 record tersebut, hampir seluruhnya adalah foto satu ekor spesimen yang diletakkan di atas meja lapak atau papan potong pedagang.
2. **NOL (0) record yang menampilkan skenario operasional TPI Karangantu yang sesungguhnya**, yaitu:
   - Tumpukan ikan multi-spesies yang saling menindih (*dense clutter / partial occlusion*).
   - Ikan yang bercampur dengan es curah (*crushed ice*), lendir basah, dan ceceran air laut.
   - Pencahayaan riil dermaga/bangsal lelang (kombinasi cahaya matahari tropis terik dan lampu merkuri/LED ber-CRI rendah).
   - Sudut pandang kamera konveyor/meja sortasi tegak lurus 90° (*top-down nadir FoV*).
3. **Konsekuensi Teknis:** Melatih model deteksi objek pada data publik yang 100% berupa spesimen terisolasi di latar belakang putih/studio akan menyebabkan kegagalan deteksi parah (*catastrophic out-of-distribution failure*) saat model diuji pada skenario nyata di TPI Karangantu.

---

## 6. AUDIT INTEGRITAS TAKSONOMI (TAXONOMIC INTEGRITY AUDIT)

### 6.1 Revisi Taksonomi Masif *Upeneus sulphureus* (Uiblein et al., Agustus 2025)
Audit taksonomi menemukan publikasi ilmiah mutakhir yang merevolusi status taksonomi Class 2:
- **Referensi Ilmiah:** Uiblein, F., et al. (2025). *Redescription of Upeneus sulphureus, with the description of new species and notes on the sulphureus species group*. **Ichthyology & Herpetology (sebelumnya Copeia)**, Vol. 113, No. 3, hlm. 453–486 (Terbit daring 22 Agustus 2025).
- **Inti Revisi Biologis:**
  1. Spesies *Upeneus sulphureus* (sensu stricto) diredeskripsi secara ketat.
  2. Ditemukan adanya variasi dimorfisme panjang sungut (*barbel length dimorphism: short morph vs long morph*).
  3. Kelompok *Upeneus sulphureus* dipisahkan dari taksa berkerabat dekat: *Upeneus moluccensis*, *Upeneus doriae*, *Upeneus quadrilineatus*, *Upeneus nigromarginatus*, serta spesies baru yang dipertalikan (*Upeneus alama* dan *Upeneus brevianalis*).
- **Karakter Diagnostik Kunci yang Harus Diperiksa:**
  - Rumus sirip: Dorsal VIII, 9; Pektoral 14–17; Sisik gurat sisi (*lateral line scales*) 32–37; Tapis insang (*gill rakers*) 26–31.
  - **Pola Warna Sirip Kaudal:** Sirip ekor (caudal fin) harus **polos tanpa garis-garis hitam melintang** (*without dark bars*). Kehadiran garis hitam pada sirip ekor menandakan spesies lain (*Upeneus tragula*, *Upeneus vittatus*, dsb.).
  - **Warna Sungut:** Sungut dagu (*chin barbels*) berwarna putih/putih gading (bukan kuning atau merah).
  - **Pola Tubuh:** Dua garis membujur kuning cerah pada sisi tubuh di atas dasar perak kemerahan.
- **Dampak Audit terhadap Inventaris:** Seluruh 10 record *Upeneus sulphureus* yang berstatus `TAXONOMY_REVIEW` ditandai dengan `post2025_review_required = YES`. Tidak ada satu pun record yang boleh masuk ke pipeline pelatihan sebelum diverifikasi oleh iktiologis menggunakan acuan diagnostik Uiblein et al. (2025).

### 6.2 Jebakan Tabrakan Nama (*Name-Collision Trap*): Kasus *Uranoscopus sulphureus*
Audit mendeteksi dua record publik (`FG-C2-026` dan `FG-C2-027`) yang diberi judul *"Uranoscopus sulphureus"*:
- *Uranoscopus* adalah genus ikan pemedang/stargazer dari famili Uranoscopidae (ordo Uranoscopiformes / Perciformes).
- Ikan ini memiliki morfologi kepala bertulang keras yang menghadap ke atas, mulut vertikal lebar, dan mata di bagian dorsal tempurung kepala. Ikan ini sama sekali tidak memiliki hubungan kekerabatan dekat dengan ikan kuniran (*Upeneus sulphureus*, famili Mullidae).
- Kesalahan ini timbul akibat algoritma pencarian teks otomatis yang hanya mencocokkan kata *"sulphureus"*. Kedua record ini telah diverifikasi dan ditetapkan berstatus **REJECTED_WRONG_GENUS**.

### 6.3 Integritas Morfologi *Rastrelliger brachysoma* vs *R. kanagurta* & *R. faughni*
- **Karakter Pembeda Utama:**
  - *Rastrelliger brachysoma* (Kembung Perempuan): Tubuh sangat dalam (*very deep body*, kedalaman tubuh 3,7–4,3 kali dalam panjang cagak / Fork Length); tapis insang bawah sangat panjang dan berjumlah 30–48; tidak memiliki bintik hitam berderet ganda di sepanjang pangkal sirip punggung.
  - *Rastrelliger kanagurta* (Kembung Lelaki): Tubuh lebih ramping dan memanjang; memiliki bintik hitam khas di dekat sirip pektoral dan deretan bintik gelap di punggung.
  - *Rastrelliger faughni*: Tapis insang lebih sedikit (kurang dari 26).
- **Status Review:** Dari 23 record Class 0, 17 record berakar pada identifikasi komunitas/lokal tanpa data hitung tapis insang (*gill rakers*). Oleh karena itu, rasio kedalaman tubuh (*body depth ratio*) harus diverifikasi secara manual oleh ahli sebelum foto digunakan.

### 6.4 Integritas Morfologi *Selaroides leptolepis*
- **Karakter Diagnostik Kunci:**
  - Garis pita emas/kuning lebar yang sangat kontras membentang dari tepi atas mata hingga pangkal ekor (*broad golden lateral stripe*).
  - Tepi belakang celah insang (*cleithrum margin*) halus tanpa tonjolan papila berdaging (membedakannya dari genus *Selar*).
  - Rahang atas tidak bergigi (*toothless upper jaw*), membedakannya dari *Alepes djedaba* dan *Atule mate*.
  - Bintik hitam jelas pada tepi atas penutup insang (*opercular spot*).

---

## 7. INVENTARISASI DUPLIKASI GAMBAR & RISIKO KEBOCORAN DATA (DATA LEAKAGE)

Audit menemukan **6 klaster duplikasi** yang mencakup **13 record gambar**:

```
Klaster Duplikasi Publik:
├── DUP-INAT-4f48550b (2 record: FG-C0-016, FG-C0-017)
│   └── Foto multi-sudut dari satu observasi iNaturalist yang sama
├── DUP-OSMANY-20130318 (2 record: FG-C1-020, FG-C1-021)
│   └── Foto spesimen yang sama di Pelabuhan Karachi oleh fotografer H.B. Osmany
├── DUP-OSMANY-20130625 (2 record: FG-C1-022, FG-C1-023)
│   └── Sesi pemotretan spesimen bertanggal sama di Karachi (status lisensi berbeda pada FishBase)
├── POSSIBLE-DUP-KAHAKU-SELAROIDES (2 record: FG-C1-033, FG-C1-034)
│   └── Duplikasi spesimen repositori Museum Kahaku (Andaman Sea vs Libong Island)
├── DUP-NRM-1439 (2 record: FG-C2-017, FG-C2-018)
│   └── Dua sudut foto spesimen lot museum NRM No. 1439 (Swedish Museum)
└── DUP-USNM-4030xx (3 record: FG-C2-020, FG-C2-021, FG-C2-022)
    └── Tiga spesimen katalog berurutan dari pembelian lot pasar Cubao, Manila (Smithsonian USNM)
```

### Mitigasi Risiko Kebocoran Data (Data Leakage Mitigation):
Jika record-record di atas diunduh dan diproses, **seluruh anggota dalam satu grup duplikasi WAJIB ditempatkan dalam split dataset yang sama (Group Partitioning)**. Pemisahan anggota satu klaster ke dalam data latih (*training*) dan data uji (*test*) akan menyebabkan bias performa evaluasi yang menyesatkan (*artificial performance inflation*) akibat kebocoran visual spesimen.

---

## 8. REKOMENDASI PRIORITAS PENGUNDUHAN & STRATEGI AKUISISI

Berdasarkan hasil audit relasional dan lisensi, urutan prioritas pengunduhan diatur sebagai berikut:

### 8.1 Prioritas P1: Pengunduhan Terbuka Segera (3 Record)
- **Karakteristik:** Lisensi terbuka penuh (CC0 1.0 Universal dari Wikimedia Commons karya Judgefloro), URL gambar langsung dapat diakses.
- **Daftar Record:**
  1. `FG-C0-018` (*Rastrelliger brachysoma*, sumber Wikimedia Commons / EOL).
  2. `FG-C1-031` (*Selaroides leptolepis*, sumber Wikimedia Commons via OsmAnd).
  3. `FG-C1-032` (*Selaroides leptolepis*, sumber Wikimedia Commons via OsmAnd).
- **Protokol:** Unduh aset asli resolusi penuh dari Wikimedia Commons, lakukan verifikasi taksonomi visual oleh iktiologis sebelum diarsipkan.

### 8.2 Prioritas P2: Pengunduhan untuk Riset Non-Komersial (19 Record)
- **Karakteristik:** Lisensi CC-BY-NC, CC-BY-SA, atau unggahan pengguna FishBase berlabel non-komersial.
- **Rincian:** 10 record Class 0 dan 9 record Class 1.
- **Protokol:** Boleh diunduh secara selektif strictly untuk keperluan benchmarking internal laboratorium. Wajib menyertakan takarir atribusi fotografer dan nama institusi secara permanen pada metadata.

### 8.3 Gerbang Khusus: Verifikasi Taksonomi Pra-Pelatihan Class 2 (10 Record)
- **Daftar Record:** `FG-C2-010` s.d. `FG-C2-014`, `FG-C2-019`, `FG-C2-020` s.d. `FG-C2-023`.
- **Protokol:** Seluruh 10 record kuniran ini **TIDAK BOLEH** langsung dimasukkan ke dataset latih sebelum diperiksa morfologinya terhadap publikasi Uiblein et al. (2025) oleh taxonomist bersertifikat.

### 8.4 Prioritas P3: Korespondensi Akademik Dataset Eksternal (1 Hubungan Kunci)
- **Target:** Record `FG-C0-022` — Dataset 450 spesimen ikan kembung dari publikasi Jongjaraunsuk et al. (2024) di jurnal *MDPI Fishes*.
- **Rekomendasi:** Mengirimkan surat permohonan resmi (*formal data request letter*) dari Program Studi Sistem Informasi Kelautan (UPI Kampus Serang) kepada Corresponding Author (*Dr. W. Taparhudee*) untuk meminta akses data gambar mentah beserta data taksonominya untuk keperluan riset bersama.

---

## 9. KESIMPULAN AKHIR & VONIS AUDIT (FINAL VERDICT)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       STATUS AUDIT PHASE 12.1                              │
├────────────────────────────────────────────────────────────────────────────┤
│  STATUS INVENTARIS PUBLIK      : AUDITED & RECONCILED (91 RECORDS)         │
│  KELAYAKAN UNDUH SELEKTIF      : CONDITIONAL GO (22 RECORDS P1 & P2 ONLY)  │
│  KELAYAKAN TRAINING MODEL YOLO : STRICT NO-GO (CRITICAL SHORTAGE & GAP)    │
└────────────────────────────────────────────────────────────────────────────┘
```

### Kesimpulan Strategis:
1. **Inventaris Gambar Publik Hanya Berfungsi sebagai Data Tambahan/Benchmark Lab:** Dari 91 kandidat, hanya 22 gambar yang memenuhi syarat pengunduhan selektif untuk Class 0 dan Class 1, sedangkan Class 2 memiliki **0 gambar siap latih**. Jumlah ini sangat jauh dari batas minimum pelatihan model visi komputer (minimal 100–150 gambar beranotasi per kelas).
2. **Ketiadaan Realitas Lapangan TPI Karangantu:** Seluruh gambar publik merupakan foto spesimen tunggal yang bersih. Melatih model deteksi objek pada data publik tidak akan menghasilkan model yang mampu mengenali ikan dalam tumpukan sortasi di TPI Karangantu.
3. **Prioritas Utama Tetap pada Data Primer Lapangan:** Proyek FishGuard AI harus tetap berfokus penuh pada pelaksanaan **Phase 11.7.2 (Physical Pre-Flight Verification)** dan pengumpulan data primer lapangan di PPN Karangantu (target pilot: 45 spesimen; target penuh: 450 spesimen) menggunakan rig kamera terkalibrasi tegak lurus 90°.

---
*Laporan ini disusun secara objektif dan berbasis bukti fisik artefak repositori oleh Tim Multidisiplin FishGuard AI — ASIK V (AI Engineering, Computer Vision, Ichthyology, Data Integrity).*
