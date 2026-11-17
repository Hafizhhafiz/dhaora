# PHASE 2 — SCOPE AND SPECIES IDENTIFICATION

**Proyek:** ByCatch AI — AI-Based Fisheries Monitoring & Conservation Support System  
**Ekosistem:** FishGuard AI (ASIK V)  
**Status:** In Progress (Dalam Pengerjaan)  
**Tanggal:** 17 November 2026  
**Lokasi Penelitian:** PPN Karangantu, Kota Serang, Banten  
**Wilayah Pengelolaan Perikanan:** WPPNRI 712 (Laut Jawa)  

---

## 1. Tujuan Phase 2

PHASE 2 merupakan tahap penentuan ruang lingkup penelitian (*research scope*) dan identifikasi objek spesies (*species identification*) sebelum proses pengumpulan dataset dimulai.

Tahap ini bertujuan untuk memastikan bahwa pengembangan ByCatch AI memiliki batasan penelitian yang jelas, objek identifikasi yang valid secara taksonomi, serta skenario penggunaan sistem yang sesuai dengan kondisi aktivitas perikanan di PPN Karangantu.

Secara khusus, tujuan Phase 2 adalah:

1. Menetapkan batasan wilayah dan lingkungan operasional sistem ByCatch AI.
2. Mengidentifikasi dan memvalidasi tiga jenis ikan yang menjadi objek penelitian.
3. Menentukan karakteristik morfologi yang dapat digunakan sebagai dasar identifikasi visual.
4. Menetapkan kategori klasifikasi dan struktur label dataset.
5. Menentukan perbedaan antara hasil tangkapan utama (*target catch*) dan hasil tangkapan sampingan (*bycatch*).
6. Menetapkan kriteria teknis dan ilmiah sebelum memasuki tahap akuisisi dataset.

---

## 2. Penetapan Ruang Lingkup Penelitian (Research Scope)

### A. Batasan Lokasi Penelitian

Penelitian ByCatch AI secara khusus dilaksanakan di:

- **Pelabuhan:** Pelabuhan Perikanan Nusantara (PPN) Karangantu.
- **Kelurahan:** Banten.
- **Kecamatan:** Kasemen.
- **Kota:** Serang.
- **Provinsi:** Banten.
- **WPPNRI:** 712 (Laut Jawa).

Lokasi penelitian dibatasi pada kawasan PPN Karangantu, terutama area pendaratan ikan dan Tempat Pelelangan Ikan (TPI) yang memungkinkan dilakukannya dokumentasi hasil tangkapan.

Pemilihan lokasi ini didasarkan pada aktivitas perikanan tangkap dan ketersediaan hasil pendaratan berbagai jenis ikan yang dapat dijadikan objek penelitian.

### B. Batasan Lingkungan Operasional

Sistem ByCatch AI dirancang untuk digunakan pada lingkungan identifikasi hasil tangkapan ikan setelah proses penangkapan, khususnya di area pendaratan ikan.

Kondisi citra yang menjadi fokus penelitian meliputi:

1. Ikan dalam kondisi segar setelah proses pendaratan.
2. Ikan yang diletakkan di atas wadah, meja sortir, atau permukaan tempat penanganan hasil tangkapan.
3. Ikan dalam kondisi tunggal maupun beberapa individu dalam satu citra.
4. Variasi ukuran tubuh dan posisi ikan.
5. Variasi pencahayaan dan latar belakang di lingkungan pelabuhan.

Citra bawah air (*underwater image*) tidak menjadi fokus utama karena skenario penggunaan sistem diarahkan pada proses identifikasi hasil tangkapan di lingkungan pendaratan ikan.

### C. Batasan Objek Identifikasi

Objek identifikasi sistem dibatasi pada tiga jenis ikan:

| No. | Nama Lokal | Nama Ilmiah | Famili |
|---|---|---|---|
| 1 | Kembung perempuan | *Rastrelliger brachysoma* | Scombridae |
| 2 | Selar kuning | *Selaroides leptolepis* | Carangidae |
| 3 | Kuniran | *Upeneus sulphureus* | Mullidae |

Ketiga objek tersebut ditetapkan berdasarkan penamaan dan identifikasi jenis ikan pada data PIPP KKP untuk PPN Karangantu serta acuan taksonomi KKP.

### D. Batasan Fungsional Sistem

ByCatch AI direncanakan memiliki beberapa fungsi utama:

