import cv2
import json
import numpy as np
from pathlib import Path

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
EVIDENCE_DIR = WORKSPACE / "PHASES" / "PHASE_11_7_3" / "EVIDENCE"
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)

# Import calibrate_scale
sys_path = str(WORKSPACE / "PHASES" / "PHASE_11_7_3" / "tools")
import sys
if sys_path not in sys.path:
    sys.path.insert(0, sys_path)
from calibrate_scale import analyze_calibration_image

def generate_synthetic_rig_frame(target_scale_mm_per_px=0.25, noise_level=0.0):
    """
    Generates a synthetic calibration test image (1920x1080) representing
    a top-down view of a measuring board with a 50mm ArUco DICT_4X4_50 marker
    and a 150mm ground-truth reference object bar.
    """
    h, w = 1080, 1920
    # Create realistic dark matte background
    canvas = np.full((h, w, 3), 45, dtype=np.uint8)
    
    # 50mm marker size in pixels:
    marker_px = int(50.0 / target_scale_mm_per_px) # e.g. 200 px
    
    # Draw ArUco marker DICT_4X4_50 ID 0
    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    marker_img = cv2.aruco.generateImageMarker(aruco_dict, 0, marker_px)
    
    # Quiet zone: 10mm -> 40 px at 0.25 mm/px
    qz_px = int(10.0 / target_scale_mm_per_px)
    padded_marker = np.full((marker_px + 2*qz_px, marker_px + 2*qz_px), 255, dtype=np.uint8)
    padded_marker[qz_px:qz_px+marker_px, qz_px:qz_px+marker_px] = marker_img
    
    # Place marker at top-left of measuring board
    mx, my = 150, 200
    mh, mw = padded_marker.shape
    canvas[my:my+mh, mx:mx+mw] = cv2.cvtColor(padded_marker, cv2.COLOR_GRAY2BGR)
    
    # Draw a 150mm ground truth reference test bar (non-biological object)
    bar_len_mm = 150.0
    bar_len_px = int(bar_len_mm / target_scale_mm_per_px) # 600 px
    bar_x1, bar_y1 = 500, 500
    bar_x2, bar_y2 = bar_x1 + bar_len_px, bar_y1
    cv2.line(canvas, (bar_x1, bar_y1), (bar_x2, bar_y2), (0, 255, 255), 10)
    # Add end notches
    cv2.line(canvas, (bar_x1, bar_y1 - 15), (bar_x1, bar_y1 + 15), (0, 255, 255), 4)
    cv2.line(canvas, (bar_x2, bar_y2 - 15), (bar_x2, bar_y2 + 15), (0, 255, 255), 4)
    cv2.putText(canvas, "150.0 mm Reference Bar", (bar_x1 + 100, bar_y1 - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    
    # Add subtle Gaussian noise to simulate camera sensor noise
    if noise_level > 0:
        noise = np.random.normal(0, noise_level, canvas.shape).astype(np.int16)
        canvas = np.clip(canvas.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
    return canvas, (bar_x1, bar_y1, bar_x2, bar_y2, bar_len_mm)

def run_stability_and_accuracy_tests():
    print("--- 1. Testing Synthetic Primary Calibration ---")
    img, (bx1, by1, bx2, by2, true_len_mm) = generate_synthetic_rig_frame(0.25, noise_level=1.5)
    test_img_path = EVIDENCE_DIR / "synthetic_calibration_frame.png"
    cv2.imwrite(str(test_img_path), img)
    
    calib_res = analyze_calibration_image(test_img_path, marker_size_mm=50.0, output_dir=EVIDENCE_DIR)
    print(f"Calibration status: {calib_res['status']}")
    print(f"Detected scale factor: {calib_res['mm_per_pixel']:.5f} mm/px (Ground truth: 0.25000)")
    scale_error_pct = abs(calib_res['mm_per_pixel'] - 0.25) / 0.25 * 100
    print(f"Scale error: {scale_error_pct:.3f}%")
    
    # Estimate reference bar length using calibrated scale
    measured_bar_px = np.linalg.norm(np.array([bx2, by2]) - np.array([bx1, by1]))
    estimated_bar_mm = measured_bar_px * calib_res['mm_per_pixel']
    bar_error_mm = abs(estimated_bar_mm - true_len_mm)
    bar_error_pct = (bar_error_mm / true_len_mm) * 100
    print(f"Reference bar test (150 mm): Estimated = {estimated_bar_mm:.2f} mm | Error = {bar_error_mm:.2f} mm ({bar_error_pct:.2f}%)")
    
    print("\n--- 2. Testing 5x Re-mount Repeatability Simulation ---")
    remount_scales = []
    for i in range(5):
        # Simulate slight physical variations in re-mounting height (+- 0.5% scale shift)
        scale_shift = 0.25 * (1.0 + np.random.uniform(-0.004, 0.004))
        frame, _ = generate_synthetic_rig_frame(scale_shift, noise_level=2.0)
        fpath = EVIDENCE_DIR / f"remount_test_trial_{i+1}.png"
        cv2.imwrite(str(fpath), frame)
        c_res = analyze_calibration_image(fpath, marker_size_mm=50.0)
        remount_scales.append(c_res['mm_per_pixel'])
        print(f"  Trial {i+1}: Scale = {c_res['mm_per_pixel']:.5f} mm/px")
        
    mean_scale = float(np.mean(remount_scales))
    std_scale = float(np.std(remount_scales))
    cv_scale_pct = (std_scale / mean_scale) * 100
    print(f"Re-mount Repeatability: Mean = {mean_scale:.5f}, SD = {std_scale:.6f}, CV = {cv_scale_pct:.3f}% (Target <= 1.0%)")
    
    print("\n--- 3. Testing 10x Exposure Consistency Simulation ---")
    exposures = []
    for i in range(10):
        # Simulate subtle exposure fluctuation
        exp_factor = 1.0 + np.random.uniform(-0.03, 0.03)
        exp_frame = np.clip(img.astype(np.float32) * exp_factor, 0, 255).astype(np.uint8)
        gray = cv2.cvtColor(exp_frame, cv2.COLOR_BGR2GRAY)
        mean_lum = float(np.mean(gray))
        exposures.append(mean_lum)
        
    mean_exp = float(np.mean(exposures))
    std_exp = float(np.std(exposures))
    cv_exp_pct = (std_exp / mean_exp) * 100
    print(f"Exposure Consistency: Mean Lum = {mean_exp:.2f}, SD = {std_exp:.3f}, CV = {cv_exp_pct:.2f}%")
    
    summary = {
        "scale_error_pct": round(scale_error_pct, 4),
        "reference_bar_error_pct": round(bar_error_pct, 3),
        "reference_bar_error_mm": round(bar_error_mm, 3),
        "remount_cv_pct": round(cv_scale_pct, 4),
        "remount_scales": remount_scales,
        "exposure_cv_pct": round(cv_exp_pct, 3),
        "pass_scale_target": bool(scale_error_pct <= 1.0),
        "pass_object_target": bool(bar_error_pct <= 2.0),
        "pass_remount_target": bool(cv_scale_pct <= 1.0)
    }
    
    with open(EVIDENCE_DIR / "calibration_test_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print("\nTest results saved to PHASE_11_7_3/EVIDENCE/calibration_test_summary.json")

if __name__ == "__main__":
    run_stability_and_accuracy_tests()
