# CHECKLIST KESIAPAN PENGUMPULAN DATA LAPANGAN
## FishGuard AI — ASIK V (TPI Karangantu, Teluk Banten)

**Program Inovasi:** ASIK V — FishGuard AI  
**Lokasi Fokus:** Tempat Pelelangan Ikan (TPI) Karangantu & PPN Karangantu, Teluk Banten  
**Spesies Target:** 
1. *Rastrelliger kanagurta* (Ikan Kembung Lelaki — Kelas 0)
2. *Decapterus macarellus* (Ikan Layang — Kelas 1)

---

## 1. Perlengkapan Lapangan (Hardware & Consumables)

### A. Alat Ukur & Kalibrasi
- [ ] **Papan Ukur Perikanan (*Ichthyometer*)**:
  - [ ] Panjang minimal 50 cm dengan pembagian skala **0.1 cm (1 mm)** yang jelas.
  - [ ] Dilengkapi pembatas kepala tegak 90° (*headboard*) di titik nol.
  - [ ] Permukaan latar belakang berwarna biru matte atau abu-abu matte anti-refleksi.
- [ ] **Marker Kalibrasi Optik**:
  - [ ] ArUco Marker $50 \times 50\text{ mm}$ (Dictionary: `DICT_4X4_50`) berlaminasi doff anti-air.
  - [ ] Terpasang rata dan sejajar dengan bidang peletakan spesimen.
- [ ] **Kaliper Geser Digital (*Vernier Caliper*)**:
  - [ ] Presisi 0.01 mm untuk verifikasi tinggi badan (*body depth*) dan diameter mata.
- [ ] **Timbangan Digital Lapangan**:
  - [ ] Presisi 0.1 gram untuk pencatatan bobot basah spesimen.

### B. Perangkat Kamera & Rig
- [ ] **Kamera Utama**:
  - [ ] Kamera mirrorless atau smartphone resolusi tinggi ($\ge 12\text{ MP}$, sensor bersih).
  - [ ] Pengaturan kamera: Matikan beautifikasi, matikan filter AI scene enhancer agresif, matikan distorsi wide-angle berlebih (gunakan ekuivalen 35mm–50mm).
- [ ] **Tripod / Rig Kamera Tegak Lurus**:
  - [ ] Rig dengan arm horizontal yang kokoh dan tidak bergetar.
  - [ ] Dilengkapi *bubble level* (waterpas bundar) untuk memastikan sensor kamera **180° sejajar dengan papan ukur (sudut 90° tegak lurus ortogonal)**.
  - [ ] Jarak lensa ke permukaan papan diatur konstan: **45 – 55 cm**.
- [ ] **Pencahayaan Tambahan**:
  - [ ] Lampu panel LED portable dengan *diffuser* (suhu warna daylight 5000K–5600K).
  - [ ] Baterai cadangan lampu LED terisi penuh (100%).

### C. Logistik & Sanitasi Spesimen
- [ ] Sarung tangan latex/nitril lapangan (minimal 2 pasang per operator).
- [ ] Kain microfiber lembut / lap pengering untuk membersihkan lendir, darah, dan serpihan es sebelum difoto.
- [ ] Coolbox kecil berisi es curah untuk menyimpan spesimen sampel rujukan lab jika diperlukan.
- [ ] Label identitas fisik kertas tahan air (*waterproof tag*) dan spidol permanen.
- [ ] Power bank kapasitas $\ge 20.000\text{ mAh}$ dan kabel pengisi daya kamera/ponsel.
- [ ] Laptop lapangan untuk *triage* dan backup langsung data foto di lokasi.

---

## 2. Pra-Keberangkatan & Administrasi Perizinan

- [ ] **Surat Izin Penelitian Kampus**:
  - [ ] Membawa Surat Pengantar Resmi dari Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.
- [ ] **Koordinasi Petugas TPI & PPN Karangantu**:
  - [ ] Melapor dan mendapatkan persetujuan lisan/tertulis dari Pengelola PPN Karangantu serta petugas pencatat lelang.
- [ ] **Penyelarasan Jam Operasional Nelayan**:
  - [ ] Tiba di TPI Karangantu sebelum jam pendaratan puncak (**pukul 05.30 – 08.00 WIB** untuk pendaratan perahu bagan dan payang malam).
