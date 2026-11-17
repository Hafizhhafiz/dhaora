# DOKUMENTASI PERCAKAPAN: PHASE 9 — PUBLIC DATASET ACQUISITION (DEEPFISH ZENODO)
**Ringkasan Fase:** Akuisisi dataset publik DeepFish Zenodo, inspeksi citra bawah air, domain gap analysis, dan evaluasi kelayakan.

---

## Interaksi Dialog (Sesi 6)
**Timestamp:** `2026-11-09T02:56:44Z`

### Perintah Pengguna:
```text
# PHASE 9 — PUBLIC DATASET ACQUISITION & INSPECTION
## FishGuard AI — ASIK V

Kamu bertindak sebagai Data Engineer, Computer Vision Dataset Specialist, dan Research Assistant dalam proyek FishGuard AI.

### 1. KONTEKS PROYEK

Workspace:
`c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI`

FishGuard AI merupakan sistem berbasis computer vision untuk:
1. Identifikasi spesies ikan.
2. Penghitungan jumlah ikan.
3. Estimasi panjang total ikan (Total Length/TL).

Target spesies:
- Kembung lelaki (*Rastrelliger kanagurta*).
- Layang (*Decapterus macarellus*).

Wilayah studi: Teluk Banten, Banten.

Domain operasional: ikan hasil tangkapan yang sudah didaratkan dan diletakkan di atas nampan atau meja sortir.

### 2. KONDISI AKTUAL

Berdasarkan laporan PHASE 8:
- Dataset foto spesimen lapangan: 0.
- Dataset publik terunduh: 0.
- Anotasi YOLO lapangan: 0.
- Citra sintetis hanya digunakan untuk pengujian teknis.
- Custom weights `fishguard_yolo.pt` belum tersedia.
- Infrastruktur backend, frontend, dan dataset pipeline sudah disiapkan.

JANGAN mengasumsikan bahwa dataset sudah tersedia.

### 3. TUGAS PERTAMA — AUDIT WORKSPACE

Sebelum melakukan apa pun:
1. Periksa direktori `dataset_pipeline`.
2. Periksa file metadata dan script yang telah dibuat pada PHASE 8.
3. Periksa kapasitas penyimpanan.
4. Periksa apakah ada dataset publik yang sudah terunduh.
5. Identifikasi struktur direktori untuk menyimpan dataset publik.
6. Jangan menghapus atau mengubah file yang sudah ada.

Sampaikan hasil audit singkat sebelum melanjutkan.

### 4. TUGAS KEDUA — PRIORITAS DATASET DEEPFISH

Mulai dengan kandidat pertama:

https://zenodo.org/records/6475675

https://www.nature.com/articles/s41597-022-01416-0

DeepFish merupakan dataset citra ikan di atas nampan dari pasar ikan grosir El Campello, Spanyol.

Periksa terlebih dahulu:
- Dokumentasi dataset.
- Ketentuan lisensi.
- Format arsip dan ukuran unduhan.
- Struktur citra.
- Anotasi segmentasi yang tersedia.
- Metadata spesies.
- Informasi pengukuran panjang jika tersedia.

Jangan mengasumsikan dataset memiliki dua spesies target FishGuard.

### 5. TUGAS KETIGA — AKUISISI DATASET NYATA

Jika lisensi dan ketentuan penggunaan telah diverifikasi:

1. Unduh dataset DeepFish atau subset yang relevan.
2. Simpan arsip asli tanpa modifikasi.
3. Simpan di direktori:

`dataset_pipeline/data/public/deepfish/raw/`

4. Ekstrak ke direktori kerja terpisah:

`dataset_pipeline/data/public/deepfish/processed/`

5. Jangan mengunduh jika kapasitas penyimpanan tidak mencukupi.
6. Jika unduhan gagal, laporkan penyebabnya dan berikan instruksi manual.

Jangan hanya membuat folder kosong atau file laporan yang mengklaim dataset telah diunduh.

### 6. TUGAS KEEMPAT — INSPEKSI HASIL UNDUHAN

Jika dataset berhasil diunduh, lakukan pemeriksaan:

- Jumlah file gambar.
- Format gambar.
- Resolusi gambar.
- Jumlah spesimen jika metadata mendukung.
- Daftar spesies.
- Format anotasi.
- Jumlah anotasi.
- Kualitas citra.
- Duplikasi.
- Informasi lisensi dan atribusi.

Tampilkan minimal beberapa sampel citra untuk pemeriksaan visual.

Jangan membuat label spesies sendiri berdasarkan dugaan visual.

### 7. TUGAS KELIMA — EVALUASI KOMPATIBILITAS

Evaluasi apakah DeepFish dapat dimanfaatkan untuk:

A. Benchmark deteksi ikan.

B. Referensi instance segmentation.

C. Referensi pengukuran panjang ikan.

D. Pembanding domain pasar ikan dengan TPI Teluk Banten.

Periksa apakah anotasinya dapat dikonversi menjadi format yang kompatibel dengan pipeline FishGuard.

Jika konversi memungkinkan:
- Buat hanya pada salinan kerja.
- Pertahankan anotasi asli.
- Dokumentasikan mapping dan proses konversi.

Jangan memaksakan seluruh kelas DeepFish menjadi dua kelas target FishGuard.

### 8. TUGAS KEENAM — DOKUMENTASI

Buat laporan:

`documentation/PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md`

Isi laporan:
1. Hasil audit workspace.
2. Sumber dataset.
3. Status lisensi.
4. Status unduhan.
5. Ukuran arsip.
6. Jumlah gambar aktual.
7. Struktur anotasi.
8. Spesies yang ditemukan.
9. Hasil pemeriksaan kualitas.
10. Kesesuaian dengan FishGuard.
11. Kendala yang ditemukan.
12. Rekomendasi langkah berikutnya.

Bedakan secara tegas:
- Dataset ditemukan.
- Dataset berhasil diunduh.
- Dataset berhasil diekstrak.
- Dataset berhasil diperiksa.
- Dataset siap digunakan.

### 9. BATASAN

- Jangan menjalankan training YOLO.
- Jangan membuat data sintetis untuk menggantikan data asli.
- Jangan mengarang jumlah gambar atau spesimen.
- Jangan mengarang lisensi.
- Jangan mengklaim unduhan berhasil jika file belum tersedia.
- Jangan melakukan scraping massal.
- Jangan mengubah dataset mentah.
- Jangan menghapus data lama.
- Jangan mengklaim DeepFish memiliki spesies target sebelum diverifikasi.

### 10. CARA KERJA

Kerjakan secara bertahap dan transparan.

Prioritas utama adalah memperoleh satu dataset publik yang benar-benar berhasil diunduh dan diperiksa.

Jika ada tindakan yang memerlukan permission pengguna, jelaskan tindakan tersebut dan minta izin sesuai mekanisme yang tersedia.

Jangan berhenti pada pembuatan rencana. Lakukan pekerjaan nyata sejauh akses dan izin memungkinkan.

Di akhir pekerjaan, laporkan status:

- WORKSPACE AUDIT: COMPLETED / PENDING
- DATASET LICENSE AUDIT: VERIFIED / UNVERIFIED
- DATASET DOWNLOAD: SUCCESS / FAILED / NOT STARTED
- DATASET INSPECTION: COMPLETED / PENDING
- YOLO TRAINING: NOT STARTED
- SCIENTIFIC VALIDATION: PENDING

<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.8 Flash (Medium) to Gemini 3.8 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>
```

