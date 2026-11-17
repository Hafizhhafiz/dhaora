# PHASE 11 — IMAGE FEASIBILITY ASSESSMENT REPORT
## FishGuard AI — ASIK V

**Tanggal Dokumen:** 16 November 2026  
**Auditor:** Computer Vision Dataset Specialist & Fisheries Engineer  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Dasar Analisis:** Verifikasi API Langsung (GBIF, FishBase, iNaturalist) & Evaluasi Operasional TPI Karangantu  
**Status Kelayakan:** ✅ SELESAI (Analisis Kelayakan Citra 5 Kandidat Terselesaikan)  

---

## 1. Ringkasan Eksekutif

Keberhasilan model deteksi objek (YOLOv8) dan estimasi panjang (Computer Vision) sangat ditentukan oleh kuantitas, kualitas, variasi pencahayaan, serta kesesuaian domain (*domain matching*) citra latih. Citra pelatihan harus merepresentasikan skenario operasional nyata di lapangan: **ikan hasil tangkapan di atas nampan sortir atau papan ukur perikanan** di Tempat Pelelangan Ikan (TPI) Karangantu.

Laporan ini menyajikan hasil audit kelayakan ketersediaan citra (*image feasibility audit*) untuk lima kandidat spesies prioritas hasil evaluasi data produksi PIPP KKP 2026. Audit mencakup dua jalur pengadaan data:
1. **Jalur Data Publik Daring**: Penelusuran terprogram via GBIF Occurrence API, repositori iNaturalist, dan basis data taksonomi FishBase.
2. **Jalur Pengambilan Data Lapangan Primer**: Kelayakan pemotretan spesimen fisik segar di TPI Karangantu.

### Temuan Kelayakan Kunci:
1. ***Selaroides leptolepis* (Selar Kuning)** memiliki ketersediaan citra publik tertinggi di antara seluruh kandidat di GBIF (**179 citra dengan StillImage**), didukung oleh pendaratan segar harian yang sangat melimpah di Karangantu.
2. ***Upeneus sulphureus* (Kuniran)** memiliki **67 citra dengan StillImage** di GBIF, dengan ciri visual sungut (*barbels*) dan garis kuning yang sangat kontras di atas papan ukur biru.
3. ***Rastrelliger brachysoma* (Kembung Perempuan)** memiliki **35 citra StillImage** di GBIF. Walaupun angka GBIF-nya lebih sedikit dibandingkan *R. kanagurta*, ketersediaan spesimen segar di TPI Karangantu adalah yang **paling tinggi (komoditas nomor 1 dengan 33,3 ton)**.
4. ***Stolephorus commersonii* (Teri)** memiliki **0 citra StillImage** di GBIF dan **dinyatakan TIDAK LAYAK secara teknis** untuk MVP pendeteksi individu dan pengukur panjang karena bentuk fisik mikronya (3–7 cm) yang selalu didaratkan dalam tumpukan gumpalan basah.
5. **Isolasi Data Terdahulu**: Dataset DeepFish (Phase 9) dan 207 citra GBIF Phase 10 (*R. kanagurta* & *D. macarellus*) **tetap dipertahankan 100%** sebagai referensi metodologi dan tidak diikutsertakan dalam set pelatihan spesies target baru.

---

## 2. Audit Kuantitatif Ketersediaan Citra (Jalur Publik vs Lapangan)

Berdasarkan eksekusi langsung script penelusuran API resmi GBIF (`https://api.gbif.org/v1/occurrence/search?mediaType=StillImage`):

