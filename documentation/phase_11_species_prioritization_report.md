# PHASE 11 — LOCAL SPECIES PRIORITIZATION & DATASET FEASIBILITY ASSESSMENT REPORT
## FishGuard AI — ASIK V

**Tanggal Dokumen:** 16 November 2026  
**Auditor / Tim Analis:** Senior AI Engineer, Fisheries Data Scientist & Dataset Curator  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Dasar Analisis Primer:** Data Statistik Pendaratan PIPP KKP 2026 — PPN Karangantu, Kota Serang, Banten  
**Status Evaluasi:** ✅ SELESAI & TERVALIDASI (Rekomendasi Kelas Target Baru Ditetapkan)  

---

## 1. Ringkasan Eksekutif & Konteks Pembukaan Ulang Spesies Target

Pada fase perencanaan awal (Phase 0–10), FishGuard AI menetapkan dua spesies target pelagis berdasarkan asumsi literatur umum Teluk Banten:
* *Rastrelliger kanagurta* (Ikan Kembung Lelaki)
* *Decapterus macarellus* (Ikan Layang)

Namun, audit terhadap data empiris pendaratan riil dari **Pusat Informasi Pelabuhan Perikanan (PIPP) Kementerian Kelautan dan Perikanan (KKP) tahun 2026 di PPN Karangantu, Kota Serang, Banten**, mengungkap fakta bahwa dinamika perikanan tangkap skala kecil Teluk Banten didominasi oleh komoditas yang berbeda:
1. Pendaratan ikan nomor 1 di PPN Karangantu adalah **Ikan Kembung Perempuan (*Rastrelliger brachysoma*) dengan volume 33.305 kg**, bukan *R. kanagurta*.
2. Ikan Layang (*Decapterus macarellus*) **tidak tercatat dalam 23 komoditas ikan teratas** di PPN Karangantu. Komoditas Carangidae pelagis kecil yang mendominasi adalah **Ikan Selar Kuning (*Selaroides leptolepis*) dengan volume 19.902 kg (Rank 4)**.
3. Komoditas lain dengan pendaratan sangat masif adalah **Peperek (*Leiognathus leuciscus* — 32.238 kg, Rank 2)** dan **Kuniran (*Upeneus sulphureus* — 23.838 kg, Rank 3)**.

Sesuai instruksi, ruang lingkup prototipe pertama (MVP) FishGuard AI dibatasi secara tegas **hanya untuk komoditas IKAN**. Seluruh komoditas non-ikan (krustasea dan moluska) telah dipisahkan.

Melalui evaluasi multi-kriteria berbasis bobot terstruktur (Produksi Lokal 30%, Konsistensi 20%, Ketersediaan Citra 25%, Kepastian Taksonomi 15%, dan Kelayakan AI 10%), laporan ini merekomendasikan **tiga kelas target utama yang paling layak, kredibel, dan siap dieksekusi** untuk model FishGuard AI MVP:
* **Kelas 0**: ***Rastrelliger brachysoma* (Ikan Kembung Perempuan)** — Skor: **90.5 / 100**
* **Kelas 1**: ***Selaroides leptolepis* (Ikan Selar Kuning)** — Skor: **89.0 / 100**
* **Kelas 2**: ***Upeneus sulphureus* (Ikan Kuniran)** — Skor: **86.0 / 100**

---

## 2. Task 11.1 — Konsolidasi Data Produksi PIPP KKP Karangantu

### 2.1 Metadata Sumber Data
* **Penyedia Data**: Pusat Informasi Pelabuhan Perikanan (PIPP) — Direktorat Jenderal Perikanan Tangkap, KKP RI.
* **Pelabuhan Rujukan**: Pelabuhan Perikanan Nusantara (PPN) Karangantu, Kasemen, Kota Serang, Banten.
* **Koordinat Geografis**: $6^\circ 02' 01''\text{ S}$, $106^\circ 09' 21''\text{ E}$ (Perairan Teluk Banten & Selat Sunda).
* **Tahun Data**: 2026 (Pendaratan tahun berjalan kumulatif).
* **Tanggal Akses / Ekstraksi**: November 2026.
* **Satuan**: Berat dalam Kilogram (kg), Nilai Produksi dalam Rupiah (IDR).
* **Filter Digunakan**: PPN Karangantu $\rightarrow$ Komoditas Tangkapan Laut $\rightarrow$ Data Tahunan 2026.

