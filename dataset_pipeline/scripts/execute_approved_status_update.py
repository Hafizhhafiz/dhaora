import os
import shutil
import pandas as pd
import numpy as np

WORKSPACE_ROOT = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI"
PIPELINE_ROOT = os.path.join(WORKSPACE_ROOT, "dataset_pipeline")
METADATA_DIR = os.path.join(PIPELINE_ROOT, "metadata")
DOCS_DIR = os.path.join(WORKSPACE_ROOT, "documentation")

master_path = os.path.join(METADATA_DIR, "dataset_master.csv")
backup_path = os.path.join(METADATA_DIR, "dataset_master_backup_pre_phase10_1.csv")
log_path = os.path.join(DOCS_DIR, "phase_10_1_status_update_log.md")

# 1. Audit initial condition
print("=== 1. AUDITING INITIAL CONDITION ===")
df_orig = pd.read_csv(master_path)
print(f"Original shape: {df_orig.shape}")
print(f"Columns: {df_orig.columns.tolist()}")
orig_counts = df_orig['verification_status'].value_counts().to_dict()
print(f"Original verification_status counts: {orig_counts}")
orig_source_counts = df_orig['source_type'].value_counts().to_dict()
print(f"Original source_type counts: {orig_source_counts}")

# 2. Create backup
print("\n=== 2. CREATING BACKUP ===")
shutil.copy2(master_path, backup_path)
print(f"Backup created at: {backup_path}")
assert os.path.exists(backup_path), "Backup creation failed!"
print(f"Backup size: {os.path.getsize(backup_path)} bytes")

# 3. Perform Status Updates
print("\n=== 3. PERFORMING STATUS UPDATES ===")
df_updated = df_orig.copy()

# Filter conditions
mask_rkan_verified = (df_updated['source_type'] == 'PUBLIC_GBIF') & \
                     (df_updated['scientific_name'] == 'Rastrelliger kanagurta') & \
                     (df_updated['verification_status'] == 'VERIFIED')

mask_candidate = (df_updated['source_type'] == 'PUBLIC_GBIF') & \
                 (df_updated['verification_status'] == 'CANDIDATE')

mask_synthetic = (df_updated['source_type'] == 'SYNTHETIC_TEST')

count_rkan_verified = mask_rkan_verified.sum()
count_candidate = mask_candidate.sum()
count_synthetic = mask_synthetic.sum()

print(f"Matching rows for RKAN VERIFIED -> PRIORITY_CANDIDATE: {count_rkan_verified}")
print(f"Matching rows for CANDIDATE -> METADATA_SCREENED: {count_candidate}")
print(f"Synthetic rows to preserve untouched: {count_synthetic}")

assert count_rkan_verified == 75, f"Expected 75 RKAN VERIFIED, got {count_rkan_verified}"
assert count_candidate == 100, f"Expected 100 CANDIDATE, got {count_candidate}"
assert count_synthetic == 8, f"Expected 8 SYNTHETIC_TEST, got {count_synthetic}"

# Apply update
df_updated.loc[mask_rkan_verified, 'verification_status'] = 'PRIORITY_CANDIDATE'
df_updated.loc[mask_candidate, 'verification_status'] = 'METADATA_SCREENED'

# 4. Strict Validation
print("\n=== 4. STRICT POST-UPDATE VALIDATION ===")
# 4.1 Total rows
assert len(df_updated) == 183, f"Total rows changed! Expected 183, got {len(df_updated)}"
assert df_updated.shape == df_orig.shape, "Shape mismatch!"
print("Assertion Passed: Total rows remain exactly 183.")

# 4.2 Synthetic data intact
synthetic_orig = df_orig[mask_synthetic]
synthetic_updated = df_updated[mask_synthetic]
pd.testing.assert_frame_equal(synthetic_orig, synthetic_updated)
print("Assertion Passed: All 8 SYNTHETIC_TEST rows are 100% identical and intact.")

# 4.3 Total GBIF candidates
gbif_count = (df_updated['source_type'] == 'PUBLIC_GBIF').sum()
assert gbif_count == 175, f"Expected 175 GBIF rows, got {gbif_count}"
print("Assertion Passed: Total GBIF rows remain exactly 175.")

# 4.4 Status breakdown
new_status_counts = df_updated['verification_status'].value_counts().to_dict()
print(f"New verification_status counts: {new_status_counts}")
assert new_status_counts.get('PRIORITY_CANDIDATE', 0) == 75, f"Expected 75 PRIORITY_CANDIDATE, got {new_status_counts.get('PRIORITY_CANDIDATE')}"
assert new_status_counts.get('METADATA_SCREENED', 0) == 100, f"Expected 100 METADATA_SCREENED, got {new_status_counts.get('METADATA_SCREENED')}"
assert new_status_counts.get('VERIFIED', 0) == 8, f"Expected 8 VERIFIED (synthetic), got {new_status_counts.get('VERIFIED')}"
print("Assertion Passed: Status counts match target exactly (75 PRIORITY_CANDIDATE, 100 METADATA_SCREENED, 8 VERIFIED synthetic).")

