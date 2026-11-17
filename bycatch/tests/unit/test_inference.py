"""
Unit tests for Inference Predictor and Preprocessing (Phase 10).
"""

import pytest
from pathlib import Path
from PIL import Image
from src.inference.preprocess import preprocess_image_for_inference
from src.inference.predictor import FishDetector

def test_preprocess_image():
    # Create simple RGB image
    img = Image.new("RGBA", (100, 80), color=(255, 0, 0, 128))
    rgb_img, w, h = preprocess_image_for_inference(img)
    assert w == 100
    assert h == 80
    assert rgb_img.mode == "RGB"

def test_fish_detector_status_without_weights(tmp_path):
    # Empty root dir -> no active_model.json
    detector = FishDetector(tmp_path)
    assert detector.model_status == "model_missing"

    pred = detector.predict(Image.new("RGB", (64, 64)))
    assert pred["status"] == "model_missing"
    assert len(pred["detections"]) == 0