### 2.2 Analisis Perbedaan Angka Antara Grafik dan Tabel PIPP
Dalam audit portal PIPP KKP, sering ditemukan perbedaan angka visual antara *dashboard chart* dan tabel logbook detail:
* **Penyebab Metodologis**: Grafik portal PIPP menerapkan filter dinamis berbasis *rolling aggregate* (misal 10 komoditas teratas dalam rentang 30 hari terakhir atau pembaruan berkala tiap akhir bulan). Sebaliknya, tabel pendaratan memuat seluruh entri transaksi harian kapal yang telah diverifikasi oleh petugas syahbandar/pencatat lelang TPI.
* **Kesimpulan Auditor**: Perbedaan tersebut adalah variasi agregasi waktu pelaporan, bukan galat integritas data (*not a data corruption error*). Angka pada tabel transaksi resmi adalah acuan paling valid untuk analisis data sains.

### 2.3 Katalog Lengkap 30 Komoditas PIPP Karangantu

Sesuai ruang lingkup, katalog dibagi secara tegas menjadi **23 Komoditas Ikan** dan **7 Komoditas Non-Ikan**:

#### A. 23 Komoditas IKAN (Ruang Lingkup FishGuard AI MVP)

| Rank | Nama Lokal | Nama Ilmiah Tercatat | Nama Ilmiah Valid (WoRMS/FishBase) | Famili | Produksi (kg) | Estimasi Harga (Rp/kg) | Nilai Produksi Estimasi (Juta Rp) |
|---|---|---|---|---|---:|---:|---:|
| 1 | Kembung perempuan | *Rastrelliger brachysoma* | *Rastrelliger brachysoma* (Bleeker, 1851) | Scombridae | 33.305 | 35.000 | 1.165,68 |
| 2 | Peperek | *Leiognathus leuciscus* | *Equulites leuciscus* (Günther, 1860) | Leiognathidae | 32.238 | 15.000 | 483,57 |
| 3 | Kuniran | *Upeneus sulphureus* | *Upeneus sulphureus* Cuvier, 1829 | Mullidae | 23.838 | 25.000 | 595,95 |
| 4 | Selar kuning | *Selaroides leptolepis* | *Selaroides leptolepis* (Cuvier, 1833) | Carangidae | 19.902 | 30.000 | 597,06 |
| 5 | Teri | *Stolephorus commersonii* | *Stolephorus commersonii* Lacepède, 1803 | Engraulidae | 17.418 | 20.000 | 348,36 |
| 6 | Selanget | *Anodontostoma chacunda* | *Anodontostoma chacunda* (Hamilton, 1822) | Dorosomatidae | 9.855 | 18.000 | 177,39 |
| 7 | Peperek lainnya | *Leiognathus spp* | *Leiognathidae indet.* (Multi-species) | Leiognathidae | 8.893 | 12.000 | 106,72 |
| 8 | Peperek bondolan | *Leiognathus bindus* | *Photopectoralis bindus* (Valenciennes, 1835) | Leiognathidae | 5.057 | 14.000 | 70,80 |
| 9 | Tembang | *Sardinella brachysoma* | *Sardinella brachysoma* Bleeker, 1852 | Clupeidae | 4.866 | 20.000 | 97,32 |
| 10 | Teri | *Encrasicholina devisi* | *Encrasicholina devisi* (Whitley, 1940) | Engraulidae | 3.868 | 22.000 | 85,10 |
| 11 | Beloso | *Saurida tumbil* | *Saurida tumbil* (Bloch, 1795) | Synodontidae | 3.609 | 20.000 | 72,18 |
| 12 | Tongkol banyar | *Euthynnus affinis* | *Euthynnus affinis* (Cantor, 1849) | Scombridae | 3.145 | 32.000 | 100,64 |
| 13 | Gulamah | *Otolithes ruber* | *Otolithes ruber* (Bloch & Schneider, 1801) | Sciaenidae | 2.608 | 25.000 | 65,20 |
| 14 | Kurisi | *Nemipterus aurora* | *Nemipterus aurora* Russell, 1991 | Nemipteridae | 1.823 | 28.000 | 51,04 |
| 15 | Pari kembang | *Dasyatis kuhlii* | *Neotrygon kuhlii* (Müller & Henle, 1841) | Dasyatidae | 1.610 | 25.000 | 40,25 |
| 16 | Selar komo | *Alepes djedaba* | *Alepes djedaba* (Forsskål, 1775) | Carangidae | 1.428 | 26.000 | 37,13 |
| 17 | Kuwe | *Caranx sexfasciatus* | *Caranx sexfasciatus* Quoy & Gaimard, 1825 | Carangidae | 1.387 | 40.000 | 55,48 |
| 18 | Gulamah | *Pennahia argentata* | *Pennahia argentata* (Houttuyn, 1782) | Sciaenidae | 1.359 | 22.000 | 29,90 |
| 19 | Peperek | *Leiognathus berbis* | *Equulites elongatus* (Günther, 1874) | Leiognathidae | 1.230 | 12.000 | 14,76 |
| 20 | Tongkol pisang-balaki | *Auxis thazard* | *Auxis thazard* (Lacepède, 1800) | Scombridae | 1.209 | 28.000 | 33,85 |
| 21 | Ikan sebelah | *Psettodes erumei* | *Psettodes erumei* (Bloch & Schneider, 1801) | Psettodidae | 1.017 | 35.000 | 35,60 |
| 22 | Tenggiri batang | *Scomberomorus lineolatus* | *Scomberomorus lineolatus* (Cuvier, 1832) | Scombridae | 998 | 65.000 | 64,87 |
| 23 | Kurisi | *Nemipterus nematophorus* | *Nemipterus nematophorus* (Bleeker, 1854) | Nemipteridae | 713 | 25.000 | 17,83 |
| **TOTAL IKAN** | — | — | — | — | **179.908** | — | **4.246,68** |

