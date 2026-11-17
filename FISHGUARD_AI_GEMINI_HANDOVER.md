# FISHGUARD AI — GEMINI ANTIGRAVITY MASTER HANDOVER DOCUMENT
## Dokumen Resmi Pengalihan, Audit Komprehensif, dan Cetak Biru Pengembangan Teknis
**Kegiatan:** ASIK V — Ajang Kompetisi Sistem Informasi Kelautan  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia (UPI) Kampus Serang  
**Lokasi Referensi Operasional:** Pelabuhan Perikanan Nusantara (PPN) Karangantu, Teluk Banten, Kota Serang, Banten  
**Tanggal Handover:** 16 November 2026  
**Status Pengalihan:** Responded & Accepted by Gemini via Antigravity  

---

## 1. RINGKASAN TUJUAN PROYEK

**FishGuard AI** adalah platform kecerdasan buatan dan visi komputer (*Computer Vision & AI*) yang dirancang khusus untuk memodernisasi pencatatan, pemantauan, dan tata kelola perikanan tangkap skala kecil dan menengah di Indonesia, dengan lokus studi utama di **PPN Karangantu, Teluk Banten**.

### Tujuan Utama:
1. **Identifikasi Spesies Otomatis (*Automated Species Identification*):** Mengidentifikasi spesies ikan hasil tangkapan secara akurat pada tingkat taksonomi spesies (*species-level accuracy*).
2. **Penghitungan Jumlah Individu (*Automated Fish Counting*):** Menghitung cacah individu ikan secara otomatis, baik dalam kondisi ikan tunggal maupun tumpukan/keranjang tangkapan.
3. **Analisis Komposisi Hasil Tangkapan (*Catch Composition Analysis*):** Menganalisis proporsi kelimpahan relatif (%) per spesies tangkapan guna mendukung statistik pelabuhan perikanan dan kepatuhan kuota penangkapan.

### Posisi dalam Ekosistem Inovasi ASIK V:
FishGuard AI diposisikan sebagai **modul inti (*flagship module*)** dari ekosistem digital perikanan terpadu yang mencakup:
- **FishGuard AI:** Pengenalan spesies, penghitungan, dan komposisi hasil tangkapan di darat/dermaga.
- **OceanSense AI:** Pemantauan parameter oseanografi dan lingkungan perairan Teluk Banten.
- **ByCatch AI:** Deteksi dan pemantauan spesies tangkapan sampingan (*bycatch*) dan biota dilindungi (ETP species).
- **CatchForecast AI:** Modul analitik lanjutan untuk memproyeksikan estimasi hasil tangkapan berbasis integrasi data historis pendaratan dan data oseanografi.

---

## 2. RUANG LINGKUP MVP (MINIMUM VIABLE PRODUCT)

### Batasan Ruang Lingkup yang Dikunci Mutlak:
Ruang lingkup prototipe pertama (MVP) FishGuard AI dibatasi secara tegas hanya pada tiga pilar fungsi:
1. **Species Identification**
2. **Fish Counting**
3. **Catch Composition Analysis**

> [!IMPORTANT]
> **EKSKLUSI RESMI FITUR MORFOMETRI:**  
> Fitur **Estimasi Panjang Total (*Total Length Estimation*)** dan **Estimasi Bobot (*Weight Estimation*)** secara tegas **DIKELUARKAN DARI RUANG LINGKUP MVP**. Fitur-fitur tersebut tidak boleh dimasukkan kembali ke dalam kode produksi, rancangan database aktif, antarmuka utama, maupun rekomendasi implementasi MVP tanpa instruksi eksplisit dari pemilik proyek.

---

## 3. TARGET SPESIES DAN CLASS ID

Target spesies prototipe MVP telah dikunci berdasarkan data pendaratan riil PIPP KKP 2026 di PPN Karangantu (mencakup 42,8% dari total 23 komoditas ikan tercatat):

