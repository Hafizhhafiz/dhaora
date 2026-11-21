# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Peneliti oseanografi/perikanan, dosen & mahasiswa, juri kompetisi ASIK VOL VI, enumerator pelabuhan, dan pemangku kebijakan perikanan skala kecil di Teluk Banten (PPN Karangantu, WPPNRI 712).

## Product Purpose

Platform digital terintegrasi (DHAORA — Integrated Marine AI & WebGIS Platform) untuk pemantauan, prediksi habitat daerah penangkapan ikan, estimasi biometrik morfometri otomatis, dan kepatuhan regulasi perlindungan spesies ETP (Endangered, Threatened, and Protected) bagi armada perikanan skala kecil (< 10 GT).

## Positioning

Satu-satunya platform intelijen perikanan terpadu yang memadukan model prediksi habitat spasial beresolusi 1 km² (CatchForecast AI), inferensi Computer Vision YOLOv8/v11 terkalibrasi ArUco 50 mm (FishGuard AI), dan Mesin Aturan berbasis FAO Technical Guidelines serta Permen-KP No. 36/2023 (ByCatch AI) dalam ekosistem pelabuhan PPN Karangantu.

## Operating Context

- Digunakan di meja administrasi pelelangan TPI Karangantu, laboratorium riset kampus UPI Serang, dan inspeksi lapangan.
- Operasional membutuhkan akurasi tinggi, format data Indonesia (angka ribuan titik, desimal koma), serta transparansi metodologi ilmiah (R² ≥ 0,999 dan standar FAO).

## Capabilities and Constraints

- **CatchForecast AI**: WebGIS prediksi zonasi tangkapan pada 798 sel grid 1 km² dengan telemetri oseanografi MUR SST, gradien termal Sobel, dan batimetri ETOPO1. Default basemap CartoDB Positron.
- **FishGuard AI**: Deteksi multi-spesies, pencacahan kuantitatif, dan estimasi Total Length (TL) terkalibrasi ArUco marker 50 mm untuk 3 spesies target MVP (Rastrelliger brachysoma, Selaroides leptolepis, Upeneus sulphureus).
- **ByCatch AI**: Mesin aturan evaluasi peran operasional tangkapan (Target Catch vs Bycatch Retained/Discarded) dan audit status konservasi IUCN Red List, CITES, dan regulasi nasional KKP RI.
- **Batasan**: Tidak mengubah arsitektur model AI, bobot model, data schema, atau formula perhitungan backend yang telah tervalidasi.

## Brand Commitments

- Nama resmi: DHAORA — Integrated Marine AI & WebGIS Platform (ASIK VOL VI).
- Afiliasi: Universitas Pendidikan Indonesia (UPI) Kampus Serang & PPN Karangantu (WPPNRI 712).
- Bahasa UI: Bahasa Indonesia baku, formal, tanpa kata hiperbola ("mutakhir", "revolusioner") dan tanpa emoji.

## Evidence on Hand

- Dataset historis pendaratan PPN Karangantu 2026 (181.377 kg tangkapan total, 77.045 kg 3 spesies target).
- Bobot model YOLO terlatih (backend/weights/fishguard_yolo.pt).
- Basis data SQLite lokal (backend/fishguard_history.db dan bycatch/data/app.sqlite).

## Product Principles

1. **Integritas Ilmiah**: Setiap angka, klaim R², dan status taksonomi harus dapat diverifikasi dengan data empiris.
2. **Kesesuaian Pengguna Lapangan**: Alur kerja cepat (Quick Analysis dock), antarmuka bersih tanpa distraksi neon visual.
3. **Kepatuhan Konservasi**: Transparansi pemisahan hasil tangkapan target dan non-target sesuai panduan teknis FAO.

## Accessibility & Inclusion

- Standar WCAG AA (kontras teks minimal 4.5:1).
- Target sentuh minimal 44 × 44 px untuk penggunaan tablet/mobile di lapangan.
- Dukungan prefers-reduced-motion dan angka tabular-nums untuk pembacaan tabel data.