### Hasil Pelaksanaan & Jawaban Asisten:

Audit workspace awal selesai. Kapasitas penyimpanan drive C: **72.60 GB Free** (sangat aman). Metadata Zenodo DeepFish (April 2022, lisensi CC BY 4.0) telah berhasil diunduh (`coco_format_fish_data.json` 41.45 MB dan `size_estimation_homography_DeepFish.csv` 0.63 MB), dan proses pengunduhan arsip citra serta label segmentasi sedang berlangsung di latar belakang.

---

## Interaksi Dialog (Sesi 7)
**Timestamp:** `2026-11-09T03:01:30Z`

### Perintah Pengguna:
```text
lanjutkan

<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.8 Flash (High) to Claude Sonnet 4.6 (Thinking). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>
```

### Hasil Pelaksanaan & Jawaban Asisten:

Semua data kunci sudah ada. Sekarang saya punya data lengkap untuk laporan. Mari saya juga:
1. Ekstrak `fish_tray_json_labels.zip` 
2. Inspeksi CSV size estimation
3. Buat laporan PHASE_9

---

## Interaksi Dialog (Sesi 8)
**Timestamp:** `2026-11-13T15:19:03Z`

### Perintah Pengguna:
```text
berikan laporan phase 9

<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Claude Sonnet 4.6 (Thinking) to Gemini 3.8 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>
```

