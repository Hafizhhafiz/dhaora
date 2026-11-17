import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..config import DATABASE_FILE

def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            filename TEXT NOT NULL,
            image_url TEXT NOT NULL,
            result_image_url TEXT NOT NULL,
            total_count INTEGER NOT NULL,
            brachysoma_count INTEGER NOT NULL DEFAULT 0,
            leptolepis_count INTEGER NOT NULL DEFAULT 0,
            sulphureus_count INTEGER NOT NULL DEFAULT 0,
            other_count INTEGER NOT NULL DEFAULT 0,
            kembung_count INTEGER DEFAULT 0,
            layang_count INTEGER DEFAULT 0,
            detections_json TEXT NOT NULL,
            species_breakdown_json TEXT NOT NULL,
            composition_json TEXT NOT NULL,
            inference_time_ms REAL NOT NULL,
            model_mode TEXT NOT NULL,
            total_length_cm REAL,
            measurement_status TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_analysis(
    analysis_id: str,
    filename: str,
    image_url: str,
    result_image_url: str,
    total_count: int,
    brachysoma_count: int = 0,
    leptolepis_count: int = 0,
    sulphureus_count: int = 0,
    other_count: int = 0,
    detections: Optional[List[Dict[str, Any]]] = None,
    species_breakdown: Optional[Dict[str, int]] = None,
    composition_percentages: Optional[Dict[str, float]] = None,
    inference_time_ms: float = 0.0,
    model_mode: str = "MODEL_NOT_TRAINED",
    kembung_count: Optional[int] = None,
    layang_count: Optional[int] = None,
    total_length_cm: Optional[float] = None,
    measurement_status: Optional[str] = "unmeasured"
):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Sync aliases
    if kembung_count is None:
        kembung_count = brachysoma_count
    if layang_count is None:
        layang_count = leptolepis_count

    cursor.execute("""
        INSERT OR REPLACE INTO analyses (
            id, timestamp, filename, image_url, result_image_url,
            total_count, brachysoma_count, leptolepis_count, sulphureus_count, other_count,
            kembung_count, layang_count,
            detections_json, species_breakdown_json, composition_json,
            inference_time_ms, model_mode, total_length_cm, measurement_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        analysis_id, now_str, filename, image_url, result_image_url,
        total_count, brachysoma_count, leptolepis_count, sulphureus_count, other_count,
        kembung_count, layang_count,
        json.dumps(detections or []), json.dumps(species_breakdown or {}), json.dumps(composition_percentages or {}),
        inference_time_ms, model_mode, total_length_cm, measurement_status
    ))
    conn.commit()
    conn.close()

def get_recent_analyses(limit: int = 50) -> List[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM analyses ORDER BY timestamp DESC LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "filename": r["filename"],
            "image_url": r["image_url"],
            "result_image_url": r["result_image_url"],
            "total_count": r["total_count"],
            "brachysoma_count": r["brachysoma_count"] if "brachysoma_count" in r.keys() else r["kembung_count"],
            "leptolepis_count": r["leptolepis_count"] if "leptolepis_count" in r.keys() else r["layang_count"],
            "sulphureus_count": r["sulphureus_count"] if "sulphureus_count" in r.keys() else 0,
            "other_count": r["other_count"],
            "kembung_count": r["kembung_count"],
            "layang_count": r["layang_count"],
            "detections": json.loads(r["detections_json"]),
            "species_breakdown": json.loads(r["species_breakdown_json"]),
            "composition_percentages": json.loads(r["composition_json"]),
            "inference_time_ms": r["inference_time_ms"],
            "model_mode": r["model_mode"],
            "total_length_cm": r["total_length_cm"],
            "measurement_status": r["measurement_status"]
        })
    conn.close()
    return results

def get_statistics() -> Dict[str, Any]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            COUNT(*) as total_analyses,
            COALESCE(SUM(total_count), 0) as total_fish,
            COALESCE(SUM(brachysoma_count), 0) as total_brachysoma,
            COALESCE(SUM(leptolepis_count), 0) as total_leptolepis,
            COALESCE(SUM(sulphureus_count), 0) as total_sulphureus,
            COALESCE(SUM(kembung_count), 0) as total_kembung,
            COALESCE(SUM(layang_count), 0) as total_layang,
            COALESCE(SUM(other_count), 0) as total_other
        FROM analyses
    """)
    stat = cursor.fetchone()
    recent = get_recent_analyses(5)
    conn.close()
    return {
        "total_analyses": stat["total_analyses"],
        "total_fish_detected": stat["total_fish"],
        "total_brachysoma": stat["total_brachysoma"],
        "total_leptolepis": stat["total_leptolepis"],
        "total_sulphureus": stat["total_sulphureus"],
        "total_other": stat["total_other"],
        "total_kembung": stat["total_kembung"],
        "total_layang": stat["total_layang"],
        "latest_analyses": recent
    }

def update_measurement(analysis_id: str, length_cm: float, measured_url: str):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE analyses 
        SET total_length_cm = ?, measurement_status = 'measured', result_image_url = ?
        WHERE id = ?
    """, (length_cm, measured_url, analysis_id))
    conn.commit()
    conn.close()
