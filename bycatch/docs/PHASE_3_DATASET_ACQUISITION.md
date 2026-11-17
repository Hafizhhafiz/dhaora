# PHASE 3 — DATASET ACQUISITION

**Proyek:** ByCatch AI — AI-Based Fisheries Monitoring & Conservation Support System  
**Ekosistem:** FishGuard AI (ASIK V)  
**Status:** In Progress (Persiapan dan Pemetaan Sumber Dataset)  
**Tanggal:** 17 November 2026  
**Lokasi Penelitian:** PPN Karangantu, Kota Serang, Banten  
**Wilayah Pengelolaan Perikanan:** WPPNRI 712 (Laut Jawa)  

---

## 1. Tujuan Phase 3

PHASE 3 merupakan tahap pengumpulan dataset citra yang akan digunakan sebagai bahan utama dalam pengembangan model kecerdasan buatan ByCatch AI.

Tahap ini berfokus pada pencarian, pengumpulan, dan inventarisasi citra ikan berdasarkan tiga objek penelitian yang telah ditetapkan pada Phase 2.

Dataset yang dikumpulkan berasal dari dua sumber utama, yaitu dataset primer yang diperoleh melalui dokumentasi langsung di PPN Karangantu dan dataset sekunder yang diperoleh dari sumber terbuka, repositori ilmiah, serta basis data biodiversitas.

Tujuan utama Phase 3 adalah:

1. Mengidentifikasi sumber dataset publik yang menyediakan citra ketiga jenis ikan penelitian.
2. Mengumpulkan citra ikan dari sumber yang dapat dipertanggungjawabkan.
3. Menyiapkan strategi pengambilan gambar primer di PPN Karangantu.
4. Menentukan target jumlah citra untuk setiap kelas.
5. Menyusun sistem pencatatan sumber, lisensi, dan identitas setiap citra.
6. Memastikan dataset yang dikumpulkan sesuai dengan kebutuhan pengembangan model AI.
7. Memisahkan dataset berdasarkan sumber dan tingkat validitas identifikasi spesies.

---

## 2. Objek Dataset (Target Species)

Pengumpulan dataset tetap dibatasi pada tiga kelas utama berikut:

| Class ID | Nama Kelas | Nama Ilmiah | Famili |
|---|---|---|---|
| 0 | kembung_perempuan | *Rastrelliger brachysoma* | Scombridae |
| 1 | selar_kuning | *Selaroides leptolepis* | Carangidae |
| 2 | kuniran | *Upeneus sulphureus* | Mullidae |

**Total target: 3 kelas spesies.**

Setiap citra harus memiliki identitas spesies yang jelas. Foto dari spesies lain yang memiliki kemiripan morfologi tidak boleh dimasukkan sebagai bagian dari salah satu kelas tersebut.

---

## 3. Strategi Sumber Akuisisi Dataset

Pengumpulan dataset dibagi menjadi dua kategori:

### A. Dataset Primer (Primary Dataset)

Dataset primer merupakan kumpulan citra yang diperoleh melalui dokumentasi langsung di PPN Karangantu.

Dataset ini menjadi sumber data utama karena memiliki kesesuaian dengan kondisi operasional sistem ByCatch AI.

Keunggulan dataset primer:

1. Memiliki kesesuaian lokasi dengan wilayah penelitian.
2. Menggunakan objek ikan yang benar-benar ditemukan dalam aktivitas pendaratan ikan.
3. Dapat disesuaikan dengan kondisi pencahayaan, latar belakang, dan posisi ikan di pelabuhan.
4. Identitas spesies dapat diperiksa secara langsung.
5. Informasi alat tangkap dan konteks hasil tangkapan dapat dikumpulkan sebagai metadata tambahan.

**Rencana lokasi dokumentasi:**

- Area pendaratan ikan PPN Karangantu.
- Tempat Pelelangan Ikan (TPI).
- Area penyortiran hasil tangkapan.
- Area penanganan dan pengelompokan ikan.