| Class ID | Nama Ilmiah | Nama Lokal | Famili | Karakter Diagnostik Kunci |
|:---:|---|---|---|---|
| **0** | *Rastrelliger brachysoma* | Kembung Perempuan | Scombridae | Tubuh sangat dalam (*depth* 3,7–4,3 dalam FL); tapis insang bawah panjang (30–48 buah); bintik gelap punggung tidak berderet ganda. |
| **1** | *Selaroides leptolepis* | Selar Kuning | Carangidae | Pita lateral kuning keemasan lebar dari tepi atas mata ke ekor; tepi celah insang halus (*smooth cleithrum*); rahang atas tanpa gigi. |
| **2** | *Upeneus sulphureus* | Kuniran | Mullidae | Sirip ekor (caudal fin) polos tanpa garis hitam; sungut dagu putih; dua garis kuning membujur pada sisi tubuh (Uiblein et al., 2025). |

### Batasan Taksonomi Ketat:
- **Dilarang melakukan substitusi taksonomi sepihak:** Tidak boleh mengganti *Rastrelliger brachysoma* dengan *Scomber japonicus*, atau *Selaroides leptolepis* dengan *Trachurus mediterraneus*.
- **Data Historis Bukan Kelas MVP:** Spesies historis dari fase awal (*Rastrelliger kanagurta* dan *Decapterus macarellus*) **BUKAN bagian dari kelas target MVP saat ini**. Data tersebut hanya dapat digunakan sebagai referensi pengujian luar domain (*Out-of-Domain / Hard Negative*).
- **Gerbang Taksonomi *Upeneus sulphureus*:** Terikat penuh pada revisi iktiologi mutakhir **Uiblein et al. (*Ichthyology & Herpetology* 113(3):453–486, 22 Agustus 2025)** yang memisahkan kompleks *U. sulphureus* dan menetapkan variasi dimorfisme panjang sungut (*short/long morphs*). Citra publik kuniran tidak boleh dianggap valid tanpa verifikasi sirip ekor polos dan sungut putih.

---

## 4. RIWAYAT PEKERJAAN YANG TELAH DISELESAIKAN

Kronologi pengerjaan yang tercatat dan terverifikasi di repositori:
1. **Phase 7 (Technical System Audit):** Pembangunan awal arsitektur end-to-end FastAPI, antarmuka React 19/Vite, integrasi YOLOv8 baseline, dan pengujian kalibrasi ArUco OpenCV.
2. **Phase 8 (Dataset Pipeline & Annotation Standard):** Penetapan standar anotasi format YOLO (`class_id x_c y_c w h`) dan pedoman pelabelan poligon/bounding box.
3. **Phase 9 (Public Dataset DeepFish Audit):** Audit dataset DeepFish (Zenodo 6475675, 1.320 citra video terumbu karang Australia Barat). Kesimpulan: terjadi pergeseran domain (*domain shift*) ekstrem; DeepFish hanya dijadikan acuan metodologi, bukan data latih spesies MVP.
4. **Phase 10 & 10.1 (GBIF Acquisition & Integrity Audit):** Pengunduhan citra spesimen GBIF untuk *R. kanagurta* dan *D. macarellus* (masing-masing 25 citra) serta audit integritas katalog master.
5. **Phase 11 & 11.6 (Species Prioritization & Scientific Integrity Closure):** Rekonsiliasi data produksi PIPP KKP 2026 PPN Karangantu. Keputusan penetapan 3 spesies MVP baru (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*).
6. **Phase 11.7, 11.7.1, 11.7.2 (Sampling Protocol & Physical Rig Pre-Flight):** Penyusunan SOP sampling, verifikasi geometris kamera APS-C 35mm (koreksi jarak kerja menjadi 90 cm untuk FoV 60,4 cm mencakup papan ukur 50 cm dan marker ArUco 50 mm). Status rig ditandai secara jujur sebagai `SIMULATION` (belum diverifikasi secara fisik).
7. **Phase 12.1 (Public Image Inventory Integrity Audit):** Audit terhadap 91 kandidat citra publik dari 15 repositori. Temuan: 52 record Tier D (*All Rights Reserved*), 31 record Tier B, 8 record Tier A; penemuan jebakan taksonomi *Uranoscopus sulphureus* (stargazer); seluruh 10 kandidat Class 2 ditahan di `TAXONOMY_REVIEW`. Vonis training: `STRICT NO-GO`.
8. **Phase 12.1.1 (Selective Public Image Acquisition & Final Closure):** Eksekusi pengunduhan selektif 22 kandidat P1/P2. Hasil: 21 citra terunduh (10 Class 0, 11 Class 1), 1 kegagalan server FishBase 0-byte (`FG-C0-009`), 1 citra dikarantina karena domain bawah air (`FG-C1-019`), menyisakan **20 citra referensi morfologi bersih**. Seluruh 10 kandidat Class 2 dipisahkan dan ditahan. Status fase: **`COMPLETED`**.

