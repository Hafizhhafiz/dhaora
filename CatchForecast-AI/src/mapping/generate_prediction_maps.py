"""
CatchForecast AI - Prediction Map Generation Pipeline (Phase 10)
Generates high-resolution spatial prediction maps for:
1. Rastrelliger brachysoma (Pelagic)
2. Selaroides leptolepis (Pelagic)
3. Upeneus sulphureus (Demersal)

Outputs:
- GeoJSON FeatureCollections (RFC 7946, EPSG:4326)
- Thematic Cartographic Maps (300 DPI PNG with scale, north arrow, legends)
- Unified map metadata JSON
"""

import os
import sys
import json
from datetime import datetime, timezone
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.colors import Normalize

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONFIG_PATH = os.path.join(BASE_DIR, "config", "environmental_grid_config.json")
PROCESSED_SPECIES_DIR = os.path.join(BASE_DIR, "data", "processed", "species")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MAPS_GEOJSON_DIR = os.path.join(BASE_DIR, "data", "processed", "maps")
MAPS_PNG_DIR = os.path.join(BASE_DIR, "reports", "phase_10", "maps")

os.makedirs(MAPS_GEOJSON_DIR, exist_ok=True)
os.makedirs(MAPS_PNG_DIR, exist_ok=True)

SPECIES_CONFIGS = [
    {
        "key": "rastrelliger",
        "name": "Rastrelliger brachysoma",
        "local": "Kembung perempuan",
        "type": "Pelagic",
        "gear_effort": 1801, # Nov effort
        "cmap": "YlOrRd"
    },
    {
        "key": "selaroides",
        "name": "Selaroides leptolepis",
        "local": "Selar kuning",
        "type": "Pelagic",
        "gear_effort": 1801,
        "cmap": "YlGnBu"
    },
    {
        "key": "upeneus",
        "name": "Upeneus sulphureus",
        "local": "Kuniran",
        "type": "Demersal",
        "gear_effort": 510,
        "cmap": "viridis"
    }
]

FEATURE_COLS = [
    "sst_celsius", "thermal_front_c_per_km", "chlorophyll_a_mg_m3",
    "bathymetry_depth_m", "bathymetry_slope_deg", "dist_to_shore_km",
    "dist_to_port_km", "month_sin", "month_cos"
]

def load_grid_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def generate_species_geojson(species_cfg, df_latest, predictions):
    """Create GeoJSON FeatureCollection of 1 km grid polygons."""
    key = species_cfg["key"]
    features = []
    
    # 1 km in degrees approx
    d_lon = 0.010
    d_lat = 0.010
    
    for idx, row in df_latest.iterrows():
        lon = float(row["lon"])
        lat = float(row["lat"])
        pred_kg = float(predictions[idx])
        cpue = float(pred_kg / (species_cfg["gear_effort"] / 798.0))
        
        # Cell Polygon coordinates
        poly_coords = [
            [round(lon - d_lon/2, 5), round(lat - d_lat/2, 5)],
            [round(lon + d_lon/2, 5), round(lat - d_lat/2, 5)],
            [round(lon + d_lon/2, 5), round(lat + d_lat/2, 5)],
            [round(lon - d_lon/2, 5), round(lat + d_lat/2, 5)],
            [round(lon - d_lon/2, 5), round(lat - d_lat/2, 5)]
        ]
        
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly_coords]
            },
            "properties": {
                "cell_id": str(row["cell_id"]),
                "species_id": key,
                "scientific_name": species_cfg["name"],
                "local_name": species_cfg["local"],
                "category": species_cfg["type"],
                "predicted_catch_kg": round(pred_kg, 2),
                "predicted_cpue_kg_per_trip": round(cpue, 3),
                "sst_celsius": round(float(row["sst_celsius"]), 2),
                "thermal_front_c_per_km": round(float(row["thermal_front_c_per_km"]), 3),
                "bathymetry_depth_m": round(float(row["bathymetry_depth_m"]), 1),
                "dist_to_shore_km": round(float(row["dist_to_shore_km"]), 2),
                "month": int(row["month"]),
                "year": int(row["year"])
            }
        }
        features.append(feature)
        
    geojson_data = {
        "type": "FeatureCollection",
        "name": f"CatchForecast_{key}_prediction_map",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "metadata": {
            "species": species_cfg["name"],
            "unit": "kg / km² / month",
            "observation_period": "November 2026 (Current Condition)",
            "model_version": "RandomForest_v1.0",
            "generated_utc": datetime.now(timezone.utc).isoformat(),
            "disclaimer": "Scientific estimation based on environmental telemetry. Not a guarantee of catch."
        },
        "features": features
    }
    
    out_file = os.path.join(MAPS_GEOJSON_DIR, f"{key}_prediction_map.geojson")
    with open(out_file, "w") as f:
        json.dump(geojson_data, f, indent=2)
    print(f"Generated GeoJSON: {out_file} ({len(features)} cells)")
    return out_file

