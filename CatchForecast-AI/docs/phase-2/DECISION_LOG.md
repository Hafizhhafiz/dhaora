# DECISION LOG — CatchForecast AI

> **Proyek:** CatchForecast AI (ASIK Vol. VI)  
> **Status Dokumen:** ACTIVE & LIVING LOG  
> **Prinsip Utama:** Setiap keputusan arsitektural dan metodologis dicatat dengan konteks, status, tanggal, justifikasi, dan konsekuensi. Jangan pernah menghapus entri lama.

---

## Ringkasan Log Keputusan

| ID | Tanggal | Topik Keputusan | Status | Dampak Arsitektur |
|---|---|---|---|---|
| **DEC-01** | 2026-11-18 | Pembatasan Wilayah Studi ke Teluk Banten | **LOCKED** | Domain spasial ~105.90°–106.35° BT, ~5.87°–6.10° LS |
| **DEC-02** | 2026-11-18 | Target Prediksi: Catch Prediction (Bukan Habitat Suitability) | **LOCKED** | Target kontinu: Catch Weight (kg/bulan) |
| **DEC-03** | 2026-11-18 | Aturan Ketat Penggunaan Metrik CPUE | **LOCKED** | CPUE hanya jika effort konsisten; dilarang klaim sepihak |
| **DEC-04** | 2026-11-18 | Penetapan Tiga Spesies Target Utama | **LOCKED** | *R. brachysoma*, *S. leptolepis*, *U. sulphureus* |
| **DEC-05** | 2026-11-18 | Arsitektur Species-Specific Tiga Model & Peta Terpisah | **LOCKED** | 3 model regresi independen; 3 peta prediksi terpisah |
| **DEC-06** | 2026-11-18 | Strategi Sumber Data Gabungan (Combined Data Sources) | **LOCKED** | Data satelit publik (GEE) + data historis lokal (PPN/DKP) |
| **DEC-07** | 2026-11-18 | Batasan Waktu: Current Prediction (Bukan Future Forecasting) | **LOCKED** | Estimasi kondisi terkini dengan pencatatan data latency |
| **DEC-08** | 2026-11-18 | Adopsi Roadmap 12-Fase Berurutan & Gate Checkpoint | **LOCKED** | Transisi antar fase wajib memenuhi acceptance criteria & laporan |
| **DEC-09** | 2026-11-18 | Larangan Mutlak Data Sintetis Sebagai Data Riset | **LOCKED** | Data sintetis dilarang keras untuk training penelitian |
| **DEC-10** | 2026-11-18 | Baseline Tumpukan Teknologi (Technology Stack) | **LOCKED** | Python, XGBoost/LightGBM, GEE, FastAPI, PostGIS, React, Leaflet |
| **DEC-11** | 2026-11-18 | Gate Approval Phase 01 & Mandat Transisi Phase 02 | **APPROVED** | Menyetujui hasil Phase 01; membuka gate Phase 02 fokus PPN Karangantu & GEE |
| **DEC-12** | 2026-11-18 | Integrasi Data PIPP KKP PPN Karangantu Sebagai Ground Truth Tangkapan | **LOCKED** | Pipeline ekstraksi mandiri via REST/AJAX endpoint + permohonan surat formal logbook |
| **DEC-13** | 2026-11-18 | Strategi Akuisisi Mandiri Penuh Melalui PIPP KKP API Scraper | **APPROVED** | Menghindari bottleneck birokrasi; fokus ekstraksi endpoint terbuka harian/bulanan |
| **DEC-14** | 2026-11-18 | Integrasi Penghitungan CPUE & Estimasi Bioekonomi MSY (Schaefer/Fox) | **APPROVED** | Menghitung CPUE per alat tangkap & mengestimasi MSY dan tingkat pemanfaatan spesies |

---

## Rincian Keputusan

### DEC-01: Pembatasan Wilayah Studi ke Teluk Banten
- **Konteks:** Perlu menetapkan batas batas spasial pemodelan oseanografi dan perikanan yang realistis dan terfokus.
- **Keputusan:** Wilayah studi dikunci pada **Teluk Banten (Banten Bay)** (~105.90°–106.35° BT, ~5.87°–6.10° LS). Wilayah tidak boleh diperluas ke seluruh Indonesia atau Selat Sunda tanpa persetujuan eksplisit baru.
- **Justifikasi:** Teluk Banten merupakan perairan semi-tertutup dengan pangkalan pendaratan ikan yang terkonsentrasi di PPN Karangantu, sehingga memiliki karakteristik oseanografi lokal yang khas dan dapat diisolasi.
- **Konsekuensi:** Ekstraksi data lingkungan satelit dan resolusi grid (~1 km) harus disesuaikan dengan dimensi teluk ini.

