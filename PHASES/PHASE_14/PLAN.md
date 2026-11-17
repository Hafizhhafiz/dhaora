# PHASE 14 — CALIBRATED LENGTH ESTIMATION & CATCH ANALYSIS PLAN
**Status:** COMPLETED & VERIFIED  
**Fase Pemilik:** Computer Vision Specialist, Fisheries Biometrician

---

## 1. Sasaran Utama
1. Merealisasikan modul komputasi estimasi panjang ikan (Total Length / TL) dari citra 2D tegak lurus.
2. Mengintegrasikan pemulihan skala optik berbasis penanda ArUco (`DICT_4X4_50`, 50 mm) dan fallback profil rig ($H=90$ cm, FoV $= 60.4$ cm).
3. Mengatasi fenomena kelengkungan tubuh spesimen (*rigor mortis body curvature*) melalui analisis kontur dan garis tengah (*centerline spline*).
4. Menerapkan model ketidakpastian statistik $95\%$ Confidence Interval ($TL \pm \Delta L$).
5. Menetapkan hierarki validasi saintifik tri-status: `VALIDATED` ($\le 5\%$), `LIMITED` ($5\% - 10\%$), `EXPERIMENTAL` ($> 10\%$ atau uncalibrated).

---

## 2. Struktur Deliverables
- Skrip pipeline mandiri: `dataset_pipeline/scripts/length_estimator.py`
- Layanan integrasi backend: `backend/app/services/length_service.py`
- Skema model: `backend/app/models/schemas.py` (`LengthMeasurementResponse`)
- Laporan metrik validasi sintetis: `PHASES/PHASE_14/length_evaluation_metrics.json`
