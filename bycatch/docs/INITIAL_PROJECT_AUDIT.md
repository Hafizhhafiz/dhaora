# INITIAL PROJECT AUDIT REPORT (PHASE 0)

**Proyek:** ByCatch AI — AI-Based Fisheries Monitoring & Conservation Support System  
**Ekosistem:** FishGuard AI (ASIK V)  
**Status Audit:** Selesai (Completed)  
**Tanggal:** 14 November 2026  
**Auditor / Konsultan:** AI Research Mentor & Technical Consultant  

---

## 1. Ringkasan Eksekutif

ByCatch AI merupakan modul inovasi ketiga dalam ekosistem **FishGuard AI (ASIK V)** yang bertujuan mengidentifikasi hasil tangkapan non-target (*bycatch*), membedakan hasil tangkapan target dan non-target berdasarkan konteks kegiatan perikanan, serta menyaring informasi status konservasi spesies berdasarkan sumber otoritatif, seperti IUCN Red List, CITES, dan regulasi Kementerian Kelautan dan Perikanan Republik Indonesia (KKP RI).

Audit awal (*Phase 0*) dilakukan untuk memetakan kondisi dasar aset proyek, kesiapan perangkat keras dan perangkat lunak, ketersediaan data, batasan teknis, serta arah penelitian sebelum memasuki tahap perancangan arsitektur sistem dan pengembangan model kecerdasan buatan (*Artificial Intelligence*).

Dalam pengembangannya, ByCatch AI difokuskan pada identifikasi tiga jenis ikan yang menjadi objek penelitian, yaitu **ikan kembung perempuan (*Rastrelliger brachysoma*), ikan selar (*Selar* sp.), dan ikan kuniran (*Upeneus* sp.)**. Ketiga jenis ikan tersebut akan digunakan sebagai objek identifikasi dan klasifikasi citra untuk mendukung proses monitoring serta pengelompokan hasil tangkapan di PPN Karangantu, Kota Serang, Banten.

---

## 2. Inventarisasi Aset (Available Assets)

| Kategori | Status Saat Ini | Detail & Temuan Audit |
| :--- | :--- | :--- |
| **Workspace Direktori** | Bersih / Siap Pakai | Direktori kerja `c:\ali\tugas\asik\bycatch` siap dikelola dengan struktur standar proyek penelitian AI. |
| **Dokumen Konsep & Literatur** | Konsep Makro Ada, Khusus Belum Ada | Konsep ekosistem makro ASIK V sudah tersedia. Namun, kajian teoritis spesifik mengenai bycatch, identifikasi ikan kembung perempuan, selar, dan kuniran, status konservasi, regulasi alat tangkap, serta *research gap* ByCatch AI masih perlu dibangun dan dikembangkan. |
| **Dataset Primer** | Belum Ada (Zero Data) | Dataset primer khusus untuk objek penelitian di PPN Karangantu belum tersedia. Dataset FishGuard AI yang sebelumnya berfokus pada ikan kembung dan layang berpotensi menjadi sumber pendukung untuk objek ikan kembung setelah kesesuaian spesies dan labelnya diverifikasi. Namun, dataset tersebut belum dapat langsung digunakan untuk mewakili ketiga objek penelitian. Diperlukan akuisisi dataset sekunder dan pengumpulan data primer melalui dokumentasi citra ikan di lokasi penelitian. |
| **Perangkat Keras (Hardware)** | Cukup & Siap Digunakan | **GPU:** NVIDIA GeForce RTX 3050 Laptop GPU (4 GB VRAM, Driver 573.05, dukungan CUDA 12.8).<br>**RAM:** sekitar 8 GB fisik (sekitar 1,1 GB tersedia pada kondisi idle/background).<br>**OS:** Windows 11 Home 64-bit. |
| **Lingkungan Pemrograman** | Python `venv` Direncanakan | Disepakati menggunakan Python standar dengan virtual environment (`venv`) agar lingkungan pengembangan lebih ringan, terisolasi, dan mudah dikelola. |

---

## 3. Analisis Kebutuhan dan Kendala (Constraints & Gaps)

### A. Kendala Teknis & Komputasi

