# DOKUMENTASI PERCAKAPAN: PHASE 7 — DEEP TECHNICAL AUDIT & SCIENTIFIC VALIDATION
**Ringkasan Fase:** Audit kejujuran status dataset (0 citra riil), verifikasi ketiadaan bobot custom, dan pengujian end-to-end API.

---

## Interaksi Dialog (Sesi 3)
**Timestamp:** `2026-11-09T02:11:36Z`

### Perintah Pengguna:
```text
# PHASE 7 — DEEP TECHNICAL AUDIT & SCIENTIFIC VALIDATION FISHGUARD AI

Kita telah menyelesaikan implementasi awal FishGuard AI dari PHASE 0 sampai PHASE 6.

Sekarang saya ingin kamu bertindak sebagai Senior AI Engineer sekaligus Software Quality Assurance Engineer untuk melakukan audit mendalam terhadap implementasi yang sudah ada.

PENTING: Jangan membangun ulang aplikasi. Jangan mengubah desain UI yang sudah berfungsi tanpa alasan. Fokus utama adalah memeriksa kode aktual, validitas hasil pengujian, ketepatan algoritma, dan kesesuaian implementasi dengan tujuan ilmiah proyek.

## 1. AUDIT YOLO DETECTION

Periksa secara langsung:
- backend/app/services/yolo_service.py
- backend/app/main.py
- backend/app/config.py
- backend/app/models/schemas.py

Pertanyaan yang harus dijawab:

1. Apakah model fishguard_yolo.pt benar-benar tersedia?
2. Apakah model yang digunakan saat ini merupakan model khusus ikan atau pretrained COCO?
3. Apakah pretrained yolov8n.pt dapat mengenali ikan?
4. Apakah sistem secara keliru menganggap kelas COCO sebagai kembung atau layang?
5. Apakah proposal objek dari OpenCV dicampurkan dengan hasil deteksi YOLO?
6. Apakah confidence score yang ditampilkan berasal dari prediksi model atau heuristik?
7. Bagaimana sistem menangani objek yang tidak terdeteksi?

Pisahkan secara eksplisit:
- YOLO AI Detection
- OpenCV Heuristic Proposals

Jangan pernah memberi label kembung atau layang pada objek yang identitas spesiesnya belum diketahui.

Jika model target belum tersedia, berikan status MODEL_NOT_TRAINED dan tampilkan keterangan yang jujur di frontend.

## 2. AUDIT LENGTH ESTIMATION

Periksa:
- backend/app/services/length_service.py
- endpoint /api/measure
- komponen frontend MeasurementPage.jsx

Periksa apakah algoritma benar-benar mampu:
- Menemukan titik moncong.
- Menemukan ujung sirip ekor.
- Menghitung jarak piksel.
- Menggunakan kalibrasi px/cm.
- Mengonversi piksel ke sentimeter.
- Memvalidasi posisi dan kualitas gambar.

Buat pengujian menggunakan beberapa variasi citra:
- Ikan dengan posisi horizontal.
- Ikan sedikit miring.
- Ikan dengan ekor terbuka.
- Ikan dengan ekor terlipat.
- Ikan dengan latar belakang kompleks.
- Ikan dengan pencahayaan berbeda.

Pisahkan hasil pengukuran otomatis dari pengukuran manual ground truth.

Jangan menyebut hasil pengujian spesimen sintetis sebagai bukti akurasi pada ikan nyata.

Jika algoritma belum cukup andal, jelaskan keterbatasannya dan usulkan perbaikan yang realistis.

## 3. AUDIT DATASET PIPELINE

Periksa:
- dataset_pipeline/dataset_config.yaml
- prepare_dataset.py
- train_yolo.py
- evaluate_metrics.py

Pastikan:
- Struktur dataset sesuai format YOLO.
- Class ID 0 benar-benar kembung.
- Class ID 1 benar-benar layang.
- Koordinat bounding box valid.
- Tidak ada label di luar rentang kelas.
- Tidak ada gambar tanpa label yang tidak sengaja.
- Tidak ada duplikasi gambar yang masuk ke split berbeda.
- Group split berdasarkan spesimen atau sesi benar-benar diterapkan.
- Data train, validation, dan test tidak mengalami leakage.

Pastikan script training menggunakan dataset yang benar dan menghasilkan bobot di lokasi yang sesuai dengan backend.

## 4. AUDIT DEPENDENCIES DAN ENVIRONMENT

Periksa kompatibilitas:
- Python 3.14.7
- PyTorch
- Ultralytics
- OpenCV
- NumPy
- FastAPI
- React 19
- Vite
- Tailwind CSS v4

Identifikasi dependensi yang tidak kompatibel atau berpotensi bermasalah.

Buat requirements.txt atau lockfile yang sesuai agar proyek dapat direproduksi.

Jangan menurunkan atau menaikkan versi paket tanpa alasan dan pengujian.

## 5. AUDIT BACKEND DAN FRONTEND

Pastikan:
- API upload gambar berjalan.
- Validasi format dan ukuran file tersedia.
- Penanganan error berjalan.
- CORS dan proxy benar.
- Hasil gambar tidak tertimpa secara tidak sengaja.
- SQLite menyimpan hasil dengan benar.
- Riwayat analisis sesuai hasil aktual.
- Statistik dashboard berasal dari database.
- Tidak ada angka dummy yang ditampilkan sebagai hasil nyata.
- Tidak ada tombol yang tidak memiliki fungsi.

Periksa keamanan dasar upload file dan validasi input.

## 6. AUDIT END-TO-END

Lakukan pengujian ulang terhadap:
- GET /api/health
- POST /api/detect
- POST /api/measure
- GET /api/history
- GET /api/statistics

Gunakan data pengujian yang jelas sumbernya.

Jika menggunakan gambar sintetis, beri label sebagai synthetic test.

Jangan mengklaim performa model spesies target jika belum tersedia dataset pengujian yang valid.

## 7. OUTPUT AUDIT

Buat file dokumentasi:

documentation/PHASE_7_AUDIT
```

