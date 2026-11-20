# ENVIRONMENTAL DATA SCHEMA — PHASE 05
**CatchForecast AI (ASIK Vol. VI)**

- **Dokumen:** `docs/ENVIRONMENTAL_DATA_SCHEMA.md`
- **Fase:** Phase 05 — Environmental Data Engineering
- **Status:** APPROVED & LOCKED
- **Cakupan Spasial:** Teluk Banten (`105.90°–106.35° BT`, `-6.15°– -5.85° LS`), WPPNRI 712
- **Resolusi Spasial:** Grid Reguler $1\text{ km} \times 1\text{ km}$ (~0,01° desimal)
- **CRS Acuan:** EPSG:4326 (WGS 84 desimal) & EPSG:32748 (WGS 84 / UTM Zone 48S untuk jarak metrik)

---

## 1. Skema Grid Spasial Acuan (Master Spatial Grid)
*File Lokasi:* `data/processed/environmental/teluk_banten_grid_master.csv`  
*Deskripsi:* Tabel koordinat dan atribut statis untuk 1.426 sel grid (46 kolom $\times$ 31 baris) yang membagi perairan Teluk Banten dan daratan pesisir sekitarnya.

| Nama Kolom | Tipe Data | Satuan | Nullable? | Rentang Nilai | Deskripsi Teknis |
|---|---|---|---|---|---|
| `cell_id` | String | ID Unik | Tidak | `TB_G_0001` – `TB_G_1426` | Pengenal unik sel grid spasial Teluk Banten berurutan. |
| `row_idx` | Integer | Indeks Baris | Tidak | 0 – 30 | Indeks baris koordinat lintang (latitude) dari selatan ke utara. |
| `col_idx` | Integer | Indeks Kolom | Tidak | 0 – 45 | Indeks kolom koordinat bujur (longitude) dari barat ke timur. |
| `lat` | Float | Derajat Desimal | Tidak | -6.15 s.d. -5.85 | Koordinat lintang titik pusat (*centroid*) sel grid (EPSG:4326). |
| `lon` | Float | Derajat Desimal | Tidak | 105.90 s.d. 106.35 | Koordinat bujur titik pusat (*centroid*) sel grid (EPSG:4326). |
| `is_marine` | Boolean | True / False | Tidak | `True`, `False` | Masking daratan vs lautan; `True` = badan air laut Teluk Banten (798 sel), `False` = daratan Banten (628 sel). |
| `bathymetry_depth_m` | Float | Meter (m) | Tidak | 0.0 s.d. 35.0 | Estimasi kedalaman dasar laut perairan Teluk Banten (0 m pada daratan, 2–5 m pesisir, hingga ~35 m di mulut teluk). |
| `dist_to_port_km` | Float | Kilometer (km) | Tidak | $\ge 0.0$ | Jarak *great-circle* (Haversine) dari titik pusat grid ke dermaga PPN Karangantu (`106.1500° E, -6.0333° S`). |
| `dist_to_shore_km` | Float | Kilometer (km) | Tidak | $\ge 0.0$ | Jarak perkiraan tegak lurus dari garis pantai Teluk Banten. |

---

## 2. Skema Matriks Fitur Spasio-Temporal Bulanan
*File Lokasi:* `data/processed/environmental/teluk_banten_environmental_features_2026.csv`  
*Deskripsi:* Matriks fitur dinamis bulanan (15.686 baris = 1.426 sel $\times$ 11 bulan) yang memuat variabel fisik oseanografi terpadu untuk pelatihan model AI.

