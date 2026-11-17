# TRAINING READINESS ASSESSMENT
## FishGuard AI — ASIK V

**Tanggal Penilaian:** 14 November 2026  
**Auditor:** Senior Dataset Auditor & Fisheries Data Scientist  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Status Kesiapan Pelatihan:** 🛑 **`NOT_READY_FOR_TRAINING`**  

---

## 1. Ringkasan Eksekutif & Penetapan Status

Berdasarkan audit komprehensif terhadap seluruh data publik yang diakuisisi hingga Phase 10 (DeepFish Zenodo dan GBIF Occurrence API), sistem FishGuard AI secara formal ditetapkan berstatus:

$$\mathbf{STATUS:\ NOT\_READY\_FOR\_TRAINING}$$

Keputusan ini didasarkan pada prinsip integritas ilmiah, kaidah biologi perikanan, dan standar rekayasa visi komputer. Meskipun sebanyak 207 citra nyata berlisensi resmi telah berhasil diunduh dan dikurasi kualitas optiknya, **data tersebut belum memenuhi syarat fundamental untuk proses pelatihan model deteksi (YOLO) maupun estimasi panjang (Total Length)**.

---

## 2. Matriks Evaluasi Kesiapan (8 Dimensi Standar Riset)

| Dimensi Evaluasi | Kondisi Aktual FishGuard AI | Kebutuhan Minimum Pelatihan YOLO & Biometri | Status Dimensi |
|---|---|---|---|
| **1. Jumlah Individu Unik** | 107 individu (*R. kanagurta*), 100 individu (*D. macarellus*) terunduh | Minimum 200–300 individu unik per spesies untuk generalisasi dasar | ⚠️ **PARTIAL** |
| **2. Keseimbangan Citra per Kelas** | 107 (*R. kanagurta*) vs 100 (*D. macarellus*) | Rasio seimbang (1:1 hingga 1:1.5) | ✅ **MEMADAI** |
| **3. Validitas Taksonomi** | 100% bersumber dari *crowdsourced* iNaturalist (tanpa voucher fisik / uji lab) | Verifikasi morfologi oleh iktiolog (rasio kedalaman tubuh, scute count) | ⚠️ **BELUM TERVERIFIKASI FISIK** |
| **4. Hak Cipta & Lisensi** | Mayoritas `CC BY-NC 4.0` dan `CC BY 4.0` (kompatibel riset akademis) | Lisensi bebas sengketa untuk riset dan publikasi kampus | ✅ **KOMPATIBEL AKADEMIS** |
| **5. Kualitas Optik Citra** | 76,3% `HIGH`, 14,0% `MEDIUM`, 9,7% `LOW` (15 berkas blur dieliminasi) | Gambar tajam, fokus pada kontur tubuh ikan | ✅ **TERKURASI** |
| **6. Kesesuaian Domain Citra** | **Underwater in-situ (ikan berenang)** & awetan toples museum | **Ikan mati tampak lateral di atas nampan sortir / papan ukur TPI Karangantu** | ❌ **DOMAIN MISMATCH BERAT** |
| **7. Anotasi Objek (Bounding Box/Mask)** | **0 Bounding Box, 0 Segmentasi, 0 Keypoint** | Format YOLO `.txt` (kelas, x_center, y_center, width, height) ternormalisasi | ❌ **KOSONG TOTAL** |
| **8. Ground Truth Panjang Fisik (TL)** | **0 Data Panjang Terkalibrasi** (tidak ada marker ArUco / penggaris pada foto GBIF) | Panjang fisik aktual (cm) terukur manual dengan kaliper/ichthyometer | ❌ **KOSONG TOTAL** |

---

## 3. Analisis Mendalam Keterbatasan Domain (Domain Shift)

Kelemahan paling substansial dari dataset publik GBIF adalah **Domain Incompatibility**:

```
[ Domain GBIF ]                             [ Domain Target FishGuard AI ]
- Ikan hidup berenang di terumbu karang     - Ikan mati/segar hasil tangkapan nelayan
- Air laut biru/keruh, backscatter           - Latar belakang papan ukur putih/biru kontras
- Sudut miring (oblique/perspective view)    - Sudut tegak lurus 90° ortogonal
- Sirip menguncup dinamis                    - Sirip dibentangkan wajar di atas papan ukur
- Ada gangguan karang, penyelam, gelembung   - Tanpa oklusi, pencahayaan studio/lapang terkontrol
- TANPA PENGGARIS KALIBRASI                  - DILENGKAPI MISTAR UKUR & ARUCO MARKER (cm)
```

