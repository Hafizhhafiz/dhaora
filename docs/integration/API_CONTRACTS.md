# ASIK PLATFORM — UNIFIED API CONTRACTS (CHECKPOINT 2)
**Base Host:** `http://127.0.0.1:8000` (FastAPI) | **Reverse Proxy:** `http://localhost:5173/api`  
**Standard Error Envelope:**
```json
{
  "detail": "Error description message"
}
```

---

## 1. Modul 1: FishGuard AI Endpoints (Preserved Legacy Contracts)

### 1.1 `GET /api/health`
Mengembalikan status kesehatan backend FishGuard dan model AI aktif.
* **Response (200 OK):**
```json
{
  "status": "healthy",
  "model_mode": "CUSTOM_SPECIES_MODEL",
  "is_custom_trained": true,
  "custom_weights_exist": true,
  "custom_weights_path": "backend/weights/fishguard_yolo.pt",
  "active_model_path": "backend/weights/fishguard_yolo.pt",
  "static_dir_exists": true,
  "uploads_count": 70,
  "results_count": 89
}
```

### 1.2 `GET /api/model/status`
Mengembalikan status 3 spesies target MVP yang dikunci.
* **Response (200 OK):**
```json
{
  "model_mode": "CUSTOM_SPECIES_MODEL",
  "is_custom_trained": true,
  "active_model_path": "backend/weights/fishguard_yolo.pt",
  "classes_count": 3,
  "species_supported": [
    "Rastrelliger brachysoma",
    "Selaroides leptolepis",
    "Upeneus sulphureus"
  ],
  "operational_reference": "PPN Karangantu, Teluk Banten"
}
```

### 1.3 `POST /api/detect`
Mengunggah citra untuk inferensi deteksi spesies target, penghitungan jumlah ekor, dan komposisi hasil tangkapan.
* **Content-Type:** `multipart/form-data`
* **Form Parameters:**
  * `file`: Berkas citra (JPG, PNG, WebP, maks 15 MB)
  * `confidence`: Float antara 0.10 dan 0.90 (default 0.25, rekomendasi operasional $\ge 0.50$)
* **Response (200 OK):**
```json
{
  "id": "2938dcff",
  "timestamp": "2026-11-18 06:12:34",
  "filename": "sample_test_01.jpg",
  "image_url": "/static/uploads/2938dcff_sample_test_01.jpg",
  "result_image_url": "/static/results/detected_...jpg",
  "total_count": 4,
  "brachysoma_count": 1,
  "leptolepis_count": 2,
  "sulphureus_count": 1,
  "other_count": 0,
  "species_breakdown": {
    "brachysoma": 1,
    "leptolepis": 2,
    "sulphureus": 1,
    "other": 0
  },
  "composition_percentages": {
    "brachysoma": 25.0,
    "leptolepis": 50.0,
    "sulphureus": 25.0,
    "other": 0.0
  },
  "detections": [
    {
      "box": [112.0, 140.0, 420.0, 260.0],
      "class_id": 1,
      "class_name": "leptolepis",
      "scientific_name": "Selaroides leptolepis",
      "common_name": "Selar Kuning",
      "family": "Carangidae",
      "confidence": 0.8845
    }
  ],
  "inference_time_ms": 182.4,
  "model_version": "YOLO (CUSTOM_SPECIES_MODEL)",
  "model_mode": "CUSTOM_SPECIES_MODEL",
  "notes": []
}
```