Pengambilan data primer dilakukan setelah memperoleh izin dan persetujuan dari pihak terkait.

### B. Dataset Sekunder (Secondary Dataset)

Dataset sekunder diperoleh dari sumber publik yang menyediakan dokumentasi citra ikan.

Sumber ini digunakan untuk melengkapi keterbatasan jumlah citra primer, membantu pengenalan karakteristik morfologi, serta mendukung pengembangan awal model AI.

Sumber yang menjadi prioritas adalah:

1. FishBase.
2. iNaturalist.
3. GBIF (Global Biodiversity Information Facility).
4. Wikimedia Commons.
5. Mendeley Data.
6. Repositori dataset penelitian berbasis computer vision.

---

## 4. Hasil Identifikasi Sumber Dataset Publik

Berdasarkan penelusuran awal, ditemukan beberapa sumber yang relevan dengan kebutuhan penelitian.

### A. FishBase

FishBase merupakan basis data ilmiah yang menyediakan informasi taksonomi, morfologi, habitat, dan dokumentasi foto berbagai jenis ikan.

Tiga halaman yang relevan dengan objek penelitian:

| No. | Spesies | Sumber Citra |
|---|---|---|
| 1 | *Rastrelliger brachysoma* | FishBase Species Gallery |
| 2 | *Selaroides leptolepis* | FishBase Species Gallery |
| 3 | *Upeneus sulphureus* | FishBase Species Gallery |

Tautan sumber:

- https://www.fishbase.se/photos/ThumbnailsSummary.php?ID=109
- https://www.fishbase.se/photos/ThumbnailsSummary.php?ID=388
- https://www.fishbase.se/photos/ThumbnailsSummary.php?ID=4445

**Pemanfaatan:**

FishBase digunakan sebagai sumber referensi visual untuk memeriksa karakteristik tubuh dan membantu validasi awal identitas spesies.

Foto tidak otomatis boleh diunduh dan digunakan untuk pelatihan. Hak cipta setiap foto mengikuti keterangan fotografer atau pemilik gambar yang tercantum pada halaman masing-masing.

### B. iNaturalist

iNaturalist merupakan platform dokumentasi keanekaragaman hayati yang menyediakan foto dan informasi observasi organisme dari berbagai wilayah.

Salah satu sumber yang telah ditemukan adalah galeri foto *Upeneus sulphureus*.

Tautan:  
https://www.inaturalist.org/taxa/347936-Upeneus-sulphureus/browse_photos

**Pemanfaatan:**

1. Mencari foto spesies berdasarkan nama ilmiah.
2. Memeriksa karakteristik morfologi berdasarkan dokumentasi lapangan.
3. Mendapatkan variasi bentuk dan warna tubuh.
4. Mengumpulkan citra tambahan setelah memeriksa lisensi masing-masing foto.

Foto iNaturalist harus diperiksa satu per satu karena pilihan lisensi dapat berbeda antara pengguna dan observasi.

### C. GBIF (Global Biodiversity Information Facility)

GBIF merupakan infrastruktur data biodiversitas global yang menyediakan informasi persebaran, identitas taksonomi, dan catatan observasi organisme.

GBIF dapat digunakan untuk memperoleh data kejadian spesies (*species occurrence*) dan tautan media yang dilampirkan pada catatan observasi.

**Pemanfaatan:**

- Mencari catatan spesies berdasarkan nama ilmiah.
- Memeriksa lokasi dan sumber observasi.
- Mengidentifikasi catatan yang memiliki foto.
- Mengumpulkan metadata dan informasi lisensi.
- Menghubungkan catatan observasi dengan sumber foto aslinya.

Untuk pengumpulan data yang lebih terstruktur, format Darwin Core Archive dapat digunakan karena menyediakan informasi occurrence dan tabel multimedia.