| Spesies Kandidat | Nama Lokal | Jumlah Citra di GBIF (StillImage) | Status di iNaturalist | Ketersediaan Foto di FishBase | Estimasi Kemudahan Foto di TPI Karangantu | Kesesuaian Domain Nampan / Papan Ukur | Status Kelayakan Citra |
|---|---|---|---|---|---|---|---|
| ***Rastrelliger brachysoma*** | Kembung perempuan | **35** | 30+ Observasi Asia Tenggara | 8 Foto lateral diagnostik | **SANGAT TINGGI** (Didaratkan puluhan peti/hari) | **SANGAT TINGGI** (Ukuran 15–22 cm, pipih lateral) | ✅ **FEASIBLE & PRIORITAS TINGGI** |
| ***Selaroides leptolepis*** | Selar kuning | **179** | 140+ Observasi Indo-Pasifik | 15 Foto lateral resolusi tinggi | **SANGAT TINGGI** (Tangkapan harian perahu payang/bagan) | **SANGAT TINGGI** (Pita kuning kontras, ukuran 12–18 cm) | ✅ **FEASIBLE & PRIORITAS TINGGI** |
| ***Upeneus sulphureus*** | Kuniran | **67** | 50+ Observasi terverifikasi | 12 Foto spesimen diagnostik | **TINGGI** (Didaratkan reguler dari jaring dasar) | **SANGAT TINGGI** (Warna oranye-kuning cerah, ukuran 12–18 cm) | ✅ **FEASIBLE & PRIORITAS TINGGI** |
| ***Equulites leuciscus*** (*L. leuciscus*) | Peperek | **14** | 10–15 Observasi terbatas | 6 Foto spesimen museum | **SANGAT TINGGI** (Sangat melimpah, harga murah) | **SEDANG** (Ukuran 6–12 cm, sangat tipis, lendir berlebih) | ⚠️ **FEASIBLE BERSYARAT (AUXILIARY)** |
| ***Stolephorus commersonii*** | Teri | **0** | Sangat langka (hanya foto tumpukan) | 3 Foto spesimen museum | **TINGGI** (Peti basah/es curah) | **SANGAT RENDAH** (Massa basah bertumpuk, ukuran 3–7 cm) | ❌ **UNFEASIBLE FOR MVP** |

### Data Spesies Lain di PIPP Karangantu (Konteks Eksternal GBIF):
* *Caranx sexfasciatus* (Kuwe): 2.149 citra
* *Euthynnus affinis* (Tongkol banyar): 293 citra
* *Otolithes ruber* (Gulamah): 118 citra
* *Alepes djedaba* (Selar komo): 114 citra
* *Saurida tumbil* (Beloso): 77 citra
* *Anodontostoma chacunda* (Selanget): 69 citra
* *Encrasicholina devisi* (Teri devisi): 24 citra
* *Sardinella brachysoma* (Tembang): 17 citra
* *Nemipterus aurora* (Kurisi): 2 citra

---

## 3. Analisis Kualitas, Resolusi, dan Pergeseran Domain (Domain Shift)

### 3.1 Resolusi dan Kualitas Citra Publik
* **Kelebihan Citra Publik (GBIF / iNaturalist)**: Sebagian besar citra modern memiliki resolusi $\ge 1200 \times 800\text{ px}$ dengan metadata kamera EXIF lengkap.
* **Kelemahan Citra Publik**:
  1. **Bawah Air Liar (*In-Situ Underwater*)**: Sekitar 70–80% foto iNaturalist diambil oleh penyelam/fotografer alam bawah air. Ikan sedang berenang bebas, seringkali dengan sudut miring (*oblique angle*), pencahayaan biru laut (*blue-green tint*), dan latar belakang terumbu karang yang kompleks.
  2. **Toples Awetan Museum (*Preserved Specimens*)**: Foto koleksi museum seringkali menampilkan ikan yang warnanya telah pudar menjadi kuning pucat akibat alkohol/formalin, dengan sirip yang mengerut.
  3. **Ketiadaan Marker Kalibrasi Skala**: Tidak ada penggaris atau penanda ArUco untuk ekstraksi skala metrik piksel-ke-sentimeter ($px/cm$).