- [ ] **Pemberian Kompensasi / Izin Pedagang**:
  - [ ] Menyepakati peminjaman ikan sampel dari keranjang/nampan pedagang dan menjamin ikan dikembalikan dalam keadaan bersih tanpa penurunan mutu komersial.

---

## 3. Penataan Rig & Kontrol Kualitas Optik di Lokasi

- [ ] Papan ukur ditempatkan di atas meja datar yang kokoh dan terlindung dari terik matahari langsung (*diffused natural shade*).
- [ ] Waterpas *bubble level* diperiksa: gelembung udara tepat di tengah lingkaran (indikasi sudut kamera tepat 90° ortogonal).
- [ ] Jarak kamera diatur agar seluruh panjang papan ukur (0–40 cm) dan marker ArUco terlihat jelas di dalam frame tanpa pemotongan (*no clipping*).
- [ ] Dilakukan uji jepretan kosong (*blank calibration shot*) pada papan ukur untuk memeriksa fokus dan pencahayaan tanpa spesimen.
- [ ] Tidak ada pantulan silau (*specular glare*) pada permukaan mistar ukur atau marker kalibrasi.

---

## 4. Protokol Verifikasi Taksonomi Lapangan

### A. Diagnosis Ikan Kembung Lelaki (*Rastrelliger kanagurta*) — Target Kelas 0
- [ ] **Uji Kelangsingan Tubuh**:
  - [ ] Ukur Total Length ($TL$) dan Body Depth ($BD$).
  - [ ] Pastikan rasio $TL / BD > 3.4$ (bentuk tubuh ramping memanjang).
  - [ ] *Peringatan*: Jika rasio $TL / BD < 3.0$ (tubuh bulat/lebar), spesimen adalah **Kembung Perempuan (*Rastrelliger brachysoma*)** $\rightarrow$ **EKSLUSI DARI KELAS TARGET**.
- [ ] **Ciri Visual Pelengkap**:
  - [ ] Terdapat bintik-bintik gelap kecil di punggung dekat pangkal sirip dada.
  - [ ] Garis-garis keemasan/gelap samar membujur di sisi atas tubuh.
- [ ] **Status Verifikator**:
  - [ ] Nama asisten lab/peneliti yang memeriksa ciri diagnostik dicatat pada form.

### B. Diagnosis Ikan Layang (*Decapterus macarellus*) — Target Kelas 1
- [ ] **Uji Gurat Sisi & Scute**:
  - [ ] Terdapat deretan sisik tebal berduri (*scutes*) di bagian lurus gurat sisi pangkal ekor (jumlah 30–38 scute).
- [ ] **Uji Finlet Lepas**:
  - [ ] Terdapat 1 finlet tunggal kecil yang terpisah di belakang sirip punggung kedua dan sirip dubur.
- [ ] **Diferensiasi Spesies Simpatrik Layang**:
  - [ ] Pastikan bukan *Decapterus russelli* (layang deles — tubuh lebih tinggi, sirip ekor kekuningan mencolok).
  - [ ] Pastikan bukan *Selar crumenophthalmus* (bentong — mata jauh lebih besar, tanpa finlet lepas).
- [ ] **Status Verifikator**:
  - [ ] Nama asisten lab/peneliti yang memeriksa ciri diagnostik dicatat pada form.

---

## 5. Prosedur Pengukuran Biometrik & Ground Truth

- [ ] **Posisi Spesimen Baku**:
  - [ ] Sisi kiri tubuh menghadap ke atas (*left lateral view*).
  - [ ] Ujung moncong (*snout*) menyentuh rapat pembatas nol (*headboard*) papan ukur.
  - [ ] Tubuh ikan lurus sejajar dengan garis skala mistar (tidak melengkung).
  - [ ] Sirip ekor dibentangkan wajar (*natural caudal spread*).
- [ ] **Pengukuran Manual Total Length (TL)**:
  - [ ] Dibaca langsung dari ujung moncong hingga ujung cuping terpanjang sirip ekor.
  - [ ] Dicatat dengan ketelitian **0.1 cm** (misal: `21.4 cm`).
