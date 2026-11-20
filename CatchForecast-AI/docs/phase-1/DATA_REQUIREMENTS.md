# DATA REQUIREMENTS — CatchForecast AI

> **Phase:** 1 — Project Definition & Research Foundation  
> **Tanggal:** 18 November 2026  
> **Status:** APPROVED BASELINE  
> **Wilayah Studi:** Teluk Banten, Indonesia (~105.90°–106.35° BT, ~5.87°–6.10° LS)

---

## 1. Pendahuluan

Dokumen ini menetapkan spesifikasi kebutuhan data teknis dan ilmiah untuk sistem CatchForecast AI. Seluruh kebutuhan dikelompokkan ke dalam tiga kategori:
- **WAJIB (MANDATORY)**: Data yang mutlak diperlukan. Tanpa data ini, pipeline tidak dapat berjalan atau model tidak dapat dilatih secara valid.
- **PENDUKUNG (SUPPORTING)**: Data yang meningkatkan kinerja, resolusi, atau kemampuan generalisasi model, namun pipeline dasar masih dapat beroperasi tanpanya.
- **OPSIONAL (OPTIONAL)**: Data sekunder/kontekstual yang dapat ditambahkan untuk analisis lanjutan atau fitur antarmuka visual.

Setiap variabel diberi label status ilmiah: `[VERIFIED]`, `[UNVERIFIED]`, `[ASSUMPTION]`, `[RECOMMENDATION]`, atau `[OPEN ISSUE]`.

---

## 2. Kebutuhan Data Oseanografi & Lingkungan (Environmental Data)

Data lingkungan diperoleh terutama melalui Google Earth Engine (GEE) dan platform data terbuka geospasial kelautan.

### 2.1 Ringkasan Kebutuhan Data Lingkungan

| Parameter | Sumber Utama Kandidat | Resolusi Spasial | Resolusi Temporal | Kategori | Status Verifikasi |
|---|---|---|---|---|---|
| **Sea Surface Temperature (SST)** | MODIS-Aqua L3 SMI / Sentinel-3 SLSTR | ~1 km – 4 km | Harian direduksi ke Komposit Bulanan | **WAJIB** | `[VERIFIED: METADATA]` |
| **Chlorophyll-a (Chl-a)** | MODIS-Aqua L3 SMI / Sentinel-3 OLCI | ~300 m – 4 km | Harian direduksi ke Komposit Bulanan | **WAJIB** | `[VERIFIED: METADATA]` |
| **Salinitas Permukaan (SSS)** | HYCOM Global Ocean Forecasting / SMAP | ~8 km (1/12°) | Bulanan | **PENDUKUNG** | `[UNVERIFIED: RESOLUSI KECIL]` |
| **Arus Laut Permukaan (u, v)** | HYCOM Reanalysis / Copernicus GLORYS | ~8 km (1/12°) | Bulanan (kecepatan & arah) | **PENDUKUNG** | `[UNVERIFIED: AKSES GEE]` |
| **Batimetri (Depth)** | GEBCO 2023 / BATNAS BIG | ~100 m – 450 m | Statis | **PENDUKUNG** | `[VERIFIED: TERSEDIA]` |
| **Jarak ke Pantai (Distance to Shore)**| Vektor Garis Pantai BIG / OSM | ~1 km grid | Statis | **PENDUKUNG** | `[VERIFIED: TERSEDIA]` |
| **Angin Permukaan (10m Wind)** | ERA5 Monthly Reanalysis | ~25 km – 31 km | Bulanan | **OPSIONAL** | `[VERIFIED: METADATA]` |
| **Curah Hujan (Precipitation)** | CHIRPS Pentad/Monthly / GPM | ~5 km – 10 km | Bulanan | **OPSIONAL** | `[VERIFIED: METADATA]` |

### 2.2 Spesifikasi Teknis Variabel Lingkungan Wajib

#### A. Sea Surface Temperature (SST)
- **Definisi:** Suhu lapisan permukaan laut yang menjadi pembatas termal metabolisme dan migrasi ikan pelagis serta demersal.
- **Unit Baku:** Derajat Celcius (°C).
- **Format Target:** Raster grid georeferenced (GeoTIFF) atau tabular per centroid grid ~1 km.
- **Masking:** Wajib menerapkan cloud mask (kualitas QA band) dan land mask Teluk Banten untuk menghindari artefak reflektansi daratan di pesisir.
- **Agregasi:** Median atau mean bulanan (mengurangi bias cloud cover tropis).

#### B. Chlorophyll-a (Chl-a)
- **Definisi:** Konsentrasi pigmen fitoplankton sebagai indikator biomassa dan produktivitas primer perairan di Teluk Banten.
- **Unit Baku:** miligram per meter kubik ($mg/m^3$).
- **Format Target:** Raster grid georeferenced (GeoTIFF) atau tabular per centroid grid ~1 km.
- **Transformasi:** Umumnya berdistribusi log-normal; perlu transformasi $\log_{10}(Chl\text{-}a + \epsilon)$ pada feature engineering.
- **Pertimbangan Pesisir:** Di perairan dangkal dekat muara sungai Teluk Banten, Chl-a satelit rentan mengalami interferensi padatan tersuspensi (CDOM / sedimen). Perlu verifikasi QA flag.

---

## 3. Kebutuhan Data Perikanan & Hasil Tangkapan (Fisheries Data)