### DEC-02: Target Prediksi Adalah Catch Prediction, Bukan Habitat Suitability
- **Konteks:** Sering terjadi pergeseran fokus proyek dari memprediksi hasil tangkapan riil menjadi sekadar memprediksi indeks kesesuaian habitat (0–1).
- **Keputusan:** Target prediksi adalah **Catch Prediction** dengan estimasi kuantitatif hasil tangkapan (Catch Weight dalam kg/bulan).
- **Justifikasi:** Nelayan dan pembuat kebijakan membutuhkan estimasi berat hasil tangkapan aktual untuk perencanaan trip dan manajemen perikanan.
- **Konsekuensi:** Proyek memerlukan data historis hasil tangkapan riil dari pendaratan lokal sebagai variabel dependen ($Y$).

### DEC-03: Aturan Ketat Penggunaan Metrik CPUE
- **Konteks:** CPUE (*Catch Per Unit Effort*) adalah metrik standar perikanan, namun data *fishing effort* (upaya penangkapan) sering kali tidak tercatat secara terstandarisasi.
- **Keputusan:** Catch Weight (kg/bulan) adalah target default. CPUE **hanya** akan digunakan jika data *fishing effort* (trip, jam, armada) terbukti tersedia secara konsisten sepanjang periode amatan. Dilarang keras menamai estimasi berat tangkapan sebagai CPUE.
- **Justifikasi:** Menjaga kepatuhan etika ilmiah dan integritas penelitian.
- **Konsekuensi:** Jika data effort tidak ada, keterbatasan ini harus dilaporkan secara transparan.

### DEC-04: Penetapan Tiga Spesies Target Utama
- **Konteks:** Pemilihan spesies harus mewakili keragaman ekologis perikanan tangkap lokal Teluk Banten.
- **Keputusan:** Target dikunci pada 3 spesies:
  1. *Rastrelliger brachysoma* (Kembung perempuan — pelagis kecil)
  2. *Selaroides leptolepis* (Selar kuning — pelagis kecil)
  3. *Upeneus sulphureus* (Kuniran — demersal)
- **Justifikasi:** Ketiga spesies terbukti secara empiris dan literatur didaratkan secara reguler di PPN Karangantu dan mewakili respons lingkungan yang berbeda (pelagis vs demersal).
- **Konsekuensi:** Pipeline pengolahan data tangkapan wajib memisahkan ketiga spesies ini dan tidak boleh mencampurnya.

### DEC-05: Arsitektur Species-Specific Tiga Model & Peta Terpisah
- **Konteks:** Apakah menggunakan satu model *multi-output* atau tiga model independen.
- **Keputusan:** Menggunakan **Species-Specific Modeling**: tiga model regresi independen dan menghasilkan tiga peta prediksi terpisah di Web GIS. Infrastruktur data engineering boleh digunakan bersama.
- **Justifikasi:** Karakteristik biologi, preferensi suhu, respons klorofil, dan musim penangkapan ketiga spesies berbeda nyata. Model independen memungkinkan tuning hyperparameter dan seleksi fitur optimal per spesies.
- **Konsekuensi:** Mengharuskan penyimpanan 3 model artifact dan 3 endpoint/layer visualisasi di frontend.

### DEC-06: Strategi Sumber Data Gabungan (Combined Data Sources)
- **Konteks:** Kebutuhan data lingkungan dan perikanan yang berbeda asal.
- **Keputusan:** Menggabungkan data sekunder publik (citra satelit MODIS/Sentinel via GEE) dengan data historis institusional lokal (catatan pendaratan TPI/PPI Karangantu / DKP).
- **Justifikasi:** Data satelit menyediakan variabel lingkungan yang luas dan berkala, sedangkan data institusional menyediakan variabel target tangkapan lokal.
- **Konsekuensi:** Memerlukan proses integrasi data (spatial-temporal matching) dan penanganan lisensi data.