1. **Fish Detection:** Mendeteksi keberadaan ikan pada citra hasil tangkapan.
2. **Fish Classification:** Mengidentifikasi ikan berdasarkan tiga kelas spesies yang telah ditentukan.
3. **Catch Identification:** Membantu mengidentifikasi dan mengelompokkan hasil tangkapan utama maupun non-target berdasarkan informasi kegiatan penangkapan.
4. **Catch Monitoring:** Menyediakan informasi hasil identifikasi untuk mendukung pencatatan dan monitoring hasil tangkapan.
5. **Conservation Screening:** Menjadi dasar integrasi informasi status konservasi spesies dari sumber resmi pada tahap pengembangan berikutnya.

Sistem tidak akan menentukan status bycatch hanya berdasarkan bentuk visual ikan. Penentuan tersebut membutuhkan informasi tambahan mengenai alat tangkap, spesies yang menjadi target operasi, dan catatan hasil tangkapan.

---

## 3. Identifikasi dan Validasi Spesies (Species Identification)

Berdasarkan hasil penelusuran data PIPP KKP dan literatur pendukung, tiga objek penelitian ditetapkan sebagai berikut.

### A. Ikan Kembung Perempuan (*Rastrelliger brachysoma*)

**Klasifikasi umum:**
- Kingdom: Animalia
- Phylum: Chordata
- Class: Actinopterygii
- Order: Scombriformes
- Family: Scombridae
- Genus: *Rastrelliger*
- Species: *Rastrelliger brachysoma*

**Karakteristik morfologi:**

Ikan kembung perempuan merupakan ikan pelagis kecil yang mempunyai tubuh relatif pendek, tinggi, dan agak pipih. Tubuhnya memiliki warna punggung biru kehijauan hingga keabu-abuan, sedangkan bagian perut cenderung berwarna keperakan.

Salah satu karakteristik penting spesies ini adalah bentuk tubuh yang relatif dalam atau tinggi dibandingkan panjang tubuhnya. Bagian insang juga memiliki tapis insang (*gill rakers*) yang panjang dan rapat.

**Fokus identifikasi visual AI:**
- Bentuk tubuh relatif tinggi dan kompak.
- Warna punggung dan bagian perut.
- Bentuk kepala dan bagian operkulum.
- Susunan sirip dorsal dan sirip anal.
- Karakteristik tubuh yang membedakannya dari jenis kembung lainnya.

**Catatan penelitian:**

Identifikasi perlu memperhatikan kemiripan dengan spesies lain dalam genus *Rastrelliger*, khususnya *Rastrelliger kanagurta*. Identifikasi akhir harus menggunakan referensi taksonomi dan sampel yang terverifikasi.

### B. Ikan Selar Kuning (*Selaroides leptolepis*)

**Klasifikasi umum:**
- Kingdom: Animalia
- Phylum: Chordata
- Class: Actinopterygii
- Order: Carangiformes
- Family: Carangidae
- Genus: *Selaroides*
- Species: *Selaroides leptolepis*

**Karakteristik morfologi:**

Ikan selar kuning merupakan ikan pelagis kecil yang memiliki bentuk tubuh memanjang, lonjong, dan pipih. Bagian punggung umumnya berwarna biru metalik, sedangkan bagian bawah tubuh berwarna putih keperakan.

Ciri visual yang cukup khas adalah garis kuning lebar yang membentang dari bagian atas mata hingga pangkal ekor. Selain itu, terdapat bintik hitam pada bagian tepi atas tutup insang (*operculum*).

**Fokus identifikasi visual AI:**
- Garis kuning memanjang pada bagian sisi tubuh.
- Warna tubuh keperakan.
- Bintik hitam pada bagian operkulum.
- Bentuk tubuh yang memanjang dan pipih.
- Karakteristik mata dan susunan sirip.

**Catatan penelitian:**

Nama selar dalam perdagangan dan kegiatan perikanan dapat merujuk pada beberapa jenis ikan. Oleh karena itu, objek penelitian ini secara khusus menggunakan ikan selar kuning (*Selaroides leptolepis*), bukan seluruh ikan dari genus *Selar*.

Jenis ini juga perlu dibedakan dari selar bentong (*Selar crumenophthalmus*) dan jenis ikan lain dari famili Carangidae.

### C. Ikan Kuniran (*Upeneus sulphureus*)

