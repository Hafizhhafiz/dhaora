# PHASE 1 — PROBLEM IDENTIFICATION AND RESEARCH FOUNDATION

**Proyek:** ByCatch AI — AI-Based Fisheries Monitoring & Conservation Support System  
**Ekosistem:** FishGuard AI (ASIK V)  
**Lokasi Penelitian:** PPN Karangantu, Kota Serang, Banten  
**Wilayah Pengelolaan Perikanan:** WPPNRI 712 (Laut Jawa)  
**Tanggal:** 14 November 2026  
**Status:** Disetujui (Approved) — Problem Identification and Research Foundation  

---

## 1. Pendahuluan

ByCatch AI merupakan sistem berbasis kecerdasan buatan (*Artificial Intelligence*) yang dikembangkan sebagai bagian dari ekosistem FishGuard AI (ASIK V). Sistem ini dirancang untuk membantu proses identifikasi ikan berdasarkan citra hasil tangkapan, memberikan informasi mengenai jenis ikan yang terdeteksi, serta mendukung pemantauan hasil tangkapan non-target (*bycatch*).

Pengembangan ByCatch AI difokuskan pada kegiatan pendaratan ikan di Pelabuhan Perikanan Nusantara (PPN) Karangantu, Kota Serang, Banten. Lokasi tersebut dipilih karena memiliki aktivitas perikanan tangkap dan pendaratan berbagai jenis ikan. Penelitian ini berada dalam konteks pengelolaan WPPNRI 712 (Laut Jawa), tetapi pengambilan data primer dan pengujian sistem tetap dibatasi pada kawasan PPN Karangantu.

Berdasarkan Laporan Statistik Perikanan PPN Karangantu Tahun 2025, hasil tangkapan dominan yang didaratkan meliputi tembang, teri, kembung, peperek, dan kuniran. Pada tahun tersebut, produksi ikan teri tercatat sebesar 485 ton, peperek 169 ton, dan kembung 208 ton. Data tersebut menunjukkan bahwa kelompok ikan yang menjadi objek pengembangan ByCatch AI memang tercatat dalam aktivitas pendaratan ikan di lokasi penelitian. Namun, data produksi tersebut belum dapat digunakan untuk menyimpulkan bahwa seluruh ikan tersebut merupakan hasil tangkapan sampingan (PPN Karangantu, 2026).

---

## 2. Identifikasi Permasalahan

Berdasarkan audit awal dan penelusuran literatur, terdapat beberapa permasalahan yang menjadi dasar pengembangan ByCatch AI:

### 2.1 Identifikasi jenis ikan masih membutuhkan pemeriksaan langsung
Identifikasi ikan hasil tangkapan memerlukan pengamatan terhadap bentuk tubuh, warna, pola sisik, bentuk sirip, dan karakteristik morfologi lainnya. Pada beberapa kelompok ikan yang memiliki kemiripan bentuk, proses identifikasi dapat menjadi lebih sulit, terutama ketika dilakukan secara cepat dalam kegiatan pendaratan.

### 2.2 Kemiripan morfologi antarjenis ikan
Ikan peperek dari famili Leiognathidae dan ikan teri dari famili Engraulidae memiliki anggota spesies dengan karakteristik yang beragam. Identifikasi berdasarkan nama lokal saja belum cukup untuk memastikan spesies secara ilmiah.

Hal yang sama berlaku pada kelompok ikan kembung. Nama komoditas kembung yang tercatat dalam statistik pelabuhan belum tentu seluruhnya merupakan *Rastrelliger brachysoma*. Oleh karena itu, identifikasi kembung perempuan perlu didukung pemeriksaan karakter morfologi yang sesuai.

### 2.3 Penentuan status bycatch belum dapat dilakukan hanya berdasarkan jenis ikan
Suatu jenis ikan tidak secara otomatis dikategorikan sebagai bycatch. Penentuan tersebut harus mempertimbangkan tujuan operasi penangkapan, jenis alat tangkap, komposisi hasil tangkapan, serta kebiasaan pemanfaatan hasil tangkapan oleh nelayan.

Dengan demikian, ByCatch AI perlu membedakan dua proses, yaitu identifikasi jenis ikan berdasarkan citra dan penentuan status target atau non-target berdasarkan informasi kegiatan penangkapan.