### DEC-07: Batasan Waktu: Current Prediction, Bukan Future Forecasting
- **Konteks:** Klaim real-time atau peramalan masa depan (future forecasting) sering tidak realistis karena keterlambatan pemrosesan citra satelit dan ketersediaan data.
- **Keputusan:** Sistem didefinisikan sebagai **Current Prediction** (estimasi kondisi tangkapan berdasarkan kondisi oseanografi terkini yang tersedia). Dilarang menyebut sistem sebagai "real-time" jika terdapat latency sumber data.
- **Justifikasi:** Komposit satelit bebas awan di perairan tropis membutuhkan agregasi waktu (misal: 8-hari atau bulanan). Tanggal akuisisi dan latensi data harus ditampilkan secara eksplisit.
- **Konsekuensi:** Sistem antarmuka harus mencantumkan label tanggal observasi data lingkungan yang menjadi dasar prediksi.

### DEC-08: Adopsi Roadmap 12-Fase Berurutan & Gate Checkpoint
- **Konteks:** Menjaga ketertiban eksekusi sistematis dan mencegah pengerjaan terburu-buru yang melompati validasi data.
- **Keputusan:** Mengadopsi roadmap 12-fase dari Master Project Brief. Setiap fase wajib menghasilkan `PHASE_REPORT.md` dan `ANTIGRAVITY_REVIEW.md` serta diverifikasi terhadap acceptance criteria sebelum membuka fase berikutnya.
- **Justifikasi:** Menjamin setiap langkah berbasis bukti (*evidence-based development*) dan meminimalkan akumulasi technical debt.
- **Konsekuensi:** Fase 2 tidak akan dimulai tanpa persetujuan eksplisit pengguna.

### DEC-09: Larangan Mutlak Data Sintetis Sebagai Data Riset
- **Konteks:** Risiko pembuatan data tangkapan palsu/sintetis untuk mempercepat pelatihan model.
- **Keputusan:** Dilarang keras menggunakan data sintetis yang disamarkan sebagai data penelitian riil. Data uji tiruan (*mock fixtures*) hanya diizinkan untuk unit test kode perangkat lunak dan wajib diberi label mencolok: `TEST_FIXTURE_ONLY`.
- **Justifikasi:** Kredibilitas ilmiah dan validitas akademik sistem.
- **Konsekuensi:** Jika data perikanan asli belum diperoleh, proyek harus menyatakan status `BLOCKED` atau `PARTIALLY_COMPLETED` pada fase terkait, bukan memalsukan data.

### DEC-10: Baseline Tumpukan Teknologi
- **Konteks:** Menentukan stack perangkat lunak yang konsisten dari ekstraksi data hingga visualisasi.
- **Keputusan:**
  - Pemrosesan Geospasial: Google Earth Engine (Python/JS API)
  - Data Engineering & ML: Python 3.14, Pandas, Scikit-learn, XGBoost/LightGBM
  - Backend: FastAPI (Python)
  - Database: PostgreSQL + PostGIS
  - Frontend: React.js + Leaflet.js
- **Justifikasi:** Stack open-source standar industri dengan performa tinggi dan interoperabilitas data spasial yang matang.
- **Konsekuensi:** Kebutuhan konfigurasi environment Python dan dependensi terstandarisasi di `requirements.txt`.

### DEC-11: Gate Approval Phase 01 & Mandat Transisi Phase 02
- **Konteks:** Penyelesaian seluruh deliverable dan acceptance criteria Phase 01.
- **Keputusan:** Pengguna secara eksplisit menyetujui laporan Phase 01 (`STATUS: COMPLETED / APPROVED`), mengunci seluruh fondasi ilmiah dan arsitektur, serta memberikan mandat untuk memulai **Phase 02 (Data Source Discovery)** dengan fokus eksplorasi data pendaratan di PPN Karangantu (DKP Banten / BPS) dan penemuan katalog data oseanografi GEE.
- **Justifikasi:** Seluruh 10 kriteria penerimaan terpenuhi, referensi ilmiah terverifikasi riil, dan environment lokal telah terisolasi aman.
- **Konsekuensi:** Membuka gerbang eksekusi Phase 02 tanpa melanggar batasan independensi fase.

