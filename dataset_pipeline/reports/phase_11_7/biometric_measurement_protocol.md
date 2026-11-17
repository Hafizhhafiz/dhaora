# PROTOKOL PENGUKURAN BIOMETRIK & GROUND TRUTH VISI KOMPUTER
## FishGuard AI — ASIK V (Phase 11.7)
**Standar Pengukuran:** FAO Fisheries Technical Paper No. 165 (Holden & Raitt) & ICES Biometric Guidelines  
**Lokasi Penerapan:** PPN Karangantu, Teluk Banten  
**Institusi:** Program Studi Sistem Informasi Kelautan (SIK), UPI Kampus Serang  

---

## 1. DEFINISI PANJANG MORFOMETRIK STANDAR

```
                      +=====================================================+
                      |                      TOTAL LENGTH (TL)              |
                      +-----------------------------------------------------+
                      |             FORK LENGTH (FL)          |             |
                      +---------------------------------------+             |
                      |       STANDARD LENGTH (SL)    |       |             |
  HEADBOARD           +-------------------------------+       |             |
     |                |                               |       |             |
     v                v                               v       v             v
    +---+           +===+                           +---+   +---+         +---+
    |   |          /     \                         /     \ /     \       /     \
    |   |  (Snout) O======[      TUBUH IKAN       ]=======X=======)     (       ) (Caudal Tip)
    | 0 |          \     /                         \     / \     /       \     /
    +---+           +===+                           +---+   +---+         +---+
                      ^                                       ^
                      |               BODY DEPTH (BD)         |
                      +---------------------------------------+
```

1. **Total Length ($TL$):**
   - Jarak horizontal garis lurus dari **ujung terdepan moncong (*anterior tip of snout*)** dengan mulut terkatup rapat hingga ke **ujung terbelakang sirip ekor (*posterior tip of caudal fin*)**.
   - Pada sirip ekor bercagak/homoserkal (*forked*), $TL$ diukur dengan membentangkan cuping ekor secara alami (*natural spread*) sejajar dengan sumbu horizontal mistar ukur.
   - Satuan: Centimeter ($cm$) dengan ketelitian **$0,1\text{ cm}$** ($1\text{ mm}$).
2. **Fork Length ($FL$):**
   - Jarak horizontal dari ujung moncong hingga ke **titik lekukan percabangan sirip ekor (*cartilaginous notch/fork*)**.
   - Sangat penting untuk Famili Scombridae (*Rastrelliger*) dan Carangidae (*Selaroides*).
   - Satuan: Centimeter ($cm$) dengan ketelitian **$0,1\text{ cm}$**.
3. **Standard Length ($SL$):**
   - Jarak horizontal dari ujung moncong hingga batas akhir ruas tulang belakang / lipatan pangkal ekor (*hypural joint*), tanpa menyertakan jari-jari sirip ekor.
4. **Body Depth ($BD$):**
   - Kedalaman vertikal tubuh maksimum tegak lurus sumbu tubuh, diukur tepat di depan dasar sirip punggung pertama menggunakan kaliper geser digital.
5. **Total Weight ($W$):**
   - Bobot basah total spesimen utuh yang diukur menggunakan timbangan digital terkalibrasi.
   - Satuan: Gram ($g$) dengan ketelitian **$0,1\text{ g}$**.

---

## 2. PROSEDUR PENGUKURAN MANUAL (GROUND TRUTH WORKFLOW)

Untuk menjamin akurasi dan meniadakan bias subjektif pembacaan manusia:
1. **Operator 1 (Pengukur):**
   - Menempelkan moncong ikan rapat pada pembatas kepala ($0,0\text{ cm}$).
   - Membaca posisi ujung cuping ekor pada mistar akrilik secara tegak lurus (*menghindari paralaks mata*).
   - Menyebutkan angka hasil pembacaan dengan lantang (contoh: *"Dua puluh koma empat sentimeter"*).
