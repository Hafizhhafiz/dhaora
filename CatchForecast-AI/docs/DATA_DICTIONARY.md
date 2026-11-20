# DATA DICTIONARY — CatchForecast AI
**Dokumen Standar Kamus Data Sistem**

- **Proyek:** CatchForecast AI (ASIK Vol. VI)
- **Fase:** Phase 03 — Public & Institutional Dataset Inspection
- **Versi Dokumen:** 1.0 (Definitif)
- **Status:** APPROVED & LOCKED

---

## 1. Skema Dataset Perikanan Tangkap (Ground Truth)

### 1.1 Tabel Pendaratan & Harga Rata-rata Ikan
*File:* `data/raw/fisheries/ppn_karangantu_pendaratan_{bulanan|mingguan|harian}.csv`  
*Sumber Endpoint:* PIPP KKP (`dt-harga-rata-rata-ikan-yang-didaratkan`)

| Nama Kolom | Tipe Data | Satuan / Format | Nullable? | Rentang Nilai | Deskripsi & Interpretasi Bisnis |
|---|---|---|---|---|---|
| `id_jenis_ikan` | Integer | ID Unik | Tidak | 1 – 999 | ID unik taksonomi komoditas ikan pada sistem basis data nasional PIPP KKP. |
| `nama_jenis_ikan` | String | Teks | Tidak | — | Nama umum atau nama lokal komoditas ikan dalam bahasa Indonesia (contoh: "Kembung perempuan", "Kuniran"). |
| `nama_latin` | String | Teks | Tidak | — | Nama taksonomi ilmiah binomial (Genus species) resmi sesuai FishBase / WoRMS. |
| `volume` | Float / Int | Kilogram (kg) | Tidak | $\ge 0$ | Bobot total hasil tangkapan yang didaratkan dan ditimbang di dermaga pendaratan PPN Karangantu pada periode pelaporan. |
| `harga_rata_rata` | Float / Int | Rupiah (IDR / kg) | Tidak | $\ge 0$ | Harga transaksi rata-rata tertimbang per kilogram komoditas ikan di tingkat produsen/TPI. |
| `frequency` | String | Kategori | Tidak | `Harian`, `Mingguan`, `Bulanan` | Frekuensi agregasi temporal data pelaporan dari sistem PIPP KKP. |
| `ingest_date` | String | ISO 8601 UTC | Tidak | Timestamp | Waktu penarikan data secara otomatis oleh skrip `src/data/pipp_ingest.py`. |

---

### 1.2 Tabel Produksi Pendaratan Bulanan 2026
*File:* `data/raw/fisheries/ppn_karangantu_produksi_bulanan_2026.csv`  
*Sumber Endpoint:* PIPP KKP (`grafik-produksi-ikan`)

| Nama Kolom | Tipe Data | Satuan / Format | Nullable? | Rentang Nilai | Deskripsi & Interpretasi Bisnis |
|---|---|---|---|---|---|
| `bulan` | String | 3-huruf ID | Tidak | `Jan` s.d. `Des` | Singkatan nama bulan dalam kalender Masehi bahasa Indonesia. |
| `volume_kg` | Float | Kilogram (kg) | Tidak | $\ge 0$ | Total volume produksi ikan campuran yang didaratkan di PPN Karangantu per bulan kalender. |
| `tahun` | Integer | YYYY | Tidak | 2026 | Tahun kalender pengamatan perikanan. |
| `pelabuhan` | String | Teks | Tidak | `PPN Karangantu` | Nama pangkalan pelabuhan perikanan pendaratan. |
| `wpp` | String | Kode WPP | Tidak | `712` | Wilayah Pengelolaan Perikanan Negara Republik Indonesia (WPPNRI 712: Laut Jawa). |

---

### 1.3 Tabel Operasional Armada Kapal Masuk (Effort Proxy)
*File:* `data/raw/fisheries/ppn_karangantu_operasional_kapal.csv`  
*Sumber Endpoint:* PIPP KKP (`dt-operasional-kapal-masuk`)