### DEC-12: Integrasi Data PIPP KKP PPN Karangantu Sebagai Ground Truth Tangkapan & Proksi Fishing Effort
- **Konteks:** Hasil audit live portal Pusat Informasi Pelabuhan Perikanan (PIPP) KKP membuktikan bahwa PPN Karangantu memiliki pencatatan pendaratan harian, mingguan, dan bulanan yang mencantumkan nama Latin ilmiah dari ketiga spesies target (*Rastrelliger brachysoma*, *Upeneus sulphureus*, *Selaroides leptolepis*) serta operasional armada kapal masuk berdasarkan jenis alat tangkap.
- **Keputusan:** Mengadopsi sistem PIPP KKP PPN Karangantu sebagai **sumber primer ground truth hasil tangkapan kuantitatif** ($Y$) dan proksi rasio upaya penangkapan (*fishing effort*). Ekstraksi data dilakukan secara otomatis melalui pipeline programatik JSON endpoint pada Phase 03, didampingi pengajuan permohonan surat formal (Jalur A) ke PPN Karangantu untuk memperoleh data arsip logbook multi-tahun (2018–2025).
- **Justifikasi:** 
  1. *R. brachysoma* tervalidasi sebagai komoditas pendaratan nomor 1 terbesar di PPN Karangantu (474.922 kg pada 2026), mematahkan asumsi awal bahwa spesies ini minor atau tercampur.
  2. Endpoint publik bersifat unauthenticated JSON REST API (HTTP 200 OK) yang memungkinkan automated ingestion yang reproducible dan terhindar dari bottleneck birokrasi.
  3. Pemisahan taksonomi tingkat spesies ilmiah telah diterapkan di sistem database PIPP KKP.
- **Konsekuensi:** 
  1. Target prediksi tidak perlu diturunkan ke level genus (*Rastrelliger* spp. atau *Upeneus* spp.), melainkan tetap di tingkat spesies ilmiah.
  2. Pipeline Phase 03 akan membangun skrip pengunduh mandiri (`src/data/pipp_ingest.py`) untuk mengambil time-series historis dan mingguan/bulanan.
  3. Indikator upaya tangkap bulanan per jenis alat tangkap dapat dimanfaatkan sebagai fitur normalisasi CPUE proksi.

### DEC-13: Strategi Akuisisi Mandiri Penuh Melalui PIPP KKP API Scraper
- **Konteks:** Pengguna memilih opsi strategi akuisisi data untuk Phase 03 tanpa ketergantungan pada birokrasi surat izin institusi yang berisiko memakan waktu lama.
- **Keputusan:** Proyek memfokuskan akuisisi data perikanan tangkap sepenuhnya secara mandiri (*Full Independent Programmatic Ingestion*) menggunakan skrip ekstraksi otomatis ke endpoint JSON terbuka PIPP KKP PPN Karangantu.
- **Justifikasi:** Endpoint REST/AJAX PIPP KKP terbukti stabil, tidak memerlukan autentikasi login (unauthenticated HTTP 200), dan menyediakan data pendaratan harian, mingguan, serta bulanan lengkap dengan nama ilmiah spesies dan harga pasar.
- **Konsekuensi:** Menghilangkan risiko penolakan birokrasi (*R-01*). Fokus engineering pada Phase 03 adalah membangun modul ingestion dan parser data yang tangguh di `src/data/pipp_ingest.py`.

### DEC-14: Integrasi Penghitungan CPUE & Estimasi Bioekonomi MSY (Schaefer & Fox Models)
- **Konteks:** Pengguna menginstruksikan perluasan analisis untuk menghitung metrik CPUE (*Catch Per Unit Effort*) dan estimasi MSY (*Maximum Sustainable Yield*) selain target catch weight murni.
- **Keputusan:** Pipeline pemodelan dan analisis data perikanan akan memproses:
  1. **Estimasi CPUE:** $\text{CPUE}_{i,t} = \frac{\text{Catch}_{i,t}}{\text{Effort}_t}$, dengan $\text{Effort}_t$ dihitung berdasarkan frekuensi operasional alat tangkap dominan kapal masuk (Gillnet, Payang, Bubu, Pukat Hela Dasar) per bulan/periode dari PIPP KKP.
  2. **Model Surplus Produksi MSY:** Mengintegrasikan model surplus produksi standar perikanan (Model Schaefer $Y = aE - bE^2$ dan Model Fox $\ln(Y/E) = a - bE$) untuk ketiga spesies target guna mengestimasi upaya optimum ($E_{\text{opt}}$), potensi lestari ($MSY$), dan status eksploitasi (*Total Allowable Catch* / tingkat pemanfaatan) di Teluk Banten.
- **Justifikasi:** Menyediakan nilai tambah bioekonomi yang sangat tinggi bagi pengambil kebijakan dan nelayan di Teluk Banten, melampaui sekadar estimasi bobot tangkapan spasial.
- **Konsekuensi:** Mengharuskan penambahan modul analitik bioekonomi di `src/evaluation/msy_models.py` dan visualisasi kurva surplus produksi pada modul Web GIS frontend nantinya.

---

*Log ini diperbarui secara berkala pada setiap fase pengerjaan CatchForecast AI.*