### 2.4 Keterbatasan dataset citra lokal
Dataset citra yang sesuai dengan kondisi pendaratan ikan di PPN Karangantu masih perlu dikumpulkan dan diverifikasi. Penggunaan dataset publik dari lingkungan bawah air tanpa penyesuaian dapat menimbulkan perbedaan karakter visual ketika model diterapkan pada ikan yang difoto di atas kapal atau di area pendaratan.

### 2.5 Kebutuhan informasi konservasi berbasis identitas spesies
Informasi konservasi harus disesuaikan dengan nama ilmiah spesies yang telah terverifikasi. Nama lokal atau nama famili belum cukup untuk menentukan status IUCN, CITES, maupun ketentuan perlindungan ikan yang berlaku di Indonesia.

---

## 3. Landasan Penelitian dan Studi Terdahulu

### 3.1 Penelitian hasil tangkapan di PPN Karangantu
Triyono, Muzakki, dan Mulyoto (2020) melakukan penelitian mengenai perbandingan hasil tangkapan jaring insang dan bagan perahu yang didaratkan di PPN Karangantu. Hasil penelitian menunjukkan bahwa bagan perahu memiliki hasil tangkapan dominan berupa teri (*Stolephorus* sp.), japuh, dan kembung (*Rastrelliger kanagurta*). Sementara itu, hasil tangkapan jaring insang didominasi oleh selar dan kembung. Penelitian tersebut memperlihatkan bahwa komposisi hasil tangkapan dapat berbeda berdasarkan alat tangkap yang digunakan.

Penelitian tersebut relevan sebagai dasar untuk memahami hubungan antara alat tangkap dan komposisi ikan di PPN Karangantu. Namun, identitas kembung yang disebutkan dalam penelitian tersebut adalah *Rastrelliger kanagurta*, sehingga tidak dapat langsung digunakan sebagai bukti keberadaan *Rastrelliger brachysoma* dalam sampel penelitian ByCatch AI.

### 3.2 Penelitian komposisi hasil tangkapan sampingan
Nurdin (2022) melakukan penelitian mengenai produktivitas dan komposisi hasil tangkapan jaring Apollo di PPN Karangantu. Penelitian menggunakan metode survei dan mengikuti 30 trip operasi penangkapan. Hasil penelitian menunjukkan bahwa jumlah hasil tangkapan sampingan pada jaring Apollo lebih besar dibandingkan hasil tangkapan utamanya.

Penelitian tersebut menjadi salah satu referensi penting karena menunjukkan bahwa persoalan hasil tangkapan sampingan memang telah dikaji pada aktivitas perikanan yang berhubungan dengan PPN Karangantu. Meskipun demikian, hasil penelitian tersebut tidak dapat digeneralisasi untuk seluruh alat tangkap yang beroperasi di pelabuhan.

### 3.3 Perkembangan computer vision untuk pemantauan ikan
Al-Abri et al. (2025) melalui kajian *Computer Vision Based Approaches for Fish Monitoring Systems: A Comprehensive Study* membahas pemanfaatan computer vision untuk pemantauan ikan. Kajian tersebut mencakup deteksi dan pengenalan ikan, estimasi biomassa, klasifikasi perilaku, serta analisis kesehatan ikan.

Kajian ini menunjukkan bahwa computer vision memiliki potensi untuk mendukung pemantauan perikanan. Dalam pengembangan ByCatch AI, pendekatan tersebut dapat diterapkan pada proses deteksi dan identifikasi ikan melalui citra hasil pendaratan.

### 3.4 Kajian taksonomi dan morfologi objek ikan
Identifikasi ikan perlu memperhatikan perbedaan karakter morfologi antarspesies. Kajian genus *Rastrelliger* oleh Bogorodsky et al. (2025) membahas karakter taksonomi beberapa spesies kembung, termasuk *Rastrelliger brachysoma* dan *Rastrelliger kanagurta*. Kajian ini penting sebagai referensi untuk menghindari kesalahan pengelompokan ikan kembung berdasarkan nama lokal.

Pada kelompok ikan teri, penelitian Hata, Sallan, dan Motomura (2026) mendeskripsikan spesies baru *Stolephorus falco* dari Sumatra. Temuan tersebut memperlihatkan bahwa kelompok ikan teri memiliki keragaman spesies yang perlu diperhatikan dalam proses identifikasi.

