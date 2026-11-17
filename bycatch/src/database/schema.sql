-- ByCatch AI Local SQLite Database Schema (Phase 10)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS species (
    class_id INTEGER PRIMARY KEY,
    class_name TEXT NOT NULL UNIQUE,
    scientific_name TEXT NOT NULL,
    common_name TEXT NOT NULL,
    family TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    image_id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    sha256 TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS detections (
    detection_id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id TEXT NOT NULL REFERENCES images(image_id) ON DELETE CASCADE,
    run_id TEXT,
    model_id TEXT,
    class_id INTEGER NOT NULL REFERENCES species(class_id),
    confidence REAL NOT NULL,
    x1 REAL NOT NULL,
    y1 REAL NOT NULL,
    x2 REAL NOT NULL,
    y2 REAL NOT NULL,
    review_status TEXT CHECK(review_status IN ('auto', 'unverified', 'confirmed', 'corrected', 'rejected')) DEFAULT 'auto',
    corrected_class_id INTEGER REFERENCES species(class_id),
    reviewed_by TEXT,
    reviewed_at TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS catch_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id TEXT REFERENCES images(image_id) ON DELETE SET NULL,
    landing_date TEXT NOT NULL,
    vessel_trip_id TEXT,
    fishing_gear TEXT NOT NULL,
    target_species TEXT,
    detected_species TEXT NOT NULL,
    catch_role TEXT CHECK(catch_role IN ('target', 'incidental_non_target_retained', 'discarded_non_target', 'unverified')) NOT NULL,
    catch_handling TEXT,
    notes TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conservation_status (
    species_id INTEGER PRIMARY KEY REFERENCES species(class_id),
    scientific_name TEXT NOT NULL,
    iucn_status TEXT NOT NULL,
    cites_appendix TEXT NOT NULL,
    national_protection_status TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS model_versions (
    model_id TEXT PRIMARY KEY,
    model_name TEXT NOT NULL,
    dsv TEXT,
    imgsz INTEGER,
    mAP50 REAL,
    is_active INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL
);

-- Prepopulate canonical species
INSERT OR IGNORE INTO species (class_id, class_name, scientific_name, common_name, family) VALUES
(0, 'kembung_perempuan', 'Rastrelliger brachysoma', 'Kembung perempuan', 'Scombridae'),
(1, 'selar_kuning', 'Selaroides leptolepis', 'Selar kuning', 'Carangidae'),
(2, 'kuniran', 'Upeneus sulphureus', 'Kuniran', 'Mullidae');
