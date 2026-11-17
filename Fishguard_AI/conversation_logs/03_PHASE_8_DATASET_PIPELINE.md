# DOKUMENTASI PERCAKAPAN: PHASE 8 — DATASET ACQUISITION & MANAGEMENT PREPARATION
**Ringkasan Fase:** Penyusunan dataset pipeline, isolasi split bebas kebocoran, verifikasi dataset publik, dan metadata master katalog.

---

## Interaksi Dialog (Sesi 4)
**Timestamp:** `2026-11-09T02:23:05Z`

### Perintah Pengguna:
```text
# PHASE 8 — DATASET ACQUISITION, DATA MANAGEMENT & PREPARATION

Kita telah menyelesaikan implementasi awal FishGuard AI dari PHASE 0 sampai PHASE 7.

Sekarang lanjutkan pengembangan ke PHASE 8.

Bertindaklah sebagai Data Engineer, Computer Vision Dataset Specialist, dan Research Assistant yang memahami pengembangan dataset untuk penelitian AI perikanan.

## 1. KONTEKS PROYEK

FishGuard AI merupakan bagian dari proyek inovasi ASIK V mahasiswa Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang.

Tujuan utama proyek adalah mengembangkan sistem berbasis Computer Vision untuk:
1. Identifikasi ikan kembung.
2. Identifikasi ikan layang.
3. Penghitungan jumlah individu ikan.
4. Estimasi panjang total ikan (Total Length/TL).

Wilayah studi: Teluk Banten.

Spesies target:
- Kembung: Rastrelliger kanagurta.
- Layang: Decapterus macarellus.

Strategi dataset yang sudah ditetapkan:
- Dataset publik sebagai dasar pengembangan.
- Foto spesimen sendiri dari Teluk Banten untuk validasi dan fine-tuning.

PHASE 7 telah menghasilkan audit teknis. Beberapa temuan penting:
- fishguard_yolo.pt belum tersedia.
- YOLOv8n COCO bukan model khusus ikan.
- Algoritma estimasi panjang berbasis kontur memiliki keterbatasan pada latar belakang kompleks dan pencahayaan buruk.
- Data spesimen nyata belum dikumpulkan.

Jangan mengulang implementasi aplikasi yang telah selesai. Jangan mengulang audit PHASE 7 kecuali untuk memperbaiki masalah yang ditemukan.

## 2. TUJUAN PHASE 8

Bangun sistem pengelolaan dataset yang terstruktur, terdokumentasi, dapat diaudit, dan siap digunakan untuk eksperimen computer vision.

Prioritas utama bukan jumlah foto, melainkan kualitas, validitas identitas spesies, anotasi, metadata, dan lisensi.

## 3. AUDIT DATASET YANG SUDAH ADA

Periksa seluruh folder dataset_pipeline dan file dataset yang tersedia.

Identifikasi:
- Foto yang sudah tersedia.
- Label YOLO yang sudah tersedia.
- File anotasi lain.
- Dataset publik yang sudah diunduh.
- Data sintetis untuk pengujian.
- Duplikasi gambar.
- File rusak atau tidak terbaca.
- Ketidaksesuaian antara label dan gambar.

Buat laporan inventaris.

Jangan menganggap foto sintetis sebagai foto spesimen nyata.

Jangan menganggap dataset publik mengandung spesies target tanpa pemeriksaan identitas kelas.

## 4. BANGUN DATASET MASTER

Buat file:

dataset_pipeline/metadata/dataset_master.csv

Gunakan minimal kolom berikut:

- image_id
- filename
- specimen_id
- species_local
- scientific_name
- family
- source_type
- source_name
- source_url
- license
- attribution
- capture_location
- capture_date
- capture_session
- camera_device
- image_width
- image_height
- annotation_status
- annotation_type
- total_length_cm
- length_type
- image_quality
- verification_status
- split
- notes

Tambahkan dokumentasi setiap kolom.

Buat juga:
- species_reference.csv
- license_register.csv

Jangan mengisi nilai yang belum diketahui dengan data karangan. Gunakan nilai kosong atau status UNKNOWN.

## 5. VALIDASI TAKSONOMI

Bangun referensi dua spesies target:

1. Rastrelliger kanagurta
2. Decapterus macarellus

Validasi konsistensi nama lokal, nama ilmiah, dan famili.

Perhatikan bahwa nama lokal ikan dapat mencakup lebih dari satu spesies. Jangan menetapkan identitas ilmiah hanya dari nama lokal atau hasil pencarian gambar.

Buat status:
- VERIFIED
- NEEDS_REVIEW
- UNKNOWN

Jika identitas spesimen belum dapat dipastikan, jangan memasukkannya ke dataset supervised training dengan label spesies yang dipaksakan.

## 6. AUDIT LISENSI DATASET PUBLIK

Siapkan mekanisme pencatatan sumber data:
- FishNet ICCV 2023
- DeepFish
- GBIF
- Wikimedia Commons
- Sumber publik lain yang relevan

Untuk setiap foto, catat:
- Sumber asli.
- URL.
- Nama pemilik atau kontributor jika tersedia.
- Lisensi.
- Ketentuan atribusi.
- Izin penggunaan untuk penelitian dan training model.

Jangan mengunduh massal atau menggunakan gambar yang lisensinya tidak jelas.

Jangan menganggap seluruh gambar dari satu platform memiliki lisensi yang sama.

Dataset yang tidak sesuai spesies target dapat tetap dicatat sebagai referensi metodologi, tetapi jangan dicampur ke kelas kembung atau layang.

## 7. VALIDASI KUALITAS GAMBAR

Buat script:

dataset_pipeline/scripts/validate_images.py

Fungsinya:
- Memastikan gambar dapat dibuka.
- Memeriksa dimensi dan resolusi.
- Mengidentifikasi file rusak.
- Mengidentifikasi gambar terlalu kecil.
- Menghitung blur score menggunakan metode yang sesuai.
- Mendeteksi kemungkinan gambar duplikat.
- Menghasilkan laporan CSV.

Buat script terpisah untuk mendeteksi duplikasi berdasarkan hash dan perceptual hash.

Jangan otomatis menghapus file. Laporkan kandidat duplikasi terlebih dahulu.

## 8. ANNOTATION PIPELINE

Siapkan struktur anotasi untuk YOLO Object Detection.

Class mapping:
- 0: kembung
- 1: layang

Buat dokumentasi annotation_guidelines.md yang menjelaskan:
- Cara menggambar bounding box.
- Aturan penentuan objek.
- Penanganan ikan yang saling menutupi.
- Penanganan bagian tubuh yang terpotong.
- Objek yang identitasnya tidak diketahui.
- Kesalahan anotasi yang harus dihindari.

Buat folder terpisah untuk anotasi keypoint jika nantinya diperlukan untuk pengukuran panjang.

Jangan mengimplementasikan model pose estimation sekarang.

## 9. METADATA PENGUKURAN PANJANG

Buat mekanisme pencatatan ground truth pengukuran ikan.

Kolom minimal:
- specimen_id
- scientific_name
- total_length_cm
- measurement_method
- measuring_instrument
- measurement_date
- operator
- calibration_marker
- image_id
- measurement_notes

Gunakan Total Length (TL) secara konsisten.

Pengukuran harus berasal dari instrumen pengukuran fisik, bukan hasil prediksi model.

Siapkan mekanisme untuk mencatat hasil pengukuran berulang jika diperlukan.

## 10. GROUP SPLIT DAN DATA LEAKAGE

Audit kembali prepare_dataset.py.

Pastikan pembagian dataset:
- Berdasarkan specimen_id.
- Tidak hanya mengandalkan asumsi nama file tanpa validasi.
- Semua foto dari spesimen yang sama berada pada satu split.
- Foto dari capture session yang sama dapat dikendalikan untuk menghindari leakage.
- Data test tidak digunakan untuk training atau tuning.

Jika specimen_id tidak tersedia, masukkan data ke status NEEDS_METADATA dan jangan membagi secara otomatis seolah-olah aman.

Buat laporan overlap antar-split.

## 11. DATASET STATISTICS

Buat script dataset_statistics.py untuk menghasilkan:
- Total gambar.
- Jumlah gambar per spesies.
- Jumlah spesimen independen.
- Jumlah foto per sumber.
- Jumlah anotasi.
- Distribusi ukuran gambar.
- Jumlah gambar berdasarkan kualitas.
- Jumlah data berdasarkan status verifikasi.
- Distribusi panjang ikan jika tersedia.
- Distribusi train, validation, dan test.

Buat visualisasi sederhana jika berguna.

Semua statistik harus berasal dari data aktual.

## 12. PERSIAPAN PENGUMPULAN DATA LAPANGAN

Buat dokumentasi field_data_collection_protocol.md.

Protokol harus mencakup:
- Pengambilan foto spesimen.
- Pengambilan foto beberapa ikan sekaligus.
- Penempatan ikan di papan ukur.
- Posisi kamera tegak lurus.
- Penggunaan marker kalibrasi.
- Pengukuran Total Length.
- Pencatatan ID spesimen.
- Pencatatan lokasi dan tanggal.
- Verifikasi identitas spesies.
- Pengelolaan foto dan metadata.
- Persetujuan atau izin yang diperlukan dari pemilik foto/lokasi.

Jangan membuat klaim bahwa pengambilan data lapangan sudah dilakukan.

## 13. STRUKTUR DOKUMENTASI

Buat:
- documentation/PHASE_8_DATASET_REPORT.md
- documentation/annotation_guidelines.md
- documentation/field_data_collection_protocol.md
- documentation/dataset_structure.md

Perbarui README hanya jika memang diperlukan.

## 14. ATURAN KERJA

1. Audit file yang sudah ada sebelum membuat file baru.
2. Jangan menghapus dataset atau anotasi.
3. Jangan membuat foto ikan sintetis untuk menggantikan data lapangan.
4. Jangan mengarang jumlah data.
5. Jangan mengarang lisensi.
6. Jangan memaksakan label spesies yang belum terverifikasi.
7. Jangan menjalankan training YOLO jika dataset valid belum tersedia.
8. Jangan mengubah fitur aplikasi yang sudah berfungsi.
9. Gunakan kode modular dan dokumentasi yang jelas.
10. Jalankan seluruh script untuk menguji bahwa pipeline bekerja pada data yang memang tersedia.
11. Jika belum ada dataset, pastikan pipeline tetap bisa diuji menggunakan folder kosong dan data uji teknis yang diberi label synthetic.
12. Jangan berhenti hanya dengan memberikan rencana. Implementasikan seluruh komponen PHASE 8 yang dapat diselesaikan tanpa foto lapangan.

## 15. OUTPUT AKHIR

Berikan laporan:
- Inventaris dataset aktual.
- Dataset yang dapat digunakan.
- Dataset yang hanya cocok sebagai referensi.
- Dataset yang tidak dapat digunakan dan alasannya.
- Hasil validasi file.
- Hasil validasi metadata.
- Hasil pemeriksaan duplikasi.
- Hasil group split dan data leakage.
- Status kesiapan dataset untuk training.
- Kebutuhan data lapangan yang masih kosong.

Target akhir PHASE 8 adalah memiliki infrastruktur dataset yang siap digunakan. Bukan mengklaim model AI telah berhasil dilatih.

Mulai dari audit dataset aktual, kemudian implementasikan seluruh kebutuhan PHASE 8 yang memungkinkan.
```

### Hasil Pelaksanaan & Jawaban Asisten:

*(Proses komputasi / eksekusi skrip background terlaksana)*

---

## Interaksi Dialog (Sesi 5)
**Timestamp:** `2026-11-09T02:31:27Z`

### Perintah Pengguna:
```text
documentation yang diminta mana ya?
```

### Hasil Pelaksanaan & Jawaban Asisten:

Seluruh dokumentasi dan infrastruktur pengelolaan dataset yang diminta pada **PHASE 8** telah selesai dibuat dan tersedia langsung di dalam folder [`documentation/`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/):

---

### 1. Berkas Dokumentasi Utama (Sesuai Permintaan)

1. 📄 **[`documentation/PHASE_8_DATASET_REPORT.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/PHASE_8_DATASET_REPORT.md)**
   - Laporan resmi akuisisi dan manajemen dataset.
   - Inventaris dataset aktual (menjelaskan bahwa 8 citra yang ada merupakan data uji teknis/sintetis dan foto lapangan nyata masih nol).
   - Analisis kelayakan dataset publik (FishNet untuk pre-training, GBIF untuk taksonomi, penolakan DeepFish karena *domain shift* bawah air).
   - Hasil audit duplikasi, kualitas citra, validasi metadata, dan kesimpulan kesiapan training model.

2. 📋 **[`documentation/annotation_guidelines.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/annotation_guidelines.md)**
   - Panduan standar pembuatan bounding box YOLO (*tight fitting* tanpa bayangan).
   - Aturan klasifikasi kelas 0 (*Rastrelliger kanagurta*) dan kelas 1 (*Decapterus macarellus*).
   - Protokol penanganan tumpang tindih (*occlusion*), pemotongan frame (*truncated*), dan spesies meragukan.
   - Skema 2-titik keypoint anatomi (*snout tip* dan *caudal fin tip*) untuk persiapan estimasi panjang berbasis keypoint.

3. 🌊 **[`documentation/field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md)**
   - Standar Operasional Prosedur (SOP) pengambilan sampel foto ikan di TPI Karangantu, Teluk Banten.
   - Penempatan spesimen pada papan ukur (*ichthyometer*), posisi kamera 90° ortogonal, dan kalibrasi metrik.
   - Konvensi penamaan berkas anti-kebocoran data (`TB_<TANGGAL>_<LOKASI>_<SPESIES>_<ID_SPESIMEN>_<INDEX>.jpg`).
   - Etika perizinan pelabuhan dan nelayan setempat.

4. 🗂️ **[`documentation/dataset_structure.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/dataset_structure.md)**
   - Arsitektur hierarki direktori dataset dari `data/raw/` hingga `data/processed/`.
   - Spesifikasi skema seluruh file CSV metadata.
   - Diagram alur kerja data dari akuisisi, validasi, *group-split*, hingga training YOLO.

---

### 2. Berkas Master Metadata & Registri yang Dibangun

- 📊 **[`dataset_pipeline/metadata/dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv)**: Registri induk 24 kolom untuk seluruh citra, mencakup ID spesimen, kualitas, status verifikasi taksonomi, dan alokasi split.
- 🐟 **[`dataset_pipeline/metadata/species_reference.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/species_reference.csv)**: Basis data taksonomi resmi pembeda *R. kanagurta* vs *R. brachysoma*, dan *D. macarellus* vs *D. russelli*.
- ⚖️ **[`dataset_pipeline/metadata/license_register.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/license_register.csv)**: Registri audit lisensi dataset publik (FishNet, DeepFish, GBIF, Wikimedia Commons, dan riset mandiri UPI).
- 📏 **[`dataset_pipeline/metadata/ground_truth_measurements.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/ground_truth_measurements.csv)**: Buku pencatatan pengukuran fisik Total Length (TL) instrumen papan ukur, lengkap dengan indeks pengukuran ulangan.

---

### 3. Perkakas Otomasi & Hasil Pengujian Pipeline

Seluruh script telah diuji dan menghasilkan laporan faktual:
- **`validate_images.py`** ➡️ Laporan kualitas: [`dataset_pipeline/reports/image_quality_report.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/image_quality_report.csv)
- **`detect_duplicates.py`** ➡️ Laporan hash & dHash: [`dataset_pipeline/reports/duplicates_report.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/duplicates_report.csv)
- **`dataset_statistics.py`** ➡️ Statistik kuantitatif: [`dataset_pipeline/reports/dataset_statistics.json`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/dataset_statistics.json)
- **`prepare_dataset.py`** ➡️ Laporan audit *leakage*: [`dataset_pipeline/reports/split_overlap_report.json`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/split_overlap_report.json)

Semua dokumen di atas dapat langsung dibuka dan dibaca di Visual Studio Code Anda.

---

