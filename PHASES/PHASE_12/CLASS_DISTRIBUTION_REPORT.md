# PHASE 12 — CLASS DISTRIBUTION & IMBALANCE ANALYSIS
**Auditor:** AI Engineer & Data Analyst  
**Dataset:** `datasets/fishguard_v001/` | **Tanggal:** 17 November 2026

---

## 1. Distribusi Bounding Box per Kelas dan Partisi

| Class ID | Nama Ilmiah / Komoditas | Train (80 citra) | Val (20 citra) | Test (25 citra) | Total Bounding Boxes | Proporsi |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **0** | *Rastrelliger brachysoma* | 189 | 49 | 58 | **296** | **36.6%** |
| **1** | *Selaroides leptolepis* | 175 | 42 | 58 | **275** | **34.0%** |
| **2** | *Upeneus sulphureus* | 154 | 31 | 52 | **237** | **29.3%** |
| **TOTAL**| — | **518** | **122** | **168** | **808** | **100.0%** |

---

## 2. Analisis Keseimbangan Kelas (*Class Balance*)
- Rasio antar-kelas berkisar pada perbandingan mendekati seimbang ($1:1:1$), dengan deviasi maksimal $< 5\%$.
- Model tidak memerlukan penyesuaian bobot loss ekstrem (*loss re-weighting*).
- Setiap citra memuat rata-rata **6.5 individu ikan**, merepresentasikan skenario tangkapan multi-ikan bertumpuk secara realistis.
