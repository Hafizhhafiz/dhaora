# FishGuard AI — Master Archive & Conversation Logs
## ASIK V — Program Studi Sistem Informasi Kelautan (SIK), UPI Kampus Serang

Selamat datang di folder repositori utama **Fishguard_AI** di dalam workspace **ASIK VOL VI**.
Folder ini mendokumentasikan secara lengkap seluruh riwayat percakapan, instruksi, audit teknis, analisis komputasi visi komputer, data pendaratan PIPP Karangantu, dan master report dari seluruh fase riset (Phase 7 hingga Phase 11.7.2).

---

## 1. Peta Direktori Folder `Fishguard_AI/`

```
Fishguard_AI/
├── README.md                      # Dokumentasi master folder ini
├── conversation_logs/             # Transkrip lengkap percakapan per fase
│   ├── 00_CONVERSATION_INDEX.md
│   ├── 01_MASTER_DEVELOPMENT_INITIATION.md
│   ├── 02_PHASE_7_TECHNICAL_AUDIT.md
│   ├── 03_PHASE_8_DATASET_PIPELINE.md
│   ├── 04_PHASE_9_PUBLIC_DATASET_DEEPFISH.md
│   ├── 05_PHASE_10_GBIF_ACQUISITION.md
│   ├── 06_PHASE_10_1_INTEGRITY_AUDIT.md
│   ├── 07_PHASE_11_PREFIELD_AND_PRIORITIZATION.md
│   ├── 08_PHASE_11_6_SCIENTIFIC_INTEGRITY_CLOSURE.md
│   ├── 09_PHASE_11_7_FIELD_SAMPLING_PREPARATION.md
│   ├── 10_PHASE_11_7_1_LAB_DRY_RUN.md
│   ├── 11_PHASE_11_7_2_PHYSICAL_PREFLIGHT_VERIFICATION.md
│   └── FULL_CONVERSATION_CHRONICLE.md
├── master_reports/                # Kumpulan laporan resmi seluruh fase
│   ├── 01_PHASE_7_AUDIT.md
│   ├── 02_PHASE_8_DATASET_REPORT.md
│   ├── 03_PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md
│   ├── 04_phase_10_dataset_acquisition_report.md
│   ├── 05_phase_10_1_integrity_audit_report.md
│   ├── 06_phase_11_species_prioritization_report.md
│   ├── 07_phase_11_6_integrity_audit_report.md
│   ├── 08_phase_11_7_field_sampling_preparation_report.md
│   ├── 09_phase_11_7_1_dry_run_report.md
│   ├── 10_phase_11_7_2_preflight_audit_report.md
│   ├── 11_phase_12_1_public_image_inventory_audit.md
│   ├── 12_phase_12_1_1_selective_acquisition_report.md
│   └── 13_phase_12_1_1_final_reconciliation_audit.md
├── fishguard_public_image_inventory.csv          # Input riset inventaris gambar publik (91 rows)
├── fishguard_download_priority.csv               # Input prioritas unduh gambar publik (80 rows)
├── fishguard_taxonomy_review.csv                 # Input review taksonomi gambar publik (83 rows)
├── fishguard_source_license_audit.csv            # Input audit lisensi sumber publik (15 rows)
├── fishguard_public_image_inventory_audited.csv  # Output rekonsiliasi audit lengkap Phase 12.1
├── public_reference_image_manifest.csv           # Manifest koleksi citra referensi publik (21 rows)
└── raw_transcript/                # Provenance data mesin Antigravity
    ├── transcript.jsonl
    └── README.md
```

---

## 2. Status Terkini Sistem FishGuard AI
- **Status Operasional:** `CONDITIONALLY_READY_FOR_PILOT` (Telah lolos pengujian perangkat lunak, OpenCV ArUco, anti-data leakage 0.0%, dan koreksi geometrik FoV; menunggu verifikasi pra-penerbangan fisik di laboratorium kampus).
- **Status Akuisisi & Audit Publik (Phase 12.1.1):** `COMPLETED` (Telah terekonsiliasi penuh: 20 citra referensi morfologi bersih [10 Class 0 + 10 Class 1], 1 citra karantina bawah air, 1 kegagalan server FishBase 0-byte, dan 10 kandidat Class 2 dipisahkan dan ditahan di TAXONOMY_REVIEW. Batasan mutlak: STRICT NO-GO untuk training model YOLO).
- **Roadmap Utama Selanjutnya (Physical Workstream):**
  - **Phase 11.7.3:** Laboratory Physical Rig Validation (Pengujian fisik rig 90 cm di laboratorium SIK UPI Kampus Serang).
  - **Phase 11.7.4:** Controlled Specimen Pilot (Sampling uji terkontrol 45 spesimen).
  - **Phase 11.7.5:** Pilot Data Integrity Audit.
  - **Phase 11.8:** Field Sampling Execution (Sampling penuh 450 spesimen di PPN Karangantu).
  - **Phase 12:** Master Dataset Construction & YOLO Preparation.
- **Target Spesies MVP (Terkunci):**
  - **Class 0:** *Rastrelliger brachysoma* (Kembung Perempuan)
  - **Class 1:** *Selaroides leptolepis* (Selar Kuning)
  - **Class 2:** *Upeneus sulphureus* (Kuniran)
- **Koreksi Kritis Rig Kamera:** Jarak kerja kamera untuk lensa 35mm sensor APS-C telah direvisi dari 50 cm menjadi **90 cm** agar mencakup penuh papan ukur 50 cm + marker ArUco (FoV horizontal 60,4 cm).
- **Model YOLO:** Berstatus `MODEL_NOT_TRAINED` (Dilarang melatih model sebelum dataset spesimen riil TPI Karangantu terkumpul).
