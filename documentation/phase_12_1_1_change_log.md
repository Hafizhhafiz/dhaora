# PHASE 12.1.1 — DOCUMENTATION CHANGE LOG & RECONCILIATION RECORD
## Proyek: FishGuard AI — ASIK V

**Tanggal:** 16 November 2026  
**Penyusun:** Tim Multidisiplin FishGuard AI (AI Engineer, Computer Vision Specialist, Ichthyologist, Data Integrity Auditor)

---

## 1. RIWAYAT VERSI DOKUMEN (VERSION HISTORY)

| Versi Berkas | Lokasi Berkas | Status | Tanggal / Waktu | Deskripsi Perubahan |
|---|---|:---:|:---:|---|
| **v1.0 (Initial)** | `dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_selective_acquisition_report_v1_backup.md` | ARCHIVED (BACKUP) | 2026-11-16 11:30 | Laporan awal akuisisi. Status gate: `PARTIALLY_COMPLETED`. Terdapat ambiguitas penyebutan 41 Tier D dan penempatan Class 2 dalam pohon kandidat akuisisi. |
| **v1.1 (Reconciled)** | `dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_selective_acquisition_report.md` | ACTIVE (RECONCILED) | 2026-11-16 12:56 | Laporan terevisi penuh: pemisahan tegas 22 kandidat akuisisi vs 10 kandidat Class 2, rekonsiliasi matematis 52 Tier D vs 41 `PERMISSION_REQUIRED`, audit klaster spesimen biologis vs SHA-256, dan penetapan status gate `COMPLETED`. |
| **Audit Penutupan** | `documentation/phase_12_1_1_final_reconciliation_audit.md` | ACTIVE (OFFICIAL) | 2026-11-16 12:56 | Berkas audit rekonsiliasi formal yang memuat perbandingan detail seluruh tabel, justifikasi legal, dan konfirmasi kesinambungan roadmap. |

---

## 2. DETAIL PERUBAHAN & REKONSILIASI (CHANGE MATRIX)

### A. Rekonsiliasi Jumlah Kandidat & Pemisahan Class 2
- **Temuan Awal:** Pohon ASCII dan tabel ringkasan awal mencantumkan Class 2 (10 record) di bawah distribusi koleksi yang dapat menimbulkan persepsi bahwa Class 2 adalah bagian dari target akuisisi 22 kandidat.
- **Koreksi:** Diberikan penegasan eksplisit bahwa **22 kandidat akuisisi yang dieksekusi HANYA mencakup Class 0 (11 record) dan Class 1 (11 record)**. Kesepuluh kandidat Class 2 (*Upeneus sulphureus*) dipisahkan secara struktural sebagai kelompok terpisah yang berstatus `HOLD_PENDING_TAXONOMY_REVIEW` akibat revisi Uiblein et al. (Agustus 2025).
- **Konsistensi Angka:**
  - 22 kandidat diproses.
  - 21 gambar berhasil diunduh.
  - 1 gagal diunduh (`FG-C0-009`, server empty response).
  - 1 dikarantina (`FG-C1-019`, foto selam bawah air Tulamben Bali).
  - 20 gambar referensi morfologi bersih (10 Class 0 + 10 Class 1).

### B. Rekonsiliasi Lisensi: 52 Record Tier D vs 41 Record Permission Required
- **Temuan Awal:** Terjadi perbedaan angka antara laporan Phase 12.1 (52 record Tier D) dan Phase 12.1.1 (41 record Tier D).
- **Koreksi & Pembuktian:**
  - **52 record** adalah total berkas di master inventaris yang memiliki atribut lisensi `license_tier = D_NONE_OR_RESERVED`.
  - Dari 52 record Tier D tersebut:
    - **41 record** berstatus akuisisi `PERMISSION_REQUIRED` (foto ikan darat sah di mana fotografer FishBase memegang hak cipta penuh).
    - **7 record** berstatus `REJECTED` (ilustrasi morfologi FAO, prangko pos, dan ikan stargazer Uranoscopus).
    - **4 record** berstatus `OOD_REFERENCE` (spesies di luar taksa target).
    - Total: $41 + 7 + 4 = 52$ record.
  - Tabel silang (*cross-tabulation*) 91 baris inventaris ditambahkan ke dalam laporan untuk menjelaskan rekonsiliasi ini secara transparan.

### C. Dokumentasi Lisensi FishBase User
- **Temuan:** Teks label pada thumbnail mencantumkan "CC-BY" atau "CC-BY-NC", namun seluruh hyperlink mengarah ke `http://creativecommons.org/licenses/by-nc/4.0/`.
- **Koreksi:** Dicatatkan secara eksplisit bahwa seluruh citra FishBase User diperlakukan secara konservatif sebagai bahan riset non-komersial internal laboratorium (UU No. 28/2014 Pasal 44) dengan kewajiban mencantumkan takarir atribusi fotografer.

### D. Audit Klaster Spesimen (Multi-Angle) vs SHA-256
- **Temuan:** Perlunya penegasan bahwa keunikan biner hash SHA-256 tidak sama dengan keunikan individu ikan biologis.
- **Koreksi:**
  - Ditambahkan penegasan prinsip: Hash SHA-256 hanya menjamin integritas file transfer biner.
  - Didokumentasikan 3 klaster biologis: `DUP-INAT-4f48550b` (2 foto dari 1 individu kembung di Thailand), `DUP-OSMANY-20130318` (2 foto dari 1 spesimen selar 16 cm di Karachi), dan `DUP-OSMANY-20130625`.
  - Dijelaskan status terpisah pada klaster `DUP-OSMANY-20130625`: `FG-C1-022` berhasil diunduh karena memiliki label teks CC-BY di FishBase, sedangkan `FG-C1-023` ditahan di `PERMISSION_REQUIRED` karena tidak memiliki label lisensi terbuka.

### E. Penetapan Status Gate Penutupan
- **Revisi:** Status diubah dari `PARTIALLY_COMPLETED` menjadi **`COMPLETED`** karena seluruh tujuan fase (akuisisi 21 gambar, pencatatan 1 kegagalan server, isolasi 1 gambar karantina, penahanan 10 Class 2, serta rekonsiliasi tuntas seluruh anomali dokumentasi) telah terpenuhi.

---

## 3. BERKAS-BERKAS YANG DIPERBARUI & DISINKRONISASI

1. `dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_selective_acquisition_report_v1_backup.md` (Backup baru dibuat)
2. `dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_selective_acquisition_report.md` (Diperbarui)
3. `dataset_pipeline/reports/phase_12_1_1/phase_12_1_1_final_reconciliation_audit.md` (Dokumen audit baru)
4. `documentation/phase_12_1_1_selective_acquisition_report_v1_backup.md` (Backup baru dibuat)
5. `documentation/phase_12_1_1_selective_acquisition_report.md` (Diperbarui)
6. `documentation/phase_12_1_1_final_reconciliation_audit.md` (Dokumen audit baru)
7. `documentation/phase_12_1_1_change_log.md` (Change log baru)
8. `Fishguard_AI/master_reports/phase_12_1_1_selective_acquisition_report_v1_backup.md` (Backup baru dibuat)
9. `Fishguard_AI/master_reports/phase_12_1_1_selective_acquisition_report.md` (Diperbarui)
10. `Fishguard_AI/master_reports/phase_12_1_1_final_reconciliation_audit.md` (Dokumen audit baru)
11. `Fishguard_AI/README.md` (Diperbarui daftar berkas dan status)

---
*Change log ini menjadi bagian dari audit trail resmi proyek FishGuard AI — ASIK V.*
