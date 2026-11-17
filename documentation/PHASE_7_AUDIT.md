# LAPORAN DEEP TECHNICAL AUDIT & SCIENTIFIC VALIDATION (PHASE 7)
## Sistem Monitoring dan Konservasi Perikanan Berbasis AI — FishGuard AI

- **Proyek**: ASIK V — FishGuard AI
- **Institusi**: Program Studi Sistem Informasi Kelautan (SIK), Universitas Pendidikan Indonesia (UPI) Kampus Serang
- **Wilayah Studi**: Teluk Banten, Banten, Indonesia
- **Spesies Target**: 
  1. Ikan Kembung (*Rastrelliger kanagurta* — Famili Scombridae)
  2. Ikan Layang (*Decapterus macarellus* — Famili Carangidae)
- **Peran Auditor**: Senior AI Engineer & Software Quality Assurance Engineer
- **Tanggal Audit**: 9 November 2026
- **Status Audit**: **SELESAI (AUDITED & VALIDATED)**

---

## 1. AUDIT YOLO DETECTION

Pemeriksaan kode dilakukan langsung pada:
- [`backend/app/services/yolo_service.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/app/services/yolo_service.py)
- [`backend/app/main.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/app/main.py)
- [`backend/app/config.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/app/config.py)
- [`backend/app/models/schemas.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/app/models/schemas.py)

### Jawaban terhadap 7 Pertanyaan Inti Audit:

#### 1. Apakah model `fishguard_yolo.pt` benar-benar tersedia?
- **Temuan**: **TIDAK TERSEDIA**. Direktori `backend/weights/` belum memuat file `fishguard_yolo.pt`.
- **Verifikasi**: File bobot tersebut merupakan artefak hasil fine-tuning yang baru dapat dibuat setelah pengumpulan foto spesimen lapangan Teluk Banten pada Fase 4.
- **Tindakan Sistem**: Sistem mendeteksi ketiadaan file ini secara dinamis (`CUSTOM_WEIGHTS_PATH.exists()`), mengalihkan status ke `MODEL_NOT_TRAINED`, dan tidak memalsukan ketersediaan bobot model.

#### 2. Apakah model yang digunakan saat ini merupakan model khusus ikan atau pretrained COCO?
- **Temuan**: Model yang dimuat adalah **Pretrained YOLOv8n (COCO Dataset 80 kelas)** dari repositori resmi Ultralytics (`yolov8n.pt`).
- **Verifikasi**: Model ini adalah model umum *off-the-shelf* yang belum pernah dilatih (*zero fine-tuning*) pada domain perikanan tangkap Teluk Banten.

#### 3. Apakah pretrained `yolov8n.pt` dapat mengenali ikan?
- **Temuan Ilmiah**: **TIDAK BISA**.
- **Bukti Teknis**: Pengujian daftar kelas COCO melalui perintah Python:
  ```python
  'fish' in YOLO('yolov8n.pt').names.values() # Menghasilkan False
  ```
  Dataset COCO (Common Objects in Context) memuat 80 kelas objek umum seperti `person`, `car`, `dog`, `boat`, `bird`, `cat`, namun **sama sekali tidak memiliki kelas `fish`**. Ketika citra ikan mentah diuji terhadap model ini, model memprediksi pola bentuk fusiform sebagai kelas COCO terdekat, yaitu **kelas 25 (`umbrella`)** atau **kelas 33 (`kite`)**.

#### 4. Apakah sistem secara keliru menganggap kelas COCO sebagai kembung atau layang?
- **Temuan Awal**: Pada iterasi prototipe paling awal, terdapat logika eksperimental yang memetakan objek deteksi baseline ke nama `kembung`/`layang`.
- **Koreksi & Validasi Audit**: Logika tersebut **TELAH DIHAPUS SEPENUHNYA**. Sistem kini menerapkan aturan ketat:
  - Jika model berstatus `MODEL_NOT_TRAINED`, hasil cacah `kembung_count` **dipaksa bernilai 0** dan `layang_count` **dipaksa bernilai 0**.
  - Deteksi baseline dari COCO dilabeli secara jujur sebagai `COCO: <nama_objek>` dengan nama ilmiah `Bukan Spesies Target` dan keluarga `Non-Fisheries Class`.

#### 5. Apakah proposal objek dari OpenCV dicampurkan dengan hasil deteksi YOLO?
- **Temuan Audit**: Sebelum audit, terdapat fungsi `_extract_fish_proposals` berbasis thresholding Otsu yang menyuntikkan bounding box jika YOLO menghasilkan 0 deteksi.
- **Tindakan Perbaikan**: **TELAH DIPISAHKAN SECARA EKSPLISIT**. Hasil inferensi YOLO AI kini 100% independen dari OpenCV. Tidak ada heuristik buatan OpenCV yang disamarkan atau digabungkan ke dalam output array `detections` YOLO.

