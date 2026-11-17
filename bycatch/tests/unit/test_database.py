"""
Unit tests for ByCatch AI Database Layer (Phase 10).
"""

import pytest
import sqlite3
from pathlib import Path
from src.database.db import get_connection, init_database
from src.database.repository import ByCatchRepository

@pytest.fixture
def test_db(tmp_path):
    db_file = tmp_path / "test_app.sqlite"
    root = Path(__file__).resolve().parents[2]
    schema_file = root / "src" / "database" / "schema.sql"
    init_database(db_file, schema_file)
    conn = get_connection(db_file)
    yield conn
    conn.close()

def test_database_initialization(test_db):
    c = test_db.cursor()
    c.execute("SELECT COUNT(*) FROM species;")
    count = c.fetchone()[0]
    assert count == 3

def test_repository_crud_and_summary(test_db):
    repo = ByCatchRepository(test_db)

    # 1. Insert image
    img_id = repo.insert_image(
        image_id="img_test_1234",
        filename="sample.jpg",
        file_path="C:/dummy/sample.jpg",
        width=640,
        height=480,
        sha256="abcdef1234567890"
    )
    assert img_id == "img_test_1234"

    # 2. Insert detection
    det_id = repo.insert_detection(
        image_id=img_id,
        class_id=0,
        confidence=0.85,
        x1=0.2, y1=0.3, x2=0.7, y2=0.8
    )
    assert det_id > 0

    # 3. Insert catch record
    rec_id = repo.insert_catch_record(
        landing_date="2026-11-17",
        fishing_gear="Jaring Insang",
        detected_species="kembung_perempuan",
        catch_role="target",
        target_species="kembung_perempuan; selar_kuning",
        image_id=img_id
    )
    assert rec_id > 0

    # 4. Summary check
    summary = repo.get_dashboard_summary()
    assert summary["total_images"] == 1
    assert summary["total_detections"] == 1
    assert summary["total_catch_records"] == 1
    assert summary["species_counts"]["Kembung perempuan"] == 1
    assert summary["catch_roles"]["target"] == 1
