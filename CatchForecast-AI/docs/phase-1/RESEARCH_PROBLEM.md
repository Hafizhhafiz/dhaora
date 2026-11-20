# RESEARCH PROBLEM — CatchForecast AI

> **Phase:** 1 — Project Definition & Research Foundation  
> **Tanggal:** 18 November 2026

---

## 1. Latar Belakang Masalah

### 1.1 Konteks Perikanan Teluk Banten

Teluk Banten merupakan perairan semi-tertutup di pesisir utara Provinsi Banten, Indonesia, yang terletak di antara Kabupaten Serang, Kota Cilegon, dan Kabupaten Tangerang. Perairan ini memiliki peran penting sebagai daerah penangkapan ikan (fishing ground) bagi nelayan skala kecil maupun menengah. `[STATUS: VERIFIED — berdasarkan literatur umum perikanan Banten]`

Beberapa tantangan yang dihadapi sektor perikanan di Teluk Banten:

1. **Variabilitas hasil tangkapan** — Hasil tangkapan nelayan sangat fluktuatif dan dipengaruhi oleh faktor lingkungan (musim, suhu laut, produktivitas primer) serta faktor sosial-ekonomi (jumlah armada, jenis alat tangkap, harga pasar). `[STATUS: VERIFIED — masalah umum perikanan tropis]`

2. **Kurangnya sistem informasi prediktif** — Nelayan umumnya bergantung pada pengalaman empiris dan pengetahuan tradisional untuk menentukan lokasi dan waktu penangkapan. Informasi berbasis saintifik yang dapat diakses secara praktis masih sangat terbatas. `[STATUS: ASSUMPTION — perlu validasi lapangan]`

3. **Tekanan lingkungan** — Teluk Banten terpapar oleh aktivitas industri (Kawasan Industri Cilegon), pelabuhan (Pelabuhan Merak), dan sedimentasi dari sungai-sungai di sekitarnya, yang berpotensi memengaruhi kualitas habitat dan distribusi ikan. `[STATUS: VERIFIED — berdasarkan literatur tentang pencemaran Teluk Banten]`

4. **Keterbatasan data perikanan terstruktur** — Data hasil tangkapan ikan di tingkat lokal (PPI/TPI) seringkali tidak terdigitalisasi, tidak memiliki koordinat spasial, dan tidak tercatat secara konsisten. `[STATUS: ASSUMPTION — umum terjadi di perikanan skala kecil Indonesia]`

### 1.2 Peluang Integrasi Data

Kemajuan teknologi penginderaan jauh (remote sensing) dan platform komputasi geospasial seperti Google Earth Engine (GEE) membuka peluang untuk:

- Memperoleh data lingkungan laut (SST, klorofil-a, salinitas, arus) secara konsisten dan mencakup wilayah luas
- Mengekstrak variabel lingkungan pada resolusi spasial dan temporal yang terdefinisi
- Mengintegrasikan data lingkungan dengan data perikanan historis melalui machine learning

Namun, integrasi ini memerlukan:
- Data perikanan yang memadai sebagai variabel target (dependent variable)
- Pemahaman hubungan ekologis antara variabel lingkungan dan kelimpahan/distribusi spesies target
- Desain sistem yang mempertimbangkan keterbatasan dan latency data

---

## 2. Rumusan Masalah

### 2.1 Masalah Utama

> **Bagaimana membangun sistem prediksi hasil tangkapan ikan (catch prediction) berbasis AI yang mengintegrasikan data lingkungan laut dari penginderaan jauh dan data perikanan historis untuk tiga spesies target di Teluk Banten?**

### 2.2 Sub-masalah

1. **Data Acquisition**: Bagaimana memperoleh dan mengintegrasikan data perikanan historis dari institusi lokal dengan data lingkungan dari satelit untuk wilayah Teluk Banten?

2. **Feature Engineering**: Variabel lingkungan apa saja yang signifikan sebagai prediktor hasil tangkapan untuk masing-masing spesies target (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*)?

