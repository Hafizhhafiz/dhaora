# EDA FINDINGS — CatchForecast AI
**Wilayah Studi:** Teluk Banten, Indonesia (WPPNRI 712)  
**Periode Data:** Januari – November 2026 (11 Bulan Observasi)  
**Domain Spasial:** 798 Sel Laut (Grid Reguler 1 km²), Bounding Box `105.90°–106.35° BT`, `-6.15°– -5.85° LS`  
**Total Observasi:** 26.334 Records ($8.778 \times 3$ Spesies)  

---

## 1. Ringkasan Eksekutif & Karakteristik Data

Eksplorasi data empiris membuktikan pemisahan karakteristik biologis dan oseanografis yang sangat tajam (*clear ecological niche separation*) antara kelompok ikan pelagis kecil (*Rastrelliger brachysoma* dan *Selaroides leptolepis*) dengan kelompok ikan demersal dasar perairan (*Upeneus sulphureus*).

### Ringkasan Statistik Utama (Tabel Perbandingan 3 Spesies)

| Metrik Statistik | *Rastrelliger brachysoma* | *Selaroides leptolepis* | *Upeneus sulphureus* |
|---|---|---|---|
| **Kategori Habitat** | Small Pelagic (Scombridae) | Small Pelagic (Carangidae) | Demersal (Mullidae) |
| **Total Tangkapan 2026** | 474.922,4 kg | 36.308,0 kg | 182.175,1 kg |
| **Rerata Tangkapan (kg/sel/bulan)** | 54,10 kg | 4,14 kg | 20,75 kg |
| **Median Tangkapan (kg/sel)** | 51,25 kg | 3,92 kg | 17,88 kg |
| **Rentang Antarkuartil (IQR)** | 35,62 kg | 2,72 kg | 23,41 kg |
| **Rerata CPUE (kg/trip)** | 26,14 kg/trip | 2,00 kg/trip | 35,37 kg/trip |
| **Alat Tangkap Standar** | Gillnet / Payang (19.819 trip) | Gillnet / Payang (19.819 trip) | Cantrang / Arad (5.618 trip) |
| **Moran's I (Puncak Upwelling Agt)**| **0,7546** (Tinggi) | **0,7546** (Tinggi) | **0,9497** (Sangat Tinggi) |
| **Prediktor Korelasi Terkuat** | SST ($r_s = -0,371$) | SST ($r_s = -0,371$) | Kedalaman Batimetri ($r_s = -0,704$) |

---

## 2. Analisis Distribusi Target Catch & CPUE

Visualisasi distribusi ([01_species_catch_distributions.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/01_species_catch_distributions.png)) menunjukkan:
1. **Positif Right-Skewed:** Distribusi tangkapan per sel menunjukkan skewness positif moderat. Sebagian besar sel laut memiliki tangkapan moderat, sementara sebagian kecil sel di zona konvergensi atau paparan pesisir menghasilkan konsentrasi biomassa tinggi.
2. **Ketiadaan Zero Inflated Masif pada Laut Teluk:** Karena Teluk Banten merupakan daerah teluk produktif tertutup (estuarin hingga paparan neritik), seluruh 798 sel laut memiliki nilai tangkapan positif terdefinisi ($Catch > 0$). Model regresi kontinu (seperti Random Forest Regressor atau Gradient Boosting Regressor) sangat tepat digunakan tanpa memerlukan hurdle/two-stage model biner.

---

## 3. Korelasi Oseanografi: Bukti Empiris Niche Separation

Visualisasi korelasi ([03_correlation_matrices_per_species.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/03_correlation_matrices_per_species.png)) mengungkap perbedaan mendasar:

### A. Spesies Pelagis (*R. brachysoma* & *S. leptolepis*)
- **Suhu Permukaan Laut (SST):** Menunjukkan korelasi negatif signifikan (Pearson $r = -0,382$, Spearman $r_s = -0,371$). Penurunan suhu akibat fenomena *upwelling* monsun timur secara langsung memicu agregasi kawanan ikan pelagis ke perairan Teluk Banten.
- **Klorofil-a:** Menunjukkan korelasi positif moderat hingga kuat (Pearson $r = +0,405$, Spearman $r_s = +0,258$). Ketersediaan fitoplankton merangsang kelimpahan zooplankton yang menjadi pakan alami utama ikan kembung dan selar.
- **Batimetri & Jarak Pantai:** Korelasi mendekati nol ($|r| < 0,11$), membuktikan bahwa pergerakan pelagis kecil di perairan teluk tidak terikat oleh kontur kedalaman dasar laut tertentu.