def plot_thematic_map(species_cfg, df_latest, predictions):
    """Plot publication-quality thematic cartographic map."""
    key = species_cfg["key"]
    name = species_cfg["name"]
    local = species_cfg["local"]
    
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    
    # Study bounds
    ax.set_xlim(105.90, 106.35)
    ax.set_ylim(-6.15, -5.85)
    
    # Background: Land area light gray
    ax.set_facecolor("#e6e6e6")
    
    # Draw water cells
    lons = df_latest["lon"].values
    lats = df_latest["lat"].values
    vals = predictions
    
    cmap = plt.get_cmap(species_cfg["cmap"])
    sc = ax.scatter(
        lons, lats, c=vals, cmap=cmap, s=75, marker="s", 
        edgecolor="none", alpha=0.92
    )
    
    # Add Colorbar
    cbar = plt.colorbar(sc, ax=ax, fraction=0.035, pad=0.03)
    cbar.set_label(f"Predicted Catch Weight ({species_cfg['local']}) [kg / km²]", fontsize=11, fontweight="bold")
    cbar.ax.tick_params(labelsize=10)
    
    # Plot PPN Karangantu Hub
    port_lon, port_lat = 106.15, -6.033
    ax.plot(port_lon, port_lat, marker="*", color="red", markersize=16, markeredgecolor="black", zorder=5)
    ax.text(port_lon + 0.012, port_lat, "PPN Karangantu\n(Main Hub)", fontsize=9, fontweight="bold", color="darkred", zorder=6)
    
    # Draw North Arrow
    ax.annotate("N", xy=(106.31, -5.89), xytext=(106.31, -5.92),
                arrowprops=dict(facecolor="black", width=3, headwidth=9),
                ha="center", va="center", fontsize=12, fontweight="bold")
    
    # Grid lines and formatting
    ax.grid(True, linestyle="--", alpha=0.6, color="gray")
    ax.set_xlabel("Longitude (°E)", fontsize=11)
    ax.set_ylabel("Latitude (°S)", fontsize=11)
    
    # Title Block
    title_text = (
        f"CatchForecast AI — Spatial Catch Prediction: {name}\n"
        f"Local: {local} ({species_cfg['type']}) | Teluk Banten (November 2026)\n"
        f"Domain: 798 Marine Cells (1 km² Grid) | Model: Random Forest Regressor"
    )
    ax.set_title(title_text, fontsize=12, fontweight="bold", pad=12)
    
    # Scientific Disclaimer in Footer
    disclaimer = "Scientific Estimate based on Environmental Conditions; Not a guarantee of fish location or harvest."
    fig.text(0.5, 0.02, disclaimer, ha="center", fontsize=8, style="italic", color="#555555")
    
    plt.tight_layout(rect=[0, 0.04, 1, 1])
    out_png = os.path.join(MAPS_PNG_DIR, f"{key}_prediction_map.png")
    plt.savefig(out_png, dpi=300)
    plt.close()
    print(f"Generated Thematic Map PNG: {out_png}")
    return out_png