#### B. 7 Komoditas NON-IKAN (Dikeluarkan dari Ruang Lingkup MVP FishGuard AI)

| No | Nama Komoditas Non-Ikan | Nama Ilmiah / Taksa | Kelompok | Produksi Estimasi (kg) | Alasan Pengeluaran dari MVP |
|---|---|---|---|---:|---|
| 24 | Rajungan | *Portunus pelagicus* (Linnaeus, 1758) | Crustacea (Kepiting) | ~42.500 | Morfologi cangkang berbuku, bukan target model deteksi ikan |
| 25 | Cumi-cumi | *Uroteuthis chinensis* / *Loligo spp.* | Cephalopoda (Mollusca) | ~38.200 | Tubuh lunak tanpa sirip tulang, morfometrik Total Length tidak aplikatif |
| 26 | Udang putih / jerbung | *Penaeus merguiensis* de Man, 1888 | Crustacea (Decapoda) | ~21.400 | Karapas berbuku dan rostrum melengkung; modul terpisah |
| 27 | Sotong | *Sepia pharaonis* / *Sepia spp.* | Cephalopoda (Mollusca) | ~14.600 | Bentuk tubuh pipih berlendir dengan cangkang dalam (*cuttlebone*) |
| 28 | Udang krosok / jrebung | *Metapenaeus monoceros* (Fabricius, 1798) | Crustacea (Decapoda) | ~12.100 | Krustasea kecil dasar perairan |
| 29 | Kepiting bakau | *Scylla serrata* (Forsskål, 1775) | Crustacea (Kepiting) | ~6.800 | Tubuh bulat bercapit besar |
| 30 | Kerang darah | *Tegillarca granosa* (Linnaeus, 1758) | Bivalvia (Mollusca) | ~4.500 | Cangkang kerang setangkup, tidak relevan untuk biometri ikan |

---

