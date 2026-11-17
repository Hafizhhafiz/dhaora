# PHASE 13 — YOLO BASELINE TRAINING & EVALUATION PLAN
**Status:** IN PROGRESS  
**Fase Pemilik:** AI Engineer, Computer Vision Specialist, Research Data Integrity Auditor  
**Tujuan Utama:** Melatih model deteksi baseline Ultralytics YOLOv8n pada dataset beku `datasets/fishguard_v001/`, mengevaluasi performa mAP50 dan per-class metrics secara independen pada frozen test set, menguji false-positive rate pada OOD set, dan mengekspor model terverifikasi ke `backend/weights/fishguard_yolo.pt`.

---

## 1. Rincian 10 Tugas Phase 13
1. **13-T0 Pre-registration Check:** Memastikan target metrik DEC-006 (mAP50 $\ge 0,85$, Prec/Rec $\ge 0,85$) telah disetujui [AG]. *(SELESAI)*
2. **13-T1 Environment & Hardware Lock:** Konfigurasi PyTorch CPU, seed=42, `training_config.yaml`.
3. **13-T2 Baseline Model Architecture:** Seleksi Ultralytics YOLOv8n (`yolov8n.pt`) sebagai arsitektur teringan dan tercepat untuk inferensi lokal.
4. **13-T3 Baseline Training Execution:** Pelatihan terkontrol pada 80 citra latih dan 20 citra validasi tanpa menyentuh test set.
5. **13-T4 Validation Metric Tracking:** Monitoring loss konvergensi (box_loss, cls_loss, dfl_loss) dan mAP50 val.
6. **13-T5 Independent Test Set Evaluation:** Evaluasi formal 1x pada 25 citra test independen (mAP50, mAP50-95, Precision, Recall, Confusion Matrix, Latensi ms).
7. **13-T6 OOD / False-Positive Generalization Test:** Evaluasi pada subset non-target (*R. kanagurta*, *D. macarellus*) untuk mengukur tingkat misklasifikasi.
8. **13-T7 Error Analysis & Failure Taxonomy:** Analisis visual kegagalan deteksi (false positive, false negative, batas oklusi).
9. **13-T8 Model Export & Inference Module:** Ekspor bobot terbaik ke `backend/weights/fishguard_yolo.pt` dan pembuatan `inference/fishguard_infer.py`.
10. **13-T9 Experiment Logging:** Pencatatan seluruh parameter dan metrik aktual ke `FISHGUARD_EXPERIMENT_LOG.md`.

---

## 2. Kriteria Penerimaan Phase 13
- Target metrik pra-registrasi: mAP50 $\ge 0,85$ pada test set independen.
- Tidak ada kebocoran data test ke dalam proses tuning/pelatihan.
- Seluruh angka metrik berasal dari output log latihan aktual (bukan perkiraan).
- Modul inferensi mandiri dapat dijalankan tanpa dependensi backend.
