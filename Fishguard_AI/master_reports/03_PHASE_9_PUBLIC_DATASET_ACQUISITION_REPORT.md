# PHASE 9 — PUBLIC DATASET ACQUISITION & INSPECTION REPORT
## FishGuard AI — ASIK V

**Tanggal laporan:** 13 November 2026  
**Fase:** Phase 9 — Public Dataset Acquisition & Inspection  
**Dataset:** DeepFish Dataset (Zenodo Record 6475675)  
**Status fase:** ✅ SELESAI  

---

## 1. Ringkasan Eksekutif

Phase 9 berhasil mengunduh, mengekstrak, dan menginspeksi dataset publik DeepFish dari Zenodo. Temuan utama: **DeepFish tidak mengandung spesies target FishGuard AI** (*Rastrelliger kanagurta* dan *Decapterus macarellus*). Semua spesies dalam dataset ini adalah ikan perairan Mediterania Barat. Meskipun demikian, DeepFish memiliki nilai metodologis yang tinggi sebagai referensi teknis untuk:

1. Pipeline deteksi objek berbasis nampan (*fish tray detection*).
2. Metodologi estimasi panjang via homography kalibrasi.
3. Format anotasi polygon instance segmentation.

> **PENTING:** DeepFish **TIDAK DAPAT** digunakan sebagai data pelatihan untuk klasifikasi kembung/layang. Dataset ini hanya berfungsi sebagai referensi metodologis.

---

## 2. Audit Workspace Sebelum Akuisisi

**Tanggal audit:** 9 November 2026  
**Kapasitas disk:** 72.60 GB tersedia pada drive C:

| Direktori | Kondisi sebelum Phase 9 |
|---|---|
| `dataset_pipeline/data/public/` | Kosong — belum ada dataset publik |
| `dataset_pipeline/data/field/` | Kosong — belum ada foto lapangan |
| `dataset_pipeline/annotations/yolo/` | Kosong |
| `dataset_pipeline/annotations/keypoints/` | Kosong |
| `dataset_pipeline/metadata/dataset_master.csv` | 8 entri SYNTHETIC_TEST |
| `backend/weights/fishguard_yolo.pt` | TIDAK ADA (MODEL_NOT_TRAINED) |

**Kesimpulan audit:** Tidak ada dataset publik yang sudah terunduh sebelum Phase 9 dimulai. Semua infrastruktur pipeline sudah siap.

---

## 3. Sumber Dataset & Verifikasi Lisensi

### 3.1 Identitas Dataset

| Atribut | Detail |
|---|---|
| **Nama** | DeepFish Dataset (April 2022 update) |
| **Versi** | 0.1 (rilis Zenodo: 20 April 2022) |
| **DOI** | 10.5281/zenodo.6475675 |
| **Zenodo Record** | 6475675 |
| **Penulis** | Garcia-d'Urso et al. |
| **Publikasi acuan** | *Scientific Data*, Nature, 2022 |
| **Institusi** | Pasar ikan El Campello, Alicante, Spanyol |
| **Domain** | Ikan tangkapan artisanal di atas nampan (*fish tray*) |
| **Wilayah** | Mediterania Barat — BUKAN perairan Indonesia |

### 3.2 Lisensi

| Atribut | Status |
|---|---|
| **Lisensi** | Creative Commons Attribution 4.0 International (CC BY 4.0) |
| **Penggunaan komersial** | ✅ Diizinkan |
| **Modifikasi** | ✅ Diizinkan |
| **Redistribusi** | ✅ Diizinkan dengan atribusi |
| **Penggunaan penelitian** | ✅ Diizinkan |
| **Atribusi wajib** | Garcia-d'Urso et al. (2022), Zenodo DOI 10.5281/zenodo.6475675 |
| **Verifikasi lisensi** | ✅ Dikonfirmasi melalui Zenodo API |

> Lisensi CC BY 4.0 memungkinkan penggunaan dataset ini sebagai referensi metodologis dalam penelitian FishGuard AI, selama atribusi yang sesuai dicantumkan dalam publikasi dan dokumentasi.

---

## 4. Inventaris File — Status Unduhan

### 4.1 File yang Berhasil Diunduh

