# Dataset Audit Summary Tables (Phase 03)
Audit Executed: `2026-11-18T15:05:52.651269`

| File Name | Rows | Columns | Size (KB) | Missing Cells | Duplicates | SHA-256 (prefix) |
|---|---|---|---|---|---|---|
| `ppn_karangantu_operasional_kapal.csv` | 17 | 4 | 1.09 KB | 0 | 0 | `49885a03384d...` |
| `ppn_karangantu_pemasaran_keluar.csv` | 8 | 4 | 0.4 KB | 0 | 0 | `a80725978bb9...` |
| `ppn_karangantu_pemasaran_masuk.csv` | 18 | 4 | 0.77 KB | 0 | 0 | `c303e9b4efc9...` |
| `ppn_karangantu_pendaratan_bulanan.csv` | 67 | 7 | 5.32 KB | 0 | 0 | `249dd8456b31...` |
| `ppn_karangantu_pendaratan_harian.csv` | 30 | 7 | 2.39 KB | 0 | 0 | `7a2ef240729e...` |
| `ppn_karangantu_pendaratan_mingguan.csv` | 37 | 7 | 3.01 KB | 0 | 0 | `199c0194a78e...` |
| `ppn_karangantu_produksi_bulanan_2026.csv` | 12 | 5 | 0.48 KB | 0 | 0 | `c05bf22bf5be...` |
| `target_species_cpue_msy_summary.csv` | 3 | 13 | 0.66 KB | 0 | 0 | `10125c58d46e...` |
| `target_species_landings.csv` | 9 | 11 | 1.28 KB | 0 | 0 | `60cd00834fa4...` |


## Target Species Landings Profile

Columns profiled:
- **species_id** (`str`): Unique=3, Missing=0 (0.0%)
- **scientific_name** (`str`): Unique=3, Missing=0 (0.0%)
- **local_name** (`str`): Unique=3, Missing=0 (0.0%)
- **family** (`str`): Unique=3, Missing=0 (0.0%)
- **category** (`str`): Unique=2, Missing=0 (0.0%)
- **frequency** (`str`): Unique=3, Missing=0 (0.0%)
- **id_jenis_ikan** (`int64`): Unique=3, Missing=0 (0.0%)
  - Min=93.0, Max=163.0, Mean=124.0, Outliers(IQR)=0
- **nama_sistem** (`str`): Unique=3, Missing=0 (0.0%)
- **volume_kg** (`float64`): Unique=9, Missing=0 (0.0%)
  - Min=1283.0, Max=34251.0, Mean=11639.56, Outliers(IQR)=0
- **harga_rata_rata_idr** (`float64`): Unique=7, Missing=0 (0.0%)
  - Min=2722.0, Max=24000.0, Mean=10478.78, Outliers(IQR)=0
- **nilai_total_est_idr** (`float64`): Unique=9, Missing=0 (0.0%)
  - Min=3703920.0, Max=822024000.0, Mean=140384649.11, Outliers(IQR)=1
