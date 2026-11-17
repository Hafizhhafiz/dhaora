import sqlite3
import shutil
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent / "fishguard_history.db"
BACKUP_PATH = Path(__file__).resolve().parent / f"fishguard_history_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"

def migrate():
    if not DB_PATH.exists():
        print(f"No database found at {DB_PATH}, nothing to migrate.")
        return

    # 1. Backup
    print(f"Backing up database to {BACKUP_PATH}...")
    shutil.copy2(DB_PATH, BACKUP_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check columns
    cursor.execute("PRAGMA table_info(analyses)")
    existing_cols = [c[1] for c in cursor.fetchall()]
    print("Existing columns:", existing_cols)

    # Add columns if not existing
    for col_def in [
        ("brachysoma_count", "INTEGER NOT NULL DEFAULT 0"),
        ("leptolepis_count", "INTEGER NOT NULL DEFAULT 0"),
        ("sulphureus_count", "INTEGER NOT NULL DEFAULT 0")
    ]:
        col_name, col_type = col_def
        if col_name not in existing_cols:
            print(f"Adding column {col_name} ({col_type})...")
            cursor.execute(f"ALTER TABLE analyses ADD COLUMN {col_name} {col_type}")

    # Copy data from legacy kembung_count -> brachysoma_count if needed
    if "kembung_count" in existing_cols:
        cursor.execute("""
            UPDATE analyses 
            SET brachysoma_count = kembung_count
            WHERE brachysoma_count = 0 AND kembung_count > 0
        """)

    conn.commit()

    # Verify
    cursor.execute("PRAGMA table_info(analyses)")
    updated_cols = [c[1] for c in cursor.fetchall()]
    print("Migration complete. Updated columns:", updated_cols)

    cursor.execute("SELECT id, total_count, brachysoma_count, leptolepis_count, sulphureus_count, other_count FROM analyses")
    rows = cursor.fetchall()
    print(f"Verified {len(rows)} rows:")
    for r in rows:
        print(" ", r)

    conn.close()

if __name__ == "__main__":
    migrate()
