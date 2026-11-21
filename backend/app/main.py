"""
ASIK VOL VI — Unified Marine AI Platform (DHAORA Hub)
Fully merges:
1. CatchForecast AI (WebGIS Spasial & Oseanografi Prediktif Teluk Banten, WPPNRI 712)
2. FishGuard AI (Computer Vision: Deteksi, Pencacahan, Estimasi Panjang ArUco, Dataset)
3. ByCatch AI (Mitigasi Tangkapan Sampingan, Skrining Spesies Rentan ETP, Logbook Trip)
4. Unified History & Executive Intelligence
"""

import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, Response

from .config import STATIC_DIR, ALLOWED_ORIGINS, UPLOAD_DIR, RESULT_DIR, CUSTOM_WEIGHTS_PATH, PRETRAINED_FALLBACK
from .routers import detection, measurement, history, bycatch, gis, auth
from .services.storage_service import init_db
from .services.yolo_service import yolo_service_instance

# Paths to modules & static assets
BASE_DIR = Path(__file__).resolve().parent.parent.parent
TEST_DATASET_DIR = BASE_DIR / "datasets" / "fishguard_v001" / "images" / "test"
DATASETS_DIR = BASE_DIR / "datasets"
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
DHAORA_FRONTEND_DIST = BASE_DIR / "dhaora" / "frontend" / "dist"

# Initialize databases
init_db()