### Hasil Pelaksanaan & Jawaban Asisten:

Laporan audit mendalam dan validasi ilmiah **PHASE 7** telah selesai dilaksanakan dan didokumentasikan secara resmi ke dalam file:

📄 **[`documentation/PHASE_7_AUDIT.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/PHASE_7_AUDIT.md)**

Berikut adalah ringkasan poin-poin kritis hasil audit:

---

### 1. Audit YOLO Detection & Integritas Status Model
- **Ketersediaan Bobot**: File `backend/weights/fishguard_yolo.pt` **belum ada** karena dataset spesifik Teluk Banten belum dikurasi dan dilatih.
- **Karakteristik Pretrained COCO**: Pengujian membuktikan bahwa dataset COCO 80 kelas pada `yolov8n.pt` **sama sekali tidak memiliki kelas ikan (`fish`)**. Citra ikan yang diuji ke model baseline COCO dikenali sebagai bentuk terdekat (misalnya kelas 25 `umbrella` atau kelas 33 `kite`).
- **Pemisahan Heuristik & Eliminasi Mocking**:
  - Proposal objek OpenCV telah **dipisahkan secara tegas** dari inferensi YOLO AI.
  - Sistem kini menerapkan status resmi **`MODEL_NOT_TRAINED`**.
  - Jumlah `kembung_count` dan `layang_count` **dijamin bernilai 0** selama bobot `fishguard_yolo.pt` belum ada, dan banner status transparan telah dipasang pada antarmuka frontend agar pengguna mengetahui kondisi model yang sebenarnya tanpa hasil prediksi palsu.

---

### 2. Audit Algoritma Computer Vision Length Estimation
Algoritma diuji terhadap **6 variasi kondisi fisik dan lingkungan visual** menggunakan spesimen dengan panjang acuan (*Ground Truth*) **22.0 cm** dan skala **20.0 px/cm**:

| No | Skenario Variasi | Ground Truth | Hasil CV (TL) | Galat | Status Ketahanan |
|:--:|---|:---:|:---:|:---:|:---|
| 1 | **Posisi Horizontal Standar** | 22.0 cm | **22.07 cm** | 0.07 cm | **Sangat Akurat (<1% deviasi)** |
| 2 | **Posisi Miring (Rotasi 30°)** | 22.0 cm | **22.18 cm** | 0.18 cm | **Akurat (<1% deviasi)** |
| 3 | **Sirip Ekor Terbuka (*Forked*)** | 22.0 cm | **22.47 cm** | 0.47 cm | **Akurat (<2.5% deviasi)** |
| 4 | **Sirip Ekor Terlipat / Kaku** | 22.0 cm | **19.95 cm** | 2.05 cm | **Deviasi Tinggi (*Underestimation* ~9.3%)** |
| 5 | **Latar Belakang Kompleks (Dek Kayu)** | 22.0 cm | **46.39 cm** | 24.39 cm | **Gagal Total (Otsu menyatukan tekstur lantai)** |
| 6 | **Pencahayaan Berbayang & Glare** | 22.0 cm | **35.96 cm** | 13.96 cm | **Gagal Total (Kontur terpecah oleh refleksi)** |

> **Catatan Validasi Ilmiah**: Hasil pengujian spesimen sintetis terkalibrasi membuktikan bahwa metode kontur bekerja baik pada kondisi ortogonal berlatar bersih, namun **tidak boleh diklaim sebagai bukti akurasi pada kondisi liar/kapal perikanan**. Untuk pengembangan lanjutan, disarankan menggunakan model berbasis **YOLOv8-Pose (Keypoint Detection)** untuk mendeteksi titik moncong dan ujung sirip ekor secara langsung, serta penggunaan **ArUco Marker** untuk kalibrasi otomatis.

---

### 3. Audit Dataset Pipeline & Pencegahan Data Leakage
- **Validasi Kelas**: `0: kembung` (*Rastrelliger kanagurta*) dan `1: layang` (*Decapterus macarellus*) telah terkunci di [`dataset_config.yaml`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/dataset_config.yaml).
- **Integritas Anotasi**: Script [`prepare_dataset.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/prepare_dataset.py) memvalidasi normalisasi rentang koordinat $0.0 \le x, y, w, h \le 1.0$.
- **Protokol Group-Split**: Pembagian Train/Val/Test dikelompokkan berdasarkan **ID Spesimen/Sesi**, memastikan seluruh foto dari individu ikan yang sama berada dalam satu split untuk mencegah kebocoran data (*zero data leakage*).