Tautan:  
https://www.gbif.org/

Dokumentasi teknis:  
https://techdocs.gbif.org/en/data-use/download-formats

**Catatan:** Lisensi data occurrence tidak selalu sama dengan lisensi foto yang menyertainya. Setiap media harus diperiksa berdasarkan lisensi dan ketentuan penerbit masing-masing.

### D. Wikimedia Commons

Wikimedia Commons merupakan repositori media terbuka yang menyediakan foto, ilustrasi, dan dokumentasi berbagai organisme.

Kategori yang relevan:

| No. | Spesies | Kategori Wikimedia |
|---|---|---|
| 1 | *Rastrelliger brachysoma* | Category: Rastrelliger brachysoma |
| 2 | *Selaroides leptolepis* | Category: Selaroides leptolepis |
| 3 | *Upeneus sulphureus* | Category: Upeneus sulphureus |

Tautan:

- https://commons.wikimedia.org/wiki/Category:Rastrelliger_brachysoma
- https://commons.wikimedia.org/wiki/Category:Selaroides_leptolepis
- https://commons.wikimedia.org/wiki/Category:Upeneus_sulphureus

**Pemanfaatan:**

Wikimedia Commons dapat digunakan untuk mencari foto ikan dari berbagai sumber dan negara.

Namun, tidak semua gambar dalam kategori tersebut cocok sebagai dataset AI. Beberapa gambar dapat berupa ilustrasi, ikan hasil olahan, foto makanan, atau media yang tidak memperlihatkan karakteristik morfologi secara lengkap.

Setiap berkas harus diperiksa berdasarkan kualitas gambar, identitas spesies, dan lisensi yang berlaku.

### E. Fish-gres Dataset — Mendeley Data

Fish-gres merupakan dataset penelitian yang diperoleh dari dokumentasi ikan di pasar tradisional Kabupaten Gresik, Jawa Timur.

Dataset ini memiliki karakteristik yang cukup relevan karena proses pengambilan gambar dilakukan pada lingkungan pemasaran ikan, bukan hanya lingkungan bawah air.

Informasi dataset:

| Parameter | Keterangan |
|---|---|
| Nama dataset | Fish-gres |
| Jumlah spesies | 8 jenis ikan |
| Jumlah seluruh gambar | 3.248 gambar |
| Resolusi awal | 4160 × 3120 piksel |
| Resolusi setelah pengolahan | 390 × 520 piksel |
| Lokasi akuisisi | Pasar tradisional Gresik |
| Lisensi | CC BY 4.0 |
| Institusi | ITS dan Universitas Bhayangkara Surabaya |

Spesies yang memiliki hubungan taksonomi dengan objek ByCatch AI adalah:

- *Rastrelliger faughni*
- *Upeneus moluccensis*

Kedua spesies tersebut bukan spesies target penelitian. Dengan demikian, gambar dari Fish-gres tidak boleh diberi label *Rastrelliger brachysoma* maupun *Upeneus sulphureus*.

**Rekomendasi pemanfaatan:**

Fish-gres dapat digunakan sebagai sumber pembanding karakteristik ikan dan pengujian awal alur pengolahan citra. Pemanfaatan untuk pelatihan model harus mempertahankan identitas spesies aslinya atau menggunakan anotasi ulang yang sesuai dengan tujuan model.

Sumber:  
https://data.mendeley.com/datasets/76cr3wfhff/1  
DOI: 10.17632/76cr3wfhff.1

### F. FishNet Dataset

FishNet merupakan dataset yang berfokus pada identifikasi ikan dalam lingkungan kegiatan perikanan.

Informasi yang ditemukan:

| Parameter | Keterangan |
|---|---|
| Nama dataset | The Fishnet Open Images Database |
| Jumlah gambar | 143.818 |
| Jumlah anotasi | 549.209 bounding boxes |
| Kategori | 34 jenis ikan dan manusia |
| Lingkungan | Kamera di atas kapal (*on-deck*) |
| Format metadata | CSV |

