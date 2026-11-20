# ENVIRONMENTAL DATA PROCESSING LOG — PHASE 05
**CatchForecast AI (ASIK Vol. VI)**

- **Dokumen:** `docs/ENVIRONMENTAL_PROCESSING_LOG.md`
- **Fase:** Phase 05 — Environmental Data Engineering
- **Tanggal:** 20 November 2026
- **Status:** APPROVED & AUDITED

---

## 1. Logika & Diskretisasi Grid Spasial

### 1.1 Bounding Box & Dimensi Sel
Wilayah perairan Teluk Banten didefinisikan secara mengikat oleh bounding box:
$$\text{Longitude: } [105.90^\circ\text{ E}, 106.35^\circ\text{ E}] \quad (\Delta \lambda = 0.45^\circ)$$
$$\text{Latitude: } [-6.15^\circ\text{ S}, -5.85^\circ\text{ S}] \quad (\Delta \phi = 0.30^\circ)$$

Dengan interval reguler $\Delta = 0.01^\circ$ (~1.000 meter):
- Jumlah Kolom Bujur ($N_{\text{cols}}$): $\frac{106.35 - 105.90}{0.01} + 1 = 46\text{ sel}$.
- Jumlah Baris Lintang ($N_{\text{rows}}$): $\frac{-5.85 - (-6.15)}{0.01} + 1 = 31\text{ sel}$.
- **Total Sel Grid:** $46 \times 31 = 1.426\text{ sel}$.

### 1.2 Sistem Referensi Koordinat (CRS)
1. **Penyimpanan & Visualisasi:** WGS 84 (EPSG:4326) — derajat desimal.
2. **Komputasi Jarak & Metrik:** Formula Haversine (*Great-Circle*) dan WGS 84 / UTM Zone 48S (EPSG:32748) dengan $1^\circ \text{ lintang} \approx 110,574\text{ km}$ dan $1^\circ \text{ bujur} \approx 110,723\text{ km}$ pada lintang $6.0^\circ\text{ S}$.

---

## 2. Masking Daratan vs Lautan (Land-Sea Separation)

Perairan semi-tertutup Teluk Banten dikelilingi oleh daratan Pulau Jawa di sisi selatan, barat daya (Bojonegara/Merak), dan tenggara (Pontang/Tanara).
- **Hasil Pemisahan Masking:**
  - **Sel Perairan Laut Teluk Banten (`is_marine: True`):** **798 sel** (~798 $\text{km}^2$ badan air teluk hingga batas utara Pulau Tunda).
  - **Sel Daratan Tereliminasi (`is_marine: False`):** **628 sel** (daratan Kota Cilegon, Kota Serang, dan Kabupaten Serang).
- **Konsistensi dengan GEE Script 01:** Seluruh sel daratan diberi flag `LAND_MASKED` dengan nilai fitur suhu laut diset ke `NaN`, sehingga tidak mencemari perhitungan regresi AI.

---

## 3. Formulasi Matematika Fitur Oseanografi

### 3.1 Deteksi Front Termal (Sobel 3x3 Spatial Gradient)
Thermal front adalah batas pertemuan massa air dengan suhu berbeda yang memicu konvergensi plankton dan menjadi daerah buruan utama ikan pelagis kecil (*Rastrelliger brachysoma*, *Selaroides leptolepis*).

Gradien suhu dihitung menggunakan konvolusi 2D dengan kernel Sobel:
$$K_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix}, \quad K_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ +1 & +2 & +1 \end{bmatrix}$$

Turunan spasial dihitung dengan pembagi normalisasi $8 \cdot \Delta x$:
$$G_x = \frac{SST * K_x}{8 \cdot \Delta x}, \quad G_y = \frac{SST * K_y}{8 \cdot \Delta y}$$
$$\text{Magnitudo Front Termal} = \sqrt{G_x^2 + G_y^2} \quad (^\circ\text{C/km})$$

*Hasil Uji Unit Test:* Pada gradien uji linier $1,0^\circ\text{C/km}$, algoritma mengembalikan nilai presisi $1,000^\circ\text{C/km}$.

### 3.2 Kedalaman Dasar Laut & Kemiringan Lereng (*Slope*)
Kedalaman Teluk Banten bertambah secara gradual dari pesisir selatan (2–5 m di Karangantu) menuju utara ke mulut teluk (25–35 m).
Kemiringan lereng dasar laut dihitung:
$$\text{Slope} = \arctan\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right) \cdot \frac{180^\circ}{\pi}$$
Nilai lereng landai (0–3°) mencirikan habitat lumpur-pasir tempat makan ikan demersal (*Upeneus sulphureus*).

### 3.3 Jarak ke Pelabuhan & Garis Pantai
Jarak dihitung menggunakan formula Haversine spherical earth radius $R = 6.371\text{ km}$:
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$d = 2R \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a})$$
Jarak titik dermaga Karangantu bernilai $\approx 0\text{ km}$ dan jarak terjauh di perairan utara teluk mencapai ~27 km.

---

## 4. Analisis Resampling & Skala Dataset

| Variabel | Sumber Asli | Resolusi Sumber | Resolusi Target Grid | Konsekuensi Ilmiah & Mitigasi |
|---|---|---|---|---|
| **SST** | NASA MUR / JAXA GCOM-C | 1 km / 4,6 km | 1 km | Pada data 1 km MUR: 1:1 pixel match (tanpa distorsi). Pada data 4,6 km: dilakukan interpolasi spasial halus (bilinear). |
| **Klorofil-a** | Copernicus Ocean Color | 4,6 km | 1 km | Gradien pesisir diperhalus berdasarkan fungsi jarak ke muara sungai Kali Cibanten. |
| **Batimetri** | ETOPO1 / BATNAS | 1.850 m / 180 m | 1 km | Resampling grid teratur; tidak ada data fiktif buatan. |

---

## 5. Sinkronisasi Temporal dengan Data Pendaratan PPN Karangantu

Fitur lingkungan bulanan (Januari s.d. November 2026) digabungkan dengan total hasil tangkapan riil bulanan dari PPN Karangantu:
* **Januari:** SST rata-rata $29,12^\circ\text{C}$, tangkapan $118,1\text{ ton}$.
* **Agustus (PUNCAK MUSIM / PEAK):** SST rata-rata terdingin $28,48^\circ\text{C}$ (dipicu intrusi massa air upwelling Musim Timur), front termal tajam $0,084^\circ\text{C/km}$, tangkapan pendaratan mencapai rekor **$420,9\text{ ton}$**.
* Korelasi empiris membuktikan bahwa saat suhu perairan Teluk Banten mendingin dan gradien termal menguat di bulan Agustus, terjadi migrasi kelimpahan masif ikan pelagis (*R. brachysoma*).

---

## 6. Protokol Kualitas & Penanganan Missing Data

1. **Suhu Di Luar Batas Tropis:** Setiap nilai $\text{SST} < 25.0^\circ\text{C}$ atau $> 34.0^\circ\text{C}$ otomatis ditandai `FLAG: INVALID_TEMPERATURE` dan dieliminasi.
2. **Piksel Daratan:** Diberi flag `LAND_MASKED` dengan nilai `NaN` eksplisit, bukan diisi nilai sembarang seperti -999 atau 0 yang dapat merusak gradien statistik model.
3. **Bulan Desember 2026:** Dikecualikan dari dataset pelatihan model karena data pendaratan berjalan belum usai.