---

## 5. KONDISI AKTUAL WORKSPACE & LINGKUNGAN PENGEMBANGAN

### 5.1 Spesifikasi Lingkungan Mesin (Audited Live):
- **Sistem Operasi:** Windows 11 Home Single Language (Build 26100)
- **Bahasa Pemrograman:** Python 3.14.7 (MSC v.1944 64-bit AMD64)
- **Runtime Node.js:** Node.js v24.22.0, npm v11.19.1
- **Kerangka AI / Deep Learning:** PyTorch 2.15.0+cpu, Torchvision 0.29.2+cpu (CUDA available: `False`)
- **Visi Komputer:** Ultralytics YOLO 8.4.208, OpenCV 5.0.0, Pillow (PIL) 13.0.0
- **Backend API:** FastAPI 0.162.2, Uvicorn 0.34.0, Pydantic v2
- **Frontend SPA:** React 19.3.1, Vite 8.3.6, Tailwind CSS 4.3.5, Recharts 3.10.1, Lucide React 1.70.0
- **Database:** SQLite 3 (`backend/fishguard_history.db`)

### 5.2 Struktur Direktori Aktual:
```
c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\
├── backend/                       # Layanan FastAPI & Layanan Inferensi YOLO
│   ├── app/
│   │   ├── config.py              # Konfigurasi & mapping taksonomi (PERLU UPDATE)
│   │   ├── main.py                # Inisialisasi API & routing endpoint
│   │   ├── models/schemas.py      # Skema Pydantic deteksi, riwayat, pengukuran
│   │   ├── routers/               # detection.py, history.py, measurement.py
│   │   └── services/              # yolo_service.py, storage_service.py, length_service.py
│   ├── static/                    # Direktori upload & gambar hasil anotasi
│   ├── weights/                   # Direktori bobot YOLO custom (KOSONG: belum ada fishguard_yolo.pt)
│   ├── fishguard_history.db       # Database SQLite riwayat analisis (3 baris data legacy)
│   ├── requirements.txt           # Dependensi Python backend
│   ├── run.py                     # Skrip peluncur uvicorn backend
│   └── yolov8n.pt                 # Bobot dasar YOLOv8n COCO (6.55 MB, pre-trained fallback)
├── dataset_pipeline/              # Pipeline data, citra publik, dan laporan fase
│   ├── data/
│   │   ├── public/deepfish/       # Dataset historis DeepFish (underwater video frames)
│   │   └── public/gbif/verified/  # Dataset historis GBIF (R. kanagurta, D. macarellus)
│   ├── public_reference_images/   # HASIL AKUISISI RESMI PHASE 12.1.1
│   │   ├── class_0_rastrelliger_brachysoma/  # 10 citra referensi bersih
│   │   ├── class_1_selaroides_leptolepis/    # 10 citra referensi bersih
│   │   ├── class_2_upeneus_sulphureus/       # KOSONG (0 citra, ditahan di TAXONOMY_REVIEW)
│   │   ├── ood_reference/                    # KOSONG (kontrol OOD)
│   │   ├── quarantine/                       # 1 citra (FG-C1-019 underwater Tulamben)
│   │   └── public_reference_image_manifest.csv # Manifest 21 citra terunduh
│   └── reports/
│       ├── phase_12_1/            # Laporan audit inventaris awal (91 record)
│       └── phase_12_1_1/          # Laporan akuisisi, kegagalan, lisensi, QC audit
├── documentation/                 # Arsip dokumentasi resmi seluruh fase proyek (Phase 7 s.d. 12.1.1)
├── Fishguard_AI/                  # Master folder arsip, master reports, provenance transcript
└── frontend/                      # Aplikasi antarmuka web SPA (React 19 + Vite)
    ├── src/
    │   ├── api/client.js          # Klien fetch API ke backend FastAPI
    │   ├── components/            # Navbar, Sidebar, StatCard
    │   └── pages/                 # Dashboard, DetectionPage, CountingPage, HistoryPage, DatasetPage, MeasurementPage
    ├── package.json               # Dependensi Node.js / React
    └── vite.config.js             # Konfigurasi bundler Vite
```