**Relevansi terhadap ByCatch AI:**

FishNet menjadi salah satu sumber pendukung yang menarik karena citranya berasal dari lingkungan kapal dan kegiatan perikanan.

Dataset ini berpotensi membantu pengembangan kemampuan deteksi objek ikan sebelum model dilatih menggunakan dataset primer ByCatch AI.

Namun, ketersediaan ketiga spesies target dalam label FishNet harus diperiksa terlebih dahulu. Jika tidak ditemukan, dataset tersebut hanya digunakan untuk pengembangan detektor ikan secara umum, bukan untuk menetapkan label spesies target.

Sumber:  
https://github.com/mbari-org/fish-datasets

### G. Community Fish Detection Dataset — LILA

Dataset ini merupakan kompilasi berbagai dataset citra ikan yang berasal dari sekitar 40 sumber publik.

Informasi yang ditemukan:

- Lebih dari 2,5 juta gambar atau frame.
- Lebih dari 2,8 juta bounding box.
- Berasal dari lingkungan air tawar, laut, dan laboratorium.
- Format anotasi COCO.
- Kategori gabungan berupa ikan dan non-ikan.

Dataset tersebut dapat menjadi referensi untuk pengembangan deteksi objek secara umum. Akan tetapi, label gabungannya bukan label spesies yang diperlukan oleh ByCatch AI.

Karena ukurannya sangat besar, pengunduhan keseluruhan dataset tidak direkomendasikan untuk perangkat lokal dengan RAM 8 GB.

**Rekomendasi:** Mengambil subset kecil yang sesuai apabila diperlukan untuk pengujian deteksi objek, dengan pemeriksaan lisensi setiap sumber penyusun.

Sumber:  
https://lila.science/datasets/community-fish-detection-dataset/

---

## 5. Prioritas Sumber Dataset

Berdasarkan hasil pemetaan, prioritas sumber data ditetapkan sebagai berikut:

| Prioritas | Sumber | Fungsi |
|---|---|---|
| 1 | Dokumentasi PPN Karangantu | Dataset utama untuk tiga spesies |
| 2 | FishBase | Referensi visual dan validasi morfologi |
| 3 | iNaturalist | Foto tambahan berdasarkan spesies |
| 4 | Wikimedia Commons | Foto tambahan dengan lisensi terverifikasi |
| 5 | GBIF | Metadata occurrence dan pencarian media |
| 6 | Fish-gres | Data pembanding dan pendukung pengembangan |
| 7 | FishNet | Pendukung pengembangan deteksi ikan |
| 8 | LILA Community Fish Detection | Pendukung deteksi objek secara umum |

**Keputusan sementara:**

Dataset primer PPN Karangantu menjadi sumber utama pelatihan dan evaluasi akhir.

Dataset sekunder digunakan sebagai data pendukung setelah melalui pemeriksaan identitas spesies, kualitas citra, domain gambar, serta hak penggunaan.

Dalam penelusuran awal ini belum ditemukan satu dataset publik siap pakai yang secara bersamaan menyediakan ketiga spesies target dengan kondisi citra pendaratan ikan yang sesuai dengan skenario penelitian.

---

## 6. Target Jumlah Dataset

Agar pengembangan model dapat dilakukan secara bertahap, target pengumpulan citra dibagi menjadi dua tahap.

### A. Target Awal (Pilot Dataset)

| Spesies | Target Gambar |
|---|---:|
| Kembung perempuan | 100 |
| Selar kuning | 100 |
| Kuniran | 100 |
| **Total** | **300** |

Dataset pilot digunakan untuk menguji proses akuisisi, validasi spesies, pengelompokan folder, dan alur anotasi.

### B. Target Dataset Utama

