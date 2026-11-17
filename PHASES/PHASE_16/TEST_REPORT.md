# PHASE 16 — SYSTEM TEST REPORT
**Laporan Pengujian Menyeluruh Sistem FishGuard AI (12 Kategori Pengujian)**  
**Tanggal Pengujian:** 17 November 2026  
**Status Evaluasi:** SELESAI — 100% KATEGORI TERVERIFIKASI  
**Eksekutor Uji Otomatis:** `tests/test_system_suite.py`  
**Ringkasan Bukti JSON:** `PHASES/PHASE_16/system_test_summary.json`

---

## 1. Ringkasan Eksekutif Hasil Uji 12 Kategori

| No | Kategori Pengujian | Komponen yang Diuji | Status Hasil | Metrik Kunci / Bukti Objektif |
|:---:|:---|:---|:---:|:---|
| **1** | **UI & Static Assets** | 7 Halaman React SPA | **PASS** | Dashboard, Detection, Counting, Measurement, History, Dataset, About terverifikasi. |
| **2** | **Backend API Contract** | Endpoint FastAPI | **PASS** | HTTP 200 pada `/api/health`, `/api/model/status`, `/api/history`, `/api/statistics`. |
| **3** | **Inference Engine** | YOLOv8n Pipeline | **PASS** | Bobot `fishguard_yolo.pt` (6.19 MB) aktif dalam mode `CUSTOM_SPECIES_MODEL`. |
| **4** | **Species Accuracy** | 25 Citra Test Beku | **PASS (AUDITED)** | Precision = 0.6067, Recall = 0.4315, mAP50 = 0.3673 (gap dilaporkan transparan). |
| **5** | **Fish Counting & Catch**| Estimasi Jumlah Individu | **PASS** | Overall MAE = 2.40 ekor/citra, RMSE = 2.993 ekor/citra. |
| **6** | **Length Estimation** | Kaliper Terkalibrasi & Kurvatur | **PASS** | Skala ArUco terdeteksi (19.98 px/cm), kurvatur horizontal & vertikal teruji ($C=1.044$), status `VALIDATED` (±0.56 cm). |
| **7** | **Database & Persistence**| SQLite Schema & Ingestion | **PASS** | Kolom 3 spesies MVP (*brachysoma*, *leptolepis*, *sulphureus*) terverifikasi utuh. |
| **8** | **Analytics & Aggregation**| Dasbor Statistik & Grafik | **PASS** | Perhitungan agregat tangkapan stabil dan bebas divide-by-zero. |
| **9** | **Error Handling & Security**| Input Boundary & Sanitization | **PASS** | File 0-byte (400), file non-image (400), path traversal terlindungi, blank frame aman. |
| **10**| **Performance & Latency** | Throughput CPU | **PASS** | Rata-rata steady latensi API: 189.13 ms per request (~5.3 req/s pada CPU). |
| **11**| **Usability & Disclaimers**| Transparansi & Panduan Pengguna | **PASS** | Disclaimer ilmiah wajib tampil pada semua respon estimasi biometrik & status model. |
| **12**| **Field Governance** | Batasan Fisik & Lapangan | **PASS** | Phase 11.7.4, 11.7.5, dan 11.8 terkunci ketat `BLOCKED` tanpa fabrikasi data. |

---

## 2. Analisis Rinci Temuan Edge Cases (Kategori 9 & 10)

1. **Halusinasi Frame Putih Polos pada Ambang Batas Rendah (Edge Case #1):**
   - Pada citra putih seragam (640x640), pengujian mendeteksi 1 bounding box halusinasi (*R. brachysoma*, conf 0.358) saat conf threshold disetel ke default 0.25.
   - Hal ini disebabkan dataset latih sintetis menggunakan latar belakang putih tanpa citra negatif murni (*pure background images*).
   - **Mitigasi Terverifikasi:** Pada rekomendasi operasional conf $\ge 0.50$, halusinasi ini tertekan $100\%$ (0 objek terdeteksi).
2. **Perilaku Citra Gelap/Hitam Polos (Edge Case #2):**
   - Pada citra gelap murni, peningkatan threshold ke 0.90 menghasilkan 0 objek dan mengaktifkan catatan diagnostik ramah pengguna: *"Tidak ada objek yang terdeteksi oleh model pada ambang batas confidence saat ini."*
3. **Keamanan Injeksi Path (Edge Case #3):**
   - Percobaan path traversal `../../../../../etc/passwd` ditangani secara aman oleh FastAPI tanpa menyebabkan crash layanan backend.

---

## 3. Kesimpulan & Rekomendasi Kesiapan Rilis
Sistem FishGuard AI membuktikan stabilitas arsitektur perangkat lunak yang sangat tinggi (100% uji unit & integrasi lulus). Keterbatasan model deteksi baseline (mAP50 0.3673) dan tingginya false positive rate pada look-alike (61.58% pada ambang 0.50, N=177) telah didokumentasikan secara terbuka dan diimbangi oleh sistem peringatan/disclaimer antarmuka.
