"""
DHAORA Unified History Router
Aggregates historical analyses across FishGuard, CatchForecast, and ByCatch.
Reads existing databases read-only and merges with DHAORA unified storage.
"""

import sqlite3
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException

from ..database import get_dhaora_connection, FISHGUARD_DB_PATH, BYCATCH_DB_PATH

router = APIRouter(prefix="/api/history", tags=["Unified History & Audit Trail"])

@router.get("/sessions")
async def get_all_sessions(limit: int = 50):
    """
    Mengambil riwayat analisis terpadu dari DHAORA DB,
    serta menggabungkan riwayat historis dari fishguard_history.db dan bycatch.
    """
    sessions = []
    
    # 1. Fetch from DHAORA database
    try:
        conn = get_dhaora_connection()
        c = conn.cursor()
        c.execute("SELECT session_id, created_at, module, title, summary, image_url FROM dhaora_sessions ORDER BY created_at DESC LIMIT ?", (limit,))
        for row in c.fetchall():
            sessions.append({
                "session_id": row["session_id"],
                "created_at": row["created_at"],
                "module": row["module"],
                "title": row["title"],
                "summary": row["summary"],
                "image_url": row["image_url"],
                "source": "DHAORA Hub"
            })
        conn.close()
    except Exception as e:
        print(f"[History] Error reading DHAORA DB: {e}")

    # 2. Fetch from existing FishGuard DB (read-only)
    if FISHGUARD_DB_PATH.is_file():
        try:
            fg_conn = sqlite3.connect(f"file:{FISHGUARD_DB_PATH}?mode=ro", uri=True)
            fg_conn.row_factory = sqlite3.Row
            c = fg_conn.cursor()
            c.execute("""
            SELECT id as session_id, timestamp as created_at, filename, total_count, result_image_url
            FROM analyses
            ORDER BY timestamp DESC LIMIT ?
            """, (limit,))
            for row in c.fetchall():
                sessions.append({
                    "session_id": row["session_id"],
                    "created_at": row["created_at"],
                    "module": "fishguard",
                    "title": f"FishGuard: {row['filename']}",
                    "summary": f"Total cacah: {row['total_count']} ekor spesimen",
                    "image_url": row["result_image_url"],
                    "source": "FishGuard Legacy DB"
                })
            fg_conn.close()
        except Exception as e:
            print(f"[History] Note on reading Fishguard DB: {e}")

    # 3. Fetch from existing ByCatch DB (read-only)
    if BYCATCH_DB_PATH.is_file():
        try:
            bc_conn = sqlite3.connect(f"file:{BYCATCH_DB_PATH}?mode=ro", uri=True)
            bc_conn.row_factory = sqlite3.Row
            c = bc_conn.cursor()
            c.execute("""
            SELECT record_id, landing_date as created_at, fishing_gear, detected_species, catch_role
            FROM catch_records
            ORDER BY created_at DESC LIMIT ?
            """, (limit,))
            for row in c.fetchall():
                sessions.append({
                    "session_id": f"BC-{row['record_id']}",
                    "created_at": row["created_at"] or "2026-11-17T00:00:00",
                    "module": "bycatch",
                    "title": f"Audit ByCatch: {row['fishing_gear']}",
                    "summary": f"Spesies: {row['detected_species']} ({row['catch_role']})",
                    "image_url": None,
                    "source": "ByCatch Legacy DB"
                })
            bc_conn.close()
        except Exception as e:
            print(f"[History] Note on reading Bycatch DB: {e}")

    # Sort merged sessions by timestamp descending
    sessions.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    return {"total": len(sessions), "sessions": sessions[:limit]}

@router.get("/stats")
async def get_history_stats():
    """Mengembalikan statistik ringkasan aktivitas sistem lintas modul."""
    conn = get_dhaora_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM dhaora_sessions;")
    total_dhaora = c.fetchone()[0]

    c.execute("SELECT module, COUNT(*) as cnt FROM dhaora_sessions GROUP BY module;")
    module_breakdown = {row["module"]: row["cnt"] for row in c.fetchall()}
    conn.close()

    return {
        "total_active_sessions": total_dhaora,
        "module_breakdown": module_breakdown,
        "integrated_subsystems": [
            "FishGuard AI (Deteksi & Biometrik)",
            "CatchForecast AI (WebGIS Teluk Banten)",
            "ByCatch AI (Screening Konservasi & Alat Tangkap)"
        ],
        "database_status": "Hybrid Multi-Store Active"
    }
