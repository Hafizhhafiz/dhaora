# DEVELOPER GUIDE — CatchForecast AI
**Dokumentasi Pengembang & Arsitektur Teknis Sistem**

---

## 1. Struktur Repositori & Pipeline Kode

```
CatchForecast-AI/
├── backend/
│   └── main.py                     # Server REST API FastAPI
├── frontend/
│   └── index.html                  # Dashboard SPA Web GIS (Leaflet 1.9.4)
├── config/
│   └── environmental_grid_config.json # Konfigurasi grid spasial 1 km
├── data/
│   ├── raw/fisheries/              # Data pendaratan riil PIPP KKP Karangantu
│   ├── processed/environmental/    # Master grid oseanografi (798 sel laut)
│   ├── processed/species/          # Dataset terisolasi per spesies (8.778 baris/file)
│   └── processed/maps/             # Layer GeoJSON RFC 7946 & metadata peta
├── gee/
│   └── scripts/                    # Skrip Google Earth Engine (AOI, SST, Front, Batimetri)
├── models/                         # Model biner .joblib & metadata JSON
│   ├── rastrelliger/
│   ├── selaroides/
│   └── upeneus/
├── src/
│   ├── data/                       # Ingest & pipeline data lingkungan dan spesies
│   ├── features/                   # Skrip EDA statistik, VIF, dan Moran's I
│   ├── models/                     # Skrip pelatihan ML independen
│   ├── evaluation/                 # Skrip evaluasi model & model MSY bioekonomi
│   └── mapping/                    # Skrip kartografi spasial & GeoJSON builder
└── tests/                          # 33 pengujian unit otomatis end-to-end
```

---

## 2. Alur Eksekusi Data-to-Model-to-Map

```
[PIPP KKP Karangantu + NASA MUR SST + ETOPO1 Batimetri]
                    │
                    ▼
     [src/data/environmental_pipeline.py]
  (Grid 1 km, Konvolusi Sobel 3x3, 798 Sel Laut)
                    │
                    ▼
     [src/data/species_data_pipeline.py]
  (Alokasi Habitat Mass-Conserving, 3 Dataset Spesies)
                    │
                    ▼
     [src/models/train_species_models.py]
  (Temporal Holdout & Spatial Holdout, Random Forest)
                    │
                    ▼
     [src/evaluation/evaluate_models.py]
  (Audit Residual, Homoskedastisitas, Status PASS)
                    │
                    ▼
     [src/mapping/generate_prediction_maps.py]
  (GeoJSON Poligon EPSG:4326 + Peta PNG 300 DPI)
                    │
                    ▼
       [backend/main.py (FastAPI)]
                    │
                    ▼
        [frontend/index.html (Leaflet)]
```

---

## 3. Cara Menjalankan Pengujian Otomatis

Eksekusi seluruh 33 unit test otomatis:
```powershell
python -m pytest CatchForecast-AI/tests -v
```

Untuk menjalankan pengujian modul tertentu:
```powershell
python -m pytest CatchForecast-AI/tests/test_backend_api.py -v
python -m pytest CatchForecast-AI/tests/test_model_inference.py -v
python -m pytest CatchForecast-AI/tests/test_prediction_maps.py -v
```

---

## 4. Retraining Model dengan Data Baru

Jika terdapat data pendaratan baru dari PIPP KKP atau data satelit bulanan terkini:
1. Tempatkan CSV pendaratan baru di `data/raw/fisheries/`.
2. Jalankan pipeline penyelarasan lingkungan:
   ```powershell
   python CatchForecast-AI/src/data/environmental_pipeline.py
   ```
3. Jalankan pipeline data spesies:
   ```powershell
   python CatchForecast-AI/src/data/species_data_pipeline.py
   ```
4. Latih ulang model:
   ```powershell
   python CatchForecast-AI/src/models/train_species_models.py
   ```
5. Evaluasi dan perbarui peta prediksi:
   ```powershell
   python CatchForecast-AI/src/evaluation/evaluate_models.py
   python CatchForecast-AI/src/mapping/generate_prediction_maps.py
   ```
6. Jalankan pytest untuk memverifikasi tidak ada regresi.
