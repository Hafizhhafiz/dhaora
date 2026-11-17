# FishGuard AI — Artificial Intelligence Fisheries Monitoring System
## Proyek Inovasi ASIK V — Universitas Pendidikan Indonesia (UPI) Kampus Serang
**Program Studi:** Sistem Informasi Kelautan (SIK)  
**Wilayah Studi:** Pelabuhan Perikanan Nusantara (PPN) Karangantu, Teluk Banten, Indonesia  
**Status Repositori:** **`CONDITIONALLY_READY_FOR_PILOT`** (Phase 11.7.2)  

---

## 1. Ringkasan Eksekutif & Ruang Lingkup MVP

FishGuard AI adalah platform computer vision dan data perikanan terpadu untuk pemantauan hasil tangkapan skala kecil (*small-scale fisheries*) di PPN Karangantu, Teluk Banten. Sistem mengintegrasikan modul deteksi spesies multi-kelas, pencacahan individu (*fish counting*), dan estimasi panjang total (*Total Length/TL*) berbasis kalibrasi metrik optik ArUco 50 mm.

### Tiga Spesies Target Utama MVP (Berdasarkan Data Pendaratan PIPP KKP 2026):
| Class ID | Nama Lokal | Nama Ilmiah Valid | Ordo / Famili | Volume Pendaratan PIPP | Karakteristik Utama |
|:---:|:---|:---|:---|:---:|:---|
| **0** | Kembung Perempuan | *Rastrelliger brachysoma* (Bleeker, 1851) | Scombridae | 33.305 kg (18,36%) | Tubuh sangat tinggi/bulat (*deep-body*, $TL/BD < 3.0$), sisir insang 56-61 |
| **1** | Selar Kuning | *Selaroides leptolepis* (Cuvier, 1833) | Carangidae | 19.902 kg (10,97%) | Pita kuning emas lebar membujur kontras, bercak operkulum gelap, 24-29 scute |
| **2** | Kuniran | *Upeneus sulphureus* Cuvier, 1829 | Mullidae | 23.838 kg (13,14%) | Sepasang sungut dagu kuning, dua garis lateral, sirip ekor polos tanpa garis silang |

*Akumulasi ketiga spesies pendaratan menyumbang 42,48% (77.045 kg) dari total 23 komoditas ikan di PPN Karangantu.*

---

## 2. Struktur Direktori Proyek Terintegrasi

```
c:/TUGAS-TUGAS KULIAH/SEMESTER 5/ASIK VOL VI/
├── Fishguard_AI/                     # [ARSIP UTAMA] Dokumentasi & Log Seluruh Percakapan
│   ├── README.md                     # Panduan master arsip percakapan
│   ├── conversation_logs/            # Log percakapan lengkap dari Phase 7 s.d. Phase 11.7.2
│   │   ├── 00_CONVERSATION_INDEX.md
│   │   ├── 01_MASTER_DEVELOPMENT_INITIATION.md s.d. 11_PHASE_11_7_2_...
│   │   └── FULL_CONVERSATION_CHRONICLE.md
│   ├── master_reports/               # Koleksi laporan resmi seluruh fase
│   └── raw_transcript/               # Rekaman asli machine-readable (transcript.jsonl)
├── backend/                          # Backend API FastAPI & Layanan Inferensi
│   ├── app/                          # Router, Schema Pydantic, dan Service
│   ├── weights/                      # Direktori bobot model (fishguard_yolo.pt - MODEL_NOT_TRAINED)
│   ├── run.py                        # Uvicorn runner
│   └── requirements.txt
├── frontend/                         # Antarmuka Pengguna SPA (React + Vite + Tailwind)
│   ├── src/pages/                    # Dashboard, Detection, Counting, Measurement, History
│   └── package.json
├── dataset_pipeline/                 # Pipeline Manajemen & Pelaporan Dataset
│   ├── metadata/                     # species_reference.csv, dataset_master.csv (183 citra)
│   ├── templates/                    # field_data_collection_template.csv (reconciled)
│   ├── scripts/                      # Skrip validasi, kalkulator FoV, audit taksonomi
│   │   ├── camera_fov_calculator.py  # Kalkulator optik dan evaluasi FoV horizontal
│   │   ├── run_phase11_7_1_validation.py
│   │   └── generate_phase11_7_2_artifacts.py
│   └── reports/                      # Laporan audit per fase (phase_11_6, 11_7, 11_7_1, 11_7_2)
├── documentation/                    # Dokumentasi Ilmiah & Protokol Lapangan
│   ├── field_sampling_sop.md         # SOP pengambilan foto tegak lurus 90 derajat
│   ├── biometric_measurement_protocol.md
│   ├── specimen_identification_protocol.md
│   ├── aruco_physical_validation_protocol.md
│   ├── image_quality_acceptance_criteria.md
│   └── phase_11_7_2_preflight_audit_report.md
└── yolov8n.pt                        # Baseline weights pre-trained Ultralytics
```

---

## 3. Hasil Validasi Pra-Penerbangan & Kesiapan Pilot (Phase 11.7.2)
- **Koreksi Geometri FoV Kamera:** Ketinggian rig kamera untuk lensa prime 35mm (sensor APS-C) wajib diatur pada jarak **$H = 90,0	ext{ cm} \pm 1,0	ext{ cm}$** dari papan ukur agar menghasilkan bidang pandang horizontal **$60,4	ext{ cm}$** (mencakup utuh papan ukur 50 cm + marker ArUco + margin aman).
- **Deteksi ArUco OpenCV:** Menggunakan `DICT_4X4_50` ukuran 50 mm, wajib dicetak dengan batas putih keliling (*quiet zone*) minimal **$10	ext{ mm}$**.
- **Pemberantasan Data Leakage:** Algoritma partisi train/val/test dikunci berbasis `specimen_id` unik menggunakan `GroupShuffleSplit` (terbukti $0,00\%$ kebocoran spesimen).
- **Model Training:** Tetap ditangguhkan (`MODEL_NOT_TRAINED`) hingga data primer spesimen fisik dari TPI Karangantu berhasil dikumpulkan secara sah.

---

## 4. Panduan Menjalankan Sistem

### Menjalankan Backend (FastAPI):
```powershell
cd "c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\backend"
python run.py
# Server aktif di http://localhost:8000 (Swagger docs di http://localhost:8000/docs)
```

### Menjalankan Frontend (React Vite):
```powershell
cd "c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\frontend"
npm run dev
# Aplikasi aktif di http://localhost:5173
```

### Menjalankan Kalkulator FoV Kamera:
```powershell
python "c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\dataset_pipeline\scripts\camera_fov_calculator.py"
```

---
*FishGuard AI — Dikembangkan oleh Tim Mahasiswa dan Peneliti Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
