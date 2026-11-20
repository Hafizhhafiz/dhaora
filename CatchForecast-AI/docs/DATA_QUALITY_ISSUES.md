# DATA QUALITY ISSUES & MITIGATION LOG — PHASE 03
**CatchForecast AI (ASIK Vol. VI)**

- **Dokumen:** `docs/DATA_QUALITY_ISSUES.md`
- **Fase:** Phase 03 — Public & Institutional Dataset Inspection
- **Status:** ACTIVE LOG
- **Tujuan:** Mendokumentasikan secara transparan seluruh anomali data, keterbatasan spasial-temporal, dan strategi mitigasi teknis sebelum tahap feature engineering dan pelatihan model machine learning.

---

## 1. Matriks Rekapitulasi Isu Kualitas Data

| ID Isu | Kategori Data | Tingkat Keparahan | Status | Deskripsi Singkat | Mitigasi Rekayasa Data |
|---|---|---|---|---|---|
| **DQI-01** | Spasial Perikanan | **Tinggi** | Teridentifikasi | Pendaratan tercatat di pelabuhan (PPN Karangantu), bukan koordinat GPS kapal saat jaring diangkat. | Spatial buffering radius Teluk Banten & seleksi habitat kedalaman (BATNAS). |
| **DQI-02** | Upaya Tangkap | Sedang | Teridentifikasi | Tabel publik tidak memisahkan tonase GT kapal (<5 GT, 5–10 GT) per baris spesies. | Normalisasi bobot menggunakan frekuensi alat tangkap bulanan dominan kapal masuk. |
| **DQI-03** | Temporal Perikanan | Rendah | Selesai | Rekaman produksi Desember 2026 bernilai 0 (data tahun berjalan belum selesai). | Eksklusi bulan Desember dari training time-series 2026. |
| **DQI-04** | Resolusi Satelit | Sedang | Teridentifikasi | Resolusi 4 km GlobColour menghasilkan piksel laut terbatas di perairan dalam teluk. | Fusi data dengan Sentinel-3 OLCI (300 m) dan interpolasi spasial teratur 1 km. |
| **DQI-05** | Optik Satelit | Sedang | Teridentifikasi | Tutupan awan muson barat (Des–Feb) mengaburkan citra optik mentah (L3). | Wajib menggunakan produk L4 Gap-Free (reanalisis spatiotemporal) & MUR SST (IR+MW). |
| **DQI-06** | Outlier Pemasaran | Rendah | Teridentifikasi | Fluktuasi harga ikan musiman pada hari raya atau cuaca buruk. | Gunakan transformasi logaritmik dan scaling robust (IQR/median). |

---

## 2. Rincian Isu & Strategi Mitigasi

### DQI-01: Atribusi Spasial Pendaratan vs Lokasi Tangkap (Fishing Ground)
- **Kondisi Data:** Sistem pendaratan PIPP KKP mencatat komoditas ikan ketika tiba di dermaga pendaratan PPN Karangantu (`06º 02' LS - 106º 09' BT`). Koordinat titik tangkap di tengah laut (*latitude/longitude haul*) tidak tersedia di tabel publik karena data logbook individual bersifat rahasia (informasi dikecualikan).
- **Dampak Ilmiah:** Risiko misatribusi spasial antara kondisi lingkungan oseanografi di Teluk Banten dengan lokasi riil penangkapan ikan jika kapal berlayar ke luar teluk (misal ke Selat Sunda).
- **Bukti Lapangan:** 
  1. Berdasarkan Laporan Tahunan PPN Karangantu, sebagian besar armada pendarat adalah kapal skala kecil/tradisional armada motor tempel dan kapal <10 GT dengan alat tangkap jaring insang (gillnet), bagan tancap, payang, dan bubu yang beroperasi harian (*one-day fishing*) di perairan semi-tertutup Teluk Banten.
  2. Bagan tancap (1.161 unit) bersifat statis dan berlokasi 100% di dalam perairan Teluk Banten.
- **Strategi Mitigasi:**
  - Tetapkan wilayah pemodelan lingkungan pada poligon resmi **Teluk Banten** (~105.90°–106.35° BT, ~5.87°–6.10° LS).
  - Terapkan filter kedalaman batimetri (BATNAS): *R. brachysoma* dan *S. leptolepis* dibatasi pada perairan teluk 5–25 meter, sedangkan *U. sulphureus* (demersal) pada zona dasar berlumpur/pasir 10–35 meter.

---

