# PHASE 12 — KEYPOINT VS BOX-BASED DECISION ANALYSIS (ISSUE A5)
**Analisis Kelayakan Komparatif Metode Estimasi Panjang dan Beban Anotasi**

---

## 1. Konteks Masalah
Pada rancangan awal, muncul opsi untuk menambahkan anotasi titik kunci (*keypoint annotation*: titik moncong anterior dan titik lekukan sirip ekor). Namun, penambahan keypoint melipatgandakan beban waktu anotasi dan memerlukan arsitektur model pose estimation (e.g. YOLOv8-pose) alih-alih detektor standar.

---

## 2. Analisis Komparatif Dua Metode

| Parameter Evaluasi | Metode 1: Calibrated Oriented Bounding Box (Box-based) | Metode 2: Keypoint Estimation (Snout-to-Fork) |
|---|---|---|
| **Kompleksitas Model** | Standar YOLOv8 Detection head (`yolov8n.pt`) | YOLOv8-pose dengan 2 keypoint channels |
| **Beban Waktu Anotasi** | Cepat ($\sim 5 - 10$ detik per ikan, box 4-titik) | Lambat ($\sim 20 - 30$ detik per ikan, klik presisi tinggi) |
| **Kerentanan Kerusakan Sirip** | Rendah (ujung sirip ekor terluar tetap tercakup) | Tinggi (sulit menentukan titik lekukan jika sirip sobek di pasar) |
| **Akurasi Teoretis Planar** | Error $\le 2.0\%$ jika ikan terbentang lurus | Error $\le 1.5\%$ jika penandaan titik konsisten |
| **Latensi Inferensi CPU** | Sangat cepat ($< 80\text{ ms}$) | Lebih lambat ($+35 - 50\%$ overhead komputasi) |

---

## 3. Keputusan Teknis Terpilih (Decision DEC-008)
Berdasarkan prinsip *Occam's razor* dan efisiensi kompetisi ASIK V:
1. **Keputusan Utama:** Menetapkan **Calibrated Bounding Box Long-Axis / Minimum Area Oriented BBox** sebagai metode estimasi panjang standar primer pada Phase 14.
2. **Kondisi Cadangan (*Contingency Gate*):** Anotasi keypoint hanya akan dibuka jika pengujian ground truth manual pada Phase 14 membuktikan bahwa metode box-based gagal memenuhi target pre-registrasi ($\text{MAPE} > 5.0\%$).
3. **Pencatatan Log:** Keputusan ini dicatat secara resmi pada `FISHGUARD_DECISION_LOG.md` sebagai **DEC-008**.
