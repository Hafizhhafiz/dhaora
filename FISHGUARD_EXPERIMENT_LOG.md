# FISHGUARD AI — EXPERIMENT LOG
**Catatan Riwayat Eksperimen Pelatihan Model, Parameter, Seed, dan Hasil Evaluasi**

| Run ID | Tanggal | Versi Dataset | Arsitektur Model | Input Res | Epochs | Batch | Seed | mAP50 (Val) | mAP50 (Test) | MAE Cacah | Status / Keterangan |
|:---:|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **EXP-000** | 2026-11-09 | Baseline COCO 80 Class | YOLOv8n (`yolov8n.pt`) | 640 | 0 (Pretrained) | - | - | N/A | N/A | N/A | Status `MODEL_NOT_TRAINED`. Model baseline COCO aktif di API tanpa kelas ikan spesifik. |
| **EXP-001** | 2026-11-17 | `fishguard_v001` (80 train, 20 val, 25 test) | YOLOv8n (`yolov8n.pt`) | 640 | 10 | 16 | 42 | **0.5160** | **0.3673** | **2.40** | Pelatihan baseline 3 kelas MVP (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*). mAP50-95 val: 0.2827. FPR OOD @0.50: 61.58% (N=177). Bobot diekspor ke `backend/weights/fishguard_yolo.pt`. |
| **EXP-002** | *PLANNED* | Primary Field Dataset (Phase 11.7.4 spesimen riil) | YOLOv8s / YOLOv8n | 640/1280 | 100 | 16 | 42 | *Pending* | *Pending* | *Pending* | Pelatihan resmi model target domain pendaratan PPN Karangantu pasca akuisisi spesimen fisik. |

*Catatan Integritas Ilmiah: Sesuai Golden Rule #1 & #3, dilarang mencatat nilai metrik buatan atau mengklaim model tervalidasi sebelum proses training dan evaluasi test set independen dieksekusi secara nyata. Hasil EXP-001 di atas mencerminkan data aktual 10-epoch baseline.*