def plot_comparative_map(all_predictions, df_latest):
    """Plot side-by-side 3 species comparison map."""
    fig, axes = plt.subplots(1, 3, figsize=(20, 6.5), dpi=300)
    fig.suptitle(
        "CatchForecast AI — Teluk Banten Comparative Multi-Species Catch Density\n"
        "Current Environmental Telemetry (November 2026) | 1 km² Spatial Grid", 
        fontsize=14, fontweight="bold"
    )
    
    for i, sp in enumerate(SPECIES_CONFIGS):
        ax = axes[i]
        key = sp["key"]
        vals = all_predictions[key]
        
        ax.set_xlim(105.90, 106.35)
        ax.set_ylim(-6.15, -5.85)
        ax.set_facecolor("#ebebeb")
        
        sc = ax.scatter(
            df_latest["lon"], df_latest["lat"], 
            c=vals, cmap=sp["cmap"], s=42, marker="s", alpha=0.9
        )
        cbar = plt.colorbar(sc, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label("Catch (kg / km²)", fontsize=10)
        
        # PPN Karangantu
        ax.plot(106.15, -6.033, marker="*", color="red", markersize=12, markeredgecolor="black")
        
        ax.set_title(f"{sp['name']}\n({sp['local']} — {sp['type']})", fontsize=11, fontweight="bold")
        ax.set_xlabel("Longitude (°E)", fontsize=10)
        if i == 0:
            ax.set_ylabel("Latitude (°S)", fontsize=10)
        ax.grid(True, linestyle=":", alpha=0.5)
        
    plt.tight_layout()
    comp_png = os.path.join(MAPS_PNG_DIR, "04_comparative_prediction_map.png")
    plt.savefig(comp_png, dpi=300)
    plt.close()
    print(f"Generated Comparative PNG: {comp_png}")
    return comp_png

def main():
    print("="*70)
    print("CatchForecast AI — Phase 10: Prediction Map Generation")
    print("Producing GeoJSON Layers, Thematic Cartographic Maps & Metadata")
    print("="*70)
    
    # 1. Load latest environmental conditions (Month 11)
    sample_csv = os.path.join(PROCESSED_SPECIES_DIR, "rastrelliger", "rastrelliger_monthly_features.csv")
    df_all = pd.read_csv(sample_csv)
    df_latest = df_all[df_all["month"] == 11].copy().reset_index(drop=True)
    df_latest["month_sin"] = np.sin(2 * np.pi * df_latest["month"] / 12.0)
    df_latest["month_cos"] = np.cos(2 * np.pi * df_latest["month"] / 12.0)
    
    print(f"Loaded {len(df_latest)} marine cells for November 2026 conditions.")
    
    all_predictions = {}
    map_metadata_summary = {}
    
    # 2. Iterate each species
    for sp_cfg in SPECIES_CONFIGS:
        key = sp_cfg["key"]
        print(f"\nProcessing Species: {sp_cfg['name']} ({sp_cfg['local']})")
        
        # Load model
        model_path = os.path.join(MODELS_DIR, key, f"{key}_best_model.joblib")
        model = joblib.load(model_path)
        
        # Predict
        preds = np.maximum(model.predict(df_latest[FEATURE_COLS]), 0.0)
        all_predictions[key] = preds
        
        print(f"  Predictions generated: Min={preds.min():.2f} kg, Mean={preds.mean():.2f} kg, Max={preds.max():.2f} kg, Total={preds.sum():.2f} kg")
        
        # GeoJSON
        geojson_path = generate_species_geojson(sp_cfg, df_latest, preds)
        
        # PNG Map
        png_path = plot_thematic_map(sp_cfg, df_latest, preds)
        
        map_metadata_summary[key] = {
            "scientific_name": sp_cfg["name"],
            "local_name": sp_cfg["local"],
            "category": sp_cfg["type"],
            "observation_period": "November 2026",
            "cells_count": len(preds),
            "predicted_total_catch_kg": round(float(preds.sum()), 2),
            "predicted_mean_cell_catch_kg": round(float(preds.mean()), 2),
            "predicted_max_cell_catch_kg": round(float(preds.max()), 2),
            "geojson_path": geojson_path,
            "thematic_png_path": png_path
        }
        
    # 3. Comparative Map
    comp_map_path = plot_comparative_map(all_predictions, df_latest)
    map_metadata_summary["comparative_map_png"] = comp_map_path
    
    # 4. Save Metadata JSON
    meta_path = os.path.join(MAPS_GEOJSON_DIR, "map_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(map_metadata_summary, f, indent=2)
    print(f"\nSaved Maps Metadata Summary to: {meta_path}")
    print("\nPhase 10 Map Generation Complete!")

if __name__ == "__main__":
    main()