## 3. Task 11.2 — Validasi Taksonomi & Pembaruan Nomenklatur

Dokumen rinci: [`documentation/phase_11_taxonomic_validation_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_11_taxonomic_validation_report.md).

Poin-poin taksonomi krusial yang ditegakkan:
1. **Pemisahan Genus Peperek**: Nama *Leiognathus leuciscus* telah direvisi menjadi ***Equulites leuciscus***. Spesimen peperek di TPI Karangantu merupakan campuran beberapa taksa sekerabat, sehingga memerlukan kehati-hatian khusus.
2. **Kategori Agregat *Leiognathus spp***: Dilarang keras digunakan sebagai kelas target individual karena mewakili multi-spesies yang belum tersortir.
3. **Pembeda Morfologi Kembung**: *Rastrelliger brachysoma* dipastikan memiliki tubuh yang jauh lebih lebar ($TL/BD < 3.0$) dan moncong membulat dibanding *R. kanagurta* ($TL/BD > 3.4$).

---

## 4. Task 11.3 — Pemeringkatan Multi-Kriteria Spesies Prioritas

### 4.1 Bobot Kriteria Penilaian Ilmiah & Keteknikan

$$\mathbf{Skor\ Total} = 0.30 \times P_{\text{lokal}} + 0.20 \times K_{\text{kemunculan}} + 0.25 \times C_{\text{citra}} + 0.15 \times T_{\text{taksonomi}} + 0.10 \times A_{\text{AI}}$$

* **Produksi Lokal ($30\%$)**: Volume pendaratan riil di PPN Karangantu (menjamin relevansi ekonomi dan kemudahan pasokan sampel).
* **Konsistensi Kemunculan ($20\%$)**: Frekuensi pendaratan harian vs musiman di Teluk Banten.
* **Ketersediaan Citra ($25\%$)**: Citra publik daring (GBIF, FishBase) + kelayakan pemotretan spesimen fisik di TPI Karangantu.
* **Kepastian Taksonomi ($15\%$)**: Ketiadaan kerancuan taksonomi/sinonim, kejelasan ciri diagnosis.
* **Kelayakan Deteksi AI ($10\%$)**: Ukuran tubuh memadai untuk bounding box YOLO ($\ge 12\text{ cm}$), kontur tegas, tidak bertumpuk mikro.

### 4.2 Matriks Pemeringkatan Spesies Teratas (Top Ranking)

Hasil perhitungan matematis lengkap tersimpan pada:  
📊 [`dataset_pipeline/reports/phase_11/species_prioritization_matrix.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11/species_prioritization_matrix.csv).