### Hasil Pelaksanaan & Jawaban Asisten:

*(Proses komputasi / eksekusi skrip background terlaksana)*

---

## Interaksi Dialog (Sesi 9)
**Timestamp:** `2026-11-13T15:35:45Z`

### Perintah Pengguna:
```text
berikan laporan phase 9
```

### Hasil Pelaksanaan & Jawaban Asisten:

Semua output Phase 9 terverifikasi. Laporan berhasil disimpan. Berikut ringkasan lengkapnya:

---

## ✅ PHASE 9 — SELESAI

### 📄 Laporan tersimpan di:
[PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md) **(15.2 KB)**

---

### 🔍 Ringkasan Temuan Utama

#### Dataset yang Diinspeksi: DeepFish (Zenodo 6475675)

| Item | Detail |
|---|---|
| **Lisensi** | ✅ CC BY 4.0 — terverifikasi |
| **Wilayah** | Mediterania Barat (Spanyol) |
| **Total gambar** | 1.320 gambar |
| **Total anotasi COCO** | 7.339 (polygon instance segmentation) |
| **Jumlah spesies** | 64 spesies |
| **JSON label individual** | 1.290 file, 46.449 anotasi |
| **CSV estimasi ukuran** | 5.712 baris + metode homography kalibrasi |

#### ❌ Spesies Target TIDAK Ditemukan

| Target | Status |
|---|---|
| *Rastrelliger kanagurta* (kembung) | **TIDAK ADA** |
| *Decapterus macarellus* (layang) | **TIDAK ADA** |
| *Scomber japonicus* (kembung Mediterania) | Ada 8 — **bukan spesies target, berbeda genus** |

#### ✅ Nilai Metodologis DeepFish untuk FishGuard

1. **Referensi pipeline** deteksi ikan di atas nampan
2. **Referensi metodologi homography** untuk kalibrasi TL (lebih akurat dari px/cm konstan)
3. **Referensi format anotasi** polygon + keypoint morfometrik

---

### 📦 Status File yang Diunduh

| File | Ukuran | Status |
|---|---|---|
| `coco_format_fish_data.json` | 41.45 MB | ✅ |
| `size_estimation_homography_DeepFish.csv` | 0.63 MB | ✅ |
| `fish_tray_json_labels.zip` | 27.07 MB | ✅ |
| `fish_tray_images_2021_06-09.zip` | 373.27 MB | ✅ |
| 4 batch gambar lainnya | ~2.77 GB | ⏭️ Tidak diprioritaskan |

---

### 🚀 Rekomendasi untuk Phase 10

Karena DeepFish tidak mengandung spesies target, langkah berikutnya yang paling produktif:

1. **GBIF API** — download foto occurrence *Rastrelliger kanagurta* & *Decapterus macarellus* berlisensi CC:
   ```
   https://api.gbif.org/v1/occurrence/search?scientificName=Rastrelliger+kanagurta&mediaType=StillImage
   ```

2. **Pengumpulan data lapangan** di Teluk Banten menggunakan protokol yang sudah tersedia di [`field_data_collection_protocol.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/field_data_collection_protocol.md)

3. Target minimum sebelum training YOLO: **200+ foto per spesies (400+ total)**

---