---

### 4. Audit Backend, Frontend, dan Keamanan
- **Proteksi Upload**: Ditambahkan validasi tipe MIME gambar dan **pembatasan ukuran berkas maksimum 15 MB** (file berlebih langsung ditolak dengan HTTP 413).
- **Keamanan Berkas**: Penamaan file upload dan hasil deteksi menggunakan kombinasi **UUIDv4** dan **timestamp milidetik**, menjamin file tidak saling menimpa.
- **Integritas Database**: Database SQLite lokal [`backend/fishguard_history.db`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/fishguard_history.db) menyimpan data riil; tidak ada angka dummy pada dashboard.

---

### 5. Hasil Pengujian End-to-End Aktual
Pengujian melalui [`backend/audit_test_e2e.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/audit_test_e2e.py) menunjukkan:
- `GET /api/health` ➡️ **200 OK** (`status: healthy`, `model_mode: MODEL_NOT_TRAINED`, `custom_weights_exist: False`)
- `GET /api/model/status` ➡️ **200 OK** (`is_custom_trained: False`)
- `POST /api/detect` (Synthetic Test) ➡️ **200 OK** (`kembung_count: 0`, `layang_count: 0`, jujur tanpa rekayasa kelas)
- `POST /api/measure` ➡️ **200 OK** (`TL: 22.39 cm`, status: `HIGH_CALIBRATED`)
- `GET /api/history` & `GET /api/statistics` ➡️ **200 OK** (menghitung langsung dari basis data)

Laporan lengkap, tabel metrik, dan analisis mendalam dapat Anda baca langsung pada dokumen [`documentation/PHASE_7_AUDIT.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/PHASE_7_AUDIT.md).

---

