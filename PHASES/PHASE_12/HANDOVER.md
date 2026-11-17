# PHASE 12 → PHASE 13 HANDOVER PROTOCOL
**Protokol Pengalihan Fase dari Konstruksi Dataset ke Pelatihan Baseline YOLO (Phase 13)**

---

## 1. Prasyarat Masuk (*Entry Conditions*) untuk Phase 13
- [x] Target metrik evaluasi telah dipre-registrasi secara resmi (DEC-006: mAP50 $\ge 0,85$, Precision/Recall $\ge 0,85$).
- [x] Dataset `datasets/fishguard_v001/` berstatus beku (*frozen*) dengan manifest SHA-256.
- [x] Test set (25 citra) diisolasi permanen dan dilarang digunakan untuk penyesuaian hiperparameter (*no tuning on test data*).
- [x] Konfigurasi `data.yaml` memetakan tepat 3 kelas target:
  - 0: *Rastrelliger brachysoma*
  - 1: *Selaroides leptolepis*
  - 2: *Upeneus sulphureus*
- [x] Subset OOD (177 citra non-target *R. kanagurta* & *D. macarellus*) siap untuk pengujian false-positive rate.

---

## 2. Rencana Eksekusi Phase 13
1. Mengunci *random seed* (42) dan konfigurasi pelatihan (`training_config.yaml`).
2. Menjalankan skrip pelatihan baseline Ultralytics YOLOv8n pada split train/val.
3. Melakukan evaluasi resmi satu kali pada frozen test set dan subset OOD.
4. Mengekspor bobot model terlatih (`fishguard_yolo.pt`) ke `backend/weights/`.
5. Membangun modul inferensi mandiri `inference/fishguard_infer.py`.