### 3.5 Kesenjangan penelitian (*Research Gap*)
Berdasarkan sumber yang telah ditelusuri, beberapa penelitian telah membahas komposisi hasil tangkapan, hubungan alat tangkap dengan hasil tangkapan, karakter morfologi ikan, dan penerapan computer vision untuk pemantauan ikan.

Namun, masih terdapat ruang pengembangan berupa penerapan sistem deteksi ikan berbasis citra yang diarahkan secara khusus pada kondisi pendaratan ikan di PPN Karangantu, dengan objek peperek, teri, dan kembung perempuan. Pengembangan tersebut juga perlu menghubungkan hasil identifikasi visual dengan informasi alat tangkap dan konteks operasi penangkapan agar penentuan status target dan non-target tidak hanya didasarkan pada jenis ikan.

Kesenjangan tersebut merupakan indikasi awal berdasarkan literatur yang telah ditelusuri, bukan kesimpulan bahwa belum pernah ada penelitian serupa. Penelusuran pustaka yang lebih sistematis tetap diperlukan sebelum menyatakan kebaruan penelitian secara final.

---

## 4. Rumusan Masalah

Berdasarkan identifikasi permasalahan tersebut, rumusan masalah penelitian ini adalah:

1. Bagaimana mengidentifikasi ikan peperek, ikan teri, dan ikan kembung perempuan berdasarkan citra hasil pendaratan di PPN Karangantu?
2. Bagaimana membangun dataset citra lokal yang memiliki label dan identitas ikan terverifikasi?
3. Bagaimana menerapkan model deteksi objek berbasis YOLO untuk membantu identifikasi objek ikan?
4. Bagaimana menghubungkan hasil identifikasi ikan dengan informasi alat tangkap dan konteks operasi penangkapan untuk mendukung penentuan target catch dan bycatch?
5. Bagaimana mengintegrasikan informasi konservasi berdasarkan identitas spesies yang telah diverifikasi?

---

## 5. Tujuan Penelitian

Tujuan pengembangan ByCatch AI adalah:

1. Mengembangkan sistem identifikasi ikan berbasis citra untuk objek peperek, teri, dan kembung perempuan.
2. Mengumpulkan dan membangun dataset citra ikan yang sesuai dengan kondisi pendaratan di PPN Karangantu.
3. Menerapkan model deteksi objek berbasis YOLO untuk mendeteksi dan mengklasifikasikan objek ikan.
4. Mengembangkan mekanisme pencatatan informasi hasil tangkapan berdasarkan jenis ikan, alat tangkap, dan konteks kegiatan penangkapan.
5. Mengintegrasikan informasi konservasi dari sumber otoritatif berdasarkan nama ilmiah yang telah terverifikasi.

---

## 6. Batasan Penelitian

Untuk menjaga fokus penelitian, batasan yang digunakan adalah sebagai berikut:

1. Penelitian hanya dilakukan di PPN Karangantu, Kelurahan Banten, Kecamatan Kasemen, Kota Serang, Provinsi Banten.
2. Konteks wilayah pengelolaan perikanan adalah WPPNRI 712 (Laut Jawa).
3. Objek identifikasi dibatasi pada tiga kelompok/jenis ikan:
   - Ikan peperek (famili Leiognathidae).
   - Ikan teri (famili Engraulidae).
   - Ikan kembung perempuan (*Rastrelliger brachysoma*).
4. Identifikasi peperek dan teri pada tahap awal dapat menggunakan label tingkat famili atau kelompok lokal apabila spesies belum terverifikasi. Label spesies hanya digunakan setelah pemeriksaan taksonomi.
5. Pengambilan data primer, observasi, dokumentasi citra, dan pengujian sistem dilakukan di PPN Karangantu.
6. Dataset dari luar lokasi penelitian hanya digunakan sebagai data pendukung atau pre-training dan tidak dianggap sebagai data primer PPN Karangantu.
7. Penentuan status target catch dan bycatch dilakukan berdasarkan informasi alat tangkap, tujuan operasi penangkapan, dan komposisi hasil tangkapan.
8. Informasi konservasi mengacu pada IUCN Red List, CITES, dan regulasi resmi Kementerian Kelautan dan Perikanan.
9. Sistem difokuskan pada identifikasi citra ikan saat pendaratan, bukan identifikasi ikan secara langsung di habitat bawah air.

---

