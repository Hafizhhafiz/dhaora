# PHASE 13 — INDEPENDENT TEST SET EVALUATION REPORT
**Evaluasi Independen Model YOLOv8n Baseline pada Frozen Test Set (25 Citra)**  
**Tanggal Evaluasi:** 17 November 2026  
**Status Evaluasi:** SELESAI & TERVERIFIKASI  
**Bobot Model:** `backend/weights/fishguard_yolo.pt` (Hash/Size: 6,489,578 bytes)  
**Dataset:** `datasets/fishguard_v001/` (Split: Test beku, 25 citra, 168 ground truth instances)

---

## 1. Ringkasan Eksekutif & Temuan Kunci

Evaluasi independen dilakukan satu kali (*single-pass evaluation*) terhadap 25 citra uji beku yang belum pernah dilihat model selama pelatihan maupun validasi (`data_leakage = 0.00%`).

### Ringkasan Metrik Kinerja Aktual

| Metrik Evaluasi | Target Pra-registrasi (DEC-006) | Hasil Baseline Aktual (10 Epochs) | Status Target |
|:---|:---:|:---:|:---:|
| **mAP@50 (Overall)** | $\ge 0.8500$ | **0.3673** (36.73%) | **BELUM TERCAPAI** (Gap: -0.4827) |
| **mAP@50-95 (Overall)** | $\ge 0.5000$ | **0.2336** (23.36%) | **BELUM TERCAPAI** |
| **Precision (Overall)** | $\ge 0.8500$ | **0.6067** (60.67%) | **BELUM TERCAPAI** |
| **Recall (Overall)** | $\ge 0.8500$ | **0.4315** (43.15%) | **BELUM TERCAPAI** |
| **F1-Score** | $\ge 0.8500$ | **0.5043** | **BELUM TERCAPAI** |
| **Total GT Instances** | 168 objek | 168 objek | Sesuai Anotasi Beku |
| **Total Prediksi Terdeteksi** | - | 112 objek | Under-counting 33.3% |
| **Counting MAE (Mean Absolute Error)** | $\le 1.0$ ekor/citra | **2.40** ekor/citra | **MODERAT** |
| **Counting RMSE** | $\le 2.0$ ekor/citra | **2.99** ekor/citra | **MODERAT** |
| **Akurasi Cacah Eksak (Exact Count)**| $\ge 70.0\%$ | **20.0%** (5/25 citra) | **RENDAH** |
| **Akurasi Toleransi $\pm 1$ Ekor** | $\ge 85.0\%$ | **36.0%** (9/25 citra) | **RENDAH** |
| **Latensi Inferensi CPU (Total)** | $\le 200$ ms | **90.81 ms** (~11.0 FPS) | **MEMENUHI TARGET** |

---

## 2. Perincian Kinerja per Kelas Spesies Target

| Kelas ID | Nama Spesies Target | Precision | Recall | F1-Score | mAP@50 | mAP@50-95 | Counting MAE |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Class 0** | *Rastrelliger brachysoma* (Kembung Perempuan) | 0.6842 | 0.4483 | 0.5417 | **0.4104** | 0.2713 | 1.04 |
| **Class 1** | *Selaroides leptolepis* (Selar Kuning) | 0.6744 | 0.5000 | 0.5743 | **0.4194** | 0.2813 | 1.12 |
| **Class 2** | *Upeneus sulphureus* (Kuniran) | 0.4615 | 0.3462 | 0.3956 | **0.2722** | 0.1482 | 1.20 |

### Analisis Taksonomi & Visual:
1. **Class 1 (*S. leptolepis*)** memiliki F1-score (0.5743) dan mAP@50 (0.4194) tertinggi karena garis lateral kuning (*yellow lateral stripe*) memberikan fitur kontras tinggi yang mudah dibedakan model bahkan pada 10 epoch.
2. **Class 0 (*R. brachysoma*)** mencapai precision 0.6842 namun recall rendah (0.4483). Tubuh kembung yang lebih bulat sering terdeteksi akurat saat soliter, namun terlewat saat terjadi tumpang tindih (*partial occlusion*).
3. **Class 2 (*U. sulphureus*)** memiliki performa terlemah (mAP50 = 0.2722, Recall = 0.3462). Warna tubuh kuning-keemasan dengan refleksi cahaya latar putih di meja sortir menyebabkan false-negative tertinggi.

---

## 3. Profil Latensi & Throughput Komputasi (CPU)

Benchmark kecepatan dijalankan pada prosesor lokal standar tanpa akselerasi GPU (PyTorch CPU):

- **Preprocess time:** $2.45\text{ ms}$
- **Inference time:** $86.96\text{ ms}$
- **Postprocess time (NMS):** $1.40\text{ ms}$
- **Total Latensi per Citra:** **$90.81\text{ ms}$**
- **Throughput:** **$11.01\text{ FPS}$**

*Kesimpulan Throughput:* Model sangat ringan (6.5 MB) dan memenuhi syarat *near real-time* operasi lapangan di dermaga pendaratan ($> 10\text{ FPS}$ pada CPU laptop tanpa GPU eksternal).

---

## 4. Analisis Kegagalan (*Error Analysis & Failure Taxonomy*)

Berdasarkan evaluasi terhadap 25 citra uji:
1. **Under-detection pada Kluster Padat (Dense Clusters):**
   Pada citra dengan kepadatan $\ge 8$ ekor ikan, model gagal mendeteksi ikan yang sebagian tubuhnya tertutup spesimen lain (IoU overlap > 0.45 dieliminasi oleh NMS).
2. **Truncation di Tepi Frame:**
   Spesimen yang terpotong di tepi bidang pandang rig ($FoV$) diabaikan model (confidence $< 0.25$).
3. **Penyebab Utama Kesenjangan Target DEC-006:**
   Model dilatih hanya selama 10 epoch baseline pada 80 citra latih sintetis. Hal ini membuktikan keterbatasan mendasar pelatihan singkat pada data komposit awal, dan secara jujur dicatat bahwa model belum memenuhi kriteria produksi matang tanpa augmentasi lebih lanjut dan data riil.

---

## 5. Sumber Data Bukti (*Evidence Artifacts*)
- File data mentah: `PHASES/PHASE_13/evaluation/test_metrics.json`
- Visualisasi validasi YOLO: `PHASES/PHASE_13/evaluation/test_native_val/`
- Confusion matrix & kurva pelatihan: `PHASES/PHASE_13/runs/baseline_yolov8n_v001/`
