# LOG PERUBAHAN & AUDIT TRAIL PHASE 11.6
## FishGuard AI — ASIK V

**Tanggal Eksekusi**: 16 November 2026  
**Ruang Lingkup**: Scientific & Data Integrity Closure (Phase 11.6)

---

## 1. DAFTAR FILE YANG DIPERIKSA (INSPECTED FILES)

Pemeriksaan mendalam dilakukan terhadap file-file berikut di dalam repositori:

1. `dataset_pipeline/metadata/species_reference.csv`: Metadata referensi taksonomi dan class ID model.
2. `dataset_pipeline/metadata/dataset_master.csv`: Katalog master 183 citra (8 sintetis, 175 kandidat GBIF Phase 10).
3. `dataset_pipeline/metadata/gbif_occurrences.csv`: Metadata 175 spesimen historis GBIF.
4. `dataset_pipeline/metadata/gbif_license_audit.csv`: Audit lisensi 175 spesimen historis GBIF.
5. `dataset_pipeline/metadata/gbif_download_log.csv`: Log unduhan citra GBIF.
6. `dataset_pipeline/metadata/gbif_quality_report.csv`: Laporan resolusi dan kualitas citra GBIF.
7. `dataset_pipeline/reports/phase_11/species_prioritization_matrix.csv`: Matriks prioritas awal 23 spesies ikan.
8. `documentation/phase_11_species_prioritization_report.md`: Laporan awal prioritisasi spesies Phase 11.
9. `documentation/field_data_collection_checklist.md`: Checklist kesiapan sampling lapangan.
10. `documentation/phase_11_field_preparation_report.md`: Laporan persiapan sampling lapangan.
11. `dataset_pipeline/templates/field_data_collection_template.csv`: Template metadata sampling lapangan.
12. `backend/weights/`: Direktori penyimpanan bobot model YOLO.

---

## 2. FILE YANG DIUBAH / DIREKONSILIASI (MODIFIED FILES)

### 2.1 `dataset_pipeline/metadata/species_reference.csv`
- **File Backup Pra-Perubahan**: `dataset_pipeline/metadata/species_reference_backup_pre_phase11_6.csv` (dibuat pada 16 November 2026 03:13:15).
- **Alasan Modifikasi**:
  - Mengatasi konflik tabrakan ID kelas (*class ID collision*): SP-01 dan SP-06 keduanya memegang `class_id: 0`; SP-02 dan SP-07 keduanya memegang `class_id: 1`.
  - Mengatasi redundansi pencatatan takson ganda untuk *Rastrelliger brachysoma* (SP-03 dan SP-06).
  - Mengharmoniskan penetapan MVP 3-kelas (*Rastrelliger brachysoma* = 0, *Selaroides leptolepis* = 1, *Upeneus sulphureus* = 2).
  - Mengalihkan taksa historis dan non-MVP ke `class_id: -1`.
- **Rincian Nilai Sebelum & Sesudah**:
  - `SP-01` (*Rastrelliger kanagurta*): `class_id: 0` -> `-1`, `verification_status: VERIFIED` -> `HISTORICAL_ARCHIVE`.
  - `SP-02` (*Decapterus macarellus*): `class_id: 1` -> `-1`, `verification_status: VERIFIED` -> `HISTORICAL_ARCHIVE`.
  - `SP-03` (*Rastrelliger brachysoma*): `class_id: -1`, `verification_status: NEEDS_REVIEW` -> `HISTORICAL_ARCHIVE`.
  - `SP-06` (*Rastrelliger brachysoma*): `class_id: 0`, `verification_status: PRIORITY_CANDIDATE` (tetap aktif sebagai MVP Class 0).
  - `SP-07` (*Selaroides leptolepis*): `class_id: 1`, `verification_status: PRIORITY_CANDIDATE` (tetap aktif sebagai MVP Class 1).
  - `SP-08` (*Upeneus sulphureus*): `class_id: 2`, `verification_status: PRIORITY_CANDIDATE` (tetap aktif sebagai MVP Class 2).
  - `SP-09` (*Equulites leuciscus*): `class_id: 3` -> `-1`, `verification_status: PROPOSED_AUXILIARY`.
  - `SP-10` (*Stolephorus commersonii*): `class_id: -1`, `verification_status: EXCLUDED_UNSUITABLE_FOR_MVP`.

---

## 3. ARTEFAK BARU YANG DIBUAT (NEWLY CREATED ARTIFACTS)

