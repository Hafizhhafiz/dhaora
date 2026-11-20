# PREDICTION MAPPING METHODOLOGY — CatchForecast AI
**Wilayah Studi:** Teluk Banten, Indonesia (WPPNRI 712)  
**Spesies Target:**
1. *Rastrelliger brachysoma* (Kembung perempuan — Pelagis Kecil)
2. *Selaroides leptolepis* (Selar kuning — Pelagis Kecil)
3. *Upeneus sulphureus* (Kuniran — Demersal)

---

## 1. Landasan Kartografi & Geospasial

Pemetaan spasial hasil tangkapan ikan pada Phase 10 mematuhi secara ketat prinsip-prinsip ilmiah Aturan A1, A2, dan A4 Master Brief:
1. **Sistem Referensi Koordinat (CRS):** Seluruh keluaran peta geospasial menggunakan CRS global baku **EPSG:4326 (WGS 84)**.
2. **Diskretisasi Poligon Grid:** Setiap sel grid memiliki resolusi $1\text{ km} \times 1\text{ km}$ ($\Delta\text{lon} \approx 0,010^\circ, \Delta\text{lat} \approx 0,010^\circ$), direpresentasikan sebagai poligon 5 titik tertutup (*closed linear ring*) sesuai standar GeoJSON RFC 7946.
3. **Pembatasan Domain Marine & Masking Daratan:** Domain prediksi dikunci secara eksklusif pada **798 sel laut murni**. Sel daratan (628 sel) dimask secara transparan sebagai *no-data / land* dan tidak diinterpolasi sembarangan.
4. **Current Environmental Telemetry:** Nilai prediksi dihasilkan oleh model champion Random Forest terlatih menggunakan telemetri oseanografi aktual terbaru (November 2026).

---

## 2. Struktur Format Keluaran

Sesuai persetujuan pengguna pada sesi wawancara desain `/grill-me`, peta diproduksi dalam tiga format komplementer:

### A. Format GeoJSON Web GIS (`data/processed/maps/*.geojson`)
Didesain khusus untuk rendering performa tinggi dan interaktivitas pada Leaflet/MapLibre Web GIS (Phase 11):
- `rastrelliger_prediction_map.geojson` (798 poligon sel, 843 KB)
- `selaroides_prediction_map.geojson` (798 poligon sel, 834 KB)
- `upeneus_prediction_map.geojson` (798 poligon sel, 827 KB)

Atribut properti per sel mencakup:
- `cell_id`: Identitas unik sel grid (misal: `TB_G_0561`).
- `predicted_catch_kg`: Estimasi bobot hasil tangkapan ($kg/\text{sel } 1\text{ km}^2/\text{bulan}$).
- `predicted_cpue_kg_per_trip`: Produktivitas tangkapan per satuan upaya penangkapan (Gillnet/Payang untuk pelagis, Cantrang/Arad untuk demersal).
- `sst_celsius`, `thermal_front_c_per_km`, `bathymetry_depth_m`, `dist_to_shore_km`.

### B. Format Kartografis PNG Resolusi Tinggi (`reports/phase_10/maps/*.png`)
Peta visual publikasi cetak 300 DPI dengan kelengkapan kartografi formal:
- `rastrelliger_prediction_map.png` (Colormap: *YlOrRd*)
- `selaroides_prediction_map.png` (Colormap: *YlGnBu*)
- `upeneus_prediction_map.png` (Colormap: *Viridis*)
- `04_comparative_prediction_map.png` (Tiga spesies berdampingan dalam satu kanvas perbandingan)
- Elemen kartografis: Grid derajat lintang/bujur, arah utara (North Arrow), titik pangkalan pendaratan ikan PPN Karangantu (bintang merah), skala legenda nilai prediksi, dan klausul etika riset.

---

## 3. Klausul Etika & Integritas Riset (*Research Disclaimer*)

Peta prediksi spasial CatchForecast AI dirancang sebagai alat bantu ilmiah (*decision support system*) bagi nelayan dan otoritas pelabuhan perikanan. Sesuai Aturan A2 Master Brief:
> [!IMPORTANT]
> **Pernyataan Batas Interpretasi Ilmiah:** Peta ini memproyeksikan potensi biomassa hasil tangkapan berdasarkan kondisi parameter lingkungan kelautan terkini. Peta ini **TIDAK MENJAMIN** kepastian keberadaan kawanan ikan pada koordinat tertentu ataupun jaminan hasil tangkapan riil bagi armada perahu. Keberhasilan penangkapan di laut tetap dipengaruhi oleh keterampilan jurumudi, taktik pengoperasian jaring, dinamika arus mikro, dan cuaca laut harian.
