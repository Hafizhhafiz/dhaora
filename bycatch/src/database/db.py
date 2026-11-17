"""
Database connection and migration manager for ByCatch AI (SQLite).
Enforces foreign keys, WAL mode, and parameterised queries.
"""

import sqlite3
from pathlib import Path
from typing import Optional

DEFAULT_DB_PATH = Path("data/app.sqlite")

def get_connection(db_path: Optional[Path] = None) -> sqlite3.Connection:
    """Returns a SQLite connection with foreign keys and row factory enabled."""
    if db_path is None:
        db_path = DEFAULT_DB_PATH

    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path))
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.row_factory = sqlite3.Row
    return conn

def init_database(db_path: Optional[Path] = None, schema_path: Optional[Path] = None):
    """Initializes database schema from schema.sql."""
    if schema_path is None:
        schema_path = Path("src/database/schema.sql")

    conn = get_connection(db_path)
    schema_sql = schema_path.read_text(encoding="utf-8")
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()
