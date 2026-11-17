# ByCatch AI — FishGuard AI Ecosystem (ASIK V)

**ByCatch AI** adalah modul pendeteksi, pengklasifikasi, dan penganalisis hasil tangkapan non-target (*bycatch*) serta penyaring status konservasi berbasis Computer Vision dan kecerdasan buatan, di bawah ekosistem **FishGuard AI (ASIK V)**.

---

## Modul Ekosistem FishGuard AI
1. **FishGuard:** Identifikasi spesies ikan target, penghitungan, estimasi panjang, dan analisis komposisi hasil tangkapan.
2. **OceanSense AI:** Analisis kondisi lingkungan oseanografi dan penginderaan jauh.
3. **ByCatch AI:** Identifikasi dan analisis hasil tangkapan non-target serta dukungan penyaringan konservasi.
4. **CatchForecast AI:** Prediksi kesesuaian habitat dan potensi daerah penangkapan ikan (fishing ground).

---

## Dokumentasi Proyek
Seluruh dokumentasi bertahap disimpan di dalam direktori `docs/`:
- [INITIAL_PROJECT_AUDIT.md](docs/INITIAL_PROJECT_AUDIT.md) — Hasil audit awal lingkungan sistem, hardware, batasan data, dan analisis lokasi studi PPN Karangantu (Phase 0).
- [PHASE_1_RESEARCH_FOUNDATION.md](docs/PHASE_1_RESEARCH_FOUNDATION.md) — Identifikasi masalah, rumusan masalah, problem statement, profil pengguna, research gap, dan referensi ilmiah rujukan (Phase 1).
- [PHASE_2_SCOPE_SPECIES_IDENTIFICATION.md](docs/PHASE_2_SCOPE_SPECIES_IDENTIFICATION.md) — Ruang lingkup operasional, identifikasi taksonomi 3 spesies target, struktur kelas label, dan rancangan dataset (Phase 2).
- [PHASE_3_DATASET_ACQUISITION.md](docs/PHASE_3_DATASET_ACQUISITION.md) — Pemetaan sumber publik, protokol akuisisi citra primer/sekunder, target volume data, dan skema metadata (Phase 3).

---

## Struktur Direktori Utama
- `dataset/`: Penyimpanan citra berjenjang (`raw/primary`, `raw/secondary`, `curated`, `annotated`, `processed`).
- `docs/`: Dokumentasi per fase penelitian (Phase 0 s.d. Phase 12).
- `metadata/`: File katalog referensi taksonomi, registri citra, dan konteks trip pendaratan (`species_reference.csv`, `image_metadata.csv`, `source_registry.csv`, `catch_metadata.csv`).
- `models/`: Bobot dan konfigurasi model deteksi (YOLO).
- `scripts/`: Skrip otomasi akuisisi, pra-pemrosesan, validasi, dan inferensi.
- `results/`: Metrik evaluasi, confusion matrix, dan log eksperimen.