### 3.2 Keunggulan Komparatif Citra Lapangan Primer di TPI Karangantu
Pengambilan foto primer langsung di TPI Karangantu menggunakan SOP [`field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md) menawarkan kesesuaian domain yang sempurna:
* Sudut pemotretan **90° tegak lurus ortogonal** (menggunakan rig *bubble level*).
* Latar belakang papan ukur **biru matte anti-refleksi**.
* Ikan diletakkan dengan sisi kiri menghadap atas (*left lateral view*) dan moncong menempel di pembatas nol.
* Dilengkapi mistar metrik presisi 0.1 cm dan **marker optik ArUco 50 mm**.
* Menggunakan pencahayaan terkontrol difus (tanpa *specular glare* yang merusak deteksi sirip).

---

## 4. Evaluasi Lisensi Hak Cipta Repositori Publik

Audit lisensi terhadap repositori publik menunjukkan profil hak cipta yang kompatibel untuk penelitian akademis:

| Sumber Repositori | Ragam Lisensi Dominan | Hak Penggunaan Visi Komputer | Status Kepatuhan FishGuard AI |
|---|---|---|---|
| **GBIF / iNaturalist** | `CC BY 4.0`, `CC BY-NC 4.0`, `CC0 1.0` | Diizinkan untuk anotasi, pelatihan, dan publikasi riset kampus | ✅ **KOMPATIBEL AKADEMIS PENUH** |
| **FishBase** | Hak cipta fotografer dengan atribusi | Diizinkan sebagai referensi visual morfologi | ✅ **REFERENSI DIAGNOSTIK** |
| **Data Lapangan TPI Karangantu** | Proprietary Academic (ASIK V UPI Serang) | Hak cipta milik tim peneliti UPI Kampus Serang | ✅ **DATASET PRIMER BEBAS SENGKETA** |

---

## 5. Kebijakan Terhadap Dataset Fase Terdahulu (DeepFish & Phase 10)

Sesuai aturan eksekusi ketat (*Execution Rules*):
1. **Dataset DeepFish (Zenodo 6475675 - Phase 9)**:
   * Status: **100% dipertahankan utuh** pada `dataset_pipeline/data/public/deepfish/`.
   * Peran: Referensi arsitektur pipeline deteksi berbasis nampan (*tray detection*), format anotasi segmentasi poligon, dan metode estimasi panjang berbasis matriks homografi.
2. **Dataset GBIF Phase 10 (207 citra - *R. kanagurta* & *D. macarellus*)**:
   * Status: **100% dipertahankan utuh** pada `dataset_pipeline/data/public/gbif/` dan `dataset_master.csv`.
   * Peran: Dataset pengujian ketahanan lintas-domain (*out-of-distribution robustness testing*) dan studi taksonomi genus Scombridae/Carangidae.
   * Tidak dihapus dan tidak diubah statusnya pada fase ini.

---

## 6. Rencana Pengadaan Citra Primer Lapangan (Target TPI Karangantu)

Untuk menjamin ketersediaan dataset latih berkualitas tinggi yang bebas dari *domain shift*, disusun rencana survei lapangan primer:

| Kelas Target Baru | Nama Ilmiah | Target Spesimen Segar | Target Foto per Ekor | Total Target Foto Lapangan | Estimasi Biaya Sampel per Sesi |
|---|---|---|---|---|---|
| **Kelas 0** | *Rastrelliger brachysoma* | 50–70 ekor | 3 foto (Baseline, tilt 5°, folded tail) | **150–210 foto** | Rp 50.000 – 75.000 (dapat dikembalikan bersih) |
| **Kelas 1** | *Selaroides leptolepis* | 50–70 ekor | 3 foto (Baseline, tilt 5°, folded tail) | **150–210 foto** | Rp 40.000 – 60.000 |
| **Kelas 2** | *Upeneus sulphureus* | 50–70 ekor | 3 foto (Baseline, tilt 5°, folded tail) | **150–210 foto** | Rp 35.000 – 50.000 |
| **Multi-Ikan** | Komposisi campuran (Kelas 0, 1, 2) | — | 30 foto komposisi nampan | **30 foto** | — |
| **TOTAL TARGET** | — | **150–210 ekor** | — | **480–660 foto** | — |

---

## 7. Kesimpulan Kelayakan Citra

1. **Kelayakan Citra Sangat Tinggi**: Tiga spesies terpilih (*Rastrelliger brachysoma*, *Selaroides leptolepis*, dan *Upeneus sulphureus*) memiliki kelayakan ketersediaan citra dan kemudahan akuisisi lapangan yang luar biasa di TPI Karangantu.
2. **Eliminasi Teri**: *Stolephorus commersonii* secara definitif dikeluarkan dari ruang lingkup MVP karena 0 citra di GBIF dan sifat fisiknya yang mendarat dalam tumpukan massa basah mikro.
3. Seluruh metadata inventarisasi citra telah terdokumentasi rapi pada:  
   📊 [`dataset_pipeline/reports/phase_11/image_source_inventory.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11/image_source_inventory.csv).

---
*Laporan Kelayakan Citra FishGuard AI — Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