| Nama File | Ukuran | Status | Lokasi |
|---|---|---|---|
| `coco_format_fish_data.json` | 41.45 MB | ✅ LENGKAP | `raw/` |
| `size_estimation_homography_DeepFish.csv` | 0.63 MB | ✅ LENGKAP | `raw/` |
| `fish_tray_json_labels.zip` | 27.07 MB | ✅ LENGKAP | `raw/` |
| `fish_tray_images_2021_06-09.zip` | 373.27 MB | ✅ LENGKAP | `raw/` |

### 4.2 File yang Belum Diunduh

| Nama File | Ukuran | Alasan |
|---|---|---|
| `fish_tray_images_2021_04_01.zip` | 482.68 MB | Tidak diprioritaskan — tidak ada spesies target |
| `fish_tray_images_2021_04_20.zip` | 658.10 MB | Tidak diprioritaskan — tidak ada spesies target |
| `fish_tray_images_2021_05_01.zip` | 780.01 MB | Tidak diprioritaskan — tidak ada spesies target |
| `fish_tray_images_2021_05_17.zip` | 852.16 MB | Tidak diprioritaskan — tidak ada spesies target |

> Inspeksi COCO JSON sudah membuktikan tidak ada spesies target dalam dataset ini. Mengunduh 2.77 GB gambar tambahan tidak akan mengubah kesimpulan kompatibilitas.

### 4.3 File yang Diekstrak

| Nama File | Diekstrak ke | Jumlah File | Status |
|---|---|---|---|
| `fish_tray_json_labels.zip` | `processed/json_labels/json/` | 1.290 file JSON | ✅ LENGKAP |

**Total ruang disk yang digunakan:** ~442 MB (raw + processed)

---

## 5. Inspeksi COCO JSON (`coco_format_fish_data.json`)

### 5.1 Struktur File

| Kunci | Isi |
|---|---|
| `images` | 1.320 entri gambar |
| `annotations` | 7.339 anotasi instansi |
| `categories` | 64 kategori spesies |
| `info` | Metadata dataset (DeepFish, v0.1, 2021) |
| `licenses` | Lisensi dataset |

### 5.2 Statistik Gambar

| Atribut | Nilai |
|---|---|
| Total gambar | 1.320 |
| Rentang lebar | 2.236 – 4.032 piksel |
| Rentang tinggi | 1.680 – 3.024 piksel |
| Format | JPEG |
| Rata-rata anotasi per gambar | 7,1 objek |
| Min anotasi per gambar | 1 |
| Maks anotasi per gambar | 29 |

### 5.3 Format Anotasi

```
Kunci anotasi  : ['segmentation', 'iscrowd', 'image_id', 'bbox', 'area', 'id', 'category_id']
Tipe segmentasi: polygon instance segmentation
Format bbox    : [x, y, width, height]  — format COCO (XYWH)
Titik polygon  : rata-rata 200–650 titik per objek
```

> Format anotasi adalah **polygon instance segmentation** (bukan bounding box YOLO). Konversi ke format YOLO `.txt` memerlukan ekstraksi bounding box dari envelope polygon.

### 5.4 Semua 64 Kategori Spesies (COCO JSON)