Jika model YOLO dilatih langsung menggunakan foto bawah air GBIF:
1. **Deteksi Gagal di Lapangan**: Model akan mempelajari fitur air biru dan terumbu karang sebagai konteks, sehingga gagal mendeteksi ikan di atas nampan TPI (*negative transfer*).
2. **Estimasi Panjang Tidak Berfungsi**: Tanpa referensi skala piksel-ke-sentimeter, algoritma kontur OpenCV atau pose keypoint tidak dapat mengonversi panjang piksel ke Total Length (cm).

---

## 4. Evaluasi Taksonomi Kritis: *Rastrelliger* vs *Decapterus*

Sistem FishGuard AI menetapkan dua spesies target spesifik:
* **Kelas 0**: *Rastrelliger kanagurta* (Ikan Kembung Lelaki)
* **Kelas 1**: *Decapterus macarellus* (Ikan Layang)

Risiko taksonomi yang teridentifikasi dalam audit:
1. **Kebingungan Spesies Simpatrik**: Di perairan Banten, *Rastrelliger kanagurta* hidup bersama *Rastrelliger brachysoma* (kembung perempuan). Keduanya hanya dapat dibedakan melalui rasio kelangsingan tubuh ($TL/BodyDepth > 3.4$ untuk *R. kanagurta*) dan jumlah sisir saring insang (*gill rakers* 30–46 vs 56–61). Foto bawah air GBIF dari sudut miring tidak memungkinkan verifikasi rasio ini secara kuantitatif.
2. **Ketiadaan Spesimen Layang Lokal di GBIF**: Seluruh rekaman *Decapterus macarellus* pada GBIF berasal dari Hawaii, Meksiko, dan Atlantik Barat. Tidak ada rekaman dengan foto dari Teluk Banten atau Selat Sunda.

Oleh karena itu, seluruh citra GBIF **tidak boleh dinyatakan sebagai ground truth taksonomi mutlak**, melainkan diklasifikasikan sebagai **`PRIORITY_CANDIDATE`** (Indonesia) atau **`METADATA_SCREENED`** (Global).

---

## 5. Peta Jalan Menuju `READY_FOR_ANNOTATION` dan `READY_FOR_TRAINING`

Untuk beralih dari status `NOT_READY_FOR_TRAINING` menuju `READY_FOR_TRAINING`, tim peneliti FishGuard AI harus menyelesaikan tahapan berikut:

```
[ Phase 10.1 ] 
Status: NOT_READY_FOR_TRAINING (Audit Integritas Selesai)
      │
      ▼
[ Phase 11 — Field Specimen Acquisition di Teluk Banten ]
- Lokasi: TPI Karangantu, PPN Karangantu, Teluk Banten
- Target: 200 foto kembung + 200 foto layang
- Alat: Papan ukur ichthyometer (0.1 cm), marker ArUco 5x5 cm, sudut 90° tegak lurus
- Pencatatan: Ground truth Total Length (cm) di metadata/ground_truth_measurements.csv
- Verifikasi: Identifikasi morfologi oleh asisten laboratorium SIK UPI
      │
      ▼
[ Milestone: READY_FOR_ANNOTATION ]
      │
      ▼
[ Phase 12 — Ground Truth Annotation & Quality Triage ]
- Bounding Box YOLO (Label 0: kembung, Label 1: layang)
- Keypoints Moncong (Snout tip) dan Ekor (Caudal tip)
- Verifikasi IoU dan konsistensi split (specimen-isolated group split)
- Data Leakage Prevention (memastikan satu ikan tidak terpecah ke Train dan Test)
      │
      ▼
[ Milestone: READY_FOR_TRAINING ]
      │
      ▼
[ Phase 13 — Model Training & Evaluation ]
- Transfer learning dari backbone Ultralytics (YOLOv8n / YOLOv8-Pose)
- Pelatihan bobot resmi: backend/weights/fishguard_yolo.pt
- Evaluasi mAP@0.5, mAP@0.5:0.95, MAE Panjang (cm), Precision, Recall
```

---

## 6. Kesimpulan Audit Kesiapan

1. **Status Model Saat Ini**: Tetap **`MODEL_NOT_TRAINED`** pada backend FastAPI (`backend/app/services/yolo_service.py`).
2. **Pemanfaatan Data GBIF**: 175 citra GBIF yang tersaring dialokasikan sebagai **data referensi taksonomi visual, studi banding variasi morfologi global, dan kandidat data uji ketahanan (Out-of-Distribution / OOD testing)**.
3. **Data Latih Utama**: Pelatihan YOLO resmi hanya akan dibuka setelah data foto lapangan ortogonal dari TPI Karangantu, Teluk Banten tersedia dan dianotasi lengkap.

---
*Disusun secara independen oleh Tim Audit FishGuard AI — ASIK V, Universitas Pendidikan Indonesia.*