| Nama Kolom | Tipe Data | Satuan / Format | Nullable? | Rentang Nilai | Deskripsi & Interpretasi Bisnis |
|---|---|---|---|---|---|
| `nama_alat_tangkap` | String | Teks | Tidak | — | Nama jenis Alat Penangkapan Ikan (API) resmi yang digunakan kapal penangkap (contoh: "Jaring insang", "Bagan tancap"). |
| `jumlah_alat_tangkap_by_kapal_masuk` | Integer | Unit trip / kedatangan | Tidak | $\ge 0$ | Frekuensi kumulatif penggunaan alat tangkap oleh kapal-kapal yang masuk mendarat di pelabuhan. |
| `pelabuhan` | String | Teks | Tidak | `PPN Karangantu` | Nama pelabuhan tempat pencatatan operasional. |
| `ingest_date` | String | ISO 8601 UTC | Tidak | Timestamp | Waktu penarikan data ingestion. |

---

### 1.4 Tabel Khusus Target Spesies Landings
*File:* `data/raw/fisheries/target_species_landings.csv`  
*Deskripsi:* Ekstraksi terstandarisasi untuk 3 spesies target utama CatchForecast AI.

| Nama Kolom | Tipe Data | Satuan / Format | Nullable? | Rentang Nilai | Deskripsi & Interpretasi Bisnis |
|---|---|---|---|---|---|
| `species_id` | String | Kategori kode | Tidak | `rastrelliger_brachysoma`, `selaroides_leptolepis`, `upeneus_sulphureus` | Pengenal internal unik model untuk masing-masing spesies target. |
| `scientific_name` | String | Binomial | Tidak | — | Nama Latin ilmiah spesies target. |
| `local_name` | String | Teks | Tidak | — | Nama sebutan umum lokal di Teluk Banten. |
| `family` | String | Teks | Tidak | `Scombridae`, `Carangidae`, `Mullidae` | Famili taksonomi biologi laut. |
| `category` | String | Kategori | Tidak | `Small Pelagic`, `Demersal` | Zonasi ekologi penangkapan ikan. |
| `frequency` | String | Kategori | Tidak | `Harian`, `Mingguan`, `Bulanan` | Skala waktu rekaman pendaratan. |
| `id_jenis_ikan` | Integer | ID Sistem | Tidak | 93, 116, 163 | ID jenis komoditas pada database PIPP KKP. |
| `nama_sistem` | String | Teks | Tidak | — | Nama yang tertera pada sistem enumerasi pelabuhan. |
| `volume_kg` | Float | Kilogram (kg) | Tidak | $> 0$ | Volume tangkapan aktual yang didaratkan. |
| `harga_rata_rata_idr` | Float | Rupiah (Rp) | Tidak | $> 0$ | Harga rata-rata pasar tingkat pelabuhan. |
| `nilai_total_est_idr` | Float | Rupiah (Rp) | Tidak | $> 0$ | Estimasi nilai omset perikanan ($\text{volume} \times \text{harga}$). |

---

### 1.5 Tabel Analisis Bioekonomi CPUE & MSY (Schaefer & Fox)
*File:* `data/raw/fisheries/target_species_cpue_msy_summary.csv`  
*Deskripsi:* Hasil komputasi parameter bioekonomi berbasis DEC-14.