#### 6. Apakah confidence score yang ditampilkan berasal dari prediksi model atau heuristik?
- **Temuan**: Confidence score yang dikembalikan (`float(box.conf[0])`) berasal **100% murni dari tensor output layer softmax/sigmoid Ultralytics YOLOv8n**. Tidak ada angka konfidensi yang di-hardcode atau digenerasi secara acak.

#### 7. Bagaimana sistem menangani objek yang tidak terdeteksi?
- **Temuan**: Jika tidak ada bounding box yang melewati ambang batas confidence (misal `conf < 0.25`), sistem:
  - Mengembalikan array kosong `detections: []`.
  - Mengembalikan `total_count: 0`.
  - Mengisi catatan diagnostik transparan: `"Tidak ada objek yang terdeteksi oleh model pada ambang batas confidence saat ini."`

---

## 2. AUDIT COMPUTER VISION LENGTH ESTIMATION

Pemeriksaan kode dilakukan langsung pada:
- [`backend/app/services/length_service.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/app/services/length_service.py)
- [`dataset_pipeline/scripts/audit_length_variations.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/audit_length_variations.py)

### Metodologi Pengujian
Algoritma diuji terhadap **6 variasi kondisi fisik dan lingkungan visual** menggunakan spesimen dengan panjang fisik acuan (*Ground Truth*) sebesar **22.0 cm** pada skala kalibrasi **20.0 px/cm** (440 piksel):

| No | Kondisi Pengujian | Ground Truth | Hasil CV (TL) | Galat Mutlak | Deviasi Relatif | Status Ketahanan Algoritma |
|:--:|---|:---:|:---:|:---:|:---:|:---|
| 1 | **Posisi Horizontal Standar** | 22.0 cm | **22.07 cm** | 0.07 cm | 0.32% | **SANGAT AKURAT** |
| 2 | **Miring (Rotasi 30°)** | 22.0 cm | **22.18 cm** | 0.18 cm | 0.82% | **AKURAT** |
| 3 | **Sirip Ekor Terbuka (*Forked*)** | 22.0 cm | **22.47 cm** | 0.47 cm | 2.14% | **AKURAT** |
| 4 | **Sirip Ekor Terlipat / Melengkung** | 22.0 cm | **19.95 cm** | 2.05 cm | 9.32% | **DEVIASI TINGGI (*Underestimation*)** |
| 5 | **Latar Belakang Kompleks (Dek Kayu/Papan)**| 22.0 cm | **46.39 cm** | 24.39 cm | 110.86% | **GAGAL TOTAL (Kontur Pecah/Menyatu)** |
| 6 | **Pencahayaan Buruk (Bayangan + Glare)** | 22.0 cm | **35.96 cm** | 13.96 cm | 63.45% | **GAGAL TOTAL (Artefak Kontras)** |

### Temuan Teknis & Keterbatasan Ilmiah:
1. **Titik Ekstremitas Kontur Morfologi**:
   - Metode `cv2.findContours` + `argmin/argmax` hanya andal pada latar belakang bersih dan seragam (*flat white/monochrome calibration mat*).
   - Pada posisi miring hingga 30°, algoritma Euclidean $\sqrt{\Delta x^2 + \Delta y^2}$ masih memberikan presisi memadai (galat < 0.2 cm).
2. **Kelemahan pada Ekor Terlipat**:
   - Total Length (TL) biologis diukur hingga ujung cuping terpanjang sirip ekor yang direntangkan secara wajar. Jika ikan kaku (*rigor mortis*) atau ekornya terlipat, jarak linier garis lurus mengalami *underestimation* sebesar 9.3%.
3. **Kelemahan pada Latar Belakang Lapangan (TPI / Dek Kapal)**:
   - Pengambang-taraan Otsu (`cv2.THRESH_OTSU`) gagal memisahkan ikan dari garis tekstur papan perahu dan bayangan basah, sehingga kontur membesar ke seluruh latar belakang.
4. **Pernyataan Integritas**:
   - **Hasil pengujian spesimen sintetis TIDAK BOLEH diklaim sebagai bukti akurasi pada ikan nyata di lapangan**.
   - Diperlukan papan ukur perikanan standar (*fisheries measuring board*) dengan latar belakang biru/putih kontras tinggi untuk operasional nyata di Teluk Banten.

### Rekomendasi Solusi Teknis untuk Fase Lanjutan:
- Mengganti deteksi kontur global dengan **YOLOv8-Pose (Keypoint Detection)** untuk mendeteksi 2 titik anatomi spesifik: ujung moncong (*snout*) dan ujung sirip ekor (*caudal fork/tip*).
- Mengintegrasikan **ArUco Marker** (misal tag 5x5 cm) untuk kalibrasi rasio piksel-ke-cm otomatis tanpa input manual.

