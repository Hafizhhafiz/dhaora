# PHASE 11.7.4 — TASKS & EXECUTION TRACKER

| Task ID | Deskripsi Tugas | Pemilik (*Owner*) | Status | Kriteria Penerimaan | Bukti / Output |
|:---:|:---|:---:|:---:|:---|:---|
| **11.7.4-T1** | Penyusunan Protokol Pilot Spesimen Lengkap | AI Specialist | **COMPLETED / VERIFIED** | Protokol mencakup penanganan, positioning, sekuens foto, dan pengukuran TL/FL/SL | `PILOT_PROTOCOL.md` |
| **11.7.4-T2** | Penyusunan Template Metadata Spesimen | Data Engineer | **COMPLETED / VERIFIED** | Template CSV mencakup ID unik, taksonomi, verifikator, dan metadata kamera | `metadata/specimens_template.csv` |
| **11.7.4-T3** | Penyusunan Template Pengukuran Manual Ganda | Biometric Lead | **COMPLETED / VERIFIED** | Template mencakup pencatatan 2 pengamat untuk TL, FL, SL | `measurements/manual_measurements_template.csv` |
| **11.7.4-T4** | Skrip QC & Ingestion Citra Otomatis | AI Engineer | **COMPLETED / VERIFIED** | Skrip memvalidasi blur, exposure, integritas Exif, dan ArUco | `tools/qc_ingest_pilot.py` |
| **11.7.4-T5** | Eksekusi Akuisisi Spesimen Fisik di Lab | Human Operator | **BLOCKED (PENDING SPECIMENS)** | 30–45 spesimen fisik dipotret sesuai SOP | Menunggu tindakan manusia di lab |
| **11.7.4-T6** | Pengukuran Manual Inter-Observer Pengamat 1 & 2 | Human Operator | **BLOCKED (PENDING SPECIMENS)** | 10+ spesimen diukur oleh 2 orang | Menunggu tindakan manusia di lab |
| **11.7.4-T7** | Pelaporan Kualitas Akuisisi & Evaluasi Perbaikan | AI + Human | **PLANNED** | Waktu per spesimen dan evaluasi protokol | `ACQUISITION_QUALITY_REPORT.md` |
