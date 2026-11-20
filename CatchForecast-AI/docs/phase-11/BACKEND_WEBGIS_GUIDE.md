# BACKEND & WEB GIS USER GUIDE — CatchForecast AI
**Aplikasi:** CatchForecast AI Web GIS Dashboard  
**Framework:** FastAPI + Leaflet.js  
**Wilayah Cakupan:** Teluk Banten, Indonesia (WPPNRI 712)  
**Status Gate:** COMPLETED & OPERATIONAL  

---

## 1. Arsitektur Aplikasi

Aplikasi CatchForecast AI Web GIS mengadopsi pola arsitektur *Client-Server decoupled* yang ringan dan efisien:
```
CatchForecast-AI/
├── backend/
│   └── main.py              # FastAPI REST API Engine
├── frontend/
│   └── index.html           # Single Page Application (Leaflet.js + Glassmorphism UI)
└── data/processed/maps/     # Lapisan spasial GeoJSON per spesies
    ├── rastrelliger_prediction_map.geojson
    ├── selaroides_prediction_map.geojson
    └── upeneus_prediction_map.geojson
```

---

## 2. Petunjuk Menjalankan Server Lokal

### A. Prasyarat Lingkungan
Pastikan dependensi utama telah terpasang:
```powershell
pip install fastapi uvicorn pydantic
```

### B. Perintah Menjalankan Server
Dari direktori akar `CatchForecast-AI`, jalankan:
```powershell
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Atau melalui Python module:
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### C. Mengakses Antarmuka
Buka peramban (*web browser*) pada URL:
- **Web GIS Dashboard:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Dokumentasi Interaktif OpenAPI/Swagger:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Dokumentasi Redoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 3. Dokumentasi REST API Endpoints

### 1. `GET /`
- **Deskripsi:** Menyajikan dashboard interaktif Web GIS Leaflet.
- **Content-Type:** `text/html; charset=utf-8`

### 2. `GET /api/health`
- **Deskripsi:** Health-check sistem dan status operasional gate model.
- **Respons JSON:**
  ```json
  {
    "status": "healthy",
    "project": "CatchForecast AI",
    "release": "ASIK Vol. VI",
    "active_models_count": 3,
    "domain": "Teluk Banten (WPPNRI 712)",
    "server_time_utc": "2026-11-20T...",
    "validation_gate_status": "PASS"
  }
  ```

### 3. `GET /api/species`
- **Deskripsi:** Katalog 3 spesies target beserta alat tangkap acuan dan akurasi model ($R^2$).

### 4. `GET /api/metadata`
- **Deskripsi:** Batas domain spasial Teluk Banten (`105.90°–106.35° BT`, `-6.15°– -5.85° LS`), resolusi 1 km, jumlah sel aktif (798 laut, 628 darat), dan ringkasan PPN Karangantu.

### 5. `GET /api/predictions/{species_id}`
- **Parameter:** `species_id` (`rastrelliger`, `selaroides`, atau `upeneus`).
- **Deskripsi:** Mengembalikan FeatureCollection GeoJSON (798 poligon sel $1\text{ km}^2$) lengkap dengan estimasi bobot tangkapan (`predicted_catch_kg`), proksi CPUE, SST, dan kedalaman batimetri.
- **Error Handling:** Mengembalikan `HTTP 404` jika spesies tidak dikenali.

### 6. `GET /api/predictions/{species_id}/summary`
- **Deskripsi:** Menyajikan ringkasan statistik cepat (Total catch, Mean per cell, Min, Max).

---

## 4. Fitur Antarmuka Web GIS

1. **Pengalih Spesies Instan (*One-Click Species Switcher*):**
   - Mengganti visualisasi choropleth antara Kembung Perempuan, Selar Kuning, dan Kuniran tanpa memuat ulang halaman (*zero page reload*).
2. **Inspektur Sel Real-Time (*Hover & Click Inspector*):**
   - Mengarahkan kursor (*hover*) ke sel manapun akan menampilkan identitas sel, koordinat, estimasi tangkapan, dan suhu air pada panel mengambang di pojok kanan atas.
   - Mengklik sel membuka *modal popup* rinci yang memuat estimasi bobot tangkapan, nilai CPUE per trip, kedalaman dasar laut, dan jarak ke pantai.
3. **Pangkalan Pendaratan PPN Karangantu:**
   - Ditandai dengan simbol bintang merah berdenyut pada koordinat `6.033° LS, 106.150° BT` lengkap dengan ringkasan statistik produksi pelabuhan tahun 2026.
4. **Kontrol Multi-Basemap:**
   - Pengguna dapat memilih antara CartoDB Dark Canvas, OpenStreetMap Standar, atau Esri Ocean Basemap.