**Klasifikasi umum:**
- Kingdom: Animalia
- Phylum: Chordata
- Class: Actinopterygii
- Order: Mulliformes
- Family: Mullidae
- Genus: *Upeneus*
- Species: *Upeneus sulphureus*

**Karakteristik morfologi:**

Ikan kuniran merupakan ikan demersal yang umumnya ditemukan di sekitar dasar perairan. Ikan ini memiliki bentuk tubuh memanjang dengan warna punggung keabu-abuan hingga kecokelatan dan bagian perut berwarna keperakan.

Karakteristik paling menonjol adalah keberadaan dua sungut (*barbels*) pada bagian bawah dagu yang digunakan untuk membantu mencari makanan di dasar perairan.

Pada spesies *Upeneus sulphureus*, terdapat pola garis kekuningan atau jingga pada bagian samping tubuh serta karakteristik tertentu pada sirip dorsal.

**Fokus identifikasi visual AI:**
- Dua sungut pada bagian dagu.
- Bentuk tubuh memanjang.
- Pola warna tubuh kekuningan dan keperakan.
- Susunan dua sirip dorsal.
- Karakteristik kepala dan bagian mulut.

**Catatan penelitian:**

Identifikasi ikan kuniran harus memperhatikan karakteristik sungut dan pola morfologi lainnya. Hal tersebut penting karena famili Mullidae memiliki beberapa spesies yang mempunyai kemiripan bentuk tubuh.

---

## 4. Penetapan Kelas Dataset (Dataset Class Definition)

Berdasarkan tiga objek penelitian yang telah ditentukan, struktur kelas utama untuk model AI ditetapkan sebagai berikut:

| Class ID | Nama Kelas | Nama Ilmiah |
|---|---|---|
| 0 | kembung_perempuan | *Rastrelliger brachysoma* |
| 1 | selar_kuning | *Selaroides leptolepis* |
| 2 | kuniran | *Upeneus sulphureus* |

**Total kelas utama: 3 kelas.**

Nama kelas menggunakan format huruf kecil dan tanda underscore agar konsisten dengan kebutuhan pemrograman dan anotasi dataset.

Setiap objek ikan yang muncul pada citra akan diberikan label sesuai dengan hasil identifikasi spesies yang telah diverifikasi.

Apabila suatu ikan tidak dapat diidentifikasi dengan tingkat keyakinan yang memadai, sampel tersebut akan dimasukkan ke kategori pemeriksaan ulang dan tidak langsung dipaksakan masuk ke salah satu kelas.

---

## 5. Definisi Target Catch dan Bycatch

Salah satu aspek utama dalam pengembangan ByCatch AI adalah membedakan hasil tangkapan utama (*target catch*) dan hasil tangkapan sampingan (*bycatch*).

Berdasarkan terminologi FAO, bycatch merupakan bagian hasil tangkapan yang tertangkap secara tidak disengaja selain spesies yang menjadi sasaran operasi penangkapan.

Dengan demikian, ketiga objek penelitian tidak otomatis berstatus bycatch.

Pengelompokan dilakukan berdasarkan informasi kegiatan penangkapan dengan mempertimbangkan:

1. Jenis alat tangkap yang digunakan.
2. Jenis ikan yang menjadi target penangkapan.
3. Komposisi hasil tangkapan.
4. Status ikan yang dipertahankan atau dibuang.
5. Informasi hasil wawancara dan catatan pendaratan ikan.

Untuk keperluan dataset, disiapkan struktur metadata berikut:

| Field | Keterangan |
|---|---|
| species_label | Identitas jenis ikan |
| target_species | Spesies yang menjadi sasaran penangkapan |
| fishing_gear | Jenis alat tangkap |
| catch_role | Peran ikan dalam hasil tangkapan |
| catch_handling | Dipertahankan atau dibuang |
| landing_date | Tanggal pendaratan |
| vessel_trip_id | Identitas kegiatan atau perjalanan penangkapan |

Kategori `catch_role` direncanakan terdiri atas:

- `target`: Hasil tangkapan utama.
- `incidental_non_target_retained`: Hasil tangkapan non-target yang dipertahankan.
- `discarded_non_target`: Hasil tangkapan non-target yang dibuang.
- `unverified`: Status belum dapat dipastikan.

Pemisahan antara identifikasi spesies dan penentuan peran tangkapan diperlukan agar sistem tidak menghasilkan kesimpulan bycatch yang keliru hanya berdasarkan karakteristik morfologi.

