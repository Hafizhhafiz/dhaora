"""
DHAORA / CatchForecast AI WebGIS Router
Serves geospatial predictions, environmental telemetry, and landing site data for Teluk Banten (WPPNRI 712).
Fully integrated into ASIK VOL VI Unified Platform.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/gis", tags=["WebGIS & Spatial Catch Prediction (CatchForecast AI)"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MAPS_DIR = BASE_DIR / "CatchForecast-AI" / "data" / "processed" / "maps"
CONFIG_PATH = BASE_DIR / "CatchForecast-AI" / "config" / "environmental_grid_config.json"
METADATA_PATH = MAPS_DIR / "map_metadata.json"

SPECIES_CATALOG = {
    "rastrelliger": {
        "species_id": "rastrelliger",
        "scientific_name": "Rastrelliger brachysoma",
        "local_name": "Kembung perempuan",
        "category": "Pelagis Kecil (Small Pelagic)",
        "family": "Scombridae",
        "standard_gear": "Jaring Insang (Gillnet) / Payang",
        "annual_effort_trips": 19819,
        "champion_model": "Random Forest Regressor",
        "spatial_r2_score": 0.9995,
        "mean_catch_kg_per_sqkm": 32.59,
        "max_catch_kg_per_sqkm": 39.47,
        "total_predicted_catch_kg": 26009.73,
        "accent_color": "#38bdf8"
    },
    "selaroides": {
        "species_id": "selaroides",
        "scientific_name": "Selaroides leptolepis",
        "local_name": "Selar kuning",
        "category": "Pelagis Kecil (Small Pelagic)",
        "family": "Carangidae",
        "standard_gear": "Jaring Insang (Gillnet) / Payang",
        "annual_effort_trips": 19819,
        "champion_model": "Random Forest Regressor",
        "spatial_r2_score": 0.9995,
        "mean_catch_kg_per_sqkm": 2.49,
        "max_catch_kg_per_sqkm": 3.01,
        "total_predicted_catch_kg": 1988.50,
        "accent_color": "#f59e0b"
    },
    "upeneus": {
        "species_id": "upeneus",
        "scientific_name": "Upeneus sulphureus",
        "local_name": "Kuniran / Biji Nangka",
        "category": "Demersal Dasar Laut",
        "family": "Mullidae",
        "standard_gear": "Cantrang / Arad (Alat Tangkap Dasar)",
        "annual_effort_trips": 5618,
        "champion_model": "Random Forest Regressor",
        "spatial_r2_score": 0.9997,
        "mean_catch_kg_per_sqkm": 12.49,
        "max_catch_kg_per_sqkm": 21.48,
        "total_predicted_catch_kg": 9967.20,
        "accent_color": "#f97316"
    }
}

@router.get("/species")
async def get_species_catalog():
    """Mengembalikan katalog 3 spesies target MVP dan metrik performa model spasial."""
    return {
        "domain": "Teluk Banten (WPPNRI 712)",
        "grid_resolution": "1 km²",
        "species": list(SPECIES_CATALOG.values())
    }

@router.get("/maps/{species_id}")
async def get_prediction_geojson(species_id: str):
    """Menyajikan poligon GeoJSON prediksi tangkapan untuk spesies yang dipilih."""
    normalized_id = species_id.lower().strip()
    if normalized_id not in SPECIES_CATALOG:
        raise HTTPException(
            status_code=404,
            detail=f"Spesies '{species_id}' tidak valid. Pilihan: {list(SPECIES_CATALOG.keys())}"
        )

    geojson_file = MAPS_DIR / f"{normalized_id}_prediction_map.geojson"
    if not geojson_file.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"Berkas GeoJSON untuk {species_id} tidak ditemukan di CatchForecast-AI."
        )

    with open(geojson_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)

@router.get("/metadata")
async def get_map_metadata():
    """Mengembalikan ringkasan statistik komparatif ketiga spesies peta."""
    if METADATA_PATH.is_file():
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"message": "Map metadata not found"}

@router.get("/landing-sites")
async def get_landing_sites():
    """Titik acuan pangkalan pendaratan ikan lokal (PPN Karangantu) & stasiun pengamatan Teluk Banten."""
    return {
        "ppn_karangantu": {
            "name": "Pelabuhan Perikanan Nusantara (PPN) Karangantu",
            "type": "Pangkalan Pendaratan Utama",
            "coordinates": [-6.029, 106.161],
            "wppnri": "712",
            "regency": "Kota Serang, Banten",
            "landing_volume_2026_kg": 77045,
            "vessels": "< 10 GT Small Scale Artisanal Fleet"
        },
        "sampling_stations": [
            {"station_id": "ST-01", "name": "Muara Karangantu (Estuari)", "coordinates": [-6.025, 106.162], "depth_m": 3.5, "zone": "Zona Pesisir"},
            {"station_id": "ST-02", "name": "Pulau Lima (Terumbu Karang)", "coordinates": [-6.002, 106.151], "depth_m": 8.2, "zone": "Zona Tengah"},
            {"station_id": "ST-03", "name": "Pulau Panjang (Perairan Terbuka)", "coordinates": [-5.952, 106.155], "depth_m": 16.4, "zone": "Mulut Teluk"},
            {"station_id": "ST-04", "name": "Teluk Banten Barat (Bojonegara)", "coordinates": [-5.981, 106.095], "depth_m": 12.0, "zone": "Zona Industri/Pelagis"}
        ]
    }

@router.get("/telemetry")
async def get_oceanographic_telemetry():
    """Mengembalikan ringkasan parameter oseanografi Teluk Banten (November 2026)."""
    return {
        "domain": "Teluk Banten (Banten Bay)",
        "bounding_box": {
            "min_lat": -6.08,
            "max_lat": -5.92,
            "min_lon": 105.95,
            "max_lon": 106.28
        },
        "observation_period": "November 2026",
        "sea_surface_temperature": {
            "mean_celsius": 29.84,
            "min_celsius": 29.21,
            "max_celsius": 30.45,
            "unit": "°C (MUR SST 1km)"
        },
        "thermal_front": {
            "mean_gradient": 0.165,
            "peak_gradient": 0.482,
            "unit": "°C/km (Sobel Filter)"
        },
        "bathymetry": {
            "min_depth_m": 1.2,
            "max_depth_m": 22.8,
            "mean_depth_m": 9.7,
            "source": "ETOPO1 / GEBCO"
        },
        "active_grid_cells": 798,
        "ocean_coverage_sqkm": 798.0
    }