| Spesies | Target Gambar |
|---|---:|
| Kembung perempuan | 500–800 |
| Selar kuning | 500–800 |
| Kuniran | 500–800 |
| **Total** | **1.500–2.400** |

Target tersebut merupakan rekomendasi awal, bukan jumlah minimum yang harus dipaksakan. Jumlah akhir disesuaikan dengan ketersediaan sampel, variasi citra, dan hasil pemeriksaan kualitas.

Pengambilan gambar sebaiknya mencakup banyak individu ikan yang berbeda. Beberapa foto dari satu individu tidak boleh dianggap sebagai sampel biologis yang sepenuhnya independen.

---

## 7. Standar Pengambilan Citra (Image Acquisition Protocol)

Untuk menjaga konsistensi dataset, pengambilan foto di PPN Karangantu harus mengikuti standar dokumentasi.

### A. Standar Umum

1. Foto ikan menggunakan kamera smartphone atau kamera digital dengan kualitas yang memadai.
2. Seluruh bagian tubuh ikan harus terlihat jelas.
3. Hindari gambar yang buram atau terlalu gelap.
4. Hindari objek yang saling menutupi secara berlebihan.
5. Gunakan pencahayaan yang cukup.
6. Hindari penggunaan filter yang mengubah warna asli ikan.
7. Usahakan menggunakan latar belakang yang tidak terlalu ramai.
8. Simpan foto asli sebelum dilakukan pengolahan.

### B. Sudut Pengambilan Gambar

Setiap individu ikan diupayakan memiliki beberapa jenis dokumentasi:

| No. | Sudut Pengambilan | Tujuan |
|---|---|---|
| 1 | Tampak samping (lateral) | Melihat bentuk tubuh secara keseluruhan |
| 2 | Tampak tiga perempat (3/4 view) | Melihat bentuk kepala dan tubuh |
| 3 | Bagian kepala | Memperlihatkan ciri morfologi pembeda |
| 4 | Bagian sirip | Memperlihatkan susunan sirip |
| 5 | Tampak atas (dorsal) | Melihat bentuk dan warna bagian punggung |

Dokumentasi tambahan disesuaikan dengan karakteristik masing-masing spesies:

- **Khusus ikan kembung perempuan:** Bentuk tubuh dan bagian kepala, susunan sirip dorsal, bagian operkulum.
- **Khusus ikan selar kuning:** Garis kuning pada bagian sisi tubuh, bintik hitam pada bagian operkulum, bentuk tubuh dan susunan sirip.
- **Khusus ikan kuniran:** Dua sungut pada bagian dagu, bentuk kepala dan mulut, pola warna tubuh dan susunan sirip dorsal.

---

## 8. Struktur Metadata Dataset

Setiap gambar yang dikumpulkan harus memiliki metadata agar asal-usul dan validitas dataset dapat dilacak.

Struktur metadata yang direncanakan:

| Field | Deskripsi |
|---|---|
| `image_id` | Identitas unik gambar |
| `filename` | Nama file gambar |
| `species_label` | Label spesies (`kembung_perempuan`, `selar_kuning`, `kuniran`) |
| `scientific_name` | Nama ilmiah (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*) |
| `common_name` | Nama lokal |
| `source_type` | Primer atau sekunder (`primary` / `secondary`) |
| `source_name` | Nama sumber dataset (misal: `PPN Karangantu`, `iNaturalist`, dll.) |
| `source_url` | Alamat sumber gambar |
| `image_license` | Lisensi gambar (misal: `CC BY 4.0`, `CC0`, `In-house`) |
| `attribution` | Keterangan pemilik atau fotografer |
| `capture_date` | Tanggal pengambilan gambar |
| `location` | Lokasi pengambilan |
| `specimen_id` | Identitas individu ikan |
| `fishing_gear` | Jenis alat tangkap |
| `target_species` | Spesies sasaran penangkapan |
| `catch_role` | Peran hasil tangkapan (`target`, `incidental_non_target_retained`, `discarded_non_target`) |
| `image_quality` | Kualitas gambar (`good`, `fair`, `blurry`) |
| `verification_status` | Status verifikasi spesies (`verified`, `pending`, `flagged`) |