2. **Operator 2 (Verifikator & Pencatat):**
   - Melakukan pembacaan mandiri independen pada mistar ukur.
   - Membandingkan hasil pembacaan: **toleransi perbedaan maksimal $\le 0,1\text{ cm}$**.
   - Jika terdapat perbedaan $>0,1\text{ cm}$, posisi ikan disetel ulang dan pembacaan diulang bersama.
   - Mencatat nilai final yang disepakati ke dalam form lapangan dan template CSV.

---

## 3. KALIBRASI METRIK OPTIK (PIXEL-TO-MILLIMETER CALIBRATION)

Untuk mengubah panjang dalam piksel citra ($L_{px}$) menjadi panjang fisik milimeter ($L_{mm}$):

$$\text{Skala Rasio } (S) = \frac{D_{marker\_px}}{W_{marker\_mm}} \quad [\text{pixel}/\text{mm}]$$

$$L_{mm} = \frac{L_{px}}{S} = L_{px} \times \left( \frac{W_{marker\_mm}}{D_{marker\_px}} \right)$$

Di mana:
- $W_{marker\_mm} = 50,0\text{ mm}$ (Lebar fisik presisi ArUco Marker `DICT_4X4_50`).
- $D_{marker\_px}$ adalah jarak piksel antara sudut pojok (*corner points*) marker ArUco yang terdeteksi via algoritma OpenCV ArUco detector.
- Validasi sekunder dilakukan dengan mencocokkan jarak piksel antara garis gradasi $0\text{ cm}$ dan $10\text{ cm}$ pada mistar akrilik ($100,0\text{ mm}$).

---

## 4. SKEMA ANOTASI GROUND TRUTH VISI KOMPUTER

> [!WARNING]
> **Bounding Box Tidak Cukup untuk Estimasi Panjang**:
> Kotak pembatas 2D (*axis-aligned bounding box*) hanya merepresentasikan koordinat terluar $[x_{min}, y_{min}, x_{max}, y_{max}]$. Bila orientasi tubuh ikan miring $5^\circ$ atau sirip sedikit melengkung, lebar kotak bounding box ($W$) menyimpang dari panjang sesungguhnya ($TL$) hingga $>8\%$. Estimasi panjang wajib didasarkan pada **Keypoint Landmark Regression** atau **Instance Segmentation Mask**.

### 4.1 Definisi 6 Titik Kunci Anatomi (Keypoint Landmarks)
Setiap spesimen dianotasi dengan 6 koordinat titik $(x, y, v)$ di mana $v \in \{0: \text{tidak ada}, 1: \text{oklusi}, 2: \text{terlihat jelas}\}$:
- **Keypoint 0 (`snout_tip`):** Ujung terdepan dari rahang/moncong ikan.
- **Keypoint 1 (`caudal_fork`):** Titik lekukan tengah percabangan sirip ekor.
- **Keypoint 2 (`upper_caudal_tip`):** Titik terujung dari cuping sirip ekor bagian atas.
- **Keypoint 3 (`lower_caudal_tip`):** Titik terujung dari cuping sirip ekor bagian bawah.
- **Keypoint 4 (`dorsal_apex`):** Titik tertinggi batas dorsal tubuh pada kedalaman maksimum.
- **Keypoint 5 (`ventral_apex`):** Titik terendah batas ventral tubuh pada kedalaman maksimum.

### 4.2 Formula Perhitungan Panjang Berbasis Keypoint
$$TL_{px} = \max \left( \| P_{\text{snout}} - P_{\text{upper\_tip}} \|_2, \; \| P_{\text{snout}} - P_{\text{lower\_tip}} \|_2 \right)$$

$$FL_{px} = \| P_{\text{snout}} - P_{\text{caudal\_fork}} \|_2$$

$$BD_{px} = \| P_{\text{dorsal\_apex}} - P_{\text{ventral\_apex}} \|_2$$

Di mana $\| P_A - P_B \|_2 = \sqrt{(x_A - x_B)^2 + (y_A - y_B)^2}$ adalah jarak Euclidean dua titik.