| ID | Nama Spesies | Anotasi | Famili |
|---|---|---|---|
| 0 | *Pagrus pagrus* | 599 | Sparidae |
| 1 | Tray1 | 0 | — label nampan |
| 2 | *Spicara maena* | 419 | Sparidae |
| 3 | *Mullus surmulentus* | 1.180 | Mullidae |
| 4 | *Pagellus erythrinus* | 621 | Sparidae |
| 5 | *Sphyraena sphyraena* | 90 | Sphyraenidae |
| 6 | *Diplodus sargus* | 96 | Sparidae |
| 7 | *Symphodus tinca* (H) | 287 | Labridae |
| 8 | *Symphodus tinca* (M) | 188 | Labridae |
| 9 | *Diplodus anularis* | 587 | Sparidae |
| 10 | *Dentex dentex* | 78 | Sparidae |
| 11 | *Pagellus acarne* | 932 | Sparidae |
| 12 | *Sarda sarda* | 21 | Scombridae |
| 13 | *Scorpaena porcus* | 279 | Scorpaenidae |
| 14 | *Spondyliosoma cantharus* | 10 | Sparidae |
| 15 | *Diplodus vulgaris* | 42 | Sparidae |
| 16 | *Serranus scriba* | 824 | Serranidae |
| 17 | *Sciaena umbra* | 5 | Sciaenidae |
| 18 | *Scorpaena notata* | 12 | Scorpaenidae |
| 19 | *Labrus merula* | 7 | Labridae |
| 20 | *Mullus barbatus* | 491 | Mullidae |
| 21 | *Torpedo marmorata* | 2 | Torpedinidae |
| 22 | Tray2 | 0 | — label nampan |
| 23 | *Serranus cabrilla* | 24 | Serranidae |
| 24 | *Lithognathus mormyrus* | 11 | Sparidae |
| 25 | *Sepia officinalis* | 299 | Sepiidae |
| 26 | *Zeus faber* | 3 | Zeidae |
| 27 | *Dactylopterus volitans* | 3 | Dactylopteridae |
| 28 | Species 50 | 7 | Tidak teridentifikasi |
| 29 | *Merluccius merluccius* | 51 | Merlucciidae |
| 30 | *Trachurus mediterraneus* | 7 | Carangidae |
| 31 | *Conger conger* | 3 | Congridae |
| 32 | *Sparus aurata* | 26 | Sparidae |
| 33 | *Sarpa salpa* | 7 | Sparidae |
| 34 | *Symphodus mediterraneus* | 10 | Labridae |
| 35 | *Scorpaena scrofa* | 3 | Scorpaenidae |
| 36 | *Uranoscopus scaber* | 4 | Uranoscopidae |
| 37 | *Raja radula* | 8 | Rajidae |
| 38 | *Phycis phycis* | 6 | Phycidae |
| 39 | Species 52 | 5 | Tidak teridentifikasi |
| 40 | *Sardinella aurita* | 35 | Clupeidae |
| 41 | *Chelidonichthys lastoviza* | 6 | Triglidae |
| 42 | *Seriola dumerilii* | 2 | Carangidae |
| 43 | *Raja asterias* | 1 | Rajidae |
| 44 | *Lophius* sp. | 1 | Lophiidae |
| 45 | *Muraena helena* | 7 | Muraenidae |
| 46 | *Spicara smaris* | 2 | Sparidae |
| 47 | *Boops boops* | 9 | Sparidae |
| 48 | *Mustelus mustelus* | 1 | Triakidae |
| 49 | *Trachinus draco* | 1 | Trachinidae |
| 50 | *Umbrina cirrosa* | 7 | Sciaenidae |
| 51 | *Balistes capriscus* | 1 | Balistidae |
| 52 | *Pomatomus saltatrix* | 0 | Pomatomidae |
| 53 | Species 51 | 1 | Tidak teridentifikasi |
| 54 | *Pomadasys incisus* | 4 | Haemulidae |
| 55 | Species 49 | 1 | Tidak teridentifikasi |
| 56 | Species 68 | 1 | Tidak teridentifikasi |
| 57 | *Scomber japonicus* | 8 | Scombridae |
| 58 | *Microchirus ocellatus* | 1 | Soleidae |
| 59 | Species 55 | 1 | Tidak teridentifikasi |
| 60 | *Mugil cephalus* | 0 | Mugilidae |
| 61 | Species 53 | 0 | Tidak teridentifikasi |
| 62 | Species 54 | 1 | Tidak teridentifikasi |
| 63 | *Labrus viridis* | 1 | Labridae |

### 5.5 Pemeriksaan Spesies Target FishGuard

| Spesies Target | Nama Ilmiah | Ditemukan di DeepFish? |
|---|---|---|
| Ikan Kembung Lelaki | *Rastrelliger kanagurta* | ❌ TIDAK ADA |
| Ikan Layang | *Decapterus macarellus* | ❌ TIDAK ADA |

**Spesies terkait (Scombridae/Carangidae Mediterania — BUKAN target):**

| Spesies | Anotasi | Relevansi |
|---|---|---|
| *Scomber japonicus* (kembung Mediterania) | 8 | ⚠️ Berbeda spesies, berbeda region |
| *Trachurus mediterraneus* (layang Mediterania) | 7 | ⚠️ Berbeda spesies, berbeda region |
| *Sarda sarda* (tongkol Mediterania) | 21 | ⚠️ Berbeda spesies, berbeda region |

