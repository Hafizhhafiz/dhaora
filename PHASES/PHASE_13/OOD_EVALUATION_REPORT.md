# PHASE 13 — OUT-OF-DISTRIBUTION (OOD) EVALUATION REPORT
**Uji Ketahanan Model YOLOv8n terhadap Spesies Look-Alike Non-Target (GBIF Benchmark)**  
**Tanggal Evaluasi:** 17 November 2026  
**Status Evaluasi:** SELESAI & TERVERIFIKASI PENUH (177 Citra)  
**Data Sumber:** GBIF Dataset Benchmark (177 citra teralokasi penuh di disk dari manifes Phase 12)  
**Spesies Non-Target Penguji:**
1. *Rastrelliger kanagurta* (Kembung Lelaki - look-alike Class 0)
2. *Decapterus macarellus* (Layang Biru / Curut - look-alike Class 1)

---

## 1. Ringkasan Eksekutif & Temuan Kritis Integritas Ilmiah

Pengujian Out-of-Distribution (OOD) dirancang untuk menguji apakah model yang hanya dilatih pada 3 kelas target MVP mampu membedakan atau justru keliru mendeteksi spesies serupa (*look-alike*) yang hidup simpatrik di Teluk Banten. Seluruh 177 citra yang dialokasikan dalam manifes kurasi Phase 12 (`datasets/fishguard_v001/ood_eval/ood_evaluation_manifest.csv`) telah diindeks dan dievaluasi secara lengkap.

### Metrik Hasil Uji OOD Aktual (N = 177)

| Parameter OOD | Ambang Batas Conf $\ge 0.25$ | Ambang Batas Conf $\ge 0.50$ | Catatan Evaluator |
|:---|:---:|:---:|:---|
| **Total Citra OOD Diuji** | 177 citra | 177 citra | 95 *R. kanagurta*, 82 *D. macarellus* |
| **False Positive Rate (FPR)** | **88.14%** (156/177 citra) | **61.58%** (109/177 citra) | **Kelemahan Model Closed-Set** |
| **Spesifisitas Model (1 - FPR)**| **11.86%** (21/177 citra) | **38.42%** (68/177 citra) | **Membaik pada Ambang Batas 0.50** |

---

## 2. Rincian per Spesies Look-Alike

### 2.1. *Rastrelliger kanagurta* (Look-alike untuk *R. brachysoma*)
- **Total Citra Diuji:** 95 citra
- **False Positive (Conf $\ge 0.25$):** 83 citra (**FPR = 87.37%**)
- **False Positive (Conf $\ge 0.50$):** 62 citra (**FPR = 65.26%**)
- **Spesifisitas (Conf $\ge 0.50$):** **34.74%**
- **Temuan Visual/Morfologis:** *R. kanagurta* memiliki bintik hitam khas di dekat sirip pektoral dan garis membujur gelap, sedangkan *R. brachysoma* bertubuh lebih pendek-lebar. Tanpa data negatif (*negative background classes*) pada fase pelatihan baseline, model YOLOv8n memprediksi *R. kanagurta* sebagai *R. brachysoma* atau *S. leptolepis* dengan rata-rata confidence $0.55 - 0.81$.

### 2.2. *Decapterus macarellus* (Look-alike untuk *Selaroides leptolepis*)
- **Total Citra Diuji:** 82 citra
- **False Positive (Conf $\ge 0.25$):** 73 citra (**FPR = 89.02%**)
- **False Positive (Conf $\ge 0.50$):** 47 citra (**FPR = 57.32%**)
- **Spesifisitas (Conf $\ge 0.50$):** **42.68%**
- **Temuan Visual/Morfologis:** *D. macarellus* memiliki tubuh memanjang silindris mirip Carangidae lainnya. Model keliru mengidentifikasinya sebagai *Selaroides leptolepis* (Class 1) karena bentuk sirip dan ekor forked yang serupa.

---

## 3. Implikasi Lapangan & Mitigasi Sistem

Hasil uji OOD ini adalah **bukti empiris nyata** bahwa model baseline *closed-set* 3-kelas sangat rentan terhadap *overconfidence* saat berhadapan dengan fauna non-target:

1. **Rekomendasi Ambang Batas Operasional:**
   - Ambang batas deteksi default pada dashboard UI dinaikkan menjadi minimal $\ge 0.50$ (bukan $0.25$) untuk menekan FPR dari $88.14\%$ menjadi $61.58\%$.
2. **Mitigasi Heuristik & Disclaimer UI:**
   - Sistem dashboard UI wajib menampilkan peringatan: *"Model beroperasi dalam mode Closed-Set MVP (3 Spesies). Spesies simpatrik lain (misal Kembung Lelaki atau Tongkol) dapat terklasifikasi keliru sebagai target terdekat."*
3. **Penyebab Utama:**
   - Seluruh dataset latih sintetis hanya memuat 3 kelas target tanpa *negative sample background images* dari spesies non-target. Ini adalah pelajaran saintifik berharga untuk iterasi dataset selanjutnya.

---

## 4. Sumber Bukti (*Evidence Artifacts*)
- Data mentah granular per citra OOD: `PHASES/PHASE_13/evaluation/ood_metrics.json`
- Direktori dataset OOD: `dataset_pipeline/data/public/gbif/` (207 file terindeks, 177 manifes benchmark)