---

## 6. STATUS DATASET DAN LISENSI

| Kategori Dataset | Lokasi Direktori | Jumlah Citra | Komposisi Spesies | Status Lisensi | Batasan & Kelayakan Penggunaan |
|---|---|:---:|---|---|---|
| **Public Reference Images (Phase 12.1.1)** | `dataset_pipeline/public_reference_images/` | **20 bersih + 1 karantina** | - Class 0: 10 citra<br>- Class 1: 10 citra<br>- Class 2: 0 citra (ditahan) | Tier A: 3 citra (CC0 Judgefloro)<br>Tier B: 17 citra (CC-BY/NC/SA) | **HANYA REFERENSI MORFOLOGI & BENCHMARK LAB.** Tidak memadai untuk melatih YOLO. STRICT NO-GO untuk training. |
| **DeepFish Dataset (Phase 9)** | `dataset_pipeline/data/public/deepfish/` | 1.320 citra video | Ikan karang tropis Australia Barat (64 famili/kategori) | CC BY 4.0 | **TIDAK COCOK UNTUK TRAINING SPESIES MVP.** Hanya berguna sebagai bahan uji komparasi detektor generik kelas-agnostik (*generic fish detector*). |
| **GBIF Historical (Phase 10)** | `dataset_pipeline/data/public/gbif/verified/` | 50 citra | - *R. kanagurta*: 25 citra<br>- *D. macarellus*: 25 citra | Bervariasi (CC-BY, CC-BY-NC) | **OUT-OF-DOMAIN / KONTROL HISTORIS.** Dilarang dicampur ke dalam 3 kelas target MVP. |
| **FishGuard Primar Field Data** | `dataset_pipeline/data/field/` | **0 citra** | Belum ada pengambilan data lapangan | — | **DITANGGUHKAN.** Sesuai arahan, pemilik proyek belum merencanakan sampling primer dalam waktu dekat. |

---

## 7. AUDIT IMPLEMENTASI APLIKASI SAAT INI

Pemeriksaan kode aktual menunjukkan bahwa aplikasi dasar FishGuard AI telah berfungsi secara end-to-end dengan integritas yang baik, namun masih membawa residu arsitektur dari fase-fase awal:

### 7.1 Backend FastAPI:
1. **Layanan YOLO (`backend/app/services/yolo_service.py`):**
   - Mengimplementasikan pengecekan bobot model custom `CUSTOM_WEIGHTS_PATH = backend/weights/fishguard_yolo.pt`.
   - Karena file bobot belum ada, sistem menetapkan status secara jujur: `self.model_mode = "MODEL_NOT_TRAINED"`.
   - Saat mendeteksi gambar, sistem menggunakan baseline `yolov8n.pt` dan tidak mengarang deteksi spesies target jika tidak terdeteksi.
