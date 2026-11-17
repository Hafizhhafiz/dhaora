# PHASE 13 — HANDOVER DOCUMENT
**Serah Terima Hasil Pelatihan Baseline YOLOv8n ke Phase 14 & 15**  
**Tanggal:** 17 November 2026

---

## 1. Status Model untuk Konsumen Hilir
1. **Bobot Model:** Tersimpan di `backend/weights/fishguard_yolo.pt` (6.49 MB).
2. **Kesiapan Backend:** `YOLOService` di `backend/app/services/yolo_service.py` otomatis mendeteksi bobot ini dan beralih dari status `MODEL_NOT_TRAINED` ke `CUSTOM_SPECIES_MODEL`.
3. **Kelas Model:**
   - Class 0: `Rastrelliger brachysoma` (Kembung Perempuan)
   - Class 1: `Selaroides leptolepis` (Selar Kuning)
   - Class 2: `Upeneus sulphureus` (Kuniran)

## 2. Instruksi Khusus untuk Phase 14 (Length Estimation)
- Estimasi panjang harus menggunakan bounding box dan deteksi kontur dari hasil deteksi model ini.
- Skala optik rig yang diverifikasi pada Phase 11.7.3 ($H=90$ cm, FoV $= 60.4$ cm, skala $\approx 1.573$ px/mm) atau marker ArUco menjadi acuan konversi piksel ke cm.
- Mengingat mAP test berada di $0.3673$, status validasi estimasi panjang harus diinisialisasi pada level **`LIMITED`** atau **`EXPERIMENTAL`** sesuai framework validasi DEC-008.

## 3. Instruksi Khusus untuk Phase 15 (Backend & UI Integration)
- Verifikasi endpoint `/api/detect` menghasilkan response JSON dengan `model_mode: "CUSTOM_SPECIES_MODEL"`.
- Pastikan UI dashboard menampilkan status model kustom dan persentase komposisi tangkapan secara akurat.
