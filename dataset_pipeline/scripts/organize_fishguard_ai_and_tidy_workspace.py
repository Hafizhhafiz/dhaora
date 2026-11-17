import os
import shutil
import json
import re

root_dir = r'.'
fishguard_dir = os.path.join(root_dir, 'Fishguard_AI')
conv_dir = os.path.join(fishguard_dir, 'conversation_logs')
reports_dir = os.path.join(fishguard_dir, 'master_reports')
raw_dir = os.path.join(fishguard_dir, 'raw_transcript')

os.makedirs(conv_dir, exist_ok=True)
os.makedirs(reports_dir, exist_ok=True)
os.makedirs(raw_dir, exist_ok=True)

print("1. Copying raw machine transcript...")
src_transcript = r'C:\Users\LENOVO\.gemini\antigravity\brain\1821bbab-266e-4c8e-906a-d330fe458ae0\.system_generated\logs\transcript.jsonl'
dst_transcript = os.path.join(raw_dir, 'transcript.jsonl')
if os.path.exists(src_transcript):
    shutil.copy2(src_transcript, dst_transcript)
    print(f"Copied raw transcript -> {dst_transcript}")

with open(os.path.join(raw_dir, 'README.md'), 'w', encoding='utf-8') as f:
    f.write("""# PROVENANCE RECORD: RAW CONVERSATION TRANSCRIPT
Berkas `transcript.jsonl` di direktori ini merupakan salinan langsung dari rekaman sistem mesin Antigravity AI (`.system_generated/logs/transcript.jsonl`).
Memuat seluruh riwayat interaksi, jejak tool calls, timestamp ISO 8601, status eksekusi perintah, dan respons asisten sejak awal inisiasi proyek FishGuard AI hingga fase terkini (Phase 11.7.2).
""")

print("2. Parsing full transcript to build conversation chronicle...")
src_full_transcript = r'C:\Users\LENOVO\.gemini\antigravity\brain\1821bbab-266e-4c8e-906a-d330fe458ae0\.system_generated\logs\transcript_full.jsonl'
active_transcript = src_full_transcript if os.path.exists(src_full_transcript) else src_transcript

dialogues = []
current_user = None
current_time = ""
current_response = ""