1. **Kapasitas VRAM (4 GB):** Model deteksi objek berskala besar, seperti YOLOv8x atau arsitektur vision transformer yang berat, kurang realistis untuk pelatihan lokal dengan kapasitas GPU yang tersedia. Model baseline yang direkomendasikan adalah varian ringan seperti YOLOv8n, YOLOv8s, YOLO11n, atau YOLO11s. Pengujian awal dapat menggunakan resolusi input 640 × 640 dengan batch size 4 atau lebih rendah apabila diperlukan. Penyesuaian batch size dilakukan berdasarkan penggunaan VRAM selama pelatihan.

2. **Kapasitas RAM Sistem (8 GB):** Data loader harus dikonfigurasi dengan `num_workers` rendah, yaitu 0 atau 2. Penggunaan caching memori juga perlu dikontrol agar tidak terjadi lonjakan penggunaan RAM yang dapat menyebabkan penurunan kinerja sistem (*system thrashing*).

3. **Instalasi Python:** Perlu dilakukan penyiapan instalasi Python secara mandiri dan stabil sebelum tahap penulisan skrip pengolahan dataset, pelatihan model, dan pengembangan sistem dimulai.

### B. Kendala Ilmiah & Metodologis

1. **Definisi Konteks Bycatch:** Status bycatch bersifat kontekstual terhadap jenis alat tangkap, metode penangkapan, serta tujuan operasi penangkapan ikan. Oleh karena itu, ikan kembung perempuan, selar, maupun kuniran tidak dapat secara otomatis dikategorikan sebagai bycatch tanpa mengetahui konteks kegiatan penangkapannya.

2. **Kesesuaian Domain Citra:** Citra ikan di lingkungan bawah air (*underwater*) memiliki karakteristik visual yang berbeda dengan citra ikan di atas geladak kapal (*deck/on-board*) maupun di Tempat Pelelangan Ikan (TPI). Dataset yang dikumpulkan harus disesuaikan dengan skenario penggunaan sistem, yaitu identifikasi citra hasil tangkapan di lokasi pendaratan ikan.

3. **Kemiripan Morfologi Antarjenis Ikan:** Ikan kembung perempuan dan ikan selar memiliki karakteristik sebagai ikan pelagis kecil dengan bentuk tubuh yang relatif memanjang dan pipih. Sementara itu, ikan kuniran memiliki karakteristik tubuh memanjang dan sungut pada bagian dagu. Kemiripan karakteristik visual pada beberapa jenis ikan dapat menjadi tantangan bagi model dalam melakukan klasifikasi secara akurat.

4. **Penyaringan Konservasi:** Penentuan status konservasi berdasarkan IUCN, CITES, dan regulasi KKP RI harus menggunakan identitas taksonomi yang valid. Identifikasi hingga tingkat spesies perlu diverifikasi berdasarkan nama ilmiah, bukan hanya berdasarkan nama lokal ikan.

5. **Validitas Label Dataset:** Setiap citra ikan harus memiliki label yang sesuai dengan identitas jenis ikan sebenarnya. Kesalahan pelabelan antara ikan kembung perempuan, selar, dan kuniran dapat memengaruhi kualitas pelatihan serta hasil evaluasi model AI.

---

## 4. Analisis Potensi Lokasi Penelitian: PPN Karangantu, Kota Serang, Banten

### A. Lokasi Penelitian

Penelitian ByCatch AI difokuskan pada **Pelabuhan Perikanan Nusantara (PPN) Karangantu**, yang berlokasi di Kelurahan Banten, Kecamatan Kasemen, Kota Serang, Provinsi Banten.

PPN Karangantu merupakan salah satu pusat aktivitas perikanan tangkap yang berperan dalam kegiatan pendaratan ikan, pelayanan kapal perikanan, serta distribusi hasil tangkapan di wilayah Banten.

Berdasarkan pembagian wilayah pengelolaan perikanan yang digunakan dalam perencanaan penelitian ini, PPN Karangantu termasuk dalam wilayah pengelolaan perikanan **WPPNRI 712 (Laut Jawa)**. Dengan demikian, lokasi penelitian secara khusus dibatasi pada kawasan PPN Karangantu, bukan seluruh wilayah WPPNRI 712.

### B. Objek Penelitian

Pengembangan sistem ByCatch AI difokuskan pada tiga jenis ikan yang menjadi objek identifikasi dan klasifikasi citra, yaitu:

1. **Ikan Kembung Perempuan (*Rastrelliger brachysoma*):** Merupakan ikan pelagis kecil yang memiliki nilai ekonomis penting dalam kegiatan perikanan tangkap. Ikan ini mempunyai bentuk tubuh fusiform (memanjang dan agak pipih), warna punggung cenderung biru kehijauan, serta bagian tubuh berwarna keperakan. Karakteristik morfologi tersebut dapat digunakan sebagai dasar pengenalan visual oleh model AI.