app = FastAPI(
    title="ASIK VOL VI / DHAORA — Unified Marine AI Platform",
    description="Sistem Terpadu CatchForecast AI (WebGIS), FishGuard AI (Computer Vision), dan ByCatch AI (Konservasi & ETP).",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files directories and graceful fallbacks
STATIC_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULT_DIR.mkdir(parents=True, exist_ok=True)

# Create .gitkeep to ensure persistence
(RESULT_DIR / ".gitkeep").touch(exist_ok=True)
(UPLOAD_DIR / ".gitkeep").touch(exist_ok=True)

@app.get("/static/results/{file_path:path}")
async def get_static_result_with_fallback(file_path: str):
    """Graceful static result delivery with SVG placeholder fallback to prevent 404s."""
    target = RESULT_DIR / file_path
    if target.is_file() and target.stat().st_size > 0:
        return FileResponse(str(target))
    placeholder = STATIC_DIR / "placeholder_catch.svg"
    if placeholder.is_file():
        return FileResponse(str(placeholder), media_type="image/svg+xml")
    return Response(status_code=204)

@app.get("/static/uploads/{file_path:path}")
async def get_static_upload_with_fallback(file_path: str):
    """Graceful static upload delivery with SVG placeholder fallback to prevent 404s."""
    target = UPLOAD_DIR / file_path
    if target.is_file() and target.stat().st_size > 0:
        return FileResponse(str(target))
    placeholder = STATIC_DIR / "placeholder_catch.svg"
    if placeholder.is_file():
        return FileResponse(str(placeholder), media_type="image/svg+xml")
    return Response(status_code=204)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if DATASETS_DIR.is_dir():
    app.mount("/datasets", StaticFiles(directory=str(DATASETS_DIR)), name="datasets")

# Include Core Subsystem Routers
app.include_router(gis.router)          # CatchForecast AI WebGIS (/api/gis/...)
app.include_router(detection.router)    # FishGuard Detection (/api/detect)
app.include_router(measurement.router)  # FishGuard Length Estimation (/api/measure)
app.include_router(history.router)      # Unified History & Stats (/api/history/...)
app.include_router(bycatch.router)      # ByCatch AI Module (/api/bycatch/...)
app.include_router(auth.router)         # Authentication & Access (/api/auth/...)

# ==============================================================================
# FISHGUARD ROUTER ALIASES (/api/fishguard/...) FOR CROSS-CLIENT COMPATIBILITY
# ==============================================================================

@app.get("/api/fishguard/status")
async def get_fishguard_status():
    """Returns AI model training readiness, taxonomy lock, and validation status."""
    custom_exists = CUSTOM_WEIGHTS_PATH.exists() and CUSTOM_WEIGHTS_PATH.stat().st_size > 10000
    return {
        "status": "ready",
        "model_mode": yolo_service_instance.model_mode,
        "is_custom_trained": yolo_service_instance.is_custom_trained,
        "custom_weights_present": custom_exists,
        "model_training_status": "CUSTOM_WEIGHTS_ACTIVE" if yolo_service_instance.is_custom_trained else "PRETRAINED_FALLBACK",
        "calibrator_status": "ArUco DICT_4X4_50 (50 mm) Ready",
        "target_location": "PPN Karangantu, Teluk Banten (WPPNRI 712)"
    }

@app.get("/api/fishguard/samples")
async def get_sample_images():
    """Returns a list of pre-configured sample images for rapid live testing."""
    samples = []
    if TEST_DATASET_DIR.is_dir():
        for file in sorted(TEST_DATASET_DIR.glob("*.jpg"))[:12]:
            samples.append({
                "filename": file.name,
                "label": file.stem.replace("synth_val_", "Sampel ").replace("_", " ").title(),
                "relative_path": f"datasets/fishguard_v001/images/test/{file.name}",
                "substrate": "Es Curah" if "ice" in file.name else ("Stainless Steel" if "stainless" in file.name else "Papan Ukur Kayu")
            })
    return {"samples": samples}

@app.post("/api/fishguard/detect")
async def fishguard_detect_alias(
    file: UploadFile = File(...),
    confidence: float = Form(0.25)
):
    """Direct alias for /api/detect."""
    return await detection.detect_fish(file=file, confidence=confidence)

@app.post("/api/fishguard/measure")
async def fishguard_measure_alias(
    payload: measurement.LengthMeasurementRequest,
    analysis_id: Optional[str] = None
):
    """Direct alias for /api/measure."""
    return await measurement.measure_fish_length(payload=payload, analysis_id=analysis_id)

# ==============================================================================
# SYSTEM HEALTH & META ENDPOINTS
# ==============================================================================

@app.get("/api/health")
def health_check():
    """Unified system health check verifying all three pillars."""
    custom_exists = CUSTOM_WEIGHTS_PATH.exists() and CUSTOM_WEIGHTS_PATH.stat().st_size > 10000
    return {
        "status": "healthy",
        "platform": "DHAORA",
        "long_name": "Digital Holistic Aquatic Observation & Research Analytics",
        "framework": "ASIK VOL VI Unified Marine AI Platform",
        "location": "PPN Karangantu, Teluk Banten (WPPNRI 712)",
        "modules": {
            "webgis_catchforecast": "READY",
            "fishguard_cv": "READY",
            "bycatch_conservation": "READY",
            "unified_history": "READY"
        },
        "model_mode": yolo_service_instance.model_mode,
        "is_custom_trained": yolo_service_instance.is_custom_trained,
        "custom_weights_exist": custom_exists,
        "custom_weights_path": str(CUSTOM_WEIGHTS_PATH),
        "active_model_path": yolo_service_instance.model_path,
        "static_dir_exists": STATIC_DIR.exists(),
        "uploads_count": len(list(UPLOAD_DIR.glob("*.*"))),
        "results_count": len(list(RESULT_DIR.glob("*.*"))),
        "timestamp_utc": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/model/status")
def model_status():
    custom_exists = CUSTOM_WEIGHTS_PATH.exists() and CUSTOM_WEIGHTS_PATH.stat().st_size > 10000
    return {
        "is_custom_trained": yolo_service_instance.is_custom_trained,
        "model_mode": yolo_service_instance.model_mode,
        "custom_weights_file": str(CUSTOM_WEIGHTS_PATH),
        "custom_weights_present": custom_exists,
        "fallback_weights": PRETRAINED_FALLBACK,
        "supported_target_species": [
            {"id": 0, "common_name": "Kembung Perempuan", "scientific_name": "Rastrelliger brachysoma", "family": "Scombridae"},
            {"id": 1, "common_name": "Selar Kuning", "scientific_name": "Selaroides leptolepis", "family": "Carangidae"},
            {"id": 2, "common_name": "Kuniran", "scientific_name": "Upeneus sulphureus", "family": "Mullidae"}
        ],
        "message": (
            "Model custom terlatih aktif untuk 3 spesies MVP."
            if yolo_service_instance.is_custom_trained
            else "Model baseline aktif untuk pemantauan tangkapan perikanan Teluk Banten."
        )
    }

@app.post("/api/model/reload")
def reload_model_weights():
    status = yolo_service_instance.reload_model()
    return {
        "message": "Model weights reloaded successfully",
        "status": status
    }

# ==============================================================================
# PRODUCTION SPA FALLBACK & STATIC SERVING
# ==============================================================================

dist_to_use = FRONTEND_DIST if FRONTEND_DIST.is_dir() else (DHAORA_FRONTEND_DIST if DHAORA_FRONTEND_DIST.is_dir() else None)

if dist_to_use and dist_to_use.is_dir():
    assets_dir = dist_to_use / "assets"
    
    @app.get("/assets/{asset_name:path}")
    async def serve_asset(asset_name: str):
        if not assets_dir.is_dir():
            raise HTTPException(status_code=404, detail="Assets directory not found")
        
        target = assets_dir / asset_name
        if target.is_file():
            return FileResponse(str(target))
        
        # Case-insensitive lookup (cures Linux case sensitivity discrepancy with browser cache)
        lower_name = asset_name.lower()
        for f in assets_dir.iterdir():
            if f.is_file() and f.name.lower() == lower_name:
                return FileResponse(str(f))
        
        # Graceful fallback for outdated hashed bundles from cached client index.html
        if asset_name.endswith(".js"):
            # Find the most recently modified .js bundle in assets
            js_files = sorted([f for f in assets_dir.glob("*.js")], key=lambda x: x.stat().st_mtime, reverse=True)
            if js_files:
                return FileResponse(str(js_files[0]), media_type="application/javascript")
        elif asset_name.endswith(".css"):
            css_files = sorted([f for f in assets_dir.glob("*.css")], key=lambda x: x.stat().st_mtime, reverse=True)
            if css_files:
                return FileResponse(str(css_files[0]), media_type="text/css")
                
        raise HTTPException(status_code=404, detail="Asset Not Found")

    @app.get("/{full_path:path}", response_class=HTMLResponse)
    async def serve_spa(full_path: str, request: Request):
        if full_path.startswith("api/") or full_path.startswith("static/") or full_path.startswith("datasets/"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        # Handle direct root requests for index-* bundles (e.g. /index-xxxx.js)
        if full_path.startswith("index-") and assets_dir.is_dir():
            return await serve_asset(full_path)
            
        # If client is an API client (TestClient, curl, python-requests) on root rather than browser
        accept = request.headers.get("accept", "")
        if full_path == "" and not accept.startswith("text/html"):
            return JSONResponse({
                "project": "FishGuard AI",
                "platform": "DHAORA ASIK VOL VI",
                "status": "online",
                "version": "2.0.0",
                "modules": {
                    "fishguard": {"name": "FishGuard AI", "status": "active", "version": "1.0.0"},
                    "bycatch": {"name": "ByCatch AI", "status": "active", "version": "1.0.0"},
                    "oceansense": {"name": "OceanSense", "status": "planned", "version": "0.1.0"}
                }
            })
        
        index_file = dist_to_use / "index.html"
        if index_file.is_file():
            return FileResponse(
                str(index_file),
                headers={
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            )
        return HTMLResponse("<h1>DHAORA / ASIK Platform Backend Active</h1><p>Frontend build in progress...</p>")
else:
    @app.get("/", response_class=HTMLResponse)
    async def fallback_home():
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head><title>DHAORA / ASIK VOL VI Unified Gateway</title></head>
        <body style="font-family:sans-serif;background:#080d1a;color:#e2e8f0;padding:40px;">
            <h1 style="color:#38bdf8;">DHAORA / ASIK VOL VI Unified Platform</h1>
            <p>Unified FastAPI Server is ACTIVE.</p>
            <ul>
                <li><a style="color:#38bdf8;" href="/docs">REST API Documentation (Swagger UI)</a></li>
                <li><a style="color:#38bdf8;" href="/api/health">Unified Health Check</a></li>
                <li><a style="color:#38bdf8;" href="/api/gis/species">CatchForecast WebGIS Species Catalog</a></li>
                <li><a style="color:#38bdf8;" href="/api/bycatch/health">ByCatch AI Health Check</a></li>
                <li><a style="color:#38bdf8;" href="/api/history/sessions">Unified Sessions History</a></li>
            </ul>
        </body>
        </html>
        """)
