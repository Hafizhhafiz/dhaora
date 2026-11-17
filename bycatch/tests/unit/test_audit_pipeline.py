"""
Unit tests for ByCatch AI Dataset Audit Pipeline (Phase 4).
Runs on synthetic fixture images to test all edge cases.
"""

import pytest
import shutil
from pathlib import Path
from src.data.audit.integrity import verify_image_integrity
from src.data.audit.hashing import compute_sha256, compute_dhash, hamming_distance
from src.data.audit.quality import assess_image_quality
from src.data.audit.duplicates import find_duplicates
from src.data.audit.cli import run_audit, load_config
from PIL import Image

@pytest.fixture
def fixtures_dir():
    root = Path(__file__).resolve().parents[2]
    d = root / "tests" / "fixtures" / "synthetic_audit_images"
    assert d.exists(), "Fixtures directory does not exist! Run make_synthetic_images.py first."
    return d

def test_hashing_functions():
    # Test dHash on small dummy image
    img = Image.new("RGB", (64, 64), color="red")
    h1 = compute_dhash(img)
    assert len(h1) == 16
    h2 = compute_dhash(img)
    assert h1 == h2
    assert hamming_distance(h1, h2) == 0

def test_corrupt_image_detection(fixtures_dir):
    corrupt_file = fixtures_dir / "corrupt" / "truncated.bmp"
    integ = verify_image_integrity(corrupt_file)
    assert not integ["is_valid"]
    assert integ["error_message"] is not None

def test_valid_image_detection(fixtures_dir):
    valid_file = fixtures_dir / "valid" / "kembung_perempuan" / "test_kembung_perempuan_1.bmp"
    integ = verify_image_integrity(valid_file)
    assert integ["is_valid"]
    assert integ["width"] == 640
    assert integ["height"] == 480

def test_extreme_lighting_quality(fixtures_dir):
    dark_file = fixtures_dir / "extreme_lighting" / "too_dark.bmp"
    qual_dark = assess_image_quality(dark_file)
    assert "too_dark" in qual_dark["quality_flags"]

    bright_file = fixtures_dir / "extreme_lighting" / "too_bright.bmp"
    qual_bright = assess_image_quality(bright_file)
    assert "too_bright" in qual_bright["quality_flags"]

def test_duplicate_detection(fixtures_dir):
    orig = fixtures_dir / "duplicates" / "original_sample.bmp"
    copy = fixtures_dir / "duplicates" / "exact_copy_sample.bmp"

    sha1 = compute_sha256(orig)
    sha2 = compute_sha256(copy)
    assert sha1 == sha2

    records = [
        {"image_id": "img_001", "file_path": str(orig), "sha256": sha1, "dhash": "0000000000000000", "class_label": "sample"},
        {"image_id": "img_002", "file_path": str(copy), "sha256": sha2, "dhash": "0000000000000000", "class_label": "sample"}
    ]
    exact, near = find_duplicates(records, dhash_threshold=6)
    assert len(exact) == 2
    assert exact[0]["cluster_id"] == exact[1]["cluster_id"]

def test_end_to_end_audit_on_fixtures(fixtures_dir, tmp_path):
    root = Path(__file__).resolve().parents[2]
    cfg = load_config(root / "configs" / "audit_thresholds.yaml")
    out_dir = tmp_path / "audit_results"

    run_audit(fixtures_dir, out_dir, cfg)

    assert (out_dir / "inventory.csv").exists()
    assert (out_dir / "quality_report.csv").exists()
    assert (out_dir / "duplicates_exact.csv").exists()
    assert (out_dir / "review_queue.csv").exists()
    assert (out_dir / "audit_summary.json").exists()
    assert (out_dir / "audit_summary.md").exists()