> **PERINGATAN ILMIAH:** *Scomber japonicus* (Mediterania) dan *Rastrelliger kanagurta* (Indo-Pasifik) adalah dua spesies yang BERBEDA secara morfologi dan geografis. Melatih model dengan *S. japonicus* untuk mendeteksi *R. kanagurta* akan menghasilkan model yang tidak valid secara ilmiah dan tidak dapat dipertanggungjawabkan.

---

## 6. Inspeksi JSON Label Individual

### 6.1 Statistik Ekstraksi

| Atribut | Nilai |
|---|---|
| Total file JSON | 1.290 |
| Total anotasi | 46.449 |
| Lokasi ekstraksi | `processed/json_labels/json/` |
| Format file | JSON per gambar |

### 6.2 Struktur JSON Label

```json
{
  "image_filename": "B.10.jpg",
  "completed_tasks": ["finished"],
  "labels": [
    {
      "label_type": "polygon",
      "label_class": "Tray1",
      "source": "manual",
      "regions": [[ {"x": 3610.0, "y": 295.9}, ... ]],
      "object_id": "9e54184f-..."
    }
  ]
}
```

### 6.3 Label Class Teratas (dari JSON Individual)

| Label Class | Jumlah | Tipe |
|---|---|---|
| `sizeDmOjo` | 9.464 | Keypoint pengukuran (diameter mata) |
| `sizeLengthHead` | 9.226 | Keypoint pengukuran (panjang kepala) |
| `sizeAncho` | 8.670 | Keypoint pengukuran (lebar badan) |
| `sizeTotal` | 7.459 | Keypoint pengukuran (panjang total / TL) |
| `Tray1` | 1.254 | Bounding box nampan |
| `Species 32` | 1.246 | Spesies tidak teridentifikasi |
| *Mullus surmulentus* | 556 | Spesies teridentifikasi |
| *Mullus barbatus* | 152 | Spesies teridentifikasi |
| *Serranus scriba* | 95 | Spesies teridentifikasi |
| *Scomber japonicus* | 9 | Scombridae Mediterania |
| `Trachurus spp` | 4 | Carangidae Mediterania |

> Label `sizeTotal`, `sizeLengthHead`, `sizeAncho`, `sizeDmOjo` adalah keypoint morfometrik — sumber data untuk membuat `size_estimation_homography_DeepFish.csv`. Metodologi ini sangat relevan sebagai referensi pengukuran TL di FishGuard.

---

## 7. Inspeksi CSV Estimasi Ukuran

### 7.1 Statistik

| Atribut | Nilai |
|---|---|
| Total baris data | 5.712 |
| Kolom | `index`, `file`, `bbox`, `class`, `size (cm)` |
| Metode | Homography kalibrasi (papan referensi ukuran diketahui) |

### 7.2 Contoh Data

| file | class | size (cm) |
|---|---|---|
| `26_05_21-B20` | *Sepia officinalis* | 8.44 |
| `26_05_21-B25` | *Mullus barbatus* | 16.21 |
| `26_05_21-B25` | *Mullus barbatus* | 14.42 |
| `26_05_21-B25` | *Mullus barbatus* | 15.60 |

### 7.3 Relevansi Metodologis untuk FishGuard

```
Alur kerja pengukuran DeepFish:
1. Foto nampan dengan papan kalibrasi (ukuran diketahui)
2. Deteksi sudut papan → homography matrix H
3. Transformasi perspektif → skala metrik nyata (cm/px per gambar)
4. Pengukuran TL berdasarkan keypoint snout & caudal fin

→ Ini jauh lebih akurat dibandingkan asumsi kalibrasi tetap (px/cm konstan)
  yang saat ini digunakan di length_service.py FishGuard.
  REKOMENDASI: adopsi pendekatan ini untuk field data collection protocol.
```

---

## 8. Penilaian Kompatibilitas