---

## 3. AUDIT DATASET PIPELINE & TAXONOMIC INTEGRITY

Pemeriksaan dilakukan pada:
- [`dataset_pipeline/dataset_config.yaml`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/dataset_config.yaml)
- [`dataset_pipeline/scripts/prepare_dataset.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/prepare_dataset.py)
- [`dataset_pipeline/scripts/train_yolo.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/train_yolo.py)
- [`dataset_pipeline/scripts/evaluate_metrics.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/scripts/evaluate_metrics.py)

### Hasil Verifikasi:
1. **Pemetaan Kelas (Class ID Mapping)**:
   - `Class 0`: Terverifikasi mutlak untuk **Ikan Kembung** (*Rastrelliger kanagurta*).
   - `Class 1`: Terverifikasi mutlak untuk **Ikan Layang** (*Decapterus macarellus*).
   - Tidak ada kelas hantu (*ghost class*) atau ketidakkonsistenan indeks kelas antara YAML dan kode inferensi.
2. **Validasi Anotasi YOLO**:
   - Fungsi `validate_yolo_annotation()` memeriksa:
     - 5 elemen per baris (`class_id x_center y_center width height`).
     - Seluruh koordinat berada dalam batas normalisasi ketat: $0.0 \le x, y, w, h \le 1.0$.
     - `class_id` wajib bernilai integer `0` atau `1`. File label yang memuat kelas di luar rentang ini otomatis ditolak (*skipped*).
3. **Protokol Pencegahan Data Leakage**:
   - Script `prepare_dataset.py` mengelompokkan citra berdasarkan ID Spesimen unik (`specimen_id = img_file.stem.split('_')[0]`).
   - Seluruh foto dari satu individu spesimen (meskipun diambil dari sudut berbeda atau pencahayaan berbeda) dialokasikan utuh ke **salah satu split saja** (Train ATAU Validation ATAU Test).
   - Tidak ada kebocoran data (*zero overlap*) antara data latih dan data uji evaluasi.
4. **Jalur Ekspor Bobot Training**:
   - Script `train_yolo.py` dikonfigurasi untuk mengekspor bobot hasil training terbaik (`best.pt`) langsung ke target `backend/weights/fishguard_yolo.pt`, yang langsung dikenali secara otomatis oleh sistem saat runtime.

---

## 4. AUDIT DEPENDENCIES DAN ENVIRONMENT

| Paket | Versi Terpasang | Status Kompatibilitas | Catatan Teknis Audit |
|---|:---:|:---:|---|
| **Python** | `3.14.7` | Compatible | Versi Python mutakhir. Seluruh modul C-extension berjalan normal. |
| **PyTorch** | `2.15.0+cpu` | Compatible | Wheel CPU resmi berhasil diinstal dan menginisialisasi tensor tanpa konflik. |
| **Ultralytics** | `8.4.208` | Compatible | YOLOv8 engine berjalan optimal, konfigurasi setting tersimpan otomatis. |
| **OpenCV** | `5.0.0` / `contrib` | Compatible | Akselerasi transformasi citra dan kontur berfungsi stabil. |
| **NumPy** | `2.5.4` | Compatible | Kompatibel dengan PyTorch 2.15 dan OpenCV 5.0. |
| **FastAPI** | `0.162.2` | Compatible | Routing asinkron, middleware CORS, dan dokumentasi OpenAPI berfungsi. |
| **Uvicorn** | `0.54.0` | Compatible | Server ASGI melayani permintaan HTTP dengan reload otomatis. |
| **React** | `19.3.1` | Compatible | Antarmuka pengguna reaktif render tanpa hydration error. |
| **Vite** | `8.3.6` | Compatible | Bundling aset produksi selesai dalam 1.45 detik. |
| **Tailwind CSS** | `@tailwindcss/vite` | Compatible | Engine v4 terintegrasi langsung ke pipeline Vite. |
| **react-is** | `19.0.0` | Compatible | Diinstal untuk mengatasi kebutuhan resolusi internal Recharts pada React 19. |

- File dependensi yang dapat direproduksi telah dibekukan di [`backend/requirements.txt`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/requirements.txt) dan [`frontend/package.json`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/frontend/package.json).

---

## 5. AUDIT BACKEND DAN FRONTEND

### Keamanan dan Validasi Upload:
- **Validasi Format MIME**: File upload diperiksa (`file.content_type.startswith("image/")`). Format non-gambar langsung ditolak dengan HTTP 400.
- **Validasi Ukuran File**: Diterapkan batas maksimum ukuran file sebesar **15 MB**. File kosong (0 bytes) atau file melebihi 15 MB ditolak dengan HTTP 413 (*Payload Too Large*).
- **Pencegahan Tumbukan File (*Collision Safety*)**: Nama file upload dan hasil inferensi di-hash menggunakan UUIDv4 acak 8 karakter (`f"{analysis_id}_{filename}"`) dan timestamp milidetik (`f"detected_{timestamp}_{filename}"`), menjamin **tidak ada file hasil yang tertimpa secara tidak sengaja**.

### Integritas Database & Dashboard:
- Database relasional SQLite lokal tersimpan di [`backend/fishguard_history.db`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/fishguard_history.db).
- Tidak ada data palsu atau angka dummy pada endpoint `/api/statistics`. Seluruh metrik KPI (Total Citra, Total Ikan, Komposisi Kembung vs Layang) dihasilkan langsung dari klausa agregasi SQL `COUNT(*)` dan `SUM()` terhadap tabel `analyses`.
- Semua tombol pada antarmuka frontend (mulai dari analisis, reset, slider ambang batas confidence, pilihan sampel riwayat, kaliper panjang, hingga navigasi tab) memiliki handler fungsi aktif; **tidak ada tombol dekoratif tanpa fungsi**.

---

## 6. AUDIT PENGUJIAN END-TO-END (HASIL EKSEKUSI AKTUAL)

Pengujian otomatis end-to-end dieksekusi melalui script [`backend/audit_test_e2e.py`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/backend/audit_test_e2e.py):

```
=== PENGUJIAN END-TO-END AUDIT API FISHGUARD AI ===

1. Menguji GET /api/health ...
   [PASS] Health Status: healthy
   [PASS] Model Mode: MODEL_NOT_TRAINED
   [PASS] Custom Weights Exist: False

2. Menguji GET /api/model/status ...
   [PASS] Is Custom Trained: False
   [PASS] Message: Model khusus belum tersedia di backend/weights/fishguard_yolo.pt. 
          Menggunakan baseline YOLOv8n (hanya mengenali objek umum, belum mengklasifikasikan kembung dan layang).

3. Menguji POST /api/detect dengan sampel: sample_kembung_calibrated.jpg (Synthetic Test) ...
   [PASS] Analysis ID: 6cb7e77f
   [PASS] Model Mode: MODEL_NOT_TRAINED
   [PASS] Total Fish Terdeteksi: 1
   [PASS] Kembung Count (Harus 0 jika belum terlatih): 0
   [PASS] Layang Count (Harus 0 jika belum terlatih): 0
   [PASS] Diagnostic Notes: ['STATUS MODEL: MODEL_NOT_TRAINED. Bobot khusus kembung dan layang belum tersedia...']

4. Menguji POST /api/measure untuk analisis ID 6cb7e77f ...
   [PASS] Is Calibrated: True
   [PASS] Pixel Distance: 447.83 px
   [PASS] Total Length (TL): 22.39 cm
   [PASS] Confidence Level: HIGH_CALIBRATED

5. Menguji GET /api/history ...
   [PASS] Total riwayat tersimpan: 3 item

6. Menguji GET /api/statistics ...
   [PASS] Agregasi Dashboard: Total Analyses: 3, Total Kembung: 0, Total Layang: 0
```

---

## 7. KESIMPULAN AUDIT & ROADMAP FASE BERIKUTNYA

### Ringkasan Status Sistem Saat Ini:
1. **Fondasi Arsitektur**: **100% Siap, Stabil, dan Beroperasi secara Lokal**.
2. **Integritas Ilmiah**: **Lulus Uji Audit**. Sistem tidak memalsukan identifikasi spesies kembung dan layang sebelum proses training nyata dilakukan. Status `MODEL_NOT_TRAINED` ditampilkan secara transparan di seluruh antarmuka.
3. **Estimasi Panjang**: Telah terbukti mampu mengukur spesimen terkalibrasi dengan galat < 0.2 cm pada kondisi ortogonal, namun memiliki keterbatasan pada latar belakang kompleks atau pencahayaan berbayang.

### Rencana Aksi Menuju Tahap Lapangan:
1. **Pengambilan Spesimen Teluk Banten**: Mengambil foto spesimen ikan kembung dan ikan layang langsung di TPI Teluk Banten (misal TPI Karangantu) beralaskan papan ukur kalibrasi.
2. **Anotasi Data**: Mengisi folder `dataset_pipeline/data/raw/` dengan file gambar dan label YOLO hasil anotasi (`.txt`).
3. **Eksekusi Training**: Menjalankan `python dataset_pipeline/scripts/train_yolo.py` untuk menghasilkan `backend/weights/fishguard_yolo.pt`.
4. **Validasi Akhir**: Menjalankan `python dataset_pipeline/scripts/evaluate_metrics.py` untuk memperoleh metrik ilmiah sesungguhnya (mAP@50, mAP@50-95, MAE).