### B. Spesies Demersal (*Upeneus sulphureus*)
- **Kedalaman Batimetri:** Menunjukkan korelasi negatif sangat kuat (Pearson $r = -0,592$, Spearman $r_s = -0,704$). Ikan kuniran terkonsentrasi secara dominan pada dasar perairan dangkal (10–35 meter). Semakin dalam perairan menuju mulut teluk, kelimpahan kuniran menurun drastis.
- **Jarak ke Pantai:** Menunjukkan korelasi negatif kuat ($r_s = -0,680$). Ikan kuniran merupakan penghuni pesisir berlumpur dekat estuari Teluk Banten.
- **Suhu Permukaan Laut (SST):** Korelasi mendekati nol ($r_s = +0,033$). Fluktuasi suhu permukaan laut satelit tidak memengaruhi secara langsung habitat dasar perairan tempat ikan demersal mencari pakan bentik.

---

## 4. Dinamika Musiman & Upwelling Monsun Timur

Visualisasi musiman ([04_seasonal_upwelling_catch_trends.png](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/reports/phase_07/figures/04_seasonal_upwelling_catch_trends.png)) membuktikan fenomena oseanografis klasik Indonesia di Teluk Banten:
1. **Puncak Musim Timur (Bulan Agustus):** Rerata SST mencapai titik terendah tahunan ($28,48^\circ\text{C}$), bertepatan dengan penguatan gradien front termal maksimum ($0,084^\circ\text{C/km}$).
2. **Ledakan Tangkapan Ikan:** Pada bulan Agustus, total pendaratan melonjak drastis hingga **420.859 kg**, mencakup lebih dari $60\%$ dari total pendaratan tahunan pelabuhan.
3. **Peralihan & Musim Barat (Januari–Mei):** SST tinggi ($29,8–30,5^\circ\text{C}$) dengan stabilitas termal tinggi dan produktivitas tangkapan rendah hingga sedang.

---

## 5. Audit Multikolinearitas (VIF Analysis)

Perhitungan *Variance Inflation Factor* (VIF) menghasilkan temuan penting:
- Variabel temporal-dinamis (`sst_celsius`, `thermal_front_c_per_km`, `chlorophyll_a_mg_m3`) memiliki $VIF < 15$, menunjukkan independensi yang wajar untuk model spasio-temporal.
- Fitur spasial statis (`bathymetry_depth_m` dan `bathymetry_slope_deg`) memiliki $VIF > 10.000$ karena kemiringan lereng diturunkan secara langsung dari variasi spasial batimetri.
- **Implikasi Model ML:** Model linier murni (OLS Linear Regression) akan mengalami ketidakstabilan numerik (*matrix singularity*). Sebaliknya, algoritma berbasis pohon keputusan (**Random Forest** dan **Gradient Boosting / LightGBM / XGBoost**) kebal terhadap multikolinearitas antar fitur dan secara alami mampu menangani hubungan non-linier.

---

## 6. Autokorelasi Spasial & Rekomendasi Cross-Validation

Hasil perhitungan Moran's I global pada bulan puncak (Agustus):
- Pelagis (*Rastrelliger* & *Selaroides*): $I = 0,7546$
- Demersal (*Upeneus*): $I = 0,9497$

Nilai Moran's I yang sangat tinggi ($I \gg 0$) membuktikan adanya dependensi spasial yang kuat antar sel bertetangga di Teluk Banten.

### Rekomendasi Validasi Silang untuk Phase 08:
> [!CAUTION]
> **Larangan Random K-Fold Biasa:** Penggunaan Random Split 80/20 konvensional akan menyebabkan *severe data leakage* (sel tetangga yang berjarak 1 km saling membocorkan nilai target ke fold validasi).
> 
> **Skema Validasi yang Direkomendasikan:**
> 1. **Temporal Holdout Validation:** Membagi data latih berdasarkan bulan/musim (misal: Bulan 1–8 untuk Training, Bulan 9–11 untuk Testing, atau Leave-One-Season-Out).
> 2. **Spatial Block CV:** Membagi wilayah teluk menjadi blok barat vs timur atau zona pesisir vs mulut teluk untuk menguji generalisasi spasial model.
