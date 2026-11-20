# CatchForecast AI — Data Management Directory

Struktur folder ini mengelola seluruh dataset lingkungan (oseanografi/satelit) dan perikanan (catch records) untuk Teluk Banten.

## 1. Struktur Folder

```text
data/
├── raw/
│   ├── oceanographic/    # Data mentah oseanografi hasil ekspor GEE / satelit / reanalysis
│   └── fisheries/        # Data mentah perikanan (PPI/TPI Karangantu, DKP, statistik)
├── interim/              # Data perantara hasil pembersihan awal, filter spasial, reproyeksi
├── processed/
│   ├── environmental/    # Master grid lingkungan terstandardisasi (~1 km, bulanan)
│   └── species/          # Tiga dataset tangkapan terpisah per spesies:
│       ├── rastrelliger/ # Rastrelliger brachysoma (Kembung)
│       ├── selaroides/   # Selaroides leptolepis (Selar kuning)
│       └── upeneus/      # Upeneus sulphureus (Kuniran)
└── external/             # Data pendukung eksternal (vektor batas Teluk Banten, batimetri GEBCO)
```

## 2. Aturan Baku Manajemen Data

1. **Immutability Raw Data**: File di dalam `data/raw/` bersifat *read-only*. Jangan pernah mengubah, menimpa (*overwrite*), atau menghapus file asli. Seluruh perlakuan pembersihan harus menghasilkan file baru di `interim/` atau `processed/`.
2. **Larangan Data Sintetis**: Tidak ada training model dengan data sintetis yang disamarkan sebagai data penelitian aktual.
3. **Pemisahan Spesies**: Sesuai Master Project Brief, dataset tangkapan untuk *Rastrelliger brachysoma*, *Selaroides leptolepis*, dan *Upeneus sulphureus* **wajib dipisahkan** sejak awal. Jangan pernah menggabungkan ketiganya menjadi satu target.
4. **Perlindungan Data Sensitif**: Data operasional nelayan individu atau informasi rahasia tidak boleh di-push ke repository publik (terisolasi oleh `.gitignore`).
5. **Metadata Provenance**: Setiap dataset yang dimasukkan harus memiliki catatan provenance (sumber, tanggal akuisisi, lisensi, unit, CRS, dan status verifikasi).