3. **Species-Specific Modeling**: Bagaimana membangun model prediksi regresi yang spesifik untuk setiap spesies, dengan mempertimbangkan perbedaan habitat dan perilaku antar spesies?

4. **Spatial Prediction**: Bagaimana menghasilkan peta prediksi spasial (prediction map) hasil tangkapan untuk setiap spesies di grid ~1 km di Teluk Banten?

5. **System Integration**: Bagaimana menyajikan hasil prediksi melalui Web GIS dashboard yang informatif dan dapat diakses?

---

## 3. Perbedaan Catch Prediction, Habitat Suitability, dan Species Occurrence

> [!IMPORTANT]
> Ketiga konsep ini sering dicampuradukkan dalam literatur. CatchForecast AI secara eksplisit memilih **catch prediction** dan bukan habitat suitability atau species occurrence.

| Aspek | Catch Prediction | Habitat Suitability | Species Occurrence |
|---|---|---|---|
| **Target variabel** | Jumlah/berat tangkapan (kg, ton, CPUE) | Indeks kesesuaian habitat (0–1) | Kehadiran/ketidakhadiran spesies (0/1) |
| **Output** | Nilai numerik kontinu (regresi) | Skor probabilistik kesesuaian | Probabilitas kehadiran |
| **Data perikanan diperlukan?** | ✅ Ya — wajib (catch records) | ❌ Tidak wajib (bisa pakai occurrence data) | ❌ Tidak wajib (bisa pakai occurrence data) |
| **Fishing effort relevan?** | ✅ Sangat relevan (untuk CPUE) | ❌ Tidak relevan | ❌ Tidak relevan |
| **Interpretasi** | "Berapa kg ikan yang diperkirakan tertangkap?" | "Seberapa cocok habitat ini untuk spesies X?" | "Apakah spesies X kemungkinan ada di lokasi ini?" |
| **Contoh model** | XGBoost regression, Random Forest regression | MaxEnt, GLM, GAM | MaxEnt, BRT, logistic regression |
| **Aplikasi** | Perencanaan trip penangkapan, pengelolaan stok | Konservasi, MPA planning | Biodiversity assessment |
| **Kompleksitas data** | Tinggi — butuh catch data historis | Sedang — cukup occurrence + environmental | Rendah — cukup presence/absence |

### 3.1 Mengapa Catch Prediction Dipilih

- **Relevansi praktis**: Nelayan dan pengelola perikanan membutuhkan estimasi kuantitatif hasil tangkapan, bukan hanya informasi habitat cocok atau tidak.
- **Kekhasan informasi**: Habitat yang sesuai tidak menjamin hasil tangkapan tinggi — variabel lain seperti musim pemijahan, migrasi, tekanan penangkapan, dan dinamika populasi juga berpengaruh.
- **Tantangan lebih tinggi**: Catch prediction memerlukan data lebih lengkap, menjadikannya demonstrasi kemampuan teknis yang lebih kuat untuk proyek ini.

### 3.2 Risiko Utama Pendekatan Catch Prediction

- **Ketergantungan pada data perikanan**: Tanpa data catch historis yang memadai, model catch prediction tidak dapat dilatih. Ini adalah **risiko kritis** proyek. `[STATUS: OPEN ISSUE]`
- **Confounding factors**: Hasil tangkapan dipengaruhi oleh banyak faktor non-lingkungan (ekonomi, regulasi, perilaku nelayan) yang sulit dimodelkan.
- **Spatial mismatch**: Data perikanan mungkin tidak memiliki resolusi spasial yang setara dengan data satelit.

---

## 4. Urgensi Penelitian

### 4.1 Urgensi Ilmiah

1. **Gap penelitian**: Studi yang secara spesifik memprediksi catch (bukan habitat suitability) menggunakan machine learning di Teluk Banten masih sangat terbatas. `[STATUS: ASSUMPTION — perlu konfirmasi melalui systematic literature review]`

2. **Validasi hubungan lingkungan-perikanan**: Kuantifikasi hubungan antara variabel oseanografi (SST, Chl-a, salinitas, arus) dengan hasil tangkapan spesies-spesies target di perairan semi-tertutup tropis.

