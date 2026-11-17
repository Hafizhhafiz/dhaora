"""
Database repository for ByCatch AI.
Provides typed, parameterised queries for images, detections, catch records, and logs.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
import sqlite3

class ByCatchRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def insert_image(self, image_id: str, filename: str, file_path: str, width: int, height: int, sha256: str) -> str:
        query = """
        INSERT OR REPLACE INTO images (image_id, filename, file_path, width, height, sha256, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """
        now = datetime.now().isoformat()
        self.conn.execute(query, (image_id, filename, file_path, width, height, sha256, now))
        self.conn.commit()
        return image_id

    def insert_detection(
        self,
        image_id: str,
        class_id: int,
        confidence: float,
        x1: float, y1: float, x2: float, y2: float,
        model_id: str = "default",
        review_status: str = "auto"
    ) -> int:
        query = """
        INSERT INTO detections (image_id, model_id, class_id, confidence, x1, y1, x2, y2, review_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """
        now = datetime.now().isoformat()
        cursor = self.conn.execute(query, (image_id, model_id, class_id, confidence, x1, y1, x2, y2, review_status, now))
        self.conn.commit()
        return cursor.lastrowid

    def insert_catch_record(
        self,
        landing_date: str,
        fishing_gear: str,
        detected_species: str,
        catch_role: str,
        target_species: str = "",
        vessel_trip_id: str = "",
        catch_handling: str = "retained",
        notes: str = "",
        image_id: Optional[str] = None
    ) -> int:
        query = """
        INSERT INTO catch_records (
            image_id, landing_date, vessel_trip_id, fishing_gear, target_species,
            detected_species, catch_role, catch_handling, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """
        now = datetime.now().isoformat()
        cursor = self.conn.execute(query, (
            image_id, landing_date, vessel_trip_id, fishing_gear, target_species,
            detected_species, catch_role, catch_handling, notes, now
        ))
        self.conn.commit()
        return cursor.lastrowid

    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Fetches total counts for the main dashboard from database."""
        c = self.conn.cursor()
        
        c.execute("SELECT COUNT(*) FROM images;")
        total_images = c.fetchone()[0]

        c.execute("SELECT COUNT(*) FROM detections;")
        total_detections = c.fetchone()[0]

        c.execute("SELECT COUNT(*) FROM catch_records;")
        total_catch_records = c.fetchone()[0]

        c.execute("""
            SELECT s.common_name, COUNT(d.detection_id) as count
            FROM species s
            LEFT JOIN detections d ON s.class_id = d.class_id
            GROUP BY s.class_id;
        """)
        species_counts = {row["common_name"]: row["count"] for row in c.fetchall()}

        c.execute("""
            SELECT catch_role, COUNT(*) as count
            FROM catch_records
            GROUP BY catch_role;
        """)
        catch_roles = {row["catch_role"]: row["count"] for row in c.fetchall()}

        return {
            "total_images": total_images,
            "total_detections": total_detections,
            "total_catch_records": total_catch_records,
            "species_counts": species_counts,
            "catch_roles": catch_roles
        }

    def get_all_catch_records(self) -> List[Dict[str, Any]]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM catch_records ORDER BY created_at DESC;")
        return [dict(row) for row in c.fetchall()]
