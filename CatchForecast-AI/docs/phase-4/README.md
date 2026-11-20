# GOOGLE EARTH ENGINE (GEE) GUIDE & WORKFLOW
**CatchForecast AI — Subdirektori Geospasial**

Dokumen ini memandu konfigurasi, autentikasi, pengujian skrip, inspeksi koleksi satelit, dan ekspor data oseanografi lingkungan untuk perairan **Teluk Banten (Banten Bay)**, Indonesia.

---

## 1. Persiapan Akun & Google Cloud Project

Sebelum menjalankan skrip GEE, pastikan Anda telah memiliki akses aktif ke Google Earth Engine:

### 1.1 Mendaftar & Mengakses Akun GEE
1. Kunjungi [Google Earth Engine Sign Up](https://earthengine.google.com/signup/).
2. Masuk menggunakan akun Google Anda (disarankan akun institusi/kampus atau akun personal aktif).
3. Pilih tujuan penggunaan: **Academic Research / Non-commercial Project**.
4. Buka antarmuka interaktif **GEE Code Editor**: [code.earthengine.google.com](https://code.earthengine.google.com/).

### 1.2 Konfigurasi Google Cloud Project
Earth Engine mewajibkan pengikatan (*linking*) dengan Google Cloud Project:
1. Saat pertama kali membuka Code Editor, Anda akan diminta memilih atau membuat Cloud Project baru.
2. Buat proyek baru dengan nama misalnya: `catchforecast-banten-ai` atau pilih proyek yang sudah ada.
3. Pastikan status **Earth Engine API** telah aktif pada proyek tersebut.

---

## 2. Struktur Skrip & Konfigurasi

Seluruh skrip dirancang secara modular dan bebas kredensial (*zero credentials committed*):

```text
gee/
├── README.md                           # Panduan operasional dan troubleshooting ini
├── config.example.js                   # Template konfigurasi AOI, dataset, dan palet visual
├── exports/                            # Folder lokal penampung GeoTIFF hasil unduhan
└── scripts/
    ├── 01_asset_and_aoi_setup.js       # Definisi batas spasial AOI & PPN Karangantu
    ├── 02_collection_inspection.js     # Inspeksi koleksi satelit, resolusi, dan metadata
    ├── 03_environmental_preview.js     # Masking, konversi unit, preview raster, & ekspor
    └── validate_gee_scripts.py         # Skrip Python validator statis lokal
```

---

## 3. Instruksi Langkah Demi Langkah (Step-by-Step Execution)

### Langkah 1: Validasi Batas Spasial AOI Teluk Banten
1. Buka [code.earthengine.google.com](https://code.earthengine.google.com/).
2. Buat skrip baru (*New File*), salin seluruh isi [gee/scripts/01_asset_and_aoi_setup.js](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/gee/scripts/01_asset_and_aoi_setup.js), lalu tempel ke jendela editor.
3. Klik tombol **Run** di bagian atas editor.
4. **Apa yang Harus Dilihat:**
   - **Pada Peta (Map):** Kotak poligon batas Teluk Banten berwarna merah melingkupi perairan semi-tertutup dari Bojonegara hingga Kasemen/Karangantu. Titik biru cyan menandai lokasi tepat dermaga PPN Karangantu (`06° 02' LS, 106° 09' BT`).
   - **Pada Tab Console (Kanan Atas):** Muncul teks diagnostik:
     ```text
     Study Area Name: Teluk Banten (Banten Bay), WPP 712
     Geometry Type: Polygon
     Total Area (sq km): ~1,600 - 1,800 sq km
     ```

### Langkah 2: Inspeksi Koleksi Citra Satelit
1. Buka tab baru di editor, salin isi [gee/scripts/02_collection_inspection.js](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/gee/scripts/02_collection_inspection.js).
2. Klik **Run**.
3. **Expected Output pada Console:**
   - **Koleksi SST:** `JPL/MURSST41/DAILY` menampilkan ketersediaan citra harian resolusi nominal ~1.000 meter (1 km) dengan rentang akuisisi 2024 s.d. 2026.
   - **Koleksi Peak Season:** Menampilkan jumlah citra tersedia pada bulan Agustus 2026 (bulan puncak pendaratan ikan di Karangantu).
   - **Koleksi Ocean Color:** Menampilkan band klorofil `CHL` dari produk Copernicus.

### Langkah 3: Preview Lingkungan & Masking
1. Salin isi [gee/scripts/03_environmental_preview.js](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/CatchForecast-AI/gee/scripts/03_environmental_preview.js).
2. Klik **Run**.
3. **Apa yang Harus Dilihat:**
   - **Layer SST Median Agustus 2026:** Peta gradien termal berwarna biru (28°C) hingga merah (31.5°C) yang menutupi seluruh badan air teluk tanpa piksel daratan bocor.
   - **Layer Batimetri:** Kontur kedalaman dasar laut perairan dangkal (0 s.d. -40 meter).
   - **Tab Console:** Rangkuman statistik spasial reduksi Teluk Banten: rata-rata suhu (`mean`), suhu minimum (`min`), dan maksimum (`max`).

---

## 4. Protokol Ekspor Data ke Google Drive

Skrip `03_environmental_preview.js` telah dilengkapi blok perintah ekspor yang dijaga (*guarded*):
1. Untuk mengekspor raster citra komposit bulanan, hapus tanda komentar `/* ... */` pada bagian akhir skrip 03.
2. Klik **Run**.
3. Buka tab **Tasks** di sebelah kanan atas Code Editor (ikon clipboard).
4. Klik tombol **Run** pada tugas ekspor yang muncul: `MUR_SST_August_2026_Teluk_Banten`.
5. Biarkan folder default: `CatchForecast_TelukBanten` dan klik **Run**.
6. Setelah selesai (ikon berubah menjadi centang biru), buka Google Drive Anda, unduh berkas GeoTIFF (`.tif`), dan simpan ke folder lokal proyek:
   `CatchForecast-AI/gee/exports/`

---

## 5. Panduan Mengatasi Error (Troubleshooting)

| Pesan Error di GEE | Penyebab Umum | Solusi Perbaikan |
|---|---|---|
| `User not authorized to access Earth Engine` | Akun Google belum terdaftar di GEE atau belum disetujui. | Kunjungi [earthengine.google.com/signup](https://earthengine.google.com/signup) dan selesaikan registrasi. |
| `Cloud project [xyz] is not registered` | Proyek GCP belum terdaftar untuk Earth Engine API. | Buka [GCP Console](https://console.cloud.google.com/), cari "Earth Engine API", lalu klik "Enable". |
| `Computation timed out / Memory limit exceeded` | Area reduksi terlalu besar atau resolusi scale terlalu halus. | Pastikan `scale: 1000` (bukan di bawah 100 meter) dan parameter `maxPixels: 1e9`. |
| `Image.clip: Parameter 'geometry' is required` | Variabel `aoi` tidak terdefinisi sebelum pemanggilan `.clip()`. | Pastikan blok definisi `aoi` dieksekusi di awal skrip. |
| `Band 'analysed_sst' not found` | Salah mengetik nama band atau dataset ID usang. | Gunakan dataset resmi `JPL/MURSST41/DAILY` dengan band `analysed_sst`. |

---

## 6. Validasi Lokal Otomatis (Python Static Checker)

Anda dapat menguji sintaks seluruh skrip JavaScript GEE di terminal lokal secara instan:
```powershell
python CatchForecast-AI/gee/scripts/validate_gee_scripts.py
```
Skrip ini memastikan tidak ada token/kredensial yang bocor, kurung kurawal seimbang, dan koordinat Teluk Banten valid.