| Nama Kolom | Tipe Data | Satuan / Format | Nullable? | Rentang Nilai | Deskripsi & Interpretasi Bisnis |
|---|---|---|---|---|---|
| `species_id` | String | ID Unik | Tidak | — | ID spesies target. |
| `scientific_name` | String | Teks | Tidak | — | Nama Latin ilmiah. |
| `local_name` | String | Teks | Tidak | — | Nama lokal. |
| `category` | String | Teks | Tidak | — | Golongan ekologi (Small Pelagic / Demersal). |
| `sample_monthly_catch_kg`| Float | Kilogram | Tidak | $> 0$ | Sampel pendaratan bulanan spesies target. |
| `assigned_gear_effort_annual`| Float | Unit alat | Tidak | $> 0$ | Total tahunan penggunaan alat tangkap terkait. |
| `monthly_cpue_kg_per_trip`| Float | kg / trip alat | Tidak | $> 0$ | Catch Per Unit Effort rata-rata bulanan. |
| `schaefer_e_opt_trips` | Float | Unit alat | Tidak | $> 0$ | Upaya tangkap optimum lestari ($E_{\text{opt}}$) menurut Model Schaefer ($a / 2b$). |
| `schaefer_msy_kg_year` | Float | kg / tahun | Tidak | $> 0$ | Potensi Tangkap Maksimum Lestari menurut Model Schaefer ($a^2 / 4b$). |
| `fox_e_opt_trips` | Float | Unit alat | Tidak | $> 0$ | Upaya tangkap optimum lestari ($E_{\text{opt}}$) menurut Model Fox ($1 / b$). |
| `fox_msy_kg_year` | Float | kg / tahun | Tidak | $> 0$ | Potensi Tangkap Maksimum Lestari menurut Model Fox ($\frac{1}{b} e^{a-1}$). |
| `estimated_utilization_pct`| Float | Persentase (%) | Tidak | $0 – 100+$ | Tingkat pemanfaatan perikanan ($\text{Yield Aktual} / \text{MSY} \times 100\%$). |
| `exploitation_status` | String | Kategori | Tidak | `Moderate`, `Fully-exploited`, `Over-exploited` | Status kelestarian stok ikan di perairan Teluk Banten. |

---

## 2. Skema Fitur Lingkungan Satelit yang Dirancang (Phase 04/05)

Dataset lingkungan yang akan diekstraksi dari Google Earth Engine (GEE) dan Copernicus Marine:

| Nama Fitur | Tipe Data | Satuan | Resolusi Asli | Sumber Dataset | Deskripsi Oseanografi |
|---|---|---|---|---|---|
| `sst` | Float | Derajat Celsius (°C) | 1 km | NASA JPL MUR SST | Suhu Permukaan Laut bebas awan. Indikator preferensi termal ikan. |
| `sst_grad` | Float | °C / km | 1 km | Dihitung (Sobel filter) | Gradien spasial SST; mendeteksi *front* termal laut sebagai zona agregasi plankton. |
| `chla` | Float | $mg/m^3$ | 4 km (L4) / 300 m | CMEMS GlobColour / Sentinel-3 | Konsentrasi Klorofil-a laut. Indikator kelimpahan fitoplankton dan produktivitas primer. |
| `salinity` | Float | PSU (g/kg) | ~8 km | CMEMS GLORYS12V1 | Salinitas air laut permukaan, penanda pola intrusi massa air tawar dari Kali Cibanten. |
| `current_u` | Float | $m/s$ | ~8 km | CMEMS GLORYS12V1 | Komponen kecepatan arus zonal (barat-timur). |
| `current_v` | Float | $m/s$ | ~8 km | CMEMS GLORYS12V1 | Komponen kecepatan arus meridional (selatan-utara). |
| `current_speed` | Float | $m/s$ | ~8 km | Dihitung ($\sqrt{u^2 + v^2}$) | Kecepatan arus resultan permukaan. |
| `bathymetry` | Float | Meter (m) | ~180 m | BIG BATNAS | Kedalaman dasar laut (kontur teluk semi-tertutup Teluk Banten, 0 – 35 m). |
| `dist_shore` | Float | Kilometer (km) | Raster grid | Dihitung (Euclidean Distance) | Jarak piksel grid dari garis pantai Teluk Banten. |

---

## 3. Konvensi Penamaan Variabel & Standardisasi Proyek

1. **Format Identifikasi:** Seluruh nama kolom dalam format *snake_case* bahasa Inggris atau Indonesia terstandarisasi.
2. **Standardisasi Tanggal:** Semua tanggal format `YYYY-MM-DD` atau `ISO 8601 UTC` (`YYYY-MM-DDTHH:MM:SSZ`).
3. **Koordinat & Sistem Proyeksi:** WGS 84 (EPSG:4326) untuk derajat desimal (latitude, longitude) dan EPSG:32748 (UTM Zone 48S) untuk perhitungan jarak metrik di Teluk Banten.
4. **Skala Nilai Target:**
   - Volume: Kilogram ($kg$).
   - Effort: Trip operasional alat tangkap.
   - CPUE: $kg / \text{unit effort}$.