Metadata tersebut akan disimpan dalam format CSV agar mudah dikelola menggunakan Python, Microsoft Excel, maupun library pengolahan data.

---

## 9. Rancangan Struktur Direktori Akuisisi Dataset

Struktur direktori yang disarankan untuk tahap pengumpulan dataset:

```text
bycatch/
│
├── dataset/
│   │
│   ├── raw/
│   │   ├── primary/
│   │   │   ├── kembung_perempuan/
│   │   │   ├── selar_kuning/
│   │   └── └── kuniran/
│   │   │
│   │   └── secondary/
│   │       ├── kembung_perempuan/
│   │       ├── selar_kuning/
│   │       └── kuniran/
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
│   ├── image_metadata.csv
│   ├── species_reference.csv
│   ├── source_registry.csv
│   └── catch_metadata.csv
│
├── models/
├── scripts/
├── results/
└── documentation/
```

**Penjelasan:**

- `primary`: Menyimpan citra hasil dokumentasi langsung di PPN Karangantu.
- `secondary`: Menyimpan citra dari sumber publik dan repositori penelitian.
- `curated`: Menyimpan citra yang telah lolos pemeriksaan kualitas dan validasi.
- `annotated`: Menyimpan gambar yang telah diberikan anotasi.
- `processed`: Menyimpan dataset yang siap digunakan untuk pelatihan dan evaluasi.

Pemisahan dataset primer dan sekunder dilakukan untuk menghindari tercampurnya asal-usul citra serta memudahkan proses pelacakan sumber.

---

## 10. Ketentuan Lisensi dan Penggunaan Dataset

Penggunaan dataset sekunder harus memperhatikan hak cipta serta ketentuan lisensi masing-masing sumber.

Ketentuan awal yang digunakan:

1. **CC0:** Dapat digunakan tanpa kewajiban atribusi berdasarkan lisensi, meskipun pencatatan sumber tetap disarankan.
2. **CC BY:** Dapat digunakan dengan memberikan atribusi yang sesuai.
3. **CC BY-SA:** Penggunaan dan distribusi adaptasi harus mengikuti ketentuan berbagi serupa.
4. **CC BY-NC:** Penggunaan dibatasi untuk kepentingan nonkomersial.
5. **All Rights Reserved:** Tidak digunakan tanpa memperoleh izin dari pemegang hak cipta.

Setiap gambar harus disertai informasi sumber, pemilik hak cipta, dan lisensi.

Khusus untuk gambar FishBase, lisensi teks dan informasi spesies tidak otomatis berlaku terhadap foto yang tersedia di dalamnya. Hak penggunaan foto mengikuti keterangan masing-masing fotografer atau institusi.

---

## 11. Tahapan Pelaksanaan Akuisisi Dataset

Pelaksanaan PHASE 3 dibagi menjadi lima tahapan:

- **Tahap 1 — Dataset Source Mapping:** Melakukan pencarian sumber citra untuk ketiga spesies berdasarkan nama ilmiah dan nama lokal.
- **Tahap 2 — Secondary Dataset Collection:** Mengumpulkan citra dari FishBase, iNaturalist, GBIF, Wikimedia Commons, dan sumber lain yang memiliki izin penggunaan memadai.
- **Tahap 3 — Primary Dataset Collection:** Melakukan dokumentasi langsung terhadap ikan hasil pendaratan di PPN Karangantu setelah mendapatkan izin.
- **Tahap 4 — Dataset Registration:** Setiap citra dimasukkan ke dalam sistem metadata berdasarkan spesies, sumber, lokasi, dan informasi pendukung.
- **Tahap 5 — Preliminary Dataset Inventory:** Menghitung jumlah citra yang berhasil dikumpulkan untuk setiap spesies serta membuat laporan ketersediaan data.

