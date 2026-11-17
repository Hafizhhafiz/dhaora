# FISHGUARD AI — DATASET REGISTER
**Pencatatan Master Inventaris Dataset, Provenance, Lisensi, dan Hash SHA-256**

---

## 1. Ringkasan Inventaris Dataset Proyek

| Kategori Dataset | Subdirektori Penyimpanan | Volume & Format | Status Penggunaan | Lisensi & Pembatasan |
|---|---|---|---|---|
| **Public Clean Reference Dataset** | `dataset_pipeline/public_reference_images/` | 30 citra JPEG/PNG (10 C0, 10 C1, 10 C2) + 1 karantina | Validated Taxonomic Benchmark | CC-BY, CC-BY-NC, CC BY-NC-SA (Academic Research Only) |
| **Extracted Fish Sprites (RGBA)** | `dataset_pipeline/data/sprites/` | 30 file PNG RGBA transparan (10 C0, 10 C1, 10 C2) | Bahan baku komposisi multi-ikan | Turunan langsung citra referensi bersih |
| **Synthetic Multi-Species YOLO Dataset** | `dataset_pipeline/data/synthetic_multispecies/` | 125 citra (100 train, 25 val) + 125 anotasi YOLO `.txt` + `dataset.yaml` | Training & evaluasi detektor multi-ikan sintetik | Prosedural internal FishGuard AI |
| **Controlled Specimen Pilot Dataset** | `PHASES/PHASE_11_7_4/data/` | Menunggu pelaksanaan pilot fisik | Target: 10–15 spesimen per kelas | Data primer mandiri |
| **Field Landing Catch Dataset** | `dataset_pipeline/data/field/` | Menunggu perizinan & sampling Karangantu | Data primer akhir pendaratan TPI | Data primer mandiri UPI Kampus Serang |
| **Historical GBIF Occurrence Records** | `dataset_pipeline/reports/phase_10/` | 207 raw occurrence records | Referensi taksonomi & distribusi | CC0, CC-BY, CC-BY-NC (Eksklusi dari training primer) |

---

## 2. Rincian Citra Referensi Bersih (30 Citra Spesimen Terverifikasi)

### Class 0: *Rastrelliger brachysoma* (Kembung Perempuan) — 10 Citra
- `FG-C0-006`: FishBase user photo (1024x768), CC-BY (label)
- `FG-C0-008`: FishBase user photo (640x480), CC-BY (label)
- `FG-C0-011`: FishBase user photo (2048x1365), CC-BY (label)
- `FG-C0-012`: FishBase user photo (1536x2048), CC-BY (label)
- `FG-C0-013`: FishBase user photo (1647x1365), CC-BY (label)
- `FG-C0-014`: FishBase user photo (2048x942), CC-BY (label)
- `FG-C0-015`: FishBase user photo (2048x1536), CC-BY (label)
- `FG-C0-016`: FishBase user photo (2020x2048), CC-BY (label)
- `FG-C0-017`: FishBase user photo (2048x2048), CC-BY (label)
- `FG-C0-018`: Wikimedia Commons / W.A. Djatmiko (4608x3456), CC BY-SA 3.0

### Class 1: *Selaroides leptolepis* (Selar Kuning) — 10 Citra Bersih (+1 Karantina)
- `FG-C1-007`: FishBase user photo (1459x656), CC-BY (label)
- `FG-C1-017`: FishBase user photo (585x266), CC-BY (label)
- `FG-C1-019`: **DIKARANTINA** (Foto bawah air Tulamben Bali, tidak digunakan)
- `FG-C1-020`: FishBase user photo (714x329), CC-BY (label)
- `FG-C1-021`: FishBase user photo (683x325), CC-BY (label)
- `FG-C1-022`: FishBase user photo (662x359), CC-BY (label)
- `FG-C1-026`: FishBase user photo (2755x1221), CC-BY (label)
- `FG-C1-028`: FishBase user photo (2917x2331), CC-BY (label)
- `FG-C1-029`: FishBase user photo (1487x873), CC-BY (label)
- `FG-C1-031`: iNaturalist / user observation (4608x3456), CC-BY-NC
- `FG-C1-032`: iNaturalist / user observation (4608x3456), CC-BY-NC

### Class 2: *Upeneus sulphureus* (Kuniran) — 10 Citra Bersih (Lulus Uiblein et al. 2025)
- `FG-C2-010`: FishBase user photo (2801x1168), CC-BY (label) — Eriyad, Kerala, India
- `FG-C2-011`: FishBase user photo (4314x2475), CC-BY-NC (label) — Probolinggo, Jawa Timur, Indonesia
- `FG-C2-012`: FishBase user photo (4272x2848), CC-BY (label) — Viet Nam
- `FG-C2-013`: FishBase user photo (3299x2473), CC-BY (label) — Ranong, Thailand
- `FG-C2-014`: FishBase user photo (1688x1266), CC-BY (label) — Phang Nga, Thailand
- `FG-C2-019`: Fishes of Australia / FiMSeA (1020x678), CC BY — Mekong Delta
- `FG-C2-020`: Fishes of Australia / Smithsonian USNM (2500x1663), CC BY-NC-SA — Cubao Market, Manila
- `FG-C2-021`: Fishes of Australia / Smithsonian USNM (2500x1663), CC BY-NC-SA — Cubao Market, Manila
- `FG-C2-022`: Fishes of Australia / Smithsonian USNM (2500x1663), CC BY-NC-SA — Cubao Market, Manila
- `FG-C2-023`: Fishes of Australia / CSIRO ANFC (654x435), CC BY-NC — Australia

---

## 3. Dataset Sintetis Multi-Spesies YOLO (`synthetic_multispecies`)
- **Struktur Direktori:**
  - `images/train/`: 100 citra (resolusi 1280x960, format JPEG)
  - `images/val/`: 25 citra (resolusi 1280x960, format JPEG)
  - `labels/train/`: 100 file anotasi bounding box YOLO ternormalisasi
  - `labels/val/`: 25 file anotasi bounding box YOLO ternormalisasi
  - `dataset.yaml`: Konfigurasi resmi YOLO (names: 0 *R. brachysoma*, 1 *S. leptolepis*, 2 *U. sulphureus*)
- **Substrat Latar Belakang:**
  - `stainless`: Meja perikanan *brushed stainless steel* dengan gradien kilap
  - `blue_crate`: Krat/keranjang pendaratan HDPE biru tua dengan rusuk kotak
  - `wood_board`: Talenan/papan kayu basah
  - `ice`: Hamparan kristal es pendingin pendaratan
