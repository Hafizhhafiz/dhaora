# PANDUAN STANDAR ANOTASI CITRA (ANNOTATION GUIDELINES)
## FishGuard AI — Deteksi Objek & Estimasi Panjang Ikan Teluk Banten

- **Proyek**: ASIK V — FishGuard AI
- **Program Studi**: Sistem Informasi Kelautan (SIK), UPI Kampus Serang
- **Target Spesies**:
  - `Class 0`: **Ikan Kembung** (*Rastrelliger kanagurta*)
  - `Class 1`: **Ikan Layang** (*Decapterus macarellus*)
- **Format Label**: YOLO Normalized Bounding Box (`<class_id> <x_center> <y_center> <width> <height>`)

---

## 1. Prinsip Utama Anotasi YOLO Bounding Box

Bounding box harus merepresentasikan batas fisik nyata tubuh ikan secara presisi (*tight bounding box*):

1. **Batas Terluar (*Tight Fitting*)**:
   - Kotak pembatas harus mencakup seluruh bagian tubuh ikan mulai dari ujung moncong (*snout tip*), sirip punggung (*dorsal fin*), sirip dada/perut, hingga ujung sirip ekor (*caudal fin lobes*).
   - **DILARANG** mengikutsertakan bayangan (*shadow*) ikan di atas meja/papan ke dalam bounding box.
   - **DILARANG** menyisakan ruang kosong (*margin/padding*) berlebih di luar tubuh ikan.
2. **Koordinat Normalisasi**:
   - Seluruh nilai koordinat dinormalisasi dalam rentang desimal $0.000000$ hingga $1.000000$ relatif terhadap lebar dan tinggi citra:
     $$x_{\text{center}} = \frac{x_{\min} + x_{\max}}{2 \times W}, \quad y_{\text{center}} = \frac{y_{\min} + y_{\max}}{2 \times H}$$
     $$\text{width} = \frac{x_{\max} - x_{\min}}{W}, \quad \text{height} = \frac{y_{\max} - y_{\min}}{H}$$

---

## 2. Aturan Penentuan Kelas Spesies

| Class ID | Nama Lokal | Nama Ilmiah | Kunci Morfologi Wajib Terlihat |
|:---:|---|---|---|
| **`0`** | **Ikan Kembung** | *Rastrelliger kanagurta* | Tubuh agak pipih memanjang; bintik gelap kecil dekat tepi bawah sirip dada; garis emas membujur di punggung; 5 finlet dorsal/anal. |
| **`1`** | **Ikan Layang** | *Decapterus macarellus* | Tubuh silindris ramping; terdapat finlet tunggal terpisah di belakang sirip dorsal kedua dan sirip anal; **deretan sisik duri tajam (*scute*)** pada pangkal ekor. |

> **PERINGATAN INTEGRITAS SPESIES**:
> Jika morfologi pembeda (misal scute pada layang atau bintik dada pada kembung) tidak terlihat akibat buram, tertutup es, atau membusuk, **JANGAN PERNAH MENEBAK LABEL KELAS**. Objek tersebut harus diabaikan dari dataset training atau dilabeli sebagai `unidentified_fish` (di luar Class 0 dan 1).

---

## 3. Penanganan Kasus Kompleks di Lapangan

### A. Ikan Saling Bertumpuk / Berhimpitan (*Occlusion*)
1. **Oklusi Ringan (< 30% area tubuh tertutup)**:
   - Tetap buat bounding box untuk ikan yang tertutup sebagian, memperkirakan kontur tubuh tersembunyi secara wajar jika ciri diagnostik spesies masih dapat dipastikan.
2. **Oklusi Sedang (30% - 60% area tubuh tertutup)**:
   - Buat bounding box hanya jika kepala atau bagian sirip diagnostik terlihat jelas.
3. **Oklusi Berat (> 60% tertutup)**:
   - **JANGAN DIANOTASI**. Memasukkan ikan yang hanya terlihat ekor/potongan kecil tubuh tanpa kepala ke dataset deteksi akan memicu *false positive* saat inferensi model.

### B. Ikan Terpotong Tepi Citra (*Truncated Objects*)
- Jika lebih dari **75% tubuh ikan** berada di dalam frame kamera dan bagian kepalanya terlihat utuh, buat bounding box hingga batas tepi gambar ($x=0.0$ atau $x=1.0$).
- Jika ikan terpotong lebih dari separuh (misalnya hanya terlihat ekor di sudut frame), **abaikan objek tersebut**.

### C. Spesimen Melengkung / Tidak Lurus
- Bounding box YOLO adalah persegi panjang ortogonal horizontal-vertikal. Jika ikan diletakkan melengkung, bounding box akan memiliki area kosong yang besar.
- **Standar Pemotretan**: Operator diwajibkan meluruskan spesimen sebelum difoto agar rasio kotak rapat (*tight*).

---

## 4. Kesalahan Anotasi yang Wajib Dihindari

```
[SALAH]  Bounding box menyertakan bayangan gelap ikan di lantai TPI.
[SALAH]  Bounding box terlalu longgar (memuat lebih dari 15% ruang kosong).
[SALAH]  Satu bounding box membungkus 2-3 ikan sekaligus (harus 1 kotak per 1 ekor).
[SALAH]  Menandai ikan kembung perempuan (Rastrelliger brachysoma) sebagai Class 0.
[SALAH]  Menandai ikan layang benggol (Decapterus russelli) sebagai Class 1 tanpa memeriksa scute dan sirip dada.
[SALAH]  Label file .txt kosong atau tidak sinkron dengan nama file citra.
```

---

## 5. Struktur Anotasi Keypoint (Persiapan Model Estimasi Panjang TL)

Untuk pengembangan model keypoint (*pose estimation*) di masa mendatang, disiapkan skema 2-titik anatomis:

- `KP-0`: **Ujung Moncong Terdepan (*Snout Tip*)** — Titik paling anterior rahang tertutup.
- `KP-1`: **Ujung Sirip Ekor Terpanjang (*Caudal Fin Tip*)** — Ujung terjauh dari cuping sirip ekor untuk mengukur *Total Length* (TL).

Format koordinat keypoint masa depan:
`<class_id> <xc> <yc> <w> <h> <kp0_x> <kp0_y> <kp0_v> <kp1_x> <kp1_y> <kp1_v>`
*(di mana $v=2$ jika titik terlihat jelas, $v=1$ jika tertutup sebagian, $v=0$ jika di luar frame).*

Folder penyimpanan keypoint dialokasikan di:
[`dataset_pipeline/annotations/keypoints/`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/annotations/keypoints/)
