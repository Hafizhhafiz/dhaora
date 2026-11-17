#!/usr/bin/env python3
"""
Camera Field of View (FoV) and Optical Scale Calculator
FishGuard AI — ASIK V (Phase 11.7.2)
Location: PPN Karangantu, Teluk Banten

Calculates optical coverage, ground sampling distance (GSD), and evaluates
whether a 50 cm measuring board + ArUco calibration marker fits within camera frame.
"""

import math
import argparse

def calculate_fov(sensor_w_mm, sensor_h_mm, focal_length_mm, distance_mm, img_w_px=6000, img_h_px=4000, target_board_cm=50.0, margin_cm=10.0):
    """
    Calculate optical FoV using standard pinhole projective geometry:
    FoV_w = (sensor_w * distance) / focal_length
    FoV_h = (sensor_h * distance) / focal_length
    """
    fov_w_mm = (sensor_w_mm * distance_mm) / focal_length_mm
    fov_h_mm = (sensor_h_mm * distance_mm) / focal_length_mm
    
    fov_w_cm = fov_w_mm / 10.0
    fov_h_cm = fov_h_mm / 10.0
    fov_diag_cm = math.sqrt(fov_w_cm**2 + fov_h_cm**2)
    
    # Ground Sampling Distance (GSD) / scale
    px_per_mm_w = img_w_px / fov_w_mm
    px_per_mm_h = img_h_px / fov_h_mm
    px_per_cm = px_per_mm_w * 10.0
    gsd_mm_per_px = 1.0 / px_per_mm_w
    
    # Required coverage: 50 cm board + margin (e.g. 5 cm on left, 5 cm on right)
    required_width_cm = target_board_cm + margin_cm
    fits_horizontal = fov_w_cm >= required_width_cm
    deficit_cm = max(0.0, required_width_cm - fov_w_cm)
    
    # What working distance is needed to achieve required_width_cm with this lens?
    required_dist_for_current_lens_mm = (required_width_cm * 10.0 * focal_length_mm) / sensor_w_mm
    required_dist_for_current_lens_cm = required_dist_for_current_lens_mm / 10.0
    
    # What focal length is needed if distance is kept at distance_mm?
    required_focal_length_for_current_dist_mm = (sensor_w_mm * distance_mm) / (required_width_cm * 10.0)
    
    return {
        'sensor_w_mm': sensor_w_mm,
        'sensor_h_mm': sensor_h_mm,
        'focal_length_mm': focal_length_mm,
        'distance_cm': distance_mm / 10.0,
        'fov_width_cm': round(fov_w_cm, 2),
        'fov_height_cm': round(fov_h_cm, 2),
        'fov_diagonal_cm': round(fov_diag_cm, 2),
        'resolution_px': f"{img_w_px}x{img_h_px}",
        'scale_px_per_cm': round(px_per_cm, 2),
        'gsd_mm_per_px': round(gsd_mm_per_px, 4),
        'target_board_cm': target_board_cm,
        'margin_cm': margin_cm,
        'required_width_cm': required_width_cm,
        'fits_horizontal': fits_horizontal,
        'coverage_status': 'PASS_FIT' if fits_horizontal else 'INSUFFICIENT_FOV_FAIL',
        'width_deficit_cm': round(deficit_cm, 2),
        'recommended_min_distance_cm': round(required_dist_for_current_lens_cm, 1),
        'recommended_max_focal_length_mm': round(required_focal_length_for_current_dist_mm, 1)
    }