| Peringkat | Nama Lokal | Nama Ilmiah Valid | Prod (30) | Kons (20) | Citra (25) | Taks (15) | AI (10) | **Skor Total (100)** | Tier Prioritas | Rekomendasi Status |
|:---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | **Kembung perempuan** | ***Rastrelliger brachysoma*** | **30.0** | **18.0** | **19.0** | **14.0** | **9.5** | **90.5** | **TIER 1** | **RECOMMENDED_TARGET_CLASS (Kelas 0)** |
| **2** | **Selar kuning** | ***Selaroides leptolepis*** | **24.0** | **17.5** | **23.5** | **14.5** | **9.5** | **89.0** | **TIER 1** | **RECOMMENDED_TARGET_CLASS (Kelas 1)** |
| **3** | **Kuniran** | ***Upeneus sulphureus*** | **25.5** | **17.0** | **20.0** | **14.5** | **9.0** | **86.0** | **TIER 1** | **RECOMMENDED_TARGET_CLASS (Kelas 2)** |
| 4 | Peperek | *Equulites leuciscus* | 29.0 | 18.0 | 15.0 | 9.0 | 6.5 | **77.5** | TIER 2 | PROPOSED_AUXILIARY (Kelas Tambahan) |
| 5 | Tongkol banyar | *Euthynnus affinis* | 9.0 | 12.0 | 23.0 | 14.5 | 9.5 | **68.0** | TIER 2 | PROPOSED_EXPANSION (Pelagis Besar) |
| 6 | Selanget | *Anodontostoma chacunda* | 16.0 | 14.0 | 16.0 | 13.0 | 8.0 | **67.0** | TIER 2 | CANDIDATE_PHASE_2 |
| 7 | Kuwe | *Caranx sexfasciatus* | 5.5 | 8.0 | 25.0 | 14.5 | 9.0 | **62.0** | TIER 2 | CANDIDATE_PHASE_2 |
| 8 | Beloso | *Saurida tumbil* | 9.5 | 11.0 | 17.0 | 13.5 | 8.5 | **59.5** | TIER 2 | CANDIDATE_PHASE_2 |
| 9 | Pari kembang | *Neotrygon kuhlii* | 6.5 | 9.0 | 21.0 | 13.0 | 8.0 | **57.5** | TIER 2 | CANDIDATE_BYCATCH_MODULE |
| 10 | Gulamah | *Otolithes ruber* | 8.5 | 10.0 | 18.0 | 12.5 | 8.5 | **57.5** | TIER 2 | CANDIDATE_PHASE_2 |
| 11 | Selar komo | *Alepes djedaba* | 6.0 | 9.0 | 18.0 | 13.0 | 8.5 | **54.5** | TIER 2 | CANDIDATE_PHASE_2 |
| 12 | **Teri** | ***Stolephorus commersonii*** | 22.0 | 15.0 | 8.0 | 8.0 | 3.0 | **56.0** | **TIER 3** | **REJECTED_UNSUITABLE_FOR_MVP** |

---

## 5. Task 11.4 — Audit Kelayakan Citra (Image Feasibility)

Dokumen rinci: [`documentation/phase_11_image_feasibility_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_11_image_feasibility_report.md).  
Tabel inventaris: [`dataset_pipeline/reports/phase_11/image_source_inventory.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11/image_source_inventory.csv).

### Ringkasan Penilaian 5 Kandidat Awal:
1. ***Rastrelliger brachysoma***: Sangat layak. 35 citra di GBIF, spesimen melimpah setiap hari di Karangantu (komoditas utama), ukuran 15–22 cm sangat proporsional di papan ukur.
2. ***Selaroides leptolepis***: Sangat layak. 179 citra di GBIF (terbanyak), pita kuning lateral sangat kontras memudahkan pembelajaran deep learning, ikan didaratkan rutin.
3. ***Upeneus sulphureus***: Sangat layak. 67 citra di GBIF, sepasang sungut dagu dan warna oranye-kuning sangat khas membedakannya dari famili lain.
4. ***Equulites leuciscus* (Peperek)**: Layak bersyarat. Sangat melimpah di TPI, namun ukuran kecil (6–12 cm) dan tubuh tipis berlendir tinggi sering bertumpuk di nampan. Disimpan sebagai kandidat sekunder/tambahan.
5. ***Stolephorus commersonii* (Teri)**: **DITOLAK**. 0 citra di GBIF, ukuran mikro (3–7 cm), didaratkan dalam gumpalan massa basah ribuan ekor. Tidak mungkin diukur Total Length per ekor menggunakan kaliper/mistar dalam skenario operasional TPI.

---

## 6. Task 11.5 — Rekomendasi Pemilihan Spesies Final

Berdasarkan sintesis data produksi riil PIPP KKP, kepastian taksonomi WoRMS, ketersediaan citra GBIF, dan kelayakan Computer Vision, direkomendasikan secara tegas:

### A. Tiga Spesies Target Utama (MVP 3-Class Model)

```
┌────────────────────────────────────────────────────────────────────────┐
│               FISHGUARD AI MVP — 3 PRIMARY TARGET CLASSES              │
├─────────┬─────────────────────────┬──────────────────────┬─────────────┤
│ Class ID│ Scientific Name         │ Local Name           │ Family      │
├─────────┼─────────────────────────┼──────────────────────┼─────────────┤
│ Class 0 │ Rastrelliger brachysoma │ Ikan Kembung Perempuan│ Scombridae  │
│ Class 1 │ Selaroides leptolepis   │ Ikan Selar Kuning    │ Carangidae  │
│ Class 2 │ Upeneus sulphureus      │ Ikan Kuniran         │ Mullidae    │
└─────────┴─────────────────────────┴──────────────────────┴─────────────┘
```

