import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"
RESULT_DIR = STATIC_DIR / "results"
WEIGHTS_DIR = BASE_DIR / "weights"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULT_DIR.mkdir(parents=True, exist_ok=True)
WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)

# Custom fishguard weights path
CUSTOM_WEIGHTS_PATH = WEIGHTS_DIR / "fishguard_yolo.pt"
PRETRAINED_FALLBACK = "yolov8n.pt"

# Database path (SQLite for MVP)
DATABASE_FILE = BASE_DIR / "fishguard_history.db"

# CORS origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# MVP Target Classes (Locked)
MVP_CLASSES = {
    0: "brachysoma",
    1: "leptolepis",
    2: "sulphureus"
}

# Taxonomy & Class Mapping (Locked MVP)
TAXONOMY_INFO = {
    "brachysoma": {
        "class_id": 0,
        "common_name": "Ikan Kembung Perempuan",
        "scientific_name": "Rastrelliger brachysoma",
        "family": "Scombridae",
        "habitat": "Pelagis pantai / Teluk Banten",
        "color": "#0ea5e9" # Sky Blue
    },
    "leptolepis": {
        "class_id": 1,
        "common_name": "Ikan Selar Kuning",
        "scientific_name": "Selaroides leptolepis",
        "family": "Carangidae",
        "habitat": "Demersal / Pelagis pantai",
        "color": "#eab308" # Yellow / Gold
    },
    "sulphureus": {
        "class_id": 2,
        "common_name": "Ikan Kuniran",
        "scientific_name": "Upeneus sulphureus",
        "family": "Mullidae",
        "habitat": "Demersal dasar berlumpur/berpasir",
        "color": "#f97316" # Orange / Amber
    },
    "other": {
        "class_id": -1,
        "common_name": "Ikan (Spesies Lain / General)",
        "scientific_name": "Actinopterygii indet.",
        "family": "Pisces",
        "habitat": "Perairan Teluk Banten",
        "color": "#94a3b8" # Slate
    }
}
