import os
import sys
import json
import argparse
import cv2
import numpy as np
from pathlib import Path

def get_aruco_detector(dictionary_id=cv2.aruco.DICT_4X4_50):
    aruco_dict = cv2.aruco.getPredefinedDictionary(dictionary_id)
    aruco_params = cv2.aruco.DetectorParameters()
    # Refine corner detection for sub-pixel accuracy
    aruco_params.cornerRefinementMethod = cv2.aruco.CORNER_REFINE_SUBPIX
    detector = cv2.aruco.ArucoDetector(aruco_dict, aruco_params)
    return detector

def analyze_calibration_image(image_path, marker_size_mm=50.0, output_dir=None):
    img = cv2.imread(str(image_path))
    if img is None:
        return {"success": False, "error": f"Failed to load image from {image_path}"}
        
    h, w, c = img.shape
    detector = get_aruco_detector()
    corners, ids, rejected = detector.detectMarkers(img)
    
    if ids is None or len(ids) == 0:
        return {
            "success": False,
            "error": "No ArUco marker detected in the frame. Ensure DICT_4X4_50 is in view and quiet zone (10mm) is clean.",
            "image_width": w,
            "image_height": h,
            "markers_found": 0
        }
        
    annotated = img.copy()
    cv2.aruco.drawDetectedMarkers(annotated, corners, ids)
    
    # Process primary marker (first detected or ID 0)
    primary_idx = 0
    primary_id = int(np.array(ids).flatten()[primary_idx])
    pts = corners[primary_idx][0] # Shape (4, 2): top-left, top-right, bottom-right, bottom-left
    
    # Calculate lengths of the 4 sides in pixels
    side_top = np.linalg.norm(pts[1] - pts[0])
    side_right = np.linalg.norm(pts[2] - pts[1])
    side_bottom = np.linalg.norm(pts[3] - pts[2])
    side_left = np.linalg.norm(pts[0] - pts[3])
    
    avg_side_px = float((side_top + side_right + side_bottom + side_left) / 4.0)
    mm_per_pixel = marker_size_mm / avg_side_px
    pixels_per_mm = avg_side_px / marker_size_mm
    pixels_per_cm = pixels_per_mm * 10.0
    
    # Check squareness and perspective distortion
    aspect_ratio = float((side_top + side_bottom) / (side_right + side_left))
    diag1 = np.linalg.norm(pts[2] - pts[0])
    diag2 = np.linalg.norm(pts[3] - pts[1])
    diag_ratio = float(diag1 / diag2)
    
    # Stability assessment
    is_square = 0.97 <= aspect_ratio <= 1.03
    is_orthogonal = 0.97 <= diag_ratio <= 1.03
    
    status = "CALIBRATION_VALID" if (is_square and is_orthogonal) else "CALIBRATION_WARNING_DISTORTION"
    
    # Visual overlay info
    label = f"ID:{primary_id} | Scale: {mm_per_pixel:.4f} mm/px ({pixels_per_cm:.1f} px/cm)"
    cx = int(np.mean(pts[:, 0]))
    cy = int(np.mean(pts[:, 1]))
    cv2.putText(annotated, label, (cx - 150, cy - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv2.LINE_AA)
    
    # Save visual artifact if output_dir provided
    annotated_filename = ""
    if output_dir:
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)
        annotated_filename = f"calibrated_{Path(image_path).name}"
        cv2.imwrite(str(out_path / annotated_filename), annotated)
        
    result = {
        "success": True,
        "status": status,
        "marker_id": primary_id,
        "marker_size_mm": marker_size_mm,
        "average_marker_side_px": round(avg_side_px, 2),
        "mm_per_pixel": round(mm_per_pixel, 6),
        "pixels_per_mm": round(pixels_per_mm, 4),
        "pixels_per_cm": round(pixels_per_cm, 2),
        "aspect_ratio": round(aspect_ratio, 4),
        "diagonal_ratio": round(diag_ratio, 4),
        "is_square": is_square,
        "is_orthogonal": is_orthogonal,
        "corner_points": pts.tolist(),
        "annotated_image": annotated_filename,
        "timestamp": Path(image_path).stat().st_mtime if Path(image_path).exists() else None
    }
    return result

def main():
    parser = argparse.ArgumentParser(description="FishGuard AI ArUco Optical Calibration Tool")
    parser.add_argument("--image", required=True, help="Path to input calibration image")
    parser.add_argument("--marker_size_mm", type=float, default=50.0, help="Physical size of ArUco marker in mm")
    parser.add_argument("--output_dir", default="PHASES/PHASE_11_7_3/EVIDENCE", help="Directory to save annotated evidence")
    args = parser.parse_args()
    
    res = analyze_calibration_image(args.image, args.marker_size_mm, args.output_dir)
    print(json.dumps(res, indent=2))
    
    if not res.get("success", False):
        sys.exit(1)

if __name__ == "__main__":
    main()