3. **Perbandingan respons spesies**: Pendekatan species-specific memungkinkan analisis bagaimana spesies berbeda (pelagis kecil vs demersal) merespons variabel lingkungan secara berbeda.

### 4.2 Urgensi Praktis

1. **Decision support untuk nelayan**: Sistem prediksi dapat membantu nelayan dalam merencanakan trip penangkapan berdasarkan kondisi lingkungan yang terukur.

2. **Pengelolaan perikanan**: Data prediksi catch dapat mendukung pengelolaan stok ikan berkelanjutan di tingkat lokal.

3. **Demonstrasi teknologi**: Proyek ini mendemonstrasikan kemampuan integrasi remote sensing, machine learning, dan Web GIS untuk aplikasi perikanan — pendekatan yang masih jarang diterapkan di tingkat lokal Indonesia.

---

## 5. Hipotesis Kerja

> [!NOTE]
> Hipotesis berikut bersifat tentatif dan akan diuji setelah data tersedia.

**H1**: Terdapat hubungan signifikan antara variabel lingkungan laut (SST, Chl-a, salinitas, kecepatan arus) dengan hasil tangkapan (catch weight) untuk masing-masing spesies target di Teluk Banten.

**H2**: Model gradient boosting (XGBoost/LightGBM) yang dilatih dengan fitur lingkungan dari data satelit dapat memprediksi catch weight bulanan per spesies dengan akurasi yang memadai (target: R² > 0.5 atau MAE yang acceptable secara domain).

**H3**: Variabel prediktor yang paling berpengaruh berbeda antar spesies — spesies pelagis (*R. brachysoma*, *S. leptolepis*) lebih dipengaruhi oleh SST dan Chl-a, sementara spesies demersal (*U. sulphureus*) lebih dipengaruhi oleh kondisi dasar perairan.

---

## 6. Lingkup dan Batasan

### 6.1 Dalam Lingkup (In Scope)
- Prediksi catch weight bulanan per spesies
- Wilayah studi: Teluk Banten (bounding box ~105.9°–106.2° BT, ~5.8°–6.1° LS)
- Data lingkungan dari satelit (via GEE)
- Data perikanan historis dari institusi lokal
- Tiga spesies target
- Output: peta prediksi spasial dan Web GIS dashboard

### 6.2 Di Luar Lingkup (Out of Scope)
- Prediksi jangka panjang (seasonal forecasting, climate projections)
- Pemodelan dinamika populasi ikan (stock assessment model)
- Analisis ekonomi perikanan
- Studi sosial nelayan
- Konservasi dan pengelolaan kawasan lindung
- Spesies selain tiga target yang ditetapkan
- Wilayah di luar Teluk Banten
- Real-time prediction (sistem bukan real-time)

---

## 7. Pertanyaan Penelitian yang Masih Terbuka

| ID | Pertanyaan | Status | Catatan |
|---|---|---|---|
| OI-1 | Apakah data catch historis per spesies tersedia dari PPI/TPI di sekitar Teluk Banten? | OPEN ISSUE | Kritis — menentukan feasibility proyek |
| OI-2 | Apakah data perikanan mencakup koordinat penangkapan? | OPEN ISSUE | Jika tidak, perlu strategi alternatif (zona/grid) |
| OI-3 | Apakah fishing effort tercatat? | OPEN ISSUE | Menentukan apakah CPUE bisa digunakan |
| OI-4 | Berapa resolusi temporal data perikanan yang tersedia? | OPEN ISSUE | Harian/mingguan/bulanan |
| OI-5 | Apakah identifikasi spesies di data PPI cukup spesifik (level spesies)? | OPEN ISSUE | Sering hanya nama umum, bukan nama ilmiah |
| OI-6 | Bagaimana kualitas data satelit di Teluk Banten (cloud masking, nearshore artifacts)? | OPEN ISSUE | Perlu audit data di Phase 2 |

---

*Dokumen ini merupakan bagian dari Phase 1: Project Definition & Research Foundation — CatchForecast AI.*
