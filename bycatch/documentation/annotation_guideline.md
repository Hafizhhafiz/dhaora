# PANDUAN ANOTASI CITRA — ByCatch AI (Phase 5)

Dokumen ini merupakan pedoman standar operasional anotasi bounding box untuk tiga spesies target deteksi objek perikanan pada proyek ByCatch AI di PPN Karangantu.

---

## 1. Definisi Tiga Kelas Spesies Kanonikal

| Class ID | Nama Label | Nama Ilmiah | Famili | Ciri Visual Diagnostik Wajib Tampak |
|:---:|---|---|---|---|
| **0** | `kembung_perempuan` | *Rastrelliger brachysoma* | Scombridae | Tubuh tinggi & agak pipih (*deep body*), corak dorsal gelap/kehijauan dengan finlet sirip, tutup insang lebar. |
| **1** | `selar_kuning` | *Selaroides leptolepis* | Carangidae | Garis kuning lebar membujur dari atas mata ke pangkal ekor, bintik hitam jelas pada tepi atas operkulum, scute ekor. |
| **2** | `kuniran` | *Upeneus sulphureus* | Mullidae | Sepasang sungut dagu (*barbels*), 2 sirip punggung terpisah jelas, garis lateral kuning/oranye. |

---

## 2. Standar dan Kaidah Anotasi Bounding Box

1. **Format Koordinat YOLO Standar:**
   * Format tiap baris file label `.txt`: `<class_id> <x_center> <y_center> <width> <height>`
   * Semua nilai ternormalisasi rentang `0.0` sampai `1.0` terhadap lebar dan tinggi citra.
   * Class ID harus tepat: `0`, `1`, atau `2`. Tidak diperkenankan class ID lain.

2. **Kerapatan Bounding Box (Tight Fit):**
   * Kotak harus menutupi seluruh tubuh ikan secara pas, mencakup moncong kepala, badan, sirip punggung, hingga ujung sirip ekor (*caudal fin*).
   * Jangan menyertakan ruang kosong atau latar belakang yang terlalu luas di dalam kotak.

3. **Penanganan Ikan Bertumpuk & Terpotong (Occlusion & Truncation):**
   * Ikan hanya dianotasi jika **minimal 40% bagian tubuhnya terlihat jelas** DAN ciri diagnostik spesiesnya dapat dipastikan tanpa keraguan.
   * Jika seekor ikan tertutup es, keranjang, atau ikan lain lebih dari 60%, **JANGAN DIBERI KOTAK** (diberi flag `ambiguous` pada level citra dan dikeluarkan dari split train/val/test agar tidak memicu false negative palsu).

4. **Penanganan Spesies Lain / Citra Negatif (Open-Set Handling):**
   * Jika dalam citra terdapat spesies lain di luar tiga target (misal tembang, tongkol, cumi-cumi) atau tidak ada ikan target sama sekali:
     * File `.txt` label dibuat **KOSONG (0 byte)**. File kosong menandakan citra latar belakang negatif yang sah (*hard negative background image*), bukan file hilang.
     * Dilarang keras memasukkan ikan lain yang mirip ke dalam salah satu dari 3 kelas target.

5. **Konsistensi Orientasi Citra:**
   * Semua foto wajib diproses rotasi EXIF (`ImageOps.exif_transpose`) sebelum dilakukan anotasi untuk mencegah pergeseran koordinat bounding box.

---

## 3. Metadata Tambahan Anotasi (Sidecar Attributes)

Setiap citra yang telah dianotasi dicatat atribut kondisinya pada `metadata/annotation_attributes.csv` untuk keperluan analisis generalisasi model pada Phase 8:
* `image_id`: SHA-256 slice (16 karakter).
* `occluded`: Boolean (ada ikan yang saling menumpuk/tertutup).
* `truncated`: Boolean (ada ikan yang terpotong tepi bingkai).
* `lighting`: `normal`, `low_light`, `harsh_shadow`, `glare`.
* `background`: `deck`, `sorting_table`, `basket`, `ice_box`, `floor`.
* `fish_count`: Jumlah individu ikan dalam citra.