2. **Keterikatan Taksonomi Legacy di `backend/app/config.py`:**
   - Kamus `TAXONOMY_INFO` masih mendefinisikan kelas lama:
     - `"kembung": Rastrelliger kanagurta` (seharusnya *Rastrelliger brachysoma*)
     - `"layang": Decapterus macarellus` (seharusnya *Selaroides leptolepis*)
     - Belum ada entri untuk Class 2: *Upeneus sulphureus*.
3. **Database SQLite (`backend/fishguard_history.db`):**
   - Skema tabel `analyses` masih memiliki kolom legacy: `kembung_count`, `layang_count`, `other_count`, serta `total_length_cm` dan `measurement_status`.
   - Database berisi 3 rekaman pengujian awal dari Phase 7.

### 7.2 Frontend React 19:
1. **Navigasi Halaman:**
   - Memiliki halaman `DetectionPage.jsx` (unggah foto & deteksi AI).
   - Memiliki halaman `CountingPage.jsx` (penghitungan ikan per frame).
   - Memiliki halaman `Dashboard.jsx` (rekapitulasi analitik tangkapan).
   - Memiliki halaman `DatasetPage.jsx` (informasi metodologi dataset).
   - **Membawa halaman legacy:** `MeasurementPage.jsx` (halaman estimasi panjang ikan dengan penggaris ArUco yang berada di luar ruang lingkup MVP).

---

## 8. INVENTARISASI MASALAH TEKNIS YANG MASIH TERBUKA (OPEN ISSUES)

| ID Isu | Komponen | Deskripsi Masalah | Dampak Teknis | Prioritas Solusi |
|:---:|---|---|---|:---:|
| **ISSUE-01** | Backend Config | `TAXONOMY_INFO` di `config.py` masih menggunakan taksonomi lama (*R. kanagurta* & *D. macarellus*). | Respon JSON deteksi tidak mencerminkan 3 kelas MVP resmi. | **TINGGI** |
| **ISSUE-02** | Database Schema | Skema tabel `analyses` belum memiliki kolom untuk *Selaroides leptolepis* dan *Upeneus sulphureus*, serta masih memuat kolom panjang tubuh. | Data komposisi spesies tidak dapat disimpan secara rapi per kelas MVP. | **TINGGI** |
| **ISSUE-03** | Frontend UI | Terdapat menu `MeasurementPage` dan panggilan API `/api/measure` yang melanggar batasan eksklusi MVP. | Menimbulkan ambiguitas ruang lingkup bagi penguji/juri kompetisi ASIK V. | **SEDANG** |
| **ISSUE-04** | Class 2 Ground Truth | Sebanyak 10 citra kandidat *Upeneus sulphureus* masih ditahan di `TAXONOMY_REVIEW` (0 citra referensi bersih). | Ketiadaan data referensi terverifikasi untuk melatih atau menguji Class 2. | **KRITIS** |
| **ISSUE-05** | Domain Gap Skenario | 100% citra publik yang ada adalah foto ikan tunggal terisolasi di meja; 0% citra tumpukan ikan multi-spesies campur di lantai lelang TPI. | Model deteksi objek multi-ikan tidak dapat dilatih langsung pada data tunggal tanpa strategi komputasi khusus. | **KRITIS** |
| **ISSUE-06** | Hardware Limitation | Komputasi lokal saat ini berjalan di CPU (CUDA: `False`). Pelatihan model deep learning berat lokal akan sangat lambat. | Memerlukan strategi pelatihan cloud (Google Colab / Kaggle GPU) atau optimasi model ringan (YOLOv8 Nano). | **SEDANG** |

---

## 9. RISIKO ILMIAH DAN TEKNIS

1. **Risiko Ilmiah — Taxonomic Confusion pada *Upeneus sulphureus*:**  
   Jika citra publik kuniran digunakan tanpa memverifikasi morfologi sirip ekor (polos tanpa garis melintang) dan warna sungut (putih gading), model akan belajar mengenali spesies kerabat (*U. moluccensis*, *U. tragula*, atau *U. doriae*) sehingga kehilangan validitas iktiologis di hadapan dewan juri ASIK V.
