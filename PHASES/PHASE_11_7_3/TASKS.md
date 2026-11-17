# PHASE 11.7.3 — TASKS & EXECUTION TRACKER

| Task ID | Deskripsi Tugas | Pemilik (*Owner*) | Status | Kriteria Penerimaan | Bukti / Output Artefak |
|:---:|:---|:---:|:---:|:---|:---|
| **11.7.3-T0** | Status Reconstruction: audit bukti Phase 11.6 dan master baseline | AI Engineer | **COMPLETED / VERIFIED** | Bukti Phase 11.6 ditemukan lengkap di `reports/phase_11_6/`; status master progress diperbarui | `FISHGUARD_MASTER_PROGRESS.md` |
| **11.7.3-T1** | Hardware Inventory: template audit dan formulir spesifikasi fisik | AI + Human | **IN PROGRESS (AI Template Ready)** | Formulir spesifikasi lengkap; item fisik tercatat atau ditandai missing terencana | `HARDWARE_INVENTORY.md` |
| **11.7.3-T2** | Rig Specification: jarak kerja $H=90$ cm, FoV $\ge 60$ cm, sudut 90°, pencahayaan | AI (CV Lead) | **COMPLETED / VERIFIED** | Spesifikasi geometris matematis diverifikasi kalkulator optik | `RIG_SPEC.md` |
| **11.7.3-T3** | Calibration Procedure & OpenCV Tool: skrip `calibrate_scale.py` | AI (CV Lead) | **COMPLETED / VERIFIED** | Skrip berhasil mendeteksi ArUco DICT_4X4_50 dan menghitung mm/piksel | `tools/calibrate_scale.py`, `CALIBRATION_PROCEDURE.md` |
| **11.7.3-T4** | Stability Test Protocol: prosedur 5x re-mount & 10x tembakan eksposur | AI + Human | **COMPLETED (Protocol Ready, Physical Pending)** | Prosedur uji keterulangan terstandarisasi; simulasi lolos; uji fisik pending alat | `TEST_RESULTS.md` |
| **11.7.3-T5** | Measurement Consistency Test: uji objek referensi non-biologis | AI + Human | **COMPLETED (Synthetic Verified, Physical Pending)** | Error estimasi objek acuan $\le 2\%$; hasil simulasi tercatat transparan | `TEST_RESULTS.md`, `EVIDENCE/` |
| **11.7.3-T6** | Ingestion & Storage Protocol: format file, penamaan, metadata, backup | Data Engineer | **COMPLETED / VERIFIED** | Skema penamaan konsisten; format sidecar JSON terdefinisi; hashing SHA-256 | `INGESTION_PROTOCOL.md` |
| **11.7.3-T7** | Safety & Operational Readiness: listrik, lingkungan basah, sanitasi | Operational Lead | **COMPLETED / VERIFIED** | Checklist keselamatan lapangan tervalidasi | `SAFETY_CHECKLIST.md` |
| **11.7.3-T8** | Defects & Risk Register: identifikasi risiko optik rig dan mitigasi | Risk Lead | **COMPLETED / VERIFIED** | Risiko silau, deviasi fokus, dan paralaks terdokumentasi | `DEFECTS_AND_RISKS.md` |
| **11.7.3-T9** | Readiness Decision: Pernyataan kesiapan gerbang menuju Phase 11.7.4 | AI + Human [AG]| **CONDITIONALLY READY FOR PILOT** | Laporan akhir lengkap; menunggu persetujuan resmi manusia [AG] | `COMPLETION_REPORT.md` |
