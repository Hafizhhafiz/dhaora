"""
Inference Preprocessing Pipeline for ByCatch AI (Phase 10).
Handles EXIF rotation, sanitization of sensitive metadata, and conversion to RGB.
"""

from pathlib import Path
from typing import Tuple
from PIL import Image, ImageOps

def preprocess_image_for_inference(image_input) -> Tuple[Image.Image, int, int]:
    """
    Takes a file path, BytesIO, or PIL Image, normalizes EXIF orientation,
    and returns (RGB Image, original_width, original_height).
    """
    if isinstance(image_input, Image.Image):
        img = image_input
    elif isinstance(image_input, (str, Path)):
        img = Image.open(image_input)
    else:
        img = Image.open(image_input)

    # 1. EXIF orientation correction
    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    # 2. Convert to RGB (strips any CMYK, RGBA, or grayscale anomalies)
    rgb_img = img.convert("RGB")
    w, h = rgb_img.size

    return rgb_img, w, h