def print_audit_report():
    print("=" * 80)
    print("FISHGUARD AI — CAMERA FIELD OF VIEW (FoV) AUDIT REPORT (PHASE 11.7.2)")
    print("=" * 80)
    
    presets = [
        {
            'name': 'Preset 1: Sony Alpha 6400 (APS-C 23.5x15.6mm) + Lensa 35mm pada Jarak 50 cm (Klaim Phase 11.7.1)',
            'sensor_w': 23.5, 'sensor_h': 15.6, 'f': 35.0, 'dist': 500.0, 'img_w': 6000, 'img_h': 4000
        },
        {
            'name': 'Preset 2: Sony Alpha 6400 (APS-C 23.5x15.6mm) + Lensa 35mm pada Jarak Direvisi (90 cm)',
            'sensor_w': 23.5, 'sensor_h': 15.6, 'f': 35.0, 'dist': 900.0, 'img_w': 6000, 'img_h': 4000
        },
        {
            'name': 'Preset 3: Sony Alpha 6400 (APS-C 23.5x15.6mm) + Lensa Wide 18mm pada Jarak 50 cm',
            'sensor_w': 23.5, 'sensor_h': 15.6, 'f': 18.0, 'dist': 500.0, 'img_w': 6000, 'img_h': 4000
        },
        {
            'name': 'Preset 4: Kamera Full-Frame (36.0x24.0mm) + Lensa 35mm pada Jarak 60 cm',
            'sensor_w': 36.0, 'sensor_h': 24.0, 'f': 35.0, 'dist': 600.0, 'img_w': 6000, 'img_h': 4000
        },
        {
            'name': 'Preset 5: Smartphone High-End (Sensor 1/1.33" 9.6x7.2mm, Lensa 6.8mm ~24mm eq) Jarak 50 cm',
            'sensor_w': 9.6, 'sensor_h': 7.2, 'f': 6.8, 'dist': 500.0, 'img_w': 4000, 'img_h': 3000
        }
    ]
    
    for idx, p in enumerate(presets, 1):
        res = calculate_fov(p['sensor_w'], p['sensor_h'], p['f'], p['dist'], p['img_w'], p['img_h'], target_board_cm=50.0, margin_cm=10.0)
        print(f"\n[{idx}] {p['name']}")
        print(f"    - Dimensi Sensor        : {res['sensor_w_mm']} x {res['sensor_h_mm']} mm")
        print(f"    - Panjang Fokus (f)     : {res['focal_length_mm']} mm")
        print(f"    - Jarak Kerja Kamera (H): {res['distance_cm']} cm")
        print(f"    - Hasil Cakupan FoV     : {res['fov_width_cm']} x {res['fov_height_cm']} cm (Diagonal: {res['fov_diagonal_cm']} cm)")
        print(f"    - Target Kebutuhan FoV  : {res['required_width_cm']} cm (Papan 50 cm + Margin 10 cm)")
        print(f"    - Status Kesesuaian     : [{res['coverage_status']}]")
        if not res['fits_horizontal']:
            print(f"      [!] DEFISIT LEBAR     : {res['width_deficit_cm']} cm terpotong!")
            print(f"      [!] Solusi Jarak      : Naikkan tinggi kamera ke minimal {res['recommended_min_distance_cm']} cm")
            print(f"      [!] Solusi Lensa      : Ganti lensa dengan focal length maksimal {res['recommended_max_focal_length_mm']} mm pada jarak 50 cm")
        else:
            print(f"      [+] Resolusi Spasial  : {res['scale_px_per_cm']} px/cm ({res['gsd_mm_per_px']} mm/px)")
            print(f"      [+] Rekomendasi       : Konfigurasi VALID secara optik untuk papan ukur 50 cm")
            
    print("\n" + "=" * 80)
    print("KESIMPULAN AUDIT KRITIS FoV:")
    print("1. Klaim Phase 11.7.1 bahwa lensa 35mm pada sensor APS-C jarak 50 cm menghasilkan FoV horizontal 55 cm")
    print("   adalah KELIRU SECARA MATEMATIK (aktual: hanya 33.6 cm). Papan ukur 50 cm akan terpotong 16.4 cm!")
    print("2. REKOMENDASI TERVERIFIKASI:")
    print("   - Opsi A (Gunakan Lensa 35mm Eksisting): Naikkan jarak kamera menjadi 88 - 92 cm (rekomendasi: 90 cm).")
    print("   - Opsi B (Tetap pada Jarak 50 cm): Gunakan lensa wide 18mm (ekuivalen 27mm full-frame).")
    print("=" * 80)

if __name__ == '__main__':
    print_audit_report()
