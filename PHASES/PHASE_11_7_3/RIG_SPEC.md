# PHASE 11.7.3 — RIG ENGINEERING SPECIFICATION
**Spesifikasi Geometris, Optik, dan Lingkungan Operasional Rig Pengambilan Citra**

---

## 1. Parameter Geometri dan Optik Rig

Berdasarkan audit teknis Phase 11.7.2 (`camera_fov_calculator.py`), konfigurasi rig distandardisasi sebagai berikut:

```
                      [ Kamera + Lensa 35mm ]
                               │
                               │  Jarak Kerja Tegak Lurus (H = 90.0 cm ± 1.0 cm)
                               │  Sudut Datang: 90° Tegak Lurus (Waterpass terkalibrasi)
                               ▼
        ────────────────────────────────────────────────────────
        ◄───────────────── FoV Horizontal = 60.4 cm ──────────►
        ┌──────────────────────────────────────────────────────┐
        │  [Marker ArUco 50mm]    [ Papan Ukur 50 cm ]         │
        │  ◄── 10mm QZ ──►        [ Spesimen Ikan Terbentang ] │
        └──────────────────────────────────────────────────────┘
```

### Rincian Perhitungan Matematis Bidang Pandang (FoV):
- **Sensor Width ($S_w$):** $23,5 \text{ mm}$ (Standar APS-C)
- **Sensor Height ($S_h$):** $15,6 \text{ mm}$
- **Focal Length ($f$):** $35,0 \text{ mm}$
- **Jarak Kerja ($H$):** $900 \text{ mm}$ ($90,0 \text{ cm}$)
- **Horizontal Field of View ($\text{FoV}_H$):**
  $$\text{FoV}_H = \frac{S_w \times H}{f} = \frac{23,5 \times 900}{35} \approx 604,28 \text{ mm} \approx 60,4 \text{ cm}$$
- **Vertical Field of View ($\text{FoV}_V$):**
  $$\text{FoV}_V = \frac{S_h \times H}{f} = \frac{15,6 \times 900}{35} \approx 401,14 \text{ mm} \approx 40,1 \text{ cm}$$
- **Margin Keselamatan (*Safety Margin*):**
  - Panjang papan ukur: $500 \text{ mm}$
  - Ukuran marker ArUco + quiet zone: $70 \text{ mm}$
  - Total panjang target: $570 \text{ mm}$
  - Sisa margin bebas di tepi: $604,3 - 570 = 34,3 \text{ mm}$ (cukup untuk toleransi framing tanpa vignetting).

---

## 2. Parameter Tata Cahaya & Pengurangan Silau (*Glare Reduction*)
1. **Sudut Pencahayaan:** Dua sumber cahaya LED bervariasi kontinu (CRI > 95, 5600K Daylight) diposisikan di samping kiri dan kanan pada sudut $45^\circ$ terhadap permukaan meja.
2. **Diffuser:** Setiap panel LED dilengkapi softbox atau kain diffuser ganda untuk membaurkan bayangan tajam (*hard shadows*).
3. **Filter Polarisator (CPL):** Lensa kamera dilengkapi Circular Polarizing Filter (CPL) yang diputar hingga kilauan pantulan air/lendir pada tubuh ikan tereduksi maksimal.

---

## 3. Penempatan Penanda Kalibrasi Metrik
1. Marker ArUco `DICT_4X4_50` ID #0 dicetak presisi tinggi $50,0 \times 50,0 \text{ mm}$ pada bahan akrilik putih non-reflektif.
2. Marker diletakkan pada bidang horizontal yang persis setinggi permukaan papan ukur (tinggi $Z = 0$), bersebelahan dengan pembatas kepala (*headblock*).
3. Batas putih keliling (*quiet zone*) minimal $10 \text{ mm}$ di sekeliling kisi hitam marker tidak boleh tertutup benda atau lendir ikan.