2. **Risiko Komputasi Visi — Catastrophic Domain Shift (Synthetic-to-Real):**  
   Jika model dilatih hanya pada citra ikan tunggal berlatar belakang bersih, model akan mengalami kegagalan deteksi parah saat diuji pada skenario riil pendaratan ikan di mana ikan saling bertumpuk, tertutup es curah basah, dan memiliki pantulan cahaya air.
3. **Risiko Kebocoran Data (*Data Leakage*):**  
   Memisahkan citra dari satu individu ikan biologis yang sama (seperti `FG-C0-016` dan `FG-C0-017` pada klaster `DUP-INAT-4f48550b`) ke dalam train set dan validation set akan menghasilkan ilusi performa akurasi tinggi yang palsu (*artificially inflated evaluation*).
4. **Risiko Hukum & Hak Cipta (*IP & Licensing Infringement*):**  
   Penggunaan citra dari FishBase kontributor yang memiliki klausul Non-Commercial (NC) atau All Rights Reserved untuk kepentingan di luar riset internal dapat memicu komplain hak cipta dari fotografer kontributor.

---

## 10. REKOMENDASI ARAH PENGEMBANGAN YANG REALISTIS (MAKSIMALISASI DATA TERSEDIA)

Menindaklanjuti arahan strategis bahwa **pemilik proyek belum akan melakukan sampling lapangan primer dalam waktu dekat**, Gemini Antigravity menyusun 6 pilar solusi metodologis yang realistis dan dapat dipertanggungjawabkan secara ilmiah:

```
Peta Solusi Pengembangan FishGuard AI Berbasis Data Tersedia:
├── PILAR 1: Arsitektur Deteksi-Klasifikasi Dua Tahap (Two-Stage Decoupled Pipeline)
│   ├── Stage 1: Class-Agnostic Fish Detector (YOLOv8 "Fish" Locator)
│   └── Stage 2: Fine-Grained Species Classifier / Metric Embedder (Cropped ROI)
├── PILAR 2: Sintesis Citra Multi-Ikan Teranotasi (Cut-and-Paste Composition Augmentation)
│   ├── Segmentasi Masker Spesimen Bersih (SAM / Matting pada 20 citra referensi)
│   └── Komposisi Tumpukan Ikan Sintetis di atas Latar Meja/Keranjang TPI
├── PILAR 3: Pemanfaatan Model Fondasi Biologi (BioCLIP / Vision Transformer Zero-Shot)
│   ├── Evaluasi BioCLIP (Tree-of-Life pre-trained ViT) untuk embeddings spesies
│   └── Klasifikasi Few-Shot Prototipe Berbasis Jarak Kosinus (Centroid Matching)
├── PILAR 4: Review Iktiologis Formal 10 Citra Kuniran (Class 2 Taxonomic Clearance)
│   └── Audit morfologi berbasis 4 kriteria diagnostik Uiblein et al. (2025)
├── PILAR 5: Penyelarasan Arsitektur Aplikasi (Backend Config, DB Schema, UI Tabs)
│   ├── Update config.py ke 3 kelas MVP resmi (brachysoma, leptolepis, sulphureus)
│   ├── Migrasi skema SQLite analyses ke kolom 3 kelas target
│   └── Karantina fitur pengukuran panjang (deaktivasi MeasurementPage)
└── PILAR 6: Eksplorasi Terarah Repositori Publik Terbuka Tambahan
    └── Query terarah iNaturalist API / GBIF / FishNet untuk citra berlisensi CC0/CC-BY
```

### Rincian Metodologi Solusi:

