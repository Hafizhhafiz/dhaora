# PHASE 11.7.3 — LABORATORY PHYSICAL RIG VALIDATION PLAN
**Status:** IN PROGRESS  
**Fase Pemilik:** Hardware Specialist & Computer Vision Engineer  
**Tujuan Utama:** Memverifikasi kesiapan teknis, kestabilan mekanis, geometri optik, dan protokol kalibrasi perangkat keras pengambilan citra sebelum uji coba spesimen fisik (Phase 11.7.4).

---

## 1. Lingkup Pekerjaan & Urutan Tugas
1. **11.7.3-T0 Status Reconstruction:** Menemukan dan memverifikasi bukti riwayat Phase 11.6; menyusun baseline kemajuan proyek. *(SELESAI)*
2. **11.7.3-T1 Hardware Inventory:** Formulir inventaris lengkap komponen rig (kamera, lensa, sensor, tripod, lampu, papan ukur, marker ArUco). *(AI menyiapkan template; menunggu pengisian fakta fisik oleh operator)*.
3. **11.7.3-T2 Rig Specification:** Dokumen spesifikasi dimensi rig, jarak kerja ($H = 90$ cm), cakupan bidang pandang (FoV $\ge 60$ cm), sudut pandang tegak lurus 90°, dan tata cahaya anti-silau.
4. **11.7.3-T3 Calibration Procedure & Script:** Skrip OpenCV `tools/calibrate_scale.py` untuk deteksi ArUco DICT_4X4_50, estimasi distorsi lensa, dan kalkulasi rasio mm/piksel.
5. **11.7.3-T4 Stability Test Protocol:** Prosedur uji keterulangan pemasangan kamera (5x re-mount), stabilitas eksposur (10x tembakan), dan penguncian fokus.
6. **11.7.3-T5 Measurement Consistency Test:** Pengujian kalibrasi menggunakan objek referensi non-biologis (mistar ukur baja terkalibrasi) pada berbagai orientasi dan posisi.
7. **11.7.3-T6 Ingestion & Acquisition Protocol:** Standar penamaan file, metadata sidecar EXIF/JSON, dan verifikasi backup ganda berserta SHA-256.
8. **11.7.3-T7 Safety & Operational Readiness:** Checklist keselamatan elektrikal, lingkungan basah perikanan, dan sanitasi spesimen.
9. **11.7.3-T8 Defects & Risk Register:** Pencatatan defek optik dan rencana kontinjensi.
10. **11.7.3-T9 Readiness Decision:** Keputusan kesiapan gerbang (GO / GO-WITH-CONDITIONS / NO-GO) untuk persetujuan operator manusia [AG].

---

## 2. Kriteria Penerimaan Provisional (Pre-registered Acceptance Targets)
- Variasi rasio skala (scale factor) pada 5x pengujian re-mount: $\le 1.0\%$.
- Error pengukuran objek referensi non-biologis (panjang diketahui): $\le 2.0\%$ (atau $\le 3$ mm untuk objek $< 150$ mm).
- Tingkat kelulusan ketajaman fokus dan eksposur: $\ge 95\%$ dari 30 citra uji.
- Integritas backup dan penamaan file: $100\%$ lulus verifikasi otomatis.