## 7. Rancangan Metodologi Awal

Pengembangan ByCatch AI direncanakan melalui beberapa tahapan berikut:

### 7.1 Observasi dan pengumpulan data lapangan
Observasi dilakukan di PPN Karangantu untuk mengetahui kondisi kegiatan pendaratan ikan, jenis ikan yang ditemukan, alat tangkap yang digunakan, serta alur penanganan hasil tangkapan.

Dokumentasi citra dilakukan dengan memperhatikan:
- Tampilan tubuh ikan secara keseluruhan.
- Tampilan bagian kepala dan sirip.
- Variasi ukuran ikan.
- Kondisi pencahayaan.
- Posisi dan orientasi ikan.
- Kondisi ikan ketika didaratkan.

### 7.2 Verifikasi identitas ikan
Identitas ikan diperiksa menggunakan karakter morfologi dan referensi taksonomi. Apabila diperlukan, validasi dilakukan dengan bantuan ahli identifikasi ikan.

Setiap data citra perlu memiliki informasi pendukung seperti nama lokal, nama ilmiah atau tingkat taksonomi yang telah terkonfirmasi, tanggal pengambilan, dan sumber data.

### 7.3 Kurasi dan anotasi dataset
Citra yang telah dikumpulkan diseleksi berdasarkan kualitas gambar, kejelasan objek, dan kesesuaian dengan skenario penggunaan. Selanjutnya, citra diberi anotasi menggunakan bounding box sesuai kelas objek yang telah ditetapkan.

Dataset dibagi menjadi data pelatihan (*training*), validasi (*validation*), dan pengujian (*testing*). Pembagian perlu memperhatikan sumber pengambilan citra agar gambar yang sangat mirip atau berasal dari satu rangkaian dokumentasi tidak tersebar ke beberapa subset dan menyebabkan kebocoran data (*data leakage*).

### 7.4 Pemilihan model
Model deteksi objek yang direncanakan sebagai baseline adalah:
- YOLOv8n.
- YOLO11n.

Pemilihan model mempertimbangkan spesifikasi perangkat yang tersedia, yaitu NVIDIA RTX 3050 Laptop GPU dengan VRAM 4 GB dan RAM sistem sekitar 8 GB. Pengaturan awal pelatihan akan menggunakan batch size rendah, resolusi citra yang sesuai, serta jumlah worker data loader yang terbatas.

### 7.5 Pelatihan dan evaluasi model
Model dilatih menggunakan dataset yang telah melalui proses validasi dan anotasi. Evaluasi dilakukan menggunakan beberapa metrik, yaitu:
- Precision: mengukur ketepatan prediksi positif model.
- Recall: mengukur kemampuan model menemukan objek yang benar-benar ada.
- mAP@50: mengukur rata-rata ketepatan deteksi pada ambang IoU 0,50.
- mAP@50–95: mengukur performa deteksi pada rentang ambang IoU.
- Confusion matrix: mengidentifikasi kesalahan klasifikasi antar kelas.

Nilai performa model akan ditentukan berdasarkan hasil pengujian dataset ByCatch AI sendiri dan tidak mengacu langsung pada angka akurasi penelitian lain.

### 7.6 Integrasi informasi target catch dan bycatch
Hasil deteksi model digunakan untuk mengenali jenis ikan. Selanjutnya, informasi tersebut dapat dihubungkan dengan data alat tangkap, tujuan operasi, dan komposisi hasil tangkapan.

Dengan demikian, sistem tidak menetapkan bahwa peperek, teri, atau kembung perempuan selalu merupakan bycatch. Statusnya ditentukan berdasarkan konteks kegiatan penangkapan yang tercatat.

### 7.7 Integrasi informasi konservasi
Informasi konservasi diintegrasikan setelah identitas taksonomi ikan terverifikasi. Sumber yang digunakan meliputi:
- IUCN Red List untuk status konservasi global.
- CITES untuk pemeriksaan pencantuman dalam lampiran perdagangan internasional.
- Kementerian Kelautan dan Perikanan untuk regulasi perlindungan jenis ikan di Indonesia.

Sebagai contoh, *Rastrelliger brachysoma* tercatat berstatus Vulnerable (VU) pada penilaian IUCN yang diterbitkan tahun 2023. Informasi tersebut dapat digunakan sebagai salah satu referensi konservasi untuk kelas kembung perempuan, dengan tetap memperhatikan kesesuaian identitas spesies pada sampel lapangan.

