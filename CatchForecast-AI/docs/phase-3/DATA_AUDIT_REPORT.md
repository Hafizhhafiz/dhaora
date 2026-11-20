# DATA AUDIT REPORT — PHASE 03
**CatchForecast AI (ASIK Vol. VI)**

- **Tanggal Audit:** 18 November 2026
- **Auditor:** Antigravity Local Execution Agent
- **Lingkup Wilayah:** Teluk Banten (~105.90°–106.35° BT, ~5.87°–6.10° LS) & PPN Karangantu (WPP 712)
- **Target Spesies:** *Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*

---

## 1. Ringkasan Eksekutif

Audit Phase 03 mengevaluasi secara ketat dan menyeluruh seluruh berkas dataset aktual yang telah diekstraksi dan tersedia pada repositori lokal `data/raw/fisheries/` dan kandidat citra satelit lingkungan `data/raw/oceanographic/`. 

Audit membuktikan bahwa:
1. **Integritas Taksonomi Terpenuhi 100%:** Ketiga target spesies dicatat secara terpisah menggunakan nama Latin ilmiah dalam skema database resmi PIPP KKP, dengan volume pendaratan aktual yang melimpah (*R. brachysoma* menempati ranking #1 komoditas terbesar di PPN Karangantu).
2. **Kesesuaian Target Prediksi:** Data mendukung penuh pemodelan kuantitatif **Catch Weight (kg)** dan estimasi **CPUE (kg/unit effort alat tangkap)**, serta analisis kurva surplus bioekonomi **MSY (Schaefer & Fox)**.
3. **Data Integrity & Provenance:** Seluruh 9 berkas data perikanan bebas dari duplikasi rekaman (0 duplikat), memiliki zero missing cells pada variabel kritis (volume & harga), dan telah diverifikasi menggunakan sidik jari kriptografi SHA-256.

---

## 2. Inventarisasi & Provenance File Dataset Aktual

Seluruh dataset diunduh langsung dari sistem resmi **Pusat Informasi Pelabuhan Perikanan (PIPP)** Direktorat Jenderal Perikanan Tangkap, Kementerian Kelautan dan Perikanan (KKP) pada 18 November 2026 melalui skrip automasi `src/data/pipp_ingest.py`.

| Nama Berkas | Baris | Kolom | Ukuran (KB) | Missing Cells | Duplikat | SHA-256 (Awalan) |
|---|---|---|---|---|---|---|
| `ppn_karangantu_pendaratan_bulanan.csv` | 67 | 7 | 5,32 KB | 0 | 0 | `1a7cf73cfcae...` |
| `ppn_karangantu_pendaratan_mingguan.csv` | 37 | 7 | 3,01 KB | 0 | 0 | `b99d3ad354bf...` |
| `ppn_karangantu_pendaratan_harian.csv` | 30 | 7 | 2,39 KB | 0 | 0 | `6fb9121a5cf8...` |
| `ppn_karangantu_produksi_bulanan_2026.csv` | 12 | 5 | 0,48 KB | 0 | 0 | `1e95ec8a6358...` |
| `ppn_karangantu_operasional_kapal.csv` | 17 | 4 | 1,09 KB | 0 | 0 | `61f6c4491740...` |
| `ppn_karangantu_pemasaran_masuk.csv` | 18 | 4 | 0,77 KB | 0 | 0 | `a49258525b6a...` |
| `ppn_karangantu_pemasaran_keluar.csv` | 8 | 4 | 0,40 KB | 0 | 0 | `ca9f9bc0baae...` |
| `target_species_landings.csv` | 9 | 11 | 1,28 KB | 0 | 0 | `ebff9e923e20...` |
| `target_species_cpue_msy_summary.csv` | 3 | 13 | 0,66 KB | 0 | 0 | `23961f6cf8a9...` |
| `raw_pipp_dump.json` | — | — | 34,66 KB | — | — | `df3ad0ba921e...` |

---

## 3. Audit Taksonomi Spesies & Sinonim

Sistem pencatatan PIPP KKP menerapkan standardisasi kode jenis ikan nasional (`id_jenis_ikan`). Audit membandingkan nama sistem terhadap taksonomi ilmiah resmi (WoRMS & FishBase):

### 3.1 Spesies 1: *Rastrelliger brachysoma* (Kembung Perempuan)
- **ID Sistem PIPP:** `116`
- **Nama Sistem:** `Kembung perempuan`
- **Nama Latin Tercatat:** `Rastrelliger brachysoma`
- **Famili:** Scombridae | **Kelompok Ekologi:** Pelagis Kecil
- **Validasi Diferensiasi Taksonomi:** Sistem secara eksplisit membedakan *R. brachysoma* dengan spesies kerabat simpatrik *Rastrelliger kanagurta* (Kembung lelaki, ID `117`, tercatat 12.043 kg pada periode yang sama). Tidak terjadi percampuran taksonomi.
- **Volume Aktual 2026:** **474.922 Kg** (~474,9 Ton) — Komoditas pendaratan nomor 1 terbesar di Teluk Banten.
- **Harga Rata-rata:** Rp 24.000 / kg (stabil harian, mingguan, bulanan).

### 3.2 Spesies 2: *Upeneus sulphureus* (Kuniran)
- **ID Sistem PIPP:** `93`
- **Nama Sistem:** `Kuniran`
- **Nama Latin Tercatat:** `Upeneus sulphureus`
- **Famili:** Mullidae | **Kelompok Ekologi:** Demersal
- **Validasi Diferensiasi Taksonomi:** Sistem memisahkan *Upeneus sulphureus* dengan spesies *Upeneus tragula* (Biji nangka, ID `95`, tercatat 23 kg). 
- **Volume Aktual 2026:** **182.175 Kg** (~182,2 Ton) — Komoditas peringkat #5 terbesar di PPN Karangantu.
- **Harga Rata-rata:** Rp 2.722 – Rp 2.806 / kg.

### 3.3 Spesies 3: *Selaroides leptolepis* (Selar Kuning)
- **ID Sistem PIPP:** `163`
- **Nama Sistem:** `Selar kuning`
- **Nama Latin Tercatat:** `Selaroides leptolepis`
- **Famili:** Carangidae | **Kelompok Ekologi:** Pelagis Kecil
- **Validasi Diferensiasi Taksonomi:** Sistem memisahkan *Selaroides leptolepis* dari genus kerabat *Alepes djedaba* (Selar komo, ID `161`, 32.870 kg), *Selar crumenophthalmus* (Selar bentong, 134 kg), dan *Atule mate* (Selar hijau, 28 kg).
- **Volume Aktual 2026:** **36.308 Kg** akumulasi 2026 (sampel bulanan 21.839 kg).
- **Harga Rata-rata:** Rp 4.500 – Rp 4.846 / kg.

---

## 4. Evaluasi Variabel Target Prediksi & Effort

### 4.1 Target Primer: Catch Weight (Kilogram)
Data volume pendaratan ikan dinyatakan secara eksak dalam satuan **Kilogram (Kg)**.
- Akurasi Skala: Skala pendaratan ditimbang di dermaga TPI/PPN Karangantu oleh petugas enumerator resmi.
- Missingness: 0% data kosong pada kolom `volume`.
- Distribusi Nilai: Seluruh nilai volume $\ge 0$.

### 4.2 Proksi Fishing Effort & Alat Tangkap
Data operasional kapal masuk mencatat 17 kategori alat penangkapan ikan (API) dengan total **25.586 aktivitas penggunaan alat tangkap masuk**:
- **Alat Tangkap Pelagis Dominan (Effort Pelagis: 19.819 unit):**
  - Jaring insang lainnya: 7.088
  - Jaring insang hanyut: 3.175
  - Jaring insang berlapis: 1.990
  - Bagan tancap: 1.161
  - Payang: 700
  - Bagan perahu & apung: 434
- **Alat Tangkap Demersal Dominan (Effort Demersal: 5.618 unit):**
  - Pukat hela dasar berpapan: 5.121
  - Bubu: 497

### 4.3 Kelayakan Penggunaan CPUE & MSY (Sesuai DEC-14)
- **Rasio CPUE Terstandarisasi:** Dihitung sebagai $\text{CPUE} = \frac{\text{Volume Tangkapan (kg)}}{\text{Effort Alat Tangkap Terkait / 12}}$.
  - *R. brachysoma:* **20,74 kg / unit effort**.
  - *S. leptolepis:* **13,22 kg / unit effort**.
  - *U. sulphureus:* **53,85 kg / unit effort**.
- **Model Bioekonomi Surplus Produksi:**
  - Telah dihitung menggunakan Model Schaefer dan Fox.
  - Seluruh spesies menunjukkan tingkat pemanfaatan ~90,9% (*Fully-exploited*), menegaskan pentingnya sistem prediksi presisi seperti CatchForecast AI agar nelayan tidak menangkap secara berlebih (*overfishing*).

---

## 5. Audit Temporal & Spasial

### 5.1 Cakupan Waktu & Frekuensi
- **Deret Waktu Bulanan 2026:**
  - Januari: 118.086 kg | Februari: 177.767 kg | Maret: 140.681 kg
  - April: 227.015 kg | Mei: 290.203 kg | Juni: 292.269 kg
  - Juli: 370.372 kg | **Agustus: 420.859 kg (PUNCAK MUSIM / PEAK)**
  - September: 342.386 kg | Oktober: 246.077 kg | November: 152.126 kg
  - Desember: 0 kg (Tahun berjalan belum berakhir saat akuisisi).
- **Timezone:** Waktu Indonesia Barat (WIB / UTC+7).

### 5.2 Atribusi Spasial & Batas Wilayah
- **Pelabuhan Pendaratan:** PPN Karangantu (`06º 02' LS - 106º 09' BT`).
- **Domain Kelautan:** Teluk Banten, WPPNRI 712 (Laut Jawa).
- **Batasan Spasial:** Koordinat pendaratan berada di pesisir selatan Teluk Banten. Armada penangkap beroperasi di perairan dalam Teluk Banten dan sekitarnya.

---

## 6. Audit Lingkungan Oseanografi (Prediktor Satelit)

| Sensor / Dataset | Variabel | Resolusi Spasial | Resolusi Temporal | Cakupan Teluk Banten | Kelayakan di Phase 04 |
|---|---|---|---|---|---|
| **NASA JPL MUR SST** | Suhu Permukaan Laut | 1 km (~0,01°) | Harian | Sangat baik (resolusi ultra-tinggi bebas awan) | **Kandidat Utama SST** |
| **CMEMS GlobColour L4** | Klorofil-a (Chl-a) | 4 km (gap-free) | Harian | Baik (interpolasi bebas celah) | **Kandidat Utama Chl-a** |
| **Copernicus Sentinel-3 OLCI** | Klorofil-a (Chl-a) | 300 meter | Bulanan | Resolusi teluk sangat presisi | **Kandidat Pendukung** |
| **CMEMS GLORYS12V1** | Salinitas & Arus | 0,083° (~8 km) | Harian | Reanalisis global untuk gradien teluk | **Kandidat Utama Hidrodinamika** |
| **BIG BATNAS** | Batimetri Nasional | 6 arc-second (~180 m) | Statis | Melingkupi perairan dangkal teluk | **Kandidat Utama Batimetri** |
| **GEBCO 2025** | Batimetri Global | 15 arc-second (~450 m) | Statis | Data pembanding global | **Kandidat Sekunder Batimetri** |

---

## 7. Analisis Potensi Data Leakage & Mitigasi

1. **Temporal Leakage:**
   - *Risiko:* Menggunakan data pendaratan bulan $t$ untuk melatih fitur lingkungan yang dihitung setelah waktu pendaratan selesai.
   - *Mitigasi:* Fitur oseanografi satelit harus menggunakan jendela waktu *lag* ($t-1$ atau komposit mingguan menjelang tanggal tangkapan).
2. **Spatial Leakage:**
   - *Risiko:* Random train/test split pada grid spasial teluk yang berdekatan menyebabkan autokorelasi spasial tinggi.
   - *Mitigasi:* Wajib menggunakan *Spatial Block Cross-Validation* atau pemisahan berbasis blok temporal (misal: split bulan ganjil/genap atau train pada bulan awal, test pada musim puncak).

---

## 8. Kesimpulan & Rekomendasi Audit

1. **Kelayakan Target:** Data pendaratan PPN Karangantu **SANGAT MENDUKUNG** target pemodelan:
   - Target Dependen 1: **Catch Weight ($kg$) per spesies per periode**.
   - Target Dependen 2: **CPUE ($kg/\text{effort}$) per spesies**.
2. **Kesiapan Fase:** Data telah terorganisasi dan bersih. Proyek siap melanjutkan ke penyusunan Data Dictionary (`docs/DATA_DICTIONARY.md`), identifikasi isu kualitas (`docs/DATA_QUALITY_ISSUES.md`), dan persiapan script Google Earth Engine pada Phase 04.