### 1.4 `POST /api/measure`
Mengukur panjang ikan (Total Length) terkalibrasi penanda optik ArUco 50 mm atau input manual.
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "image_path": "/static/uploads/sample.jpg",
  "calibration": {
    "mode": "aruco_marker",
    "marker_size_cm": 5.0,
    "pixels_per_cm": null
  },
  "snout_point": null,
  "tail_point": null
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "total_length_cm": 16.02,
  "pixel_distance": 320.1,
  "scale_px_per_cm": 19.98,
  "is_calibrated": true,
  "curvature_ratio": 1.0444,
  "validation_status": "VALIDATED",
  "uncertainty_cm": 0.56,
  "confidence_interval_95": [15.46, 16.58],
  "measured_image_url": "/static/results/measured_...jpg",
  "warnings": [],
  "scientific_disclaimer": "..."
}
```

### 1.5 `GET /api/history` & `GET /api/statistics`
* `GET /api/history?limit=50`: Mengembalikan daftar rekaman pendaratan sebelumnya.
* `GET /api/statistics`: Mengembalikan agregasi total ikan, breakdown per spesies, dan rekaman terkini.

---

## 2. Modul 2: ByCatch AI Endpoints (`/api/bycatch/*`)

### 2.1 `GET /api/bycatch/health`
Mengembalikan status model ByCatch, snapshot konservasi (IUCN/CITES), registri KKP, dan database.
* **Response (200 OK):**
```json
{
  "module": "ByCatch AI",
  "status": "healthy",
  "model_status": "ready",
  "active_model_name": "ByCatch YOLO Target & Bycatch Model",
  "classes_supported": [
    "kembung_perempuan",
    "selar_kuning",
    "kuniran"
  ],
  "conservation_sources": {
    "iucn_snapshot_available": true,
    "cites_snapshot_available": true,
    "kkp_regulations_available": true
  },
  "database_connected": true
}
```

### 2.2 `POST /api/bycatch/detect`
Menjalankan inferensi deteksi ikan lengkap dengan konteks trip nelayan (alat tangkap, target trip, penanganan tangkapan).
* **Content-Type:** `multipart/form-data`
* **Form Parameters:**
  * `file`: Berkas citra (JPG, PNG, WebP)
  * `target_species`: String nama spesies target trip nelayan (misal: "Selar kuning; Kembung perempuan")
  * `fishing_gear`: Jenis alat tangkap (misal: "Jaring Insang / Gillnet")
  * `catch_handling`: "retained" (disimpan untuk jual/konsumsi) atau "discarded" (dibuang ke laut)
  * `confidence`: Float antara 0.10 dan 0.90 (default 0.25)
* **Response (200 OK):**
```json
{
  "status": "success",
  "analysis_id": "bc_9a41c2ef",
  "filename": "pendaratan_trip_01.jpg",
  "image_url": "/static/uploads/bc_9a41c2ef_pendaratan_trip_01.jpg",
  "result_image_url": "/static/results/bc_detected_...jpg",
  "trip_context": {
    "fishing_gear": "Jaring Insang / Gillnet",
    "target_species": "Selar kuning; Kembung perempuan",
    "catch_handling": "retained"
  },
  "total_detected": 3,
  "summary": {
    "target_count": 2,
    "bycatch_count": 1,
    "bycatch_ratio_percent": 33.3
  },
  "detections": [
    {
      "class_id": 1,
      "class_name": "selar_kuning",
      "scientific_name": "Selaroides leptolepis",
      "common_name": "Selar Kuning",
      "confidence": 0.892,
      "bbox_pixel": [120, 150, 410, 270],
      "catch_role": {
        "role": "target",
        "rule_id": "RULE_01_TARGET_MATCH",
        "evidence": "'selar_kuning' is explicitly listed in trip target species.",
        "is_target": true,
        "is_bycatch": false
      },
      "conservation": {
        "iucn_category": "Least Concern (LC)",
        "cites_appendix": "Not Listed",
        "national_protection": "Tidak Dilindungi / Non-Protected"
      }
    },
    {
      "class_id": 2,
      "class_name": "kuniran",
      "scientific_name": "Upeneus sulphureus",
      "common_name": "Kuniran",
      "confidence": 0.764,
      "bbox_pixel": [430, 180, 620, 290],
      "catch_role": {
        "role": "incidental_non_target_retained",
        "rule_id": "RULE_02_INCIDENTAL_RETAINED",
        "evidence": "'kuniran' is not in target list but was retained on board.",
        "is_target": false,
        "is_bycatch": true
      },
      "conservation": {
        "iucn_category": "Least Concern (LC)",
        "cites_appendix": "Not Listed",
        "national_protection": "Tidak Dilindungi / Non-Protected"
      }
    }
  ],
  "disclaimer": "Hasil klasifikasi peran tangkapan dan status konservasi merupakan penyaringan otomatis untuk pemantauan perikanan, bukan penetapan hukum status spesies."
}
```

### 2.3 `POST /api/bycatch/roles`
Evaluasi aturan peran tangkapan murni tanpa inferensi citra (rule engine tester).
* **Request Body:**
```json
{
  "detected_species_name": "kuniran",
  "target_species": "selar kuning",
  "catch_handling": "retained",
  "gear_info": "jaring insang"
}
```
* **Response (200 OK):**
```json
{
  "catch_role": "incidental_non_target_retained",
  "rule_id": "RULE_02_INCIDENTAL_RETAINED",
  "evidence": "'kuniran' is not in target list ('selar kuning') but was retained on board.",
  "is_target": false,
  "is_bycatch": true
}
```

### 2.4 `GET /api/bycatch/conservation/{scientific_name}`
Mengambil profil konservasi lengkap dari nama ilmiah terverifikasi.
* **Path Parameter:** `scientific_name` (misal `Upeneus sulphureus` atau `Rastrelliger brachysoma`)
* **Response (200 OK):**
```json
{
  "scientific_name": "Upeneus sulphureus",
  "accepted_name": "Upeneus sulphureus Cuvier, 1829",
  "family": "Mullidae",
  "order": "Perciformes",
  "worms_aphia_id": 218683,
  "fishbase_speccode": 4543,
  "iucn": {
    "status": "found",
    "iucn_status": "LC",
    "category_name": "Least Concern",
    "assessment_year": 2019,
    "population_trend": "Unknown",
    "source": "IUCN Red List of Threatened Species v4"
  },
  "cites": {
    "status": "found",
    "cites_appendix": "NC",
    "is_listed": false,
    "listing_notes": "Not covered by CITES Appendices I, II, or III"
  },
  "national_protection": {
    "status": "unprotected",
    "protection_level": "Tidak Dilindungi",
    "regulation_reference": "Permen LHK P.106/2018 & Kepmen KP No. 1/2021"
  },
  "legal_disclaimer": "Data konservasi bersumber dari snapshot resmi otoritatif dan ditujukan sebagai panduan awal pemantauan perikanan."
}
```

### 2.5 `GET /api/bycatch/records`
Mengambil riwayat pencatatan tangkapan sampingan dari `bycatch/data/app.sqlite`.
