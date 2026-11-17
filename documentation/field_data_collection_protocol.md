# STANDAR OPERASIONAL PROSEDUR (SOP) PENGUMPULAN DATA LAPANGAN
## Pengambilan Sampel Citra & Pengukuran Biometrik Ikan di Teluk Banten

- **Program Inovasi**: ASIK V — FishGuard AI
- **Pelaksana**: Mahasiswa & Asisten Riset Program Studi Sistem Informasi Kelautan, UPI Kampus Serang
- **Lokasi Fokus**: Pendaratan Ikan TPI Karangantu, Pelabuhan Perikanan Nusantara Karangantu, Teluk Banten
- **Spesies Target**:
  - Ikan Kembung (*Rastrelliger kanagurta*)
  - Ikan Layang (*Decapterus macarellus*)

> [!IMPORTANT]
> **Pemberitahuan Status**: Dokumen ini merupakan **protokol panduan operasional baku** yang harus ditaati selama survei lapangan. Pengambilan data lapangan nyata belum dilaksanakan saat dokumen ini diterbitkan.

---

## 1. Alat dan Perlengkapan yang Diperlukan

1. **Papan Ukur Perikanan (*Ichthyometer / Measuring Board*)**:
   - Papan ukur berlatar belakang warna kontras (putih atau biru matte tanpa refleksi/glare).
   - Dilengkapi mistar ukur metrik berpresisi **0.1 cm (1 mm)** dengan pembatas tegak (*headboard*) di titik nol (titik temu moncong).
2. **Marker Kalibrasi Optik**:
   - Mistar kalibrasi presisi tinggi atau **ArUco Marker** ukuran standar $5 \times 5\text{ cm}$ yang ditempel permanen pada bidang yang sama dengan spesimen.
3. **Kamera / Perangkat Perekam**:
   - Resolusi minimum: **12 Megapixel (3000 x 4000 px)**.
   - Menggunakan mode fokus manual/auto terpusat, dilarang menggunakan filter beautifikasi, HDR agresif, atau kompresi perpesanan (WhatsApp).
4. **Tripod / Rig Kamera Tegak Lurus**:
   - Dudukan kamera dengan *bubble level* (indikator kerataan sudut air) untuk memastikan sudut pandang tepat **90° tegak lurus (ortogonal)** terhadap bidang papan ukur.
5. **Kain / Lap Pengering & Sarung Tangan Lapangan**:
   - Membersihkan lendir, darah, atau es berlebih pada tubuh spesimen agar ciri sirip dan scute tidak tertutup.

---

## 2. Prosedur Pengambilan Foto Spesimen

### Tahap 1: Persiapan dan Verifikasi Taksonomi
1. Pilih ikan dalam kondisi segar (*fresh*) di mana sirip, scute, dan warna kulit belum rusak parah.
2. Lakukan pemeriksaan ciri diagnostik:
   - **Kembung**: Periksa rasio kelangsingan tubuh ($>3.4$) dan ada tidaknya bintik gelap di bawah sirip dada untuk memastikan *R. kanagurta* (bukan *R. brachysoma*).
   - **Layang**: Periksa ada tidaknya deretan scute berduri di gurat sisi pangkal ekor dan finlet tunggal untuk memastikan *D. macarellus*.
3. Jika spesies meragukan, tandai status sebagai `NEEDS_REVIEW` dan jangan campurkan ke dalam batch kelas terverifikasi.

### Tahap 2: Penempatan Spesimen pada Papan Ukur
1. Letakkan ikan dengan posisi **sisi kiri tubuh menghadap ke atas** (*left lateral view*) sesuai standar biologi perikanan internasional.
2. Tempelkan ujung moncong ikan (*snout*) rapat pada batas vertikal nol (*headboard*) papan ukur.
3. Luruskan badan ikan sejajar dengan garis mistar ukur (badan tidak boleh melengkung).
4. Rentangkan sirip ekor secara wajar (*natural caudal spread*) agar ujung cuping sirip ekor dapat terukur penuh.

### Tahap 3: Pengambilan Foto Ortogonal
1. Atur jarak kamera sekitar **40 – 60 cm** di atas papan ukur hingga seluruh tubuh ikan dan marker skala masuk ke dalam frame.
2. Pastikan bidang lensa kamera **sejajar 180° dengan permukaan papan ukur** (kemiringan sudut memicu distorsi perspektif yang merusak konversi cm).
3. Pastikan pencahayaan merata. Hindari bayangan tubuh operator yang menutupi ikan dan hindari pantulan cahaya langsung (*specular glare*) pada lendir basah ikan.
4. Ambil 2 hingga 3 foto per spesimen dengan variasi mikro sudut (maksimal 5° deviasi) untuk pengujian ketahanan model.

### Tahap 4: Pengambilan Foto Multi-Ikan (Uji Pencacahan)
- Ambil foto dengan komposisi 2 hingga 10 ikan di atas meja sortir/papan ukur:
  - Variasi 1: Ikan terpisah rapi tanpa tumpang tindih.
  - Variasi 2: Ikan dengan tumpang tindih ringan (maksimal 20% tumpang tindih).

---

## 3. Prosedur Pengukuran Ground Truth (Total Length Fisik)

1. Baca nilai **Total Length (TL)** pada mistar papan ukur:
   - Dari batas nol moncong hingga ujung terjauh sirip ekor (*tip of the longest caudal fin lobe*).
2. Catat nilai dengan presisi **0.1 cm** (misalnya `21.4 cm`).
3. Lakukan pengukuran ulang (*repeat measurement*) sebanyak 2 kali oleh operator berbeda untuk mencatat variabilitas inter-observer.
4. Catat data langsung ke lembar kerja fisik atau langsung ke:
   [`dataset_pipeline/metadata/ground_truth_measurements.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/ground_truth_measurements.csv)

---

## 4. Standar Penamaan File & Metadata

Format penamaan file citra wajib mengikuti konvensi terstruktur:

`TB_<TANGGAL>_<LOKASI>_<SPESIES>_<ID_SPESIMEN>_<INDEX_FOTO>.<ext>`

Contoh:
- `TB_20261115_KRN_KMB_SPEC001_01.jpg`
  - `TB`: Teluk Banten
  - `20261115`: Tanggal 15 November 2026
  - `KRN`: TPI Karangantu
  - `KMB`: Ikan Kembung (`LYG` untuk Ikan Layang)
  - `SPEC001`: ID Spesimen unik ke-001
  - `01`: Foto variasi ke-1

> [!CAUTION]
> **Aturan Anti-Data Leakage**: ID Spesimen (`SPEC001`) tidak boleh berubah meskipun difoto beberapa kali. Seluruh file dengan prefiks `SPEC001` akan dialokasikan ke split yang sama oleh script `prepare_dataset.py`.

---

## 5. Etika Penelitian dan Perizinan Lapangan

1. **Perizinan TPI**: Sebelum melakukan pemotretan, tim wajib melapor kepada Pengelola Pelabuhan Perikanan Nusantara (PPN) Karangantu dan petugas pencatat TPI setempat.
2. **Izin Nelayan / Pedagang**: Minta izin kepada pemilik hasil tangkapan sebelum menyortir atau meminjam ikan untuk diletakkan di papan ukur.
3. **Penanganan Spesimen**: Perlakukan ikan secara higienis agar kualitas komersial ikan tidak menurun saat dikembalikan kepada pedagang/nelayan.