#### 1. Arsitektur Dua Tahap (*Two-Stage Decoupled Pipeline*):
- **Masalah yang diselesaikan:** Kita kekurangan citra tumpukan multi-ikan yang memiliki anotasi bounding box untuk ketiga spesies target kita secara bersamaan.
- **Solusi:** Memisahkan tugas *Deteksi/Lokalisasi* dari tugas *Klasifikasi Spesies*:
  - **Tahap 1 (Class-Agnostic Fish Detector):** Model YOLOv8 dilatih hanya untuk menemukan kotak pembatas *"Fish"* (semua jenis ikan digabung menjadi 1 kelas). Model ini dapat memanfaatkan ribuan bounding box dari dataset publik perikanan terbuka (seperti DeepFish dan FishNet) yang sudah berlimpah.
  - **Tahap 2 (Fine-Grained Species Classifier):** Setiap potongan kotak ikan (*crop ROI*) yang ditemukan oleh Tahap 1 dimasukkan ke model pengklasifikasi kedua (atau ekstraktor fitur) untuk menentukan apakah potongan tersebut adalah Class 0, Class 1, Class 2, atau *Other/Unknown*.
- **Keunggulan:** Penghitungan jumlah ikan (*fish counting*) ditangani secara akurat oleh Tahap 1, sedangkan komposisi spesies ditangani oleh Tahap 2, meskipun data per spesies kita masih sedikit!

#### 2. Sintesis Citra Multi-Ikan (*Cut-and-Paste Compositional Augmentation*):
- Menggunakan teknik augmentasi *Copy-Paste* (Ghiasi et al., CVPR 2021) yang diakui secara internasional dalam computer vision:
  - Dari 20 citra referensi resolusi tinggi yang kita miliki, kita isolasi badan ikannya (*fish segmentation mask*).
  - Kita buat generator skrip komputasi untuk menempelkan 3 hingga 15 ekor ikan secara acak di atas tekstur latar belakang meja potong, lantai semen basah, keranjang plastik biru, atau es curah.
  - Setiap ikan yang ditempelkan otomatis menghasilkan anotasi bounding box format YOLO yang presisi 100% tanpa perlu anotasi manual.
  - Ditambahkan efek pantulan air (*specular glare*), variasi rotasi sudut, skala ukuran, dan bayangan tiruan.
- **Hasil:** Menghasilkan ratusan citra multi-ikan sintetis teranotasi lengkap untuk melatih prototipe detektor multi-ikan tanpa harus menunggu kamera fisik di pelabuhan!

#### 3. Pemanfaatan Model Fondasi Biologi (*BioCLIP Zero-Shot / Few-Shot*):
- **BioCLIP (Stevens et al., CVPR 2024):** Model vision transformer fondasi biologi yang dilatih pada 10 juta spesimen pohon kehidupan (*Tree of Life* / BIOSCAN / iNaturalist).
- Model ini memiliki ruang representasi fitur biologis yang sangat mendalam dan memahami perbedaan taksonomi ikan laut tropis.
- Citra ikan hasil potongan (*crop*) dari Tahap 1 dapat diekstrak vektor fiturnya (*embeddings*) menggunakan BioCLIP, lalu dicocokkan dengan vektor prototipe dari 20 citra referensi bersih kita menggunakan *Cosine Similarity / Nearest Centroid*.

#### 4. Review Iktiologis 10 Kandidat *Upeneus sulphureus*:
- Kita tidak perlu menunggu ekspedisi laut untuk mendapatkan Class 2 jika kita dapat mengaudit 10 citra publik kuniran yang sudah kita miliki.
- Tim iktiologi proyek mengevaluasi kesepuluh gambar tersebut terhadap 4 kriteria diagnostik Uiblein et al. (2025). Jika ditemukan 2 atau 3 gambar yang secara taksonomi terbukti sah berstatus *Upeneus sulphureus* sensu stricto, gambar tersebut dapat dilepaskan dari penahanan dan dijadikan data referensi Class 2!

---

## 11. PRIORITAS PEKERJAAN YANG PALING REALISTIS (ACTION PLAN)