### DQI-02: Ketidaksediaan Granularitas GT Kapal Individual di Tabel Publik
- **Kondisi Data:** Tabel pendaratan publik menyajikan total volume bulanan per jenis ikan, namun tidak memecah volume tersebut per kategori Gross Tonnage (GT) kapal individual.
- **Dampak Ilmiah:** Estimasi CPUE murni berbasis $\text{kg}/\text{GT-hari}$ tidak dapat dihitung tanpa asumsi tambahan.
- **Strategi Mitigasi (Sesuai DEC-14):**
  - Gunakan metrik CPUE proksi berbasis frekuensi operasional alat tangkap dominan kapal masuk:
    $$\text{CPUE}_{i,t} = \frac{\text{Catch}_{i,t}}{\text{Effort}_{\text{gear}, t}}$$
  - Upaya tangkap pelagis dikaitkan dengan frekuensi kapal jaring insang, payang, dan bagan (19.819 unit).
  - Upaya tangkap demersal dikaitkan dengan pukat hela dasar dan bubu (5.618 unit).

---

### DQI-03: Rekaman Nilai Nol pada Bulan Berjalan (Desember 2026)
- **Kondisi Data:** File `ppn_karangantu_produksi_bulanan_2026.csv` memuat nilai `volume_kg: 0` pada baris bulan `Des`.
- **Dampak Ilmiah:** Jika nilai nol ini disertakan dalam fitting kurva deret waktu atau regresi ML, akan terjadi bias musiman negatif yang keliru (*artificial drop*).
- **Strategi Mitigasi:**
  - Berikan label flag: `is_complete: False` pada data bulan Desember 2026.
  - Skrip preprocessing pada Phase 06 secara otomatis memfilter bulan yang belum selesai dari pelatihan model:
    ```python
    df_clean = df_prod[df_prod['volume_kg'] > 0]
    ```

---

### DQI-04: Resolusi Spasial Sensor Satelit vs Luas Teluk Banten
- **Kondisi Data:** Luas perairan Teluk Banten adalah sekitar $15 \times 20\text{ km}$. Produk satelit global berskala 4 km (seperti GlobColour Chl-a) hanya menyediakan sekitar 12–18 piksel murni di dalam teluk, serta rentan kontaminasi daratan (*land-contamination*) pada piksel garis pantai.
- **Strategi Mitigasi:**
  - **Suhu Permukaan Laut (SST):** Gunakan **NASA JPL MUR SST** dengan resolusi **1 km (0,01°)** yang menyediakan lebih dari 300 piksel di Teluk Banten.
  - **Klorofil-a (Chl-a):** Padukan produk harian CMEMS GlobColour L4 (4 km gap-free) dengan citra Sentinel-3 OLCI (300 m) bulanan.
  - Terapkan *land-sea mask* presisi tinggi berbasis poligon pesisir BIG/GADM untuk mengeliminasi piksel tepi yang terkontaminasi daratan sebelum ekstraksi nilai fitur.

---

### DQI-05: Tutupan Awan (Cloud Obscuration) pada Citra Optik
- **Kondisi Data:** Wilayah tropis Teluk Banten mengalami tutupan awan tebal selama Musim Barat (Monsun Barat Laut, November hingga Februari). Citra satelit level 3 (L3) mentah mengalami missing data hingga 70% pada musim hujan.
- **Strategi Mitigasi:**
  - Dilarang menggunakan citra harian optik mentah tanpa komposit/gap-filling untuk data operasional model.
  - Wajib menggunakan produk **Level 4 (L4) Gap-Free**:
    - CMEMS GlobColour L4 memanfaatkan interpolasi kriging spatio-temporal optimal untuk menutup kekosongan akibat awan.
    - MUR SST menggabungkan sensor infra merah (MODIS/VIIRS) dengan sensor gelombang mikro (*microwave* AMSR-2/GMI) yang mampu menembus awan tebal.

---

## 3. Protokol Penanganan Missing Data & Outlier (Standard Operating Procedure)

1. **Aturan Imputasi:**
   - Variabel fisik lingkungan (SST, Salinitas): Interpolasi linier temporal jika celah $\le 3\text{ hari}$; interpolasi kriging spasial jika celah spasial terisolasi.
   - Variabel biologis perikanan: **DILARANG MELAKUKAN IMPUTASI BUATAN (SYNTHETIC IMPUTATION) PADA DATA TARGET**. Jika data pendaratan tanggal tertentu tidak tercatat di pelabuhan, tanggal tersebut dikeluarkan dari pelatihan model.
2. **Aturan Outlier:**
   - Outlier fisik diuji terhadap batas oseanografi Teluk Banten:
     - SST: Valid jika $27.0^\circ\text{C} \le \text{SST} \le 32.5^\circ\text{C}$.
     - Salinitas: Valid jika $28.0\text{ PSU} \le \text{Salinitas} \le 34.5\text{ PSU}$.
     - Chl-a: Valid jika $0.1\text{ mg/m}^3 \le \text{Chl-a} \le 15.0\text{ mg/m}^3$.
   - Nilai di luar batas ini ditandai sebagai `QUALITY_FLAG: BAD_PIXEL` dan dieliminasi.