with open(active_transcript, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        t = data.get('type')
        if t == 'USER_INPUT':
            if current_user is not None:
                dialogues.append({
                    'user': current_user,
                    'timestamp': current_time,
                    'response': current_response
                })
            current_user = data.get('content', '')
            current_time = data.get('created_at', '')
            current_response = ''
        elif t == 'PLANNER_RESPONSE':
            c = data.get('content', '')
            if c:
                current_response = c

if current_user is not None:
    dialogues.append({
        'user': current_user,
        'timestamp': current_time,
        'response': current_response
    })

print(f"Parsed {len(dialogues)} dialogue sessions.")

# Build FULL_CONVERSATION_CHRONICLE.md
chronicle_file = os.path.join(conv_dir, 'FULL_CONVERSATION_CHRONICLE.md')
with open(chronicle_file, 'w', encoding='utf-8') as f:
    f.write("# KRONOLOGI LENGKAP PERCAKAPAN FISHGUARD AI — ASIK V\n")
    f.write("## Arsip Lengkap Dialog, Perintah, Analisis & Laporan Fase\n")
    f.write("**Workspace:** `c:\\TUGAS-TUGAS KULIAH\\SEMESTER 5\\ASIK VOL VI`\n")
    f.write("**Tanggal Ekspor:** 16 November 2026\n\n")
    f.write("---\n\n")
    
    for idx, d in enumerate(dialogues, 1):
        clean_user = d['user']
        # Clean user tags
        clean_user = re.sub(r'<USER_REQUEST>\s*', '', clean_user)
        clean_user = re.sub(r'\s*</USER_REQUEST>', '', clean_user)
        clean_user = re.sub(r'<ADDITIONAL_METADATA>[\s\S]*?</ADDITIONAL_METADATA>', '', clean_user).strip()
        
        first_line = clean_user.split('\n')[0].replace('#', '').strip()
        if not first_line:
            first_line = f"Sesi Dialog {idx}"
            
        f.write(f"## DIALOG {idx:02d}: {first_line}\n")
        f.write(f"**Waktu:** `{d['timestamp']}`\n\n")
        f.write("### Permintaan / Instruksi Pengguna:\n```text\n")
        f.write(clean_user + "\n```\n\n")
        
        f.write("### Ringkasan & Respons Asisten AI:\n\n")
        if d['response']:
            f.write(d['response'].strip() + "\n\n")
        else:
            f.write("*(Tahap eksekusi perintah / tugas teknis latar belakang)*\n\n")
        f.write("---\n\n")

print(f"Generated {chronicle_file}")

# 3. Build phase-specific conversation logs
phase_mappings = [
    {
        'file': '01_MASTER_DEVELOPMENT_INITIATION.md',
        'title': 'Inisiasi Proyek & Arsitektur Sistem MVP',
        'turns': [0, 1],
        'desc': 'Audit fondasi workspace, instalasi dependensi FastAPI & Vite, pembuatan skema Pydantic, database SQLite, dan baseline YOLOv8n.'
    },
    {
        'file': '02_PHASE_7_TECHNICAL_AUDIT.md',
        'title': 'Phase 7 — Deep Technical Audit & Scientific Validation',
        'turns': [2],
        'desc': 'Audit kejujuran status dataset (0 citra riil), verifikasi ketiadaan bobot custom, dan pengujian end-to-end API.'
    },
    {
        'file': '03_PHASE_8_DATASET_PIPELINE.md',
        'title': 'Phase 8 — Dataset Acquisition & Management Preparation',
        'turns': [3, 4],
        'desc': 'Penyusunan dataset pipeline, isolasi split bebas kebocoran, verifikasi dataset publik, dan metadata master katalog.'
    },
    {
        'file': '04_PHASE_9_PUBLIC_DATASET_DEEPFISH.md',
        'title': 'Phase 9 — Public Dataset Acquisition (DeepFish Zenodo)',
        'turns': [5, 6, 7, 8],
        'desc': 'Akuisisi dataset publik DeepFish Zenodo, inspeksi citra bawah air, domain gap analysis, dan evaluasi kelayakan.'
    },
    {
        'file': '05_PHASE_10_GBIF_ACQUISITION.md',
        'title': 'Phase 10 — GBIF Occurrence Acquisition & Optical Curation',
        'turns': [9, 10],
        'desc': 'Pengunduhan 175 kandidat citra spesimen GBIF (R. kanagurta dan D. macarellus), audit lisensi Creative Commons, dan triage optik.'
    },
    {
        'file': '06_PHASE_10_1_INTEGRITY_AUDIT.md',
        'title': 'Phase 10.1 — Dataset Integrity Audit & Status Update',
        'turns': [11, 12],
        'desc': 'Penurunan status VERIFIED menjadi PRIORITY_CANDIDATE dan METADATA_SCREENED untuk mencegah klaim verifikasi taksonomi prematur.'
    },
    {
        'file': '07_PHASE_11_PREFIELD_AND_PRIORITIZATION.md',
        'title': 'Phase 11 — Pre-Field Prep & Local Species Prioritization',
        'turns': [13, 14],
        'desc': 'Analisis data produksi pendaratan PIPP KKP 2026 di PPN Karangantu, pembobotan multi-kriteria 23 spesies, dan pivot menuju 3 kelas target MVP.'
    },
    {
        'file': '08_PHASE_11_6_SCIENTIFIC_INTEGRITY_CLOSURE.md',
        'title': 'Phase 11.6 — Scientific & Data Integrity Closure',
        'turns': [15, 16, 17],
        'desc': 'Rekonsiliasi aritmetika PIPP (+1.468 kg), penanganan status UNRESOLVED grafik vs tabel, revalidasi WoRMS 23 spesies, koreksi Equulites berbis, dan harmonisasi species_reference.csv.'
    },
    {
        'file': '09_PHASE_11_7_FIELD_SAMPLING_PREPARATION.md',
        'title': 'Phase 11.7 — Field Sampling Preparation & Pilot Validation',
        'turns': [18],
        'desc': 'SOP rig kamera 90 derajat, sistem ID spesimen anti-leakage, protokol biometrik 6 keypoint, kalibrasi ArUco 50 mm, dan penetapan status READY_FOR_PILOT.'
    },
    {
        'file': '10_PHASE_11_7_1_LAB_DRY_RUN.md',
        'title': 'Phase 11.7.1 — Laboratory Dry Run & Pre-Pilot Validation',
        'turns': [19],
        'desc': 'Stress-test OpenCV ArUco, penemuan kegagalan flush-cut & kewajiban margin 10mm, pembuktian 0.0% data leakage GroupShuffleSplit, dan status CONDITIONALLY_READY_FOR_PILOT.'
    },
    {
        'file': '11_PHASE_11_7_2_PHYSICAL_PREFLIGHT_VERIFICATION.md',
        'title': 'Phase 11.7.2 — Physical Pre-Flight Verification & Pilot Execution Readiness',
        'turns': [20],
        'desc': 'Koreksi matematis kritis camera FoV (ketinggian rig direvisi ke 90 cm), kalkulator optik camera_fov_calculator.py, dan 10 gerbang kelulusan Go/No-Go pilot.'
    }
]

for p in phase_mappings:
    p_path = os.path.join(conv_dir, p['file'])
    with open(p_path, 'w', encoding='utf-8') as f:
        f.write(f"# DOKUMENTASI PERCAKAPAN: {p['title'].upper()}\n")
        f.write(f"**Ringkasan Fase:** {p['desc']}\n\n")
        f.write("---\n\n")
        for t_idx in p['turns']:
            if t_idx < len(dialogues):
                d = dialogues[t_idx]
                clean_user = d['user']
                clean_user = re.sub(r'<USER_REQUEST>\s*', '', clean_user)
                clean_user = re.sub(r'\s*</USER_REQUEST>', '', clean_user)
                clean_user = re.sub(r'<ADDITIONAL_METADATA>[\s\S]*?</ADDITIONAL_METADATA>', '', clean_user).strip()
                f.write(f"## Interaksi Dialog (Sesi {t_idx+1})\n")
                f.write(f"**Timestamp:** `{d['timestamp']}`\n\n")
                f.write("### Perintah Pengguna:\n```text\n")
                f.write(clean_user + "\n```\n\n")
                f.write("### Hasil Pelaksanaan & Jawaban Asisten:\n\n")
                if d['response']:
                    f.write(d['response'].strip() + "\n\n")
                else:
                    f.write("*(Proses komputasi / eksekusi skrip background terlaksana)*\n\n")
                f.write("---\n\n")
    print(f"Generated {p_path}")

# Build 00_CONVERSATION_INDEX.md
index_file = os.path.join(conv_dir, '00_CONVERSATION_INDEX.md')
with open(index_file, 'w', encoding='utf-8') as f:
    f.write("""# INDEKS ARSIP PERCAKAPAN FISHGUARD AI — ASIK V

Arsip ini mendokumentasikan seluruh riwayat percakapan, instruksi riset, audit teknis, komputasi visi komputer, dan pelaporan ilmiah proyek FishGuard AI sejak inisiasi awal hingga persiapan eksekusi pilot sampling di PPN Karangantu.

## Daftar Berkas Log Percakapan per Fase:

1. [01_MASTER_DEVELOPMENT_INITIATION.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/01_MASTER_DEVELOPMENT_INITIATION.md) — Inisiasi arsitektur FastAPI, Vite, skema database, dan YOLO baseline.
2. [02_PHASE_7_TECHNICAL_AUDIT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/02_PHASE_7_TECHNICAL_AUDIT.md) — Audit mendalam integritas teknis dan validasi ilmiah.
3. [03_PHASE_8_DATASET_PIPELINE.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/03_PHASE_8_DATASET_PIPELINE.md) — Pembangunan dataset pipeline dan mitigasi kebocoran data.
4. [04_PHASE_9_PUBLIC_DATASET_DEEPFISH.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/04_PHASE_9_PUBLIC_DATASET_DEEPFISH.md) — Akuisisi dan evaluasi domain gap dataset DeepFish Zenodo.
5. [05_PHASE_10_GBIF_ACQUISITION.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/05_PHASE_10_GBIF_ACQUISITION.md) — Akuisisi 175 spesimen GBIF Occurrence API dan audit lisensi.
6. [06_PHASE_10_1_INTEGRITY_AUDIT.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/06_PHASE_10_1_INTEGRITY_AUDIT.md) — Audit integritas taksonomi dan pembaruan status ke PRIORITY_CANDIDATE.
7. [07_PHASE_11_PREFIELD_AND_PRIORITIZATION.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/07_PHASE_11_PREFIELD_AND_PRIORITIZATION.md) — Analisis data pendaratan PIPP 2026 dan pivot ke 3 kelas MVP target.
8. [08_PHASE_11_6_SCIENTIFIC_INTEGRITY_CLOSURE.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/08_PHASE_11_6_SCIENTIFIC_INTEGRITY_CLOSURE.md) — Rekonsiliasi aritmetika PIPP (+1.468 kg) dan revalidasi taksonomi WoRMS 23 spesies.
9. [09_PHASE_11_7_FIELD_SAMPLING_PREPARATION.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/09_PHASE_11_7_FIELD_SAMPLING_PREPARATION.md) — Penyusunan SOP rig kamera 90°, biometrik 6 keypoint, dan penetapan READY_FOR_PILOT.
10. [10_PHASE_11_7_1_LAB_DRY_RUN.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/10_PHASE_11_7_1_LAB_DRY_RUN.md) — Uji OpenCV ArUco, penemuan kegagalan flush-cut, dan bukti 0% data leakage.
11. [11_PHASE_11_7_2_PHYSICAL_PREFLIGHT_VERIFICATION.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/11_PHASE_11_7_2_PHYSICAL_PREFLIGHT_VERIFICATION.md) — Koreksi matematis camera FoV (H=90cm) dan 10 gerbang kelulusan Go/No-Go pilot.
12. [FULL_CONVERSATION_CHRONICLE.md](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/Fishguard_AI/conversation_logs/FULL_CONVERSATION_CHRONICLE.md) — Transkrip utuh kronologis seluruh percakapan.
""")
print(f"Generated {index_file}")

# 4. Copy master reports
print("4. Consolidating master reports into Fishguard_AI/master_reports...")
reports_map = [
    ('documentation/PHASE_7_AUDIT.md', '01_PHASE_7_AUDIT.md'),
    ('documentation/PHASE_8_DATASET_REPORT.md', '02_PHASE_8_DATASET_REPORT.md'),
    ('documentation/PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md', '03_PHASE_9_PUBLIC_DATASET_ACQUISITION_REPORT.md'),
    ('documentation/phase_10_dataset_acquisition_report.md', '04_phase_10_dataset_acquisition_report.md'),
    ('documentation/phase_10_1_integrity_audit_report.md', '05_phase_10_1_integrity_audit_report.md'),
    ('documentation/phase_11_species_prioritization_report.md', '06_phase_11_species_prioritization_report.md'),
    ('documentation/phase_11_6_integrity_audit_report.md', '07_phase_11_6_integrity_audit_report.md'),
    ('documentation/phase_11_7_field_sampling_preparation_report.md', '08_phase_11_7_field_sampling_preparation_report.md'),
    ('documentation/phase_11_7_1_dry_run_report.md', '09_phase_11_7_1_dry_run_report.md'),
    ('documentation/phase_11_7_2_preflight_audit_report.md', '10_phase_11_7_2_preflight_audit_report.md')
]

for src, dst_name in reports_map:
    if os.path.exists(src):
        dst = os.path.join(reports_dir, dst_name)
        shutil.copy2(src, dst)
        print(f"Copied {src} -> {dst}")

# 5. Build Fishguard_AI/README.md
fishguard_readme = os.path.join(fishguard_dir, 'README.md')
with open(fishguard_readme, 'w', encoding='utf-8') as f:
    f.write("""# FishGuard AI — Master Archive & Conversation Logs
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
│   └── 10_phase_11_7_2_preflight_audit_report.md
└── raw_transcript/                # Provenance data mesin Antigravity
    ├── transcript.jsonl
    └── README.md
```

---

## 2. Status Terkini Sistem FishGuard AI
- **Status Operasional:** `CONDITIONALLY_READY_FOR_PILOT` (Telah lolos pengujian perangkat lunak, OpenCV ArUco, anti-data leakage 0.0%, dan koreksi geometrik FoV; menunggu verifikasi pra-penerbangan fisik di laboratorium kampus).
- **Target Spesies MVP (Terkunci):**
  - **Class 0:** *Rastrelliger brachysoma* (Kembung Perempuan)
  - **Class 1:** *Selaroides leptolepis* (Selar Kuning)
  - **Class 2:** *Upeneus sulphureus* (Kuniran)
- **Koreksi Kritis Rig Kamera:** Jarak kerja kamera untuk lensa 35mm sensor APS-C telah direvisi dari 50 cm menjadi **90 cm** agar mencakup penuh papan ukur 50 cm + marker ArUco (FoV horizontal 60,4 cm).
- **Model YOLO:** Berstatus `MODEL_NOT_TRAINED` (Dilarang melatih model sebelum dataset spesimen riil TPI Karangantu terkumpul).
""")
print(f"Generated {fishguard_readme}")

# 6. Update root ASIK VOL VI / README.md
root_readme = os.path.join(root_dir, 'README.md')
with open(root_readme, 'w', encoding='utf-8') as f:
    f.write("""# FishGuard AI — Artificial Intelligence Fisheries Monitoring System
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
- **Koreksi Geometri FoV Kamera:** Ketinggian rig kamera untuk lensa prime 35mm (sensor APS-C) wajib diatur pada jarak **$H = 90,0\text{ cm} \pm 1,0\text{ cm}$** dari papan ukur agar menghasilkan bidang pandang horizontal **$60,4\text{ cm}$** (mencakup utuh papan ukur 50 cm + marker ArUco + margin aman).
- **Deteksi ArUco OpenCV:** Menggunakan `DICT_4X4_50` ukuran 50 mm, wajib dicetak dengan batas putih keliling (*quiet zone*) minimal **$10\text{ mm}$**.
- **Pemberantasan Data Leakage:** Algoritma partisi train/val/test dikunci berbasis `specimen_id` unik menggunakan `GroupShuffleSplit` (terbukti $0,00\%$ kebocoran spesimen).
- **Model Training:** Tetap ditangguhkan (`MODEL_NOT_TRAINED`) hingga data primer spesimen fisik dari TPI Karangantu berhasil dikumpulkan secara sah.

---

## 4. Panduan Menjalankan Sistem

### Menjalankan Backend (FastAPI):
```powershell
cd "c:\\TUGAS-TUGAS KULIAH\\SEMESTER 5\\ASIK VOL VI\\backend"
python run.py
# Server aktif di http://localhost:8000 (Swagger docs di http://localhost:8000/docs)
```

### Menjalankan Frontend (React Vite):
```powershell
cd "c:\\TUGAS-TUGAS KULIAH\\SEMESTER 5\\ASIK VOL VI\\frontend"
npm run dev
# Aplikasi aktif di http://localhost:5173
```

### Menjalankan Kalkulator FoV Kamera:
```powershell
python "c:\\TUGAS-TUGAS KULIAH\\SEMESTER 5\\ASIK VOL VI\\dataset_pipeline\\scripts\\camera_fov_calculator.py"
```

---
*FishGuard AI — Dikembangkan oleh Tim Mahasiswa dan Peneliti Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
""")
print(f"Updated {root_readme}")

print("\nSUCCESS: ASIK VOL VI folder tidied up and Fishguard_AI master archive created perfectly!")