# 4.5 Check no changes to other 24 columns
non_status_cols = [c for c in df_orig.columns if c != 'verification_status']
for c in non_status_cols:
    s_orig = df_orig[c].fillna("__NULL__")
    s_upd = df_updated[c].fillna("__NULL__")
    assert (s_orig == s_upd).all(), f"Unauthorized change detected in column '{c}'!"
print("Assertion Passed: Zero changes to any other column. All other 24 columns are bit-identical.")

# 5. Save updated master catalog
print("\n=== 5. SAVING UPDATED MASTER CATALOG ===")
df_updated.to_csv(master_path, index=False, encoding='utf-8')
print(f"Successfully saved updated catalog to: {master_path}")

# 6. Generate phase_10_1_status_update_log.md
print("\n=== 6. GENERATING UPDATE LOG ===")
log_content = f"""# PHASE 10.1 STATUS UPDATE EXECUTION LOG
## FishGuard AI — ASIK V

**Tanggal Eksekusi:** {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Pelaksana:** Senior Dataset Auditor & Fisheries Data Scientist  
**Tujuan:** Penyesuaian Ilmiah Status Taksonomi Katalog Master FishGuard AI  
**Status Eksekusi:** ✅ BERHASIL & TERVALIDASI 100%  

---

## 1. Ringkasan Eksekusi Pembaruan

Sesuai instruksi yang disetujui pada **PHASE 10.1 APPROVED STATUS UPDATE**, pembaruan status taksonomi telah diaplikasikan secara terkontrol pada [`dataset_pipeline/metadata/dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv).

| Spesies Target | Sumber Data | Status Lama | Status Baru | Jumlah Berkas | Keterangan Ilmiah |
|---|---|---|---|---|---|
| *Rastrelliger kanagurta* | `PUBLIC_GBIF` | `VERIFIED` | **`PRIORITY_CANDIDATE`** | **75** | Spesimen iNaturalist asal Indonesia; prioritas utama verifikasi laboratorium/lapang. |
| *Decapterus macarellus* & *R. kanagurta* (Global) | `PUBLIC_GBIF` | `CANDIDATE` | **`METADATA_SCREENED`** | **100** | Spesimen asal perairan internasional & museum; lolos skrining metadata dasar. |
| *R. kanagurta* & Campuran | `SYNTHETIC_TEST` | `VERIFIED` | **`VERIFIED`** | **8** | Data sintetis kalibrasi awal internal (tetap utuh tanpa perubahan). |
| **TOTAL** | — | — | — | **183** | **Zero Data Loss** |

---

## 2. Prosedur Keamanan & Backup

1. **Audit Pra-Modifikasi**: Kondisi awal diperiksa via skrip komputasi.
2. **Berkas Cadangan (Backup)**:
   * Jalur: [`dataset_pipeline/metadata/dataset_master_backup_pre_phase10_1.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master_backup_pre_phase10_1.csv)
   * Ukuran: {os.path.getsize(backup_path)} bytes
   * Integritas: Salinan biner utuh sebelum eksekusi pembaruan.
3. **Integritas Berkas Citra**: Tidak ada berkas citra yang dipindahkan, diubah, atau dihapus pada direktori `data/public/gbif/`.
4. **Pembatasan Kolom**: Hanya kolom `verification_status` yang dimodifikasi. 24 kolom lainnya diproteksi ketat.
5. **Kebijakan Model**: Tidak ada proses pelatihan model (*zero model training*).

---

## 3. Hasil Pengujian dan Validasi Ketat

Seluruh asersi validasi (*automated assertions*) telah terpenuhi 100%:

| Kriteria Validasi | Target Kebutuhan | Nilai Aktual Terverifikasi | Status Asersi |
|---|---|---|---|
| **Total Baris Katalog Master** | Tepat 183 baris | 183 baris | ✅ **PASSED** |
| **Jumlah Baris Data Sintetis** | Tepat 8 baris | 8 baris (100% identik frame) | ✅ **PASSED** |
| **Jumlah Baris Kandidat GBIF** | Tepat 175 baris | 175 baris | ✅ **PASSED** |
| **Jumlah `PRIORITY_CANDIDATE`** | Tepat 75 baris | 75 baris | ✅ **PASSED** |
| **Jumlah `METADATA_SCREENED`** | Tepat 100 baris | 100 baris | ✅ **PASSED** |
| **Jumlah `VERIFIED` (Sintetis)** | Tepat 8 baris | 8 baris | ✅ **PASSED** |
| **Integritas 24 Kolom Lainnya** | Zero modification | Zero modification (Bit-identical) | ✅ **PASSED** |

---

## 4. Daftar Berkas yang Terlibat

1. 🗃️ **Katalog Master Terkini**: [`dataset_pipeline/metadata/dataset_master.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master.csv)
2. 💾 **Berkas Cadangan (Backup)**: [`dataset_pipeline/metadata/dataset_master_backup_pre_phase10_1.csv`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/metadata/dataset_master_backup_pre_phase10_1.csv)
3. 📄 **Log Eksekusi Status Update**: [`documentation/phase_10_1_status_update_log.md`](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/documentation/phase_10_1_status_update_log.md)

---
*FishGuard AI Dataset Governance Team — Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
"""

with open(log_path, "w", encoding='utf-8') as f:
    f.write(log_content.strip())
print(f"Successfully generated log at: {log_path}")

print("\nALL TASKS COMPLETED SUCCESSFULLY!")
