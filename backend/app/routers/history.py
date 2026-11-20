"""
Unified History & Statistics Router for ASIK VOL VI / DHAORA Platform.
Combines FishGuard CV analyses, ByCatch records, and unified session audit logs.
"""

import sqlite3
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException

from ..services.storage_service import get_recent_analyses, get_statistics
from ..config import DATABASE_FILE

router = APIRouter(prefix="/api", tags=["History & Statistics"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DHAORA_DB_PATH = BASE_DIR / "dhaora" / "data" / "dhaora.db"
BYCATCH_DB_PATH = BASE_DIR / "bycatch" / "data" / "app.sqlite"

@router.get("/history", response_model=List[Dict[str, Any]])
async def fetch_history(limit: int = 50):
    """Returns past fish detection & measurement analyses (FishGuard format)."""
    return get_recent_analyses(limit=limit)

@router.get("/statistics")
async def fetch_statistics():
    """Returns dashboard aggregated metrics."""
    return get_statistics()

@router.get("/history/sessions")
async def get_unified_sessions(limit: int = 50):
    """
    Mengambil riwayat analisis terpadu lintas modul:
    CatchForecast AI (WebGIS), FishGuard AI (CV), dan ByCatch AI.
    """
    sessions = []
    
    # 1. Fetch from DHAORA unified database if present
    if DHAORA_DB_PATH.is_file():
        try:
            conn = sqlite3.connect(str(DHAORA_DB_PATH))
            conn.row_factory = sqlite3.Row
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

    # 2. Fetch from FishGuard analyses database
    try:
        analyses = get_recent_analyses(limit=limit)
        for row in analyses:
            sessions.append({
                "session_id": row.get("id"),
                "created_at": row.get("timestamp"),
                "module": "fishguard",
                "title": f"FishGuard: {row.get('filename')}",
                "summary": f"Total cacah: {row.get('total_count', 0)} ekor spesimen",
                "image_url": row.get("result_image_url"),
                "source": "FishGuard CV"
            })
    except Exception as e:
        print(f"[History] Error reading Fishguard analyses: {e}")

    # 3. Fetch from ByCatch DB if present
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
                    "created_at": row["created_at"] or "2026-11-20T00:00:00",
                    "module": "bycatch",
                    "title": f"Audit ByCatch: {row['fishing_gear']}",
                    "summary": f"Spesies: {row['detected_species']} ({row['catch_role']})",
                    "image_url": None,
                    "source": "ByCatch AI"
                })
            bc_conn.close()
        except Exception as e:
            print(f"[History] Note on reading Bycatch DB: {e}")

    # Sort merged sessions by timestamp descending
    sessions.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    return {"total": len(sessions), "sessions": sessions[:limit]}

@router.get("/history/stats")
async def get_history_stats():
    """Mengembalikan statistik ringkasan aktivitas sistem lintas modul."""
    total_dhaora = 0
    module_breakdown = {}

    if DHAORA_DB_PATH.is_file():
        try:
            conn = sqlite3.connect(str(DHAORA_DB_PATH))
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM dhaora_sessions;")
            total_dhaora = c.fetchone()[0]

            c.execute("SELECT module, COUNT(*) as cnt FROM dhaora_sessions GROUP BY module;")
            module_breakdown = {row[0]: row[1] for row in c.fetchall()}
            conn.close()
        except Exception as e:
            print(f"[History Stats] Warning: {e}")

    fg_stats = get_statistics()

    return {
        "total_active_sessions": total_dhaora + fg_stats.get("total_analyses", 0),
        "module_breakdown": module_breakdown,
        "fishguard_analyses": fg_stats.get("total_analyses", 0),
        "total_fish_detected": fg_stats.get("total_fish_detected", 0),
        "integrated_subsystems": [
            "FishGuard AI (Deteksi & Biometrik YOLOv8)",
            "CatchForecast AI (WebGIS Teluk Banten)",
            "ByCatch AI (Screening Konservasi & Alat Tangkap)"
        ],
        "database_status": "Unified Multi-Store Connected"
    }