2. **Ikan Selar (*Selar* sp.):** Merupakan kelompok ikan pelagis kecil yang banyak dimanfaatkan dalam kegiatan perikanan tangkap. Ikan selar memiliki bentuk tubuh relatif memanjang dan pipih, dengan warna tubuh yang umumnya keperakan. Karakteristik bentuk tubuh, pola warna, dan bagian sirip dapat digunakan sebagai dasar identifikasi visual untuk membedakannya dari jenis ikan pelagis kecil lainnya.

3. **Ikan Kuniran (*Upeneus* sp.):** Merupakan kelompok ikan demersal yang umumnya hidup di sekitar dasar perairan berpasir atau berlumpur. Ikan ini memiliki bentuk tubuh memanjang, warna tubuh yang cenderung kekuningan atau kemerahan, serta dua sungut pada bagian dagu yang menjadi salah satu ciri khasnya. Karakteristik morfologi tersebut dapat digunakan sebagai dasar identifikasi dan klasifikasi citra menggunakan model AI.

Ketiga jenis ikan tersebut dipilih sebagai objek penelitian untuk mengembangkan kemampuan sistem dalam mengenali dan mengklasifikasikan jenis ikan berdasarkan karakteristik visual. Hasil identifikasi selanjutnya dapat digunakan untuk membantu proses pengelompokan hasil tangkapan utama (*target catch*) dan hasil tangkapan sampingan (*bycatch*) berdasarkan konteks alat tangkap serta tujuan operasi penangkapan ikan di PPN Karangantu.

**Catatan taksonomi:** Nama ilmiah ikan kembung perempuan telah ditentukan sebagai *Rastrelliger brachysoma*. Sementara itu, ikan selar dan kuniran masih ditulis pada tingkat genus (*Selar* sp. dan *Upeneus* sp.) karena nama lokal tersebut dapat merujuk pada lebih dari satu spesies. Penentuan nama ilmiah hingga tingkat spesies akan dilakukan melalui verifikasi sampel dan literatur taksonomi pada tahap penelitian berikutnya.

### C. Fokus Permasalahan ByCatch AI di PPN Karangantu

1. Kesulitan dalam mengidentifikasi jenis ikan secara cepat dan akurat berdasarkan citra hasil tangkapan di lokasi pendaratan ikan.
2. Kemiripan karakteristik morfologi antara ikan kembung perempuan dan ikan selar yang dapat menyulitkan proses identifikasi visual secara manual maupun otomatis.
3. Perbedaan karakteristik morfologi ikan kuniran dengan ikan pelagis kecil lainnya yang perlu dikenali oleh sistem agar proses klasifikasi dapat dilakukan secara tepat.
4. Belum optimalnya proses identifikasi dan pemisahan hasil tangkapan utama (*target catch*) dengan hasil tangkapan sampingan (*bycatch/incidental catch*) berdasarkan konteks kegiatan penangkapan.
5. Keterbatasan dataset citra lokal ikan kembung perempuan, selar, dan kuniran yang memiliki label jenis ikan terverifikasi di PPN Karangantu.
6. Kebutuhan sistem identifikasi ikan otomatis untuk mendukung kegiatan monitoring dan pencatatan hasil tangkapan (*port sampling monitoring*).

### D. Batasan Wilayah Penelitian

Penelitian ini hanya dilakukan di kawasan **PPN Karangantu, Kota Serang, Banten**. Pengambilan data primer, observasi aktivitas perikanan, dokumentasi citra ikan, serta pengujian sistem diarahkan pada lokasi tersebut.

Objek identifikasi dibatasi pada tiga jenis ikan, yaitu ikan kembung perempuan (*Rastrelliger brachysoma*), ikan selar (*Selar* sp.), dan ikan kuniran (*Upeneus* sp.).

Data dari wilayah lain tidak menjadi objek pengambilan data primer. Apabila dataset sekunder dari luar wilayah penelitian digunakan, pemanfaatannya dibatasi sebagai data pendukung atau *pre-training* model AI dengan tetap memperhatikan kesesuaian karakteristik citra, identitas spesies, dan kualitas label dataset.

---

## 5. Status Roadmap Proyek

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