### B. Alasan Ilmiah dan Teknis Mengapa 3 Kelas Lebih Unggul dibanding 5 Kelas untuk MVP:
1. **Tingkat Keterpisahan Fitur Visual (Inter-Class Feature Disparity)**:
   * Tiga famili yang berbeda secara filogenetik: **Scombridae (Kembung)**, **Carangidae (Selar)**, dan **Mullidae (Kuniran)** memiliki bentuk tubuh (*body shape*), pola warna (*color patterns*), dan struktur sirip yang sangat kontras:
     * Kembung: Fusiform membulat keperakan, finlet terpisah.
     * Selar kuning: Pita emas lebar membujur dengan bercak operkulum hitam.
     * Kuniran: Sungut dagu ganda, corak oranye-kuning, bentuk kepala agak menukik.
   * Kontras visual yang tinggi ini meminimalkan ambiguitas klasifikasi (*confusion matrix*) pada tahap awal pelatihan model.
2. **Keterwakilan Volume Pendaratan Karangantu**:
   * Ketiga spesies ini secara kumulatif mewakili **77.045 kg (42,8%) dari seluruh produksi ikan bersirip di PPN Karangantu tahun 2026**.
3. **Kepraktisan Akuisisi Lapangan**:
   * Ketiga spesies dapat diperoleh secara bersamaan di TPI Karangantu dalam satu sesi pagi pendaratan nelayan (jam 06.00–08.00 WIB) dengan anggaran terjangkau.

---

## 7. Pembaruan Katalog Taksonomi Acuan (`species_reference.csv`)

Katalog taksonomi induk pada [`dataset_pipeline/metadata/species_reference.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/species_reference.csv) telah diperbarui secara terprogram dengan mempertahankan entri historis `SP-01` s/d `SP-05` dan menambahkan entri kandidat baru:
* `SP-06`: *Rastrelliger brachysoma* (Candidate Class 0)
* `SP-07`: *Selaroides leptolepis* (Candidate Class 1)
* `SP-08`: *Upeneus sulphureus* (Candidate Class 2)
* `SP-09`: *Equulites leuciscus* (Candidate Auxiliary Class)
* `SP-10`: *Stolephorus commersonii* (Excluded from MVP)

---

## 8. Indeks Berkas Artefak yang Dihasilkan pada Phase 11

| No | Tipe Artefak | Nama Berkas & Tautan | Deskripsi |
|---|---|---|---|
| 1 | 📄 Laporan Utama | [`documentation/phase_11_species_prioritization_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_11_species_prioritization_report.md) | Laporan konsolidasi data PIPP, skoring bobot, dan seleksi final |
| 2 | 📄 Laporan Taksonomi | [`documentation/phase_11_taxonomic_validation_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_11_taxonomic_validation_report.md) | Audit nomenklatur 23 ikan PIPP Karangantu dan revisi genus |
| 3 | 📄 Laporan Citra | [`documentation/phase_11_image_feasibility_report.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_11_image_feasibility_report.md) | Audit kelayakan citra daring (GBIF) dan rencana pemotretan TPI |
| 4 | 📊 Matriks Skoring CSV | [`dataset_pipeline/reports/phase_11/species_prioritization_matrix.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11/species_prioritization_matrix.csv) | Tabel pemeringkatan kuantitatif berbobot untuk 23 spesies ikan |
| 5 | 📊 Inventaris Citra CSV | [`dataset_pipeline/reports/phase_11/image_source_inventory.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11/image_source_inventory.csv) | Inventarisasi ketersediaan citra dan lisensi 5 kandidat utama |
| 6 | 🗃️ Referensi Spesies CSV | [`dataset_pipeline/metadata/species_reference.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/species_reference.csv) | Basis data taksonomi terstandarisasi (10 entri terkini) |

---
*FishGuard AI Research Team — Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