Data hasil tangkapan bertindak sebagai **variabel dependen (target Y)** dalam machine learning. Data ini harus bersumber dari pencatatan institusional atau pendaratan historis di sekitar Teluk Banten (seperti Pelabuhan Perikanan Nusantara Karangantu, PPI Kronjo, atau DKP Provinsi Banten).

### 3.1 Spesifikasi Target Spesies

Sistem mewajibkan pemisahan total data hasil tangkapan untuk 3 spesies target:

| Spesies | Nama Ilmiah | Nama Indonesia | Famili | Niche Ekologis | Status Kebutuhan |
|---|---|---|---|---|---|
| **Spesies 1** | *Rastrelliger brachysoma* | Kembung Perempuan | Scombridae | Pelagis kecil pesisir | **WAJIB** |
| **Spesies 2** | *Selaroides leptolepis* | Selar Kuning | Carangidae | Pelagis kecil pantai | **WAJIB** |
| **Spesies 3** | *Upeneus sulphureus* | Kuniran / Biji Nangka | Mullidae | Demersal dasar lunak/lumpur | **WAJIB** |

### 3.2 Variabel Target Tangkapan

| Variabel | Unit Baku | Peran | Kategori | Syarat Khusus | Status |
|---|---|---|---|---|---|
| **Catch Weight** | Kilogram (kg) atau Ton | Target Utama (Y) | **WAJIB** | Harus dipilah per spesies; bukan agregat total ikan | `[OPEN ISSUE: AKUISISI]` |
| **Catch Date / Month** | YYYY-MM | Dimensi Waktu | **WAJIB** | Resolusi temporal minimal bulanan | `[OPEN ISSUE: AKUISISI]` |
| **Lokasi / Asal Tangkapan** | Koordinat / Sub-zona / PPI | Dimensi Spasial | **WAJIB** | Minimal mencatat lokasi pendaratan dan fishing ground Teluk Banten | `[OPEN ISSUE: FORMAT]` |
| **Fishing Effort (Upaya)** | Trip, Jam Operasi, Jumlah Armada, GT | Normalisasi CPUE | **PENDUKUNG** | Harus terstandarisasi konsisten jika ingin menghitung CPUE | `[OPEN ISSUE: KETERSEDIAAN]` |
| **Jenis Alat Tangkap (Gear)** | Kategori (Gillnet, Purse seine, dll.) | Kovariat Model | **PENDUKUNG** | Menghindari bias selektivitas alat tangkap | `[OPEN ISSUE: KETERSEDIAAN]` |
| **Catch Count** | Jumlah individu | Alternatif Target | **OPSIONAL** | Sangat jarang tercatat di TPI untuk pelagis kecil | `[UNVERIFIED: TIDAK DISARANKAN]` |

---

## 4. Batasan & Integritas Ilmiah Data

1. **Pemisahan Missing Value vs. Zero-Catch**:
   - Jika suatu spesies tidak tertangkap pada bulan tertentu namun tercatat dalam log pendaratan, nilainya adalah $0\text{ kg}$ (*True Zero*).
   - Jika pada bulan tertentu tidak ada survei/pencatatan data, nilainya adalah `NaN` (*Missing Data*).
   - `[IMPORTANT]` Dilarang mengisi nilai missing sebagai 0 tanpa bukti pencatatan resmi.

2. **Resolusi Spasial dan Temporal Alignment**:
   - Data lingkungan satelit (grid ~1 km) dan data perikanan (bulanan) harus diselaraskan secara temporal (*monthly temporal alignment*).
   - Efek jeda waktu (*time-lag* 1–2 bulan) dari Chl-a ke biomassa ikan akan dimodelkan dalam fitur turunan ($Chl\text{-}a_{t-1}, SST_{t-1}$).

3. **Cakupan Waktu Historis**:
   - Kebutuhan minimum: 3–5 tahun data bulanan (36–60 data points per spesies).
   - Kebutuhan ideal: 5–10 tahun data bulanan (60–120 data points per spesies) untuk mencegah overfitting pada algoritma berbasis pohon (Tree-based ensemble).

---

## 5. Matriks Risiko Ketersediaan Data

| ID Risiko | Deskripsi Risiko | Dampak | Strategi Mitigasi Terencana |
|---|---|---|---|
| **DR-R01** | Data perikanan di PPN Karangantu hanya mencatat nama lokal "Ikan Kembung" tanpa membedakan *R. brachysoma* dan *R. kanagurta*. | **Tinggi** | Lakukan audit taksonomi bersama petugas pendaratan / rujuk literatur rasio dominansi spesies di Teluk Banten. |
| **DR-R02** | Lokasi koordinat penangkapan (*fishing ground lat/lon*) tidak dicatat di TPI (hanya lokasi pelabuhan pendaratan). | **Tinggi** | Adopsi Skenario B/C: Pembagian zona penangkapan tradisional Teluk Banten atau pemetaan catchment area pelabuhan dengan integrasi grid lingkungan. |
| **DR-R03** | Data fishing effort tidak tercatat konsisten. | **Sedang** | Kunci target pada *Catch Weight (kg)*; tolak penggunaan istilah CPUE secara sepihak untuk menjaga kepatuhan ilmiah. |
| **DR-R04** | Cloud coverage tinggi di Teluk Banten menyebabkan data gap pada citra optik harian MODIS/Sentinel-3. | **Sedang** | Gunakan komposit bulanan berbasis median dan evaluasi dataset reanalysis/interpolasi multivariat. |

---

*Dokumen ini merupakan bagian dari Phase 1: Project Definition & Research Foundation — CatchForecast AI.*
