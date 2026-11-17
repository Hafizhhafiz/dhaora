import os
import sys
import hashlib
import json
import cv2
import numpy as np
from pathlib import Path

# Add calibrate_scale path
TOOLS_PATH = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\PHASES\PHASE_11_7_3\tools")
if str(TOOLS_PATH) not in sys.path:
    sys.path.insert(0, str(TOOLS_PATH))
from calibrate_scale import analyze_calibration_image

def check_image_qc(image_path, min_blur_var=100.0, marker_size_mm=50.0):
    img = cv2.imread(str(image_path))
    if img is None:
        return {"pass": False, "reason": "Cannot open image"}
        
    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Blur check via Laplacian variance
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    is_sharp = bool(laplacian_var >= min_blur_var)
    
    # 2. Exposure check (over/underexposure)
    mean_lum = float(np.mean(gray))
    over_exposed_ratio = float(np.sum(gray >= 250) / (h * w))
    under_exposed_ratio = float(np.sum(gray <= 10) / (h * w))
    is_exposure_ok = bool((over_exposed_ratio < 0.15) and (under_exposed_ratio < 0.85))
    
    # 3. ArUco Marker detection
    calib = analyze_calibration_image(image_path, marker_size_mm)
    has_marker = bool(calib.get("success", False))
    
    overall_pass = bool(is_sharp and is_exposure_ok and has_marker)
    
    return {
        "pass": overall_pass,
        "width": w,
        "height": h,
        "sharpness_laplacian": round(laplacian_var, 2),
        "is_sharp": is_sharp,
        "mean_luminance": round(mean_lum, 2),
        "is_exposure_ok": is_exposure_ok,
        "marker_detected": has_marker,
        "mm_per_pixel": calib.get("mm_per_pixel"),
        "status": "QC_PASS" if overall_pass else "QC_FAIL",
        "failure_reasons": [
            *(["BLURRY"] if not is_sharp else []),
            *(["BAD_EXPOSURE"] if not is_exposure_ok else []),
            *(["MARKER_MISSING"] if not has_marker else [])
        ]
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        res = check_image_qc(sys.argv[1])
        print(json.dumps(res, indent=2))
    else:
        print("Usage: python qc_ingest_pilot.py <image_path>")