---

## 6. Strategi Identifikasi dan Validasi Taksonomi

Sebelum dataset dikumpulkan dalam jumlah besar, diperlukan proses validasi identitas setiap objek penelitian.

Strategi validasi yang ditetapkan adalah:

**Tahap 1 — Validasi Literatur**

Menggunakan referensi taksonomi dari:
- Kementerian Kelautan dan Perikanan.
- FishBase.
- World Register of Marine Species (WoRMS).
- Literatur ilmiah mengenai identifikasi ikan.

**Tahap 2 — Validasi Sampel Lapangan**

Melakukan dokumentasi fisik ikan yang ditemukan di PPN Karangantu.

Sampel ikan dicocokkan dengan karakteristik morfologi dan nama ilmiah berdasarkan literatur.

**Tahap 3 — Validasi Label**

Setiap jenis ikan yang akan digunakan dalam dataset diperiksa kembali agar tidak terjadi kesalahan penamaan maupun klasifikasi.

**Tahap 4 — Penetapan Label Final**

Setelah proses verifikasi dilakukan, label spesies ditetapkan sebagai label resmi dalam dataset ByCatch AI.

---

## 7. Strategi Pengambilan Data (Initial Data Collection Strategy)

Pengambilan dataset primer akan dilaksanakan di PPN Karangantu.

Prosedur awal dokumentasi citra meliputi:

1. Mengumpulkan sampel ikan dari aktivitas pendaratan hasil tangkapan.
2. Mengidentifikasi jenis ikan berdasarkan karakteristik morfologi.
3. Mengambil foto ikan dengan posisi tubuh terlihat secara jelas.
4. Mendokumentasikan bagian tubuh, kepala, sirip, dan karakteristik pembeda setiap spesies.
5. Mencatat informasi tanggal pendaratan dan alat tangkap apabila tersedia.
6. Memberikan identitas unik pada setiap sampel.
7. Menyimpan citra berdasarkan kelas spesies masing-masing.

Dataset primer akan diupayakan mencakup variasi ukuran ikan, kondisi pencahayaan, posisi tubuh, serta kondisi lingkungan pendaratan.

Dokumentasi untuk setiap individu sebaiknya dilakukan dari sisi lateral dengan seluruh bagian tubuh terlihat. Foto tambahan dapat diambil apabila diperlukan untuk memperlihatkan karakteristik morfologi yang sulit dikenali dari satu sudut.

---

## 8. Rancangan Struktur Dataset

Struktur direktori dataset yang direncanakan:

```text
bycatch/
│
├── dataset/
│   │
│   ├── raw/
│   │   ├── kembung_perempuan/
│   │   ├── selar_kuning/
│   │   └── kuniran/
│   │
│   ├── curated/
│   │   ├── kembung_perempuan/
│   │   ├── selar_kuning/
│   │   └── kuniran/
│   │
│   ├── annotated/
│   │
│   └── processed/
│
├── metadata/
│   ├── species_reference.csv
│   ├── image_metadata.csv
│   └── catch_metadata.csv
│
├── models/
│
├── scripts/
│
├── results/
│
└── documentation/
```

Keterangan:

- `raw`: Menyimpan seluruh citra asli hasil pengumpulan.
- `curated`: Menyimpan citra yang telah lolos pemeriksaan kualitas dan validasi spesies.
- `annotated`: Menyimpan citra yang telah diberikan anotasi objek.
- `processed`: Menyimpan dataset yang telah disiapkan untuk pelatihan dan evaluasi.
- `metadata`: Menyimpan informasi spesies, citra, dan konteks hasil tangkapan.
- `models`: Menyimpan model AI yang telah dilatih.
- `scripts`: Menyimpan kode pengolahan data dan pengembangan sistem.
- `results`: Menyimpan hasil pelatihan dan evaluasi.
- `documentation`: Menyimpan dokumentasi teknis dan penelitian.

Struktur tersebut merupakan rancangan awal dan dapat disesuaikan ketika metode anotasi dan arsitektur model sudah ditentukan pada Phase 6.

---

## 9. Kriteria Keberhasilan Phase 2 (Acceptance Criteria)

Phase 2 dapat dinyatakan selesai apabila seluruh kriteria berikut telah terpenuhi:

| No. | Kriteria | Status |
|---|---|---|
| 1 | Wilayah penelitian ditetapkan pada PPN Karangantu | Selesai |
| 2 | Objek penelitian terdiri atas tiga jenis ikan | Selesai |
| 3 | Nama ilmiah ketiga objek telah memiliki acuan taksonomi | Selesai, perlu verifikasi sampel |
| 4 | Karakteristik morfologi setiap objek telah dirumuskan | Selesai sebagai acuan awal |
| 5 | Kelas dataset telah ditetapkan | Selesai |
| 6 | Definisi target catch dan bycatch telah dirumuskan | Selesai sebagai definisi operasional awal |
| 7 | Struktur metadata dan dataset telah dirancang | Selesai sebagai rancangan awal |
| 8 | Kriteria pengumpulan citra telah ditetapkan | Selesai sebagai rancangan awal |
| 9 | Kesesuaian spesies dengan sampel hasil tangkapan PPN Karangantu telah diverifikasi secara langsung | Belum |
| 10 | Persiapan izin dan pelaksanaan pengumpulan data primer | Belum |

---

## 10. Keputusan Akhir Phase 2

Berdasarkan hasil penentuan ruang lingkup dan identifikasi spesies, ditetapkan beberapa keputusan awal:

1. ByCatch AI hanya difokuskan pada tiga kelas spesies utama.
2. Ikan kembung perempuan menggunakan nama ilmiah *Rastrelliger brachysoma*.
3. Ikan selar dipersempit menjadi ikan selar kuning dengan nama ilmiah *Selaroides leptolepis*.
4. Ikan kuniran menggunakan nama ilmiah *Upeneus sulphureus*.
5. Lokasi penelitian tetap dibatasi pada PPN Karangantu, Kota Serang, Banten.
6. Identifikasi citra dipusatkan pada hasil tangkapan yang telah didaratkan.
7. Penentuan target catch dan bycatch menggunakan informasi operasional perikanan sebagai metadata pendukung.
8. Dataset primer akan menjadi sumber utama pengembangan model, sedangkan dataset sekunder digunakan sebagai data pendukung setelah lolos validasi.

**Status keputusan:** Ruang lingkup dan identitas taksonomi telah ditetapkan secara awal berdasarkan referensi resmi. Validasi lapangan tetap menjadi persyaratan sebelum dataset final dikunci.

---

## 11. Status Roadmap Proyek

- [x] **PHASE 0 — Initial Project Audit** (Selesai - Didokumentasikan)
- [x] **PHASE 1 — Problem Identification and Research Foundation** (Selesai - Disetujui)
- [ ] **PHASE 2 — Scope and Species Identification** (Menunggu Validasi Lapangan)
- [ ] **PHASE 3 — Dataset Acquisition** (In Progress — Pemetaan Sumber dan Persiapan Akuisisi)
- [ ] **PHASE 4 — Dataset Validation and Curation**
- [ ] **PHASE 5 — Data Annotation and Preparation**
- [ ] **PHASE 6 — Model Architecture and Method Selection**
- [ ] **PHASE 7 — Model Training**
- [ ] **PHASE 8 — Model Evaluation**
- [ ] **PHASE 9 — Conservation Information Integration**
- [ ] **PHASE 10 — Dashboard and System Development**
- [ ] **PHASE 11 — System Testing and Validation**
- [ ] **PHASE 12 — Final Prototype and Documentation**

---

## 12. Referensi Utama

1. Kementerian Kelautan dan Perikanan. (2021). **Keputusan Menteri Kelautan dan Perikanan Nomor 37 Tahun 2021 tentang Struktur Basis Data Ikan dan Data Induk Ikan.**
2. Kementerian Kelautan dan Perikanan. **Pusat Informasi Pelabuhan Perikanan (PIPP) — Profil dan Produksi PPN Karangantu.**
3. FishBase. **Rastrelliger brachysoma — Short Mackerel.**
4. FishBase. **Selaroides leptolepis — Yellowstripe Scad.**
5. FishBase. **Upeneus sulphureus — Sulphur Goatfish.**
6. Food and Agriculture Organization (FAO). **FAO Term Portal — Definition of Bycatch.**
7. Triyono, H., Muzakki, S. A., & Mulyoto. (2020). Studi komparatif alat tangkap jaring insang dan bagan perahu terhadap hasil tangkapan ikan yang didaratkan di Pelabuhan Perikanan Nusantara (PPN) Karangantu, Serang, Banten.
