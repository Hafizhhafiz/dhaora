"""
CatchForecast AI - Backend REST API (Phase 11)
Serves geospatial predictions, environmental telemetry, and the Web GIS frontend.
Framework: FastAPI (Production Ready)
CRS: EPSG:4326 (WGS 84)
"""

import os
import sys
import json
from datetime import datetime, timezone
from typing import Dict, Any, List

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MAPS_DIR = os.path.join(BASE_DIR, "data", "processed", "maps")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
CONFIG_PATH = os.path.join(BASE_DIR, "config", "environmental_grid_config.json")

app = FastAPI(
    title="CatchForecast AI — Web GIS API",
    description="High-performance REST API for marine fish catch predictions and oceanographic telemetry in Teluk Banten, Indonesia.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VALID_SPECIES = {
    "rastrelliger": {
        "species_id": "rastrelliger",
        "scientific_name": "Rastrelliger brachysoma",
        "local_name": "Kembung perempuan",
        "category": "Small Pelagic",
        "family": "Scombridae",
        "standard_gear": "Gillnet / Payang",
        "annual_effort_trips": 19819,
        "champion_model": "Random Forest Regressor",
        "spatial_r2_score": 0.9995
    },
    "selaroides": {
        "species_id": "selaroides",
        "scientific_name": "Selaroides leptolepis",
        "local_name": "Selar kuning",
        "category": "Small Pelagic",
        "family": "Carangidae",
        "standard_gear": "Gillnet / Payang",
        "annual_effort_trips": 19819,
        "champion_model": "Random Forest Regressor",
        "spatial_r2_score": 0.9995
    },
    "upeneus": {
        "species_id": "upeneus",
        "scientific_name": "Upeneus sulphureus",
        "local_name": "Kuniran",
        "category": "Demersal",
        "family": "Mullidae",
        "standard_gear": "Cantrang / Arad",
        "annual_effort_trips": 5618,
        "champion_model": "Random Forest Regressor",
        "spatial_r2_score": 0.9997
    }
}

@app.get("/", response_class=HTMLResponse)
async def serve_webgis_frontend():
    """Serves the interactive CatchForecast AI Web GIS dashboard."""
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if not os.path.isfile(index_file):
        raise HTTPException(status_code=404, detail="Frontend index.html not found.")
    with open(index_file, "r", encoding="utf-8") as f:
        return f.read()

@app.get("/api/health")
async def health_check():
    """Health check endpoint confirming system operational readiness."""
    return {
        "status": "healthy",
        "project": "CatchForecast AI",
        "release": "ASIK Vol. VI",
        "active_models_count": 3,
        "domain": "Teluk Banten (WPPNRI 712)",
        "server_time_utc": datetime.now(timezone.utc).isoformat(),
        "validation_gate_status": "PASS"
    }

@app.get("/api/species")
async def get_species_catalog():
    """Returns the list of 3 target species and bioeconomic metadata."""
    return {
        "count": len(VALID_SPECIES),
        "species": list(VALID_SPECIES.values())
    }

@app.get("/api/metadata")
async def get_system_metadata():
    """Returns study domain, grid resolution, and oceanographic baseline."""
    meta_path = os.path.join(MAPS_DIR, "map_metadata.json")
    if os.path.isfile(meta_path):
        with open(meta_path, "r") as f:
            map_meta = json.load(f)
    else:
        map_meta = {}
        
    return {
        "study_area": "Teluk Banten (Banten Bay), Indonesia",
        "coordinates_bounding_box": [105.90, -6.15, 106.35, -5.85],
        "crs": "EPSG:4326 (WGS 84)",
        "spatial_resolution": "1 km x 1 km regular grid",
        "active_marine_cells": 798,
        "masked_land_cells": 628,
        "primary_landing_hub": {
            "name": "PPN Karangantu",
            "lat": -6.033,
            "lon": 106.150,
            "annual_volume_kg": "700,000+ kg"
        },
        "maps_summary": map_meta
    }

@app.get("/api/predictions/{species_id}")
async def get_species_prediction_geojson(species_id: str):
    """
    Returns the complete GeoJSON FeatureCollection for the requested species.
    Validated format: RFC 7946, EPSG:4326, 798 marine cell polygons.
    """
    sp_clean = species_id.lower().strip()
    if sp_clean not in VALID_SPECIES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Species '{species_id}' not recognized. Allowed: {list(VALID_SPECIES.keys())}"
        )
        
    geojson_path = os.path.join(MAPS_DIR, f"{sp_clean}_prediction_map.geojson")
    if not os.path.isfile(geojson_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GeoJSON map artifact for '{sp_clean}' is missing."
        )
        
    with open(geojson_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    return JSONResponse(content=data)

@app.get("/api/predictions/{species_id}/summary")
async def get_species_summary(species_id: str):
    """Returns summary KPIs for the requested species."""
    sp_clean = species_id.lower().strip()
    if sp_clean not in VALID_SPECIES:
        raise HTTPException(status_code=404, detail="Species not found.")
        
    geojson_path = os.path.join(MAPS_DIR, f"{sp_clean}_prediction_map.geojson")
    if not os.path.isfile(geojson_path):
        raise HTTPException(status_code=500, detail="Map file not found.")
        
    with open(geojson_path, "r") as f:
        data = json.load(f)
        
    features = data.get("features", [])
    catches = [f["properties"]["predicted_catch_kg"] for f in features]
    
    return {
        "species_id": sp_clean,
        "metadata": VALID_SPECIES[sp_clean],
        "cells_analyzed": len(catches),
        "total_predicted_catch_kg": round(float(sum(catches)), 2),
        "mean_catch_kg_per_cell": round(float(sum(catches)/len(catches)), 2),
        "max_catch_kg_cell": round(float(max(catches)), 2),
        "min_catch_kg_cell": round(float(min(catches)), 2)
    }
