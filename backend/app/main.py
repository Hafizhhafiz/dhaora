from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import STATIC_DIR, ALLOWED_ORIGINS, UPLOAD_DIR, RESULT_DIR, CUSTOM_WEIGHTS_PATH, PRETRAINED_FALLBACK
from .routers import detection, measurement, history, bycatch
from .services.storage_service import init_db
from .services.yolo_service import yolo_service_instance

# Initialize database
init_db()

app = FastAPI(
    title="ASIK VOL VI Unified Platform API",
    description="Unified API untuk FishGuard AI (Monitoring Perikanan) dan ByCatch AI (Deteksi Tangkapan Sampingan & Konservasi)",
    version="1.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend client
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads and annotated results
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers (FishGuard legacy endpoints preserved 100%, ByCatch added cleanly)
app.include_router(detection.router)
app.include_router(measurement.router)
app.include_router(history.router)
app.include_router(bycatch.router)

@app.get("/")
def root():
    return {
        "project": "FishGuard AI",
        "platform": "ASIK VOL VI Unified Fisheries Platform",
        "description": "Unified AI Platform for Fisheries Monitoring and Conservation Support",
        "status": "online",
        "modules": {
            "fishguard": {"status": "active", "prefix": "/api"},
            "bycatch": {"status": "active", "prefix": "/api/bycatch"},
            "oceansense": {"status": "planned", "prefix": None}
        },
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    custom_exists = CUSTOM_WEIGHTS_PATH.exists() and CUSTOM_WEIGHTS_PATH.stat().st_size > 10000
    return {
        "status": "healthy",
        "model_mode": yolo_service_instance.model_mode,
        "is_custom_trained": yolo_service_instance.is_custom_trained,
        "custom_weights_exist": custom_exists,
        "custom_weights_path": str(CUSTOM_WEIGHTS_PATH),
        "active_model_path": yolo_service_instance.model_path,
        "static_dir_exists": STATIC_DIR.exists(),
        "uploads_count": len(list(UPLOAD_DIR.glob("*.*"))),
        "results_count": len(list(RESULT_DIR.glob("*.*")))
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
            else "Model khusus belum tersedia di backend/weights/fishguard_yolo.pt. Menggunakan baseline YOLOv8n (hanya mengenali objek umum, belum mengklasifikasikan spesies target spesifik)."
        )
    }

@app.post("/api/model/reload")
def reload_model_weights():
    status = yolo_service_instance.reload_model()
    return {
        "message": "Model weights reloaded successfully",
        "status": status
    }
