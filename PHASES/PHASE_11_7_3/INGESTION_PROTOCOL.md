# PHASE 11.7.3 — INGESTION & STORAGE PROTOCOL
**Protokol Penamaan File, Skema Metadata Sidecar, dan Prosedur Backup Ganda**

---

## 1. Konvensi Penamaan Citra Baku (*File Naming Convention*)

Setiap file citra mentah dari rig wajib mengikuti format terstruktur:
```
FG_<SESSION_ID>_<SPECIMEN_ID>_<ANGLE>_<LIGHTING>_<BURST>.<EXT>
```
Contoh:
- `FG_20261120_C0_001_LAT_L1_01.JPG` (Sesi 20 Nov 2026, Spesimen Class 0 #001, Pandangan Lateral, Pencahayaan 45°, Tembakan ke-1).
- `FG_20261120_CALIB_START_01.JPG` (Citra kalibrasi pembuka sesi).

### Kode Nilai:
- `CLASS_ID`: `C0` (*R. brachysoma*), `C1` (*S. leptolepis*), `C2` (*U. sulphureus*), `OOD` (Non-target).
- `ANGLE`: `LAT` (Lateral kiri datar), `LATR` (Lateral kanan), `DOR` (Dorsal), `OBL` (Oblik 15°).
- `LIGHTING`: `L1` (LED Diffuse normal), `L2` (Diffuse redup), `L3` (Glare stress test).

---

## 2. Skema Metadata Sidecar (`.json`)
Setiap file citra didampingi file JSON dengan nama identik (`FG_..._01.json`):
```json
{
  "image_id": "FG_20261120_C0_001_LAT_L1_01",
  "filename": "FG_20261120_C0_001_LAT_L1_01.JPG",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "session_id": "SES_20261120_LAB01",
  "timestamp": "2026-11-20T09:30:15Z",
  "specimen_id": "SPEC_C0_001",
  "target_class": 0,
  "scientific_name": "Rastrelliger brachysoma",
  "species_verified_by": "Dr. Ichthyologist UPI",
  "verification_method": "Morphometric & Gill Raker Key (58 rakers, TL/BD 2.8)",
  "rig_height_cm": 90.0,
  "lens_focal_length_mm": 35.0,
  "aperture": "f/5.6",
  "shutter_speed": "1/160s",
  "iso": 200,
  "calibration_id": "CALIB_20261120_START",
  "mm_per_pixel": 0.25014,
  "manual_measurements_mm": {
    "total_length_tl": 182.4,
    "fork_length_fl": 165.2,
    "standard_length_sl": 151.0,
    "observer_1": "Observer A",
    "observer_2": "Observer B"
  }
}
```

---

## 3. Protokol Pencadangan Ganda (*Dual Backup Protocol*)
1. **Copy 1 (Lokal):** Disimpan di drive penyimpanan lokal workstation laboratorium: `data/primary_storage/`.
2. **Copy 2 (Arsip Eksternal):** Disinkronisasi ke drive eksternal terpisah (SSD portable tahan guncangan) setiap akhir sesi sampling: `data/external_backup/`.
3. **Verifikasi Hash:** Skrip otomatis memverifikasi kecocokan hash SHA-256 antara Copy 1 dan Copy 2 sebelum kartu memori kamera diformat ulang.