| Nama Kolom | Tipe Data | Satuan | Nullable? | Rentang Nilai Valid | Deskripsi Oseanografi & Relevansi Perikanan |
|---|---|---|---|---|---|
| `cell_id` | String | ID Unik | Tidak | `TB_G_0001` – `TB_G_1426` | Relasi kunci ke Master Spatial Grid. |
| `year` | Integer | YYYY | Tidak | 2026 | Tahun kalender pengamatan perikanan. |
| `month` | Integer | 1 – 11 | Tidak | 1 (Jan) s.d. 11 (Nov) | Bulan kalender pengamatan perikanan. |
| `lat` | Float | Derajat | Tidak | -6.15 s.d. -5.85 | Lintang centroid sel grid. |
| `lon` | Float | Derajat | Tidak | 105.90 s.d. 106.35 | Bujur centroid sel grid. |
| `is_marine` | Boolean | Boolean | Tidak | `True`, `False` | Status perairan laut vs daratan. |
| `sst_celsius` | Float | Derajat Celsius (°C)| Ya (NaN di darat) | 25.0 s.d. 34.0 | Suhu Permukaan Laut rata-rata bulanan. Indikator preferensi termal ikan pelagis (*R. brachysoma*, *S. leptolepis*). |
| `thermal_front_c_per_km` | Float | °C / km | Ya (NaN di darat) | 0.0 s.d. 2.0 | Magnitudo gradien spasial SST menggunakan kernel Sobel 3x3. Mendeteksi batas pertemuan massa air (*thermal front*) sebagai hotspot agregasi plankton dan ikan. |
| `chlorophyll_a_mg_m3` | Float | $\text{mg/m}^3$ | Ya (NaN di darat) | 0.05 s.d. 15.0 | Estimasi konsentrasi Klorofil-a perairan teluk. Indikator kelimpahan fitoplankton dan produktivitas primer. |
| `bathymetry_depth_m` | Float | Meter (m) | Tidak | 0.0 s.d. 35.0 | Kedalaman dasar laut (fitur kunci pembeda habitat pelagis vs demersal *Upeneus sulphureus*). |
| `bathymetry_slope_deg` | Float | Derajat (°) | Tidak | 0.0 s.d. 15.0 | Kemiringan lereng dasar laut. Membedakan dasar rata berlumpur dengan tubir terumbu karang. |
| `dist_to_shore_km` | Float | Kilometer (km) | Tidak | $\ge 0.0$ | Jarak sel ke garis pantai. |
| `dist_to_port_km` | Float | Kilometer (km) | Tidak | $\ge 0.0$ | Jarak sel ke pelabuhan pendaratan Karangantu (proksi biaya operasional bahan bakar nelayan). |
| `quality_flag` | String | Kategori | Tidak | `VALID_OCEAN`, `LAND_MASKED` | Flag kualitas data untuk penyaringan sebelum pelatihan model machine learning. |

---

## 3. Skema Data Terpadu Hasil Alignment (Catch & Environment)
*File Lokasi:* `data/processed/environmental/monthly_aligned_environment_catch.csv`  
*Deskripsi:* Tabel aggregat bulanan yang menggabungkan statistik oseanografi Teluk Banten dengan volume pendaratan aktual PPN Karangantu tahun 2026.

| Nama Kolom | Tipe Data | Satuan | Deskripsi |
|---|---|---|---|
| `bulan` | String | 3-huruf | Nama bulan kalender Indonesia (`Jan` s.d. `Nov`). |
| `volume_kg` | Float | Kilogram (kg) | Total hasil tangkapan riil yang didaratkan di PPN Karangantu. |
| `tahun` | Integer | YYYY | Tahun kalender 2026. |
| `pelabuhan` | String | Teks | `PPN Karangantu`. |
| `wpp` | String | Teks | `712`. |
| `month` | Integer | 1 – 11 | Indeks numerik bulan kalender. |
| `sst_mean` | Float | °C | Suhu permukaan laut rata-rata Teluk Banten pada bulan tersebut. |
| `sst_median` | Float | °C | Suhu permukaan laut median Teluk Banten. |
| `sst_std` | Float | °C | Standar deviasi spasial suhu permukaan laut di teluk. |
| `front_mean` | Float | °C / km | Rata-rata intensitas front termal di seluruh teluk. |
| `chla_mean` | Float | $\text{mg/m}^3$ | Rata-rata konsentrasi klorofil-a teluk. |
| `depth_mean` | Float | Meter | Rata-rata kedalaman perairan teluk (~17,8 m). |