- [ ] **Verifikasi Pengukuran Ulang**:
  - [ ] Operator kedua melakukan pembacaan ulang mandiri untuk verifikasi.
- [ ] **Pencatatan Lembar Data**:
  - [ ] Dicatat langsung ke [`field_data_collection_template.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/templates/field_data_collection_template.csv).

---

## 6. Protokol Pemotretan & Variasi Terkontrol

Setiap satu individu spesimen (`SPECxxx`) diambil minimal 3 variasi foto:

- [ ] **Foto 01 — Baseline Ortogonal Murni**:
  - [ ] Sudut 90° tegak lurus sempurna, ikan lurus, sirip ekor terbuka wajar.
- [ ] **Foto 02 — Variasi Kemiringan Mikro**:
  - [ ] Sudut kamera dimiringkan sedikit ($5^\circ$) atau ikan diposisikan sedikit diagonal ($15^\circ$) terhadap papan untuk melatih ketahanan model.
- [ ] **Foto 03 — Variasi Sirip Ekor Terlipat**:
  - [ ] Sirip ekor dibiarkan sedikit terkatup alami untuk menguji algoritma *length estimation*.
- [ ] **Foto Multi-Ikan (Uji Modul Pencacahan / Counting)**:
  - [ ] Komposisi 3–8 ekor ikan di atas nampan/papan ukur:
    - [ ] Variasi terpisah rapi tanpa sentuhan.
    - [ ] Variasi tumpang tindih ringan ($\le 20\%$).

---

## 7. Penamaan Berkas & Aturan Anti-Data Leakage

- [ ] Format nama berkas dipatuhi secara ketat:
  $$\mathbf{TB\_<TANGGAL>\_<LOKASI>\_<SPESIES>\_<ID\_SPESIMEN>\_<INDEX\_FOTO>.<ext>}$$
  Contoh: `TB_20261115_KRN_KMB_SPEC001_01.jpg`
- [ ] **Aturan Anti-Data Leakage**:
  - [ ] Nomor ID Spesimen (`SPEC001`, `SPEC002`, dst.) **TIDAK BOLEH BERUBAH** untuk semua foto yang berasal dari ikan yang sama.
  - [ ] Dilarang memberi ID baru untuk foto variasi dari ikan yang sama.

---

## 8. Triage Kualitas di Lokasi (*On-Site QC & Logging*)

Sebelum ikan dikembalikan kepada pedagang, foto diperiksa langsung di layar kamera/laptop:

- [ ] **Kriteria Lolos (`USABLE`)**:
  - [ ] Seluruh batas tubuh ikan (moncong hingga ekor) tajam dan fokus.
  - [ ] Marker ArUco dan angka mistar ukur terbaca jelas.
  - [ ] Tidak ada bayangan gelap operator yang menutupi kontur ikan.
- [ ] **Kriteria Ditolak / Dibuang (`DISCARDED`)**:
  - [ ] Buram akibat getaran (*motion blur*) $\rightarrow$ Catat alasan dan ulangi pengambilan foto.
  - [ ] Pantulan cahaya basah menyilaukan (*specular glare*) yang menutupi sirip ekor $\rightarrow$ Keringkan lendir dengan lap dan ulangi foto.
  - [ ] Sirip rusak/patah parah akibat es $\rightarrow$ Beri status `DAMAGED_SPECIMEN`, jangan gunakan untuk estimasi panjang.
  - [ ] Spesies meragukan/hibrida $\rightarrow$ Catat `UNCERTAIN_SPECIES`, simpan di folder review.

---

## 9. Pasca-Survei & Penyerahan Data (*Data Ingestion*)

- [ ] Salin seluruh berkas dari kartu memori kamera ke folder lokal:
  `dataset_pipeline/data/field/raw/`
- [ ] Buat salinan cadangan sekunder (*mirror backup*) di hard disk eksternal/Google Drive.
- [ ] Hitung hash SHA-256 untuk memastikan integritas transfer berkas (tidak ada berkas korup).
- [ ] Lengkapi data biometrik pada tabel CSV template lapangan.
- [ ] Lakukan verifikasi silang jumlah foto fisik terhadap jumlah baris pada berkas template.

---
*Checklist Operasional FishGuard AI — Laboratorium Sistem Informasi Kelautan, UPI Kampus Serang.*