Rencana aksi bertahap tanpa melibatkan sampling lapangan:

```
Urutan Prioritas Kerja:
┌─────────────────────────────────────────────────────────────────────────────┐
│ LANGKAH 1: Penyelarasan Arsitektur Kode Aplikasi Internal                   │
│ - Perbarui config.py ke 3 kelas target MVP resmi.                           │
│ - Perbarui skema database SQLite analyses ke kolom 3 kelas MVP.             │
│ - Nonaktifkan menu / routing MeasurementPage dari antarmuka utama.          │
├─────────────────────────────────────────────────────────────────────────────┤
│ LANGKAH 2: Evaluasi Morfologi Mandiri 10 Citra Upeneus sulphureus           │
│ - Tinjau 10 kandidat Class 2 terhadap acuan Uiblein et al. (2025).          │
│ - Lepaskan kandidat yang lolos verifikasi ke folder class_2 terverifikasi.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ LANGKAH 3: Pembangunan Pipeline Segmentasi Masker & Generator Sintetis      │
│ - Ekstrak masker badan ikan dari citra referensi bersih.                    │
│ - Buat skrip komposisi multi-ikan teranotasi YOLO secara otomatis.          │
├─────────────────────────────────────────────────────────────────────────────┤
│ LANGKAH 4: Eksplorasi Dataset Terbuka Tambahan via API Terarah              │
│ - Skrip query terarah iNaturalist API / GBIF berlisensi CC0 / CC-BY.        │
│ - Fokus mencari foto tangkapan darat/pasar untuk ketiga spesies.            │
├─────────────────────────────────────────────────────────────────────────────┤
│ LANGKAH 5: Pengembangan Prototipe Detektor Dua Tahap (Two-Stage Prototype)  │
│ - Latih detektor generik ikan (Stage 1) pada data campuran.                 │
│ - Bangun pengklasifikasi ROI berbasis embeddings (Stage 2).                 │
│ - Integrasikan ke backend FastAPI & visualisasikan di frontend React.       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. DAFTAR KEPUTUSAN YANG MEMBUTUHKAN PERSETUJUAN PEMILIK PROYEK

Sebelum memulai perubahan teknis, berikut adalah keputusan strategis yang memerlukan konfirmasi dari pemilik proyek:

1. **Persetujuan Penyelarasan Backend & Database:**  
   Apakah disetujui untuk memperbarui `backend/app/config.py` dan memigrasikan database SQLite `fishguard_history.db` agar secara resmi mengunci ketiga kelas MVP (*brachysoma, leptolepis, sulphureus*) dan menghapus dependensi pada kelas legacy (*kanagurta, macarellus*)?
2. **Persetujuan Deaktivasi Halaman Pengukuran Panjang di UI:**  
   Apakah disetujui untuk menyembunyikan/menonaktifkan tab `MeasurementPage` pada frontend agar antarmuka fokus 100% pada pilar MVP (Deteksi, Penghitungan, dan Komposisi Tangkapan)?
3. **Persetujuan Pilihan Strategi Pemodelan:**  
   Apakah menyetujui pendekatan **Two-Stage Pipeline (Detektor Ikan Generik + Pengklasifikasi Spesies ROI)** dan pembuatan **Data Multi-Ikan Sintetis (Copy-Paste Augmentation)** sebagai solusi realistis untuk mengatasi keterbatasan data multi-ikan saat ini?
4. **Persetujuan Pelaksanaan Audit Taksonomi Internal Class 2:**  
   Apakah disetujui untuk melakukan peninjauan morfologi rinci terhadap 10 citra publik *Upeneus sulphureus* yang ada di repositori guna menentukan apakah ada yang dapat divalidasi sebagai referensi resmi Class 2?

---
*Dokumen Handover ini disusun secara komprehensif, berbasis bukti kode dan data aktual, oleh Gemini Antigravity sebagai AI Technical Partner resmi untuk proyek FishGuard AI — ASIK V pada 16 November 2026.*
