# PHASE 12 — GBIF HISTORICAL RE-AUDIT REPORT
**Auditor:** Research Data Integrity Auditor & AI Lead  
**Tanggal:** 17 November 2026 | **Fokus Audit:** Rekonstruksi Ilmiah 207 Citra Historis GBIF (Issue A2)

---

## 1. Ringkasan Eksekutif & Keputusan Ilmiah
Sesuai arahan audit Master Roadmap (Issue A2):
> *"207 GBIF images are a historical count, not a training count. Possible inflated dataset claims. Phase 12 dataset register must record usable / rejected / reason per image."*

Hasil audit ulang membuktikan:
- **Total record historis yang diperiksa:** **207 record** (107 *Rastrelliger kanagurta*, 100 *Decapterus macarellus*).
- **Jumlah yang dapat digunakan untuk Training Target Kelas MVP:** **0 CITRA (0%)**.
  - *Justifikasi Ilmiah:* Sesuai Golden Rule #1 dan kaidah taksonomi terkunci, *R. kanagurta* tidak boleh disubstitusikan ke dalam Class 0 (*R. brachysoma*), dan *D. macarellus* tidak boleh disubstitusikan ke dalam Class 1 (*S. leptolepis*). Pelabelan spesies mirip sebagai kelas target merupakan pelanggaran integritas data (*label drift*).
- **Jumlah yang dialokasikan untuk Evaluasi Out-of-Distribution (OOD):** **177 citra** (Kualitas HIGH/MEDIUM).
  - Citra ini sangat berharga untuk menguji ketahanan model deteksi: mengukur *false-positive rate* dan membuktikan model tidak salah mengklasifikasikan *R. kanagurta* sebagai *R. brachysoma*.
- **Jumlah yang Ditolak Sepenuhnya (REJECTED):** **30 citra** (karena kualitas visual LOW, blur ekstrem, atau duplikasi visual).

---

## 2. Rincian Alokasi per Spesies

| Kode Spesies | Nama Ilmiah | Total Record | Usable for MVP Training | Dialokasikan ke OOD Eval | Ditolak (REJECTED) |
|:---:|:---|:---:|:---:|:---:|:---:|
| **RKAN** | *Rastrelliger kanagurta* (Kembung Lelaki) | 107 | **0** | **95** | **12** |
| **DMAC** | *Decapterus macarellus* (Layang Biru) | 100 | **0** | **82** | **18** |
| **TOTAL** | — | **207** | **0** | **177** | **30** |

---

## 3. Register Lengkap
Seluruh 207 baris keputusan individual beserta ID GBIF dan alasan penolakannya tersimpan pada:  
`PHASES/PHASE_12/gbif_reaudit_register.csv`
