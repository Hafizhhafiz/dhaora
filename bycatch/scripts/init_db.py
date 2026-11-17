#!/usr/bin/env python3
"""
Initialize local SQLite database for ByCatch AI (Phase 10).
Creates data/app.sqlite from src/database/schema.sql.
"""

import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parents[1]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.database.db import init_database, DEFAULT_DB_PATH

if __name__ == "__main__":
    db_file = root_dir / "data" / "app.sqlite"
    print(f"Initializing ByCatch AI database at: {db_file}...")
    init_database(db_file)
    print("Database schema successfully created and canonical species seeded.")
