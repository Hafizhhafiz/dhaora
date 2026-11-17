# PHASE 16 — SYSTEM TEST PLAN & TEST CASES
**Matriks Rencana Pengujian 12 Kategori Sistem FishGuard AI**

---

## 1. Matriks 12 Kategori Uji Sistem

| No | Kategori Pengujian | Lingkup Uji & Tujuan | Parameter Keberhasilan | Status Uji Saat Ini |
|:---:|:---|:---|:---|:---:|
| **1** | **Fungsional Aplikasi** | Navigasi menu dashboard, pengunggahan citra, render visual bounding box. | Semua komponen UI React render tanpa crash; rute aktif merespons klik. | **VERIFIED (PASS)** |
| **2** | **Antarmuka API Backend** | Endpoint `/api/health`, `/api/model/status`, `/api/detect`, `/api/statistics`, `/api/history`. | HTTP 200 OK, payload JSON valid sesuai schema Pydantic. | **VERIFIED (PASS)** |
| **3** | **Model Inference Engine** | Pemuatan bobot YOLO, penanganan mode `MODEL_NOT_TRAINED`, latensi inferensi. | Inferensi selesai $< 2000$ ms; model mode dilaporkan jujur tanpa manipulasi. | **VERIFIED (PASS)** |
| **4** | **Species Identification** | Akurasi klasifikasi 3 target kelas (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*). | Precision $\ge 0,85$, Recall $\ge 0,85$, mAP50 $\ge 0,85$ pada test set target domain. | **PENDING TRAINING** |
| **5** | **Fish Counting (Pencacahan)**| Penghitungan jumlah individu pada citra bertumpuk/multi-spesies. | Mean Absolute Error (MAE) $\le 1$ individu pada citra tangkapan wajar. | **PLANNED (Phase 14)** |
| **6** | **Length Estimation Validation**| Komparasi estimasi panjang 2D vs ground truth manual jangka sorong. | Status dideklarasikan: VALIDATED ($\le 5\%$), LIMITED ($5-10\%$), EXPERIMENTAL ($>10\%$). | **EXPERIMENTAL** |
| **7** | **Data Storage & Database** | Penyimpanan sesi analisis ke SQLite, integritas kolom migrasi MVP. | Data tersimpan utuh di `analyses`; fungsi agregasi `get_statistics()` valid. | **VERIFIED (PASS)** |
| **8** | **Dashboard & Visualisasi** | Grafik Recharts (PieChart komposisi, BarChart kelimpahan, tabel riwayat). | Grafik ter-render dinamis sesuai data aktual; tooltip dan legend informatif. | **VERIFIED (PASS)** |
| **9** | **Error Handling & Keamanan** | Unggahan non-citra (PDF, EXE), file kosong (0-byte), file raksasa ($> 15$ MB). | HTTP 400 / 413 dengan pesan ramah pengguna; server tidak crash. | **VERIFIED (PASS)** |
| **10**| **Performa & Latensi** | Waktu inferensi lokal CPU, konsumsi memori, build bundling Vite. | Build Vite $< 5$ detik; latensi API $< 2,0$ detik per citra. | **VERIFIED (PASS)** |
| **11**| **Evaluasi Pengguna (User Eval)**| Uji kegunaan terstruktur pada 3–5 pengguna representatif (mahasiswa/dosen SIK). | Kuesioner SUS (*System Usability Scale*) dilaporkan dengan ukuran sampel n nyata. | **PLANNED** |
| **12**| **Validasi Lapangan Operasional**| Pengujian sistem di dermaga/TPI Karangantu dalam kondisi operasional riil. | Hanya diklaim jika data lapangan fisik diproses; jika tidak: "Lab/controlled only". | **DEFERRED TO FIELD** |

---

## 2. Prosedur Eksekusi Uji Otomatis
Pengujian fungsional dan API otomatis dijalankan menggunakan skrip regresi:
```powershell
python "backend/test_pipeline.py"
```
Hasil uji terbaru: **100% LULUS (5/5 assertions)** pada lingkungan Python 3.14 CPU.