Seluruh artefak audit baru disimpan di `dataset_pipeline/reports/phase_11_6/`:

1. **`pipp_reconciliation.csv`** (23 baris data):
   - Merekonsiliasi data produksi 23 komoditas ikan pendaratan PPN Karangantu tahun 2026.
   - Mengoreksi total produksi dari klaim salah $179.908\text{ kg}$ menjadi penjumlahan aktual $181.376\text{ kg}$ ($+1.468\text{ kg}$).
   - Mencatat status audit perbandingan angka tabel vs grafik dashboard PIPP sebagai **`UNRESOLVED`**.
2. **`taxonomic_revalidation.csv`** (23 baris data):
   - Hasil pemeriksaan ulang nomenklatur zoologi 23 komoditas terhadap basis data WoRMS dan FishBase.
   - Mengoreksi kesalahan taksonomi pada *Leiognathus berbis* yang sebelumnya diklaim sinonim dari *Equulites elongatus*, kini diverifikasi sebagai spesies valid *Equulites berbis* (Valenciennes, 1835).
   - Memutakhirkan accepted name untuk *Photopectoralis bindus*, *Equulites leuciscus*, dan *Neotrygon kuhlii*.
   - Mendokumentasikan karakter morfometrik pembeda *R. brachysoma* vs *R. kanagurta* berbasis FAO (Collette & Nauen, 1983).
3. **`species_prioritization_reaudit.csv`** (23 baris data):
   - Audit independen terhadap skor pembobotan multi-kriteria:
     $$\text{Score} = (0,35 \times S_P) + (0,20 \times S_E) + (0,20 \times S_C) + (0,15 \times S_V) + (0,10 \times S_A)$$
   - Mengoreksi urutan teks pelaporan di mana Teri tertulis di bawah Selar komo, dan mengonfirmasi alasan teknis diskualifikasi Teri dari MVP.
4. **`public_image_audit.csv`** (7 baris data):
   - Inventarisasi ketersediaan citra publik via kueri live GBIF Occurrence API.
   - Memetakan domain citra (*underwater*, spesimen museum, pasar) dan restriksi lisensi Creative Commons (CC BY-NC, CC0, CC BY).
   - Mengkategorikan fungsi citra sebagai `MORPHOLOGY_REFERENCE` dan `OOD_TEST_CANDIDATE`.
5. **`species_reference_audit.csv`** (10 baris data):
   - Audit konsistensi relasional dan keselarasan metadata kelas target MVP terhadap seluruh entri spesies SP-01 hingga SP-10.
6. **`phase_11_6_integrity_audit_report.md`**:
   - Laporan komprehensif audit integritas ilmiah penutupan Phase 11.
7. **`training_readiness_assessment.md`**:
   - Evaluasi kesiapan formal dataset menuju Phase 12 (Status: `NOT_READY` untuk pelatihan model, `READY_FOR_FIELD_SAMPLING`).
8. **`phase_11_6_change_log.md`**:
   - Dokumen log perubahan dan jejak audit integritas ini.

---

## 4. FILE & DATA YANG SENGAJA TIDAK DIUBAH (PRESERVED ASSETS)

Untuk menjaga integritas historis riset dan prinsip non-destruktif:
1. **Dataset Master (`dataset_pipeline/metadata/dataset_master.csv`)**:
   - Tetap dipertahankan persis 183 baris (8 sintetis, 175 GBIF Phase 10). Tidak ada penghapusan baris atau pergantian status rekaman historis.
2. **Metadata GBIF Phase 10 (`gbif_occurrences.csv`, `gbif_license_audit.csv`, `gbif_download_log.csv`, `gbif_quality_report.csv`)**:
   - Seluruh 175 metadata spesimen *R. kanagurta* dan *D. macarellus* tetap utuh sebagai arsip komparatif dan referensi OOD.
3. **Direktori Citra Mentah (`dataset_pipeline/data/raw/deepfish/` & `dataset_pipeline/data/raw/gbif/`)**:
   - Tidak ada penghapusan citra DeepFish Phase 9 maupun citra GBIF Phase 10.
4. **Bobot Model (`backend/weights/`)**:
   - Tidak ada eksekusi skrip pelatihan model YOLO (`train_yolo.py`) pada fase ini. Bobot model custom `fishguard_yolo.pt` sengaja dibiarkan tidak dibuat (`MODEL_NOT_TRAINED`) hingga data primer lapangan terkumpul secara sah.