Pemeriksaan kualitas dan seleksi final dataset akan dilaksanakan secara lebih mendalam pada PHASE 4.

---

## 12. Kriteria Keberhasilan Phase 3 (Acceptance Criteria)

Phase 3 dapat dinyatakan selesai apabila beberapa kriteria berikut telah terpenuhi:

| No. | Kriteria | Target | Status |
|---|---|---|---|
| 1 | Pemetaan sumber dataset publik | Selesai | Selesai (Terpetakan) |
| 2 | Sumber citra tiga spesies teridentifikasi | 3 spesies | Selesai (Terpetakan) |
| 3 | Dataset sekunder berhasil dikumpulkan | Sesuai ketersediaan dan lisensi | Belum |
| 4 | Dataset primer PPN Karangantu berhasil dikumpulkan | 3 spesies | Belum |
| 5 | Target pilot dataset | 300 gambar | Belum |
| 6 | Metadata setiap gambar tersedia | 100% tercatat | Belum |
| 7 | Informasi lisensi dataset sekunder tersedia | 100% tercatat | Belum |
| 8 | Inventarisasi jumlah citra setiap kelas | Tersedia | Belum |
| 9 | Dataset dipisahkan berdasarkan sumber | Terstruktur | Belum |

---

## 13. Keputusan Sementara Phase 3

Berdasarkan hasil pemetaan sumber dataset, ditetapkan keputusan awal sebagai berikut:

1. Dataset primer dari PPN Karangantu menjadi sumber data utama.
2. Dataset sekunder digunakan sebagai sumber pendukung.
3. Pengumpulan data tetap dibatasi pada tiga kelas spesies yang telah ditetapkan.
4. Citra ikan dari spesies berbeda tidak boleh dimasukkan ke dalam kelas target meskipun memiliki kemiripan morfologi.
5. FishBase, iNaturalist, GBIF, dan Wikimedia Commons menjadi prioritas pencarian citra spesifik.
6. Fish-gres dan FishNet dipertimbangkan sebagai sumber pendukung pengembangan.
7. Seluruh citra harus memiliki identitas sumber dan informasi lisensi yang dapat ditelusuri.
8. Jumlah dataset akan ditingkatkan secara bertahap berdasarkan target pilot dan target utama.
9. Dataset yang telah dikumpulkan belum dianggap sebagai dataset final sebelum melalui PHASE 4 — Dataset Validation and Curation.

**Status keputusan:** Strategi dan sumber akuisisi dataset awal telah dipetakan. Pengumpulan serta inventarisasi citra secara aktual masih perlu dilaksanakan.

---

## 14. Status Roadmap Proyek

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

## 15. Referensi Dataset

1. Froese, R. & Pauly, D. (Editors). FishBase. *Species Image Galleries*. https://www.fishbase.org/
2. iNaturalist. *Biodiversity Observation and Photo Database*. https://www.inaturalist.org/
3. GBIF. *Global Biodiversity Information Facility*. https://www.gbif.org/
4. Wikimedia Foundation. *Wikimedia Commons — Fish Species Image Collections*. https://commons.wikimedia.org/
5. Prasetyo, E., Suciati, N., & Fatichah, C. (2021). *Fish-gres Dataset for Fish Species Classification*. Mendeley Data. https://doi.org/10.17632/76cr3wfhff.1
6. Kay, J., & Merrifield, M. (2021). *The Fishnet Open Images Database: A Dataset for Fish Detection and Fine-Grained Categorization in Fisheries*. https://arxiv.org/abs/2106.09178
7. LILA BC. (2026). *Community Fish Detection Dataset*. https://lila.science/datasets/community-fish-detection-dataset/
8. GBIF. *Occurrence Download Formats and Multimedia Data Documentation*. https://techdocs.gbif.org/en/data-use/download-formats