| Aspek | Status | Keterangan |
|---|---|---|
| Spesies *R. kanagurta* | ❌ TIDAK ADA | Dataset mediterania, bukan Indo-Pasifik |
| Spesies *D. macarellus* | ❌ TIDAK ADA | Dataset mediterania, bukan Indo-Pasifik |
| Penggunaan langsung sebagai training data | ❌ TIDAK BISA | Domain mismatch — spesies berbeda |
| Transfer learning backbone | ⚠️ TERBATAS | Hanya fitur visual generik |
| Format gambar (nampan ikan) | ✅ SESUAI | Domain visual serupa |
| Format anotasi polygon | ✅ BISA DIKONVERSI | Polygon → bbox YOLO (kelas = `fish_nonspecific`) |
| Metodologi pengukuran TL | ✅ RELEVAN | Referensi metodologis yang kuat |
| Metodologi homography | ✅ RELEVAN | Dapat diadopsi untuk field data collection |
| Lisensi CC BY 4.0 | ✅ KOMPATIBEL | Penggunaan penelitian diizinkan |

---

## 9. Rekomendasi Langkah Selanjutnya

### 9.1 Kandidat Dataset Publik Berikutnya

| Dataset | Potensi | Catatan |
|---|---|---|
| GBIF (*Rastrelliger kanagurta*) | Tinggi | API terprogram, CC license, foto spesimen nyata |
| GBIF (*Decapterus macarellus*) | Tinggi | API terprogram, CC license, foto spesimen nyata |
| iNaturalist | Medium | Foto lapangan, perlu verifikasi ID |
| Fish4Knowledge | Rendah | Underwater video, bukan nampan |

**Endpoint GBIF yang direkomendasikan:**
```
https://api.gbif.org/v1/occurrence/search?scientificName=Rastrelliger+kanagurta&mediaType=StillImage&limit=300
https://api.gbif.org/v1/occurrence/search?scientificName=Decapterus+macarellus&mediaType=StillImage&limit=300
```

### 9.2 Prioritas Utama: Data Lapangan Teluk Banten

Sumber data paling valid untuk FishGuard tetap adalah **foto spesimen lapangan** yang dikumpulkan langsung. Protokol tersedia di `documentation/field_data_collection_protocol.md`.

Target minimum untuk memulai training:
- Kembung (*R. kanagurta*): minimum 200 foto terverifikasi
- Layang (*D. macarellus*): minimum 200 foto terverifikasi

### 9.3 Pemanfaatan Metodologi DeepFish

Implementasikan pengukuran berbasis homography (menggantikan `px/cm` konstan di `length_service.py`):
1. Gunakan papan kalibrasi (A4 atau karton 20×30 cm) di setiap sesi foto lapangan.
2. Deteksi sudut papan → hitung homography matrix H.
3. Transformasikan koordinat keypoint snout & caudal fin → TL dalam cm.

---

## 10. Checklist Penyelesaian Phase 9

| Tugas | Status |
|---|---|
| Audit workspace sebelum akuisisi | ✅ |
| Verifikasi lisensi DeepFish (CC BY 4.0) | ✅ |
| Download `coco_format_fish_data.json` (41.45 MB) | ✅ |
| Download `size_estimation_homography_DeepFish.csv` (0.63 MB) | ✅ |
| Download `fish_tray_json_labels.zip` (27.07 MB) | ✅ |
| Download `fish_tray_images_2021_06-09.zip` (373.27 MB) | ✅ |
| Ekstraksi json_labels (1.290 file) | ✅ |
| Inspeksi COCO JSON (1.320 gambar, 7.339 anotasi, 64 spesies) | ✅ |
| Inspeksi size estimation CSV (5.712 baris) | ✅ |
| Inspeksi JSON label individual (46.449 anotasi) | ✅ |
| Konfirmasi tidak ada spesies target | ✅ |
| Penilaian kompatibilitas | ✅ |
| Rekomendasi langkah berikutnya | ✅ |
| Pembuatan laporan ini | ✅ |

**Status model:** `fishguard_yolo.pt` BELUM TERSEDIA — `MODEL_NOT_TRAINED` tetap aktif.  
**Keputusan:** Phase 9 selesai. Phase 10 direkomendasikan untuk akuisisi dataset via GBIF API dan/atau pengumpulan data lapangan di Teluk Banten.

---

*Laporan ini dibuat berdasarkan inspeksi langsung terhadap file yang terunduh. Tidak ada asumsi atau fabrikasi data.*  
*Disiapkan oleh: FishGuard AI Development Team — ASIK V*  
*Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang*