---

## 8. Indikator Keberhasilan Awal

| Aspek | Indikator |
|---|---|
| **Data** | Dataset citra lokal PPN Karangantu berhasil dikumpulkan |
| **Taksonomi** | Identitas ikan memiliki dasar verifikasi ilmiah |
| **Anotasi** | Citra memiliki bounding box dan label yang konsisten |
| **Model** | YOLO berhasil dilatih dan menghasilkan prediksi valid |
| **Evaluasi** | Precision, Recall, mAP@50, mAP@50–95, dan confusion matrix tersedia |
| **Konteks perikanan** | Informasi alat tangkap dan status target/non-target dapat dicatat |
| **Konservasi** | Informasi konservasi terhubung dengan nama ilmiah yang valid |

Target angka performa model belum ditetapkan pada Phase 1 karena perlu disesuaikan dengan jumlah dataset, distribusi kelas, dan hasil pengujian awal.

---

## 9. Kesimpulan Phase 1

Berdasarkan identifikasi permasalahan dan penelusuran literatur awal, pengembangan ByCatch AI memiliki dasar untuk dilanjutkan sebagai sistem pendukung identifikasi dan pemantauan hasil tangkapan di PPN Karangantu. Permasalahan utama yang menjadi perhatian adalah identifikasi ikan berdasarkan citra, keterbatasan dataset lokal, kemiripan morfologi antarspesies, serta kebutuhan menghubungkan identifikasi ikan dengan konteks alat tangkap dan operasi penangkapan.

Pengembangan sistem akan menggunakan pendekatan computer vision berbasis YOLO dengan mempertimbangkan keterbatasan perangkat keras yang tersedia. Selain itu, integrasi informasi konservasi akan dilakukan berdasarkan identitas spesies yang telah diverifikasi.

Sebelum masuk ke tahap akuisisi dataset, diperlukan penyelesaian identifikasi taksonomi objek ikan, khususnya penentuan spesies peperek dan teri yang ditemukan di PPN Karangantu serta konfirmasi identitas kembung perempuan (*Rastrelliger brachysoma*).

---

## 10. Daftar Referensi Awal

1. Al-Abri, S., Keshvari, S., Al-Rashdi, K., Al-Hmouz, R., dan Bourdoucen, H. (2025). *Computer vision based approaches for fish monitoring systems: a comprehensive study*. Artificial Intelligence Review, 58, 185. https://doi.org/10.1007/s10462-025-11180-3
2. Bogorodsky, S. V., dkk. (2025). *Review of the Mackerel Genus Rastrelliger (Teleostei: Scombridae) with Redescription of R. chrysozonus and R. kanagurta*. Diversity, 17(1), 72.
3. Hata, H., Sallan, L. C., dan Motomura, H. (2026). *Stolephorus falco sp. nov. (Teleostei, Clupeiformes, Engraulidae), a new anchovy from Sumatra, Indonesia*. ZooKeys, 1270, 255–268.
4. IUCN. (2023). *Rastrelliger brachysoma*. The IUCN Red List of Threatened Species. https://doi.org/10.2305/IUCN.UK.2023-1.RLTS.T170318A170085723.en
5. Nurdin, H. S. (2022). *Produktivitas dan Komposisi Hasil Tangkapan Jaring Apollo di PPN Karangantu untuk Pangan Berkelanjutan*. Leuit, 3(2).
6. Pelabuhan Perikanan Nusantara Karangantu. (2026). *Laporan Statistik Perikanan Tahunan PPN Karangantu Tahun 2025*. Kementerian Kelautan dan Perikanan Republik Indonesia.
7. Triyono, H., Muzakki, S. A., dan Mulyoto. (2020). *Studi Komparatif Alat Tangkap Jaring Insang dan Bagan Perahu terhadap Hasil Tangkapan Ikan yang Didaratkan di PPN Karangantu, Serang, Banten*. Jurnal Sains dan Teknologi Perikanan, 2(2). https://doi.org/10.15578/bjsj.v2i2.8751

---
**Catatan status:** Dokumen ini telah disetujui sebagai landasan penelitian awal (Phase 1). Referensi dan identitas taksonomi akan diverifikasi lebih lanjut pada Phase 2 sebelum penetapan kelas final dataset.
