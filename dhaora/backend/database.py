"""
DHAORA Database Service
Manages local SQLite database (dhaora/data/dhaora.db) for storing unified sessions,
detections, and conservation audits without altering existing project databases.
"""

import sqlite3
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional
import json

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DHAORA_DB_PATH = BASE_DIR / "dhaora" / "data" / "dhaora.db"
FISHGUARD_DB_PATH = BASE_DIR / "backend" / "fishguard_history.db"
BYCATCH_DB_PATH = BASE_DIR / "bycatch" / "data" / "app.sqlite"

def get_dhaora_connection() -> sqlite3.Connection:
    DHAORA_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DHAORA_DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_dhaora_db():
    conn = get_dhaora_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dhaora_sessions (
        session_id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        module TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        image_url TEXT,
        metadata_json TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dhaora_detections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        species_name TEXT NOT NULL,
        scientific_name TEXT,
        confidence REAL NOT NULL,
        bbox_json TEXT,
        estimated_length_cm REAL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES dhaora_sessions (session_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dhaora_bycatch_audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        fishing_gear TEXT NOT NULL,
        target_species TEXT NOT NULL,
        detected_species TEXT NOT NULL,
        catch_role TEXT NOT NULL,
        iucn_status TEXT,
        compliance_status TEXT NOT NULL,
        recommendation TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES dhaora_sessions (session_id)
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_dhaora_db()
    print(f"DHAORA database initialized at {DHAORA_DB_PATH}")
