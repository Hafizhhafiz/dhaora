import time
import math
import cv2
import numpy as np
from pathlib import Path
from typing import Optional, List, Tuple, Dict, Any
from ..config import RESULT_DIR, UPLOAD_DIR, BASE_DIR
from ..models.schemas import LengthMeasurementRequest, LengthMeasurementResponse


def get_aruco_detector(dictionary_id=cv2.aruco.DICT_4X4_50):
    aruco_dict = cv2.aruco.getPredefinedDictionary(dictionary_id)
    aruco_params = cv2.aruco.DetectorParameters()
    aruco_params.cornerRefinementMethod = cv2.aruco.CORNER_REFINE_SUBPIX
    return cv2.aruco.ArucoDetector(aruco_dict, aruco_params)


class LengthEstimationService:
    def __init__(self):
        self.aruco_detector = get_aruco_detector()

    def measure_length(self, req: LengthMeasurementRequest) -> LengthMeasurementResponse:
        """
        Measures fish Total Length (TL) using calibrated computer vision,
        supporting ArUco marker scale recovery, body curvature analysis,
        and statistical uncertainty modeling.
        """
        warnings = []
        scientific_disclaimer = (
            "Pengukuran panjang ikan (Total Length / TL) menggunakan Computer Vision berbasis kalibrasi piksel-ke-cm. "
            "Akurasi bergantung pada posisi kamera tegak lurus (90 derajat ortogonal), kerataan spesimen di bidang Z=0, "
            "dan presisi penanda skala. Status validasi fisik pada spesimen lapangan riil di PPN Karangantu tetap "
            "berstatus EXPERIMENTAL hingga verifikasi fisik langsung dengan jangka sorong terlaksana."
        )

        # Resolve image path robustly
        raw_path = Path(req.image_path)
        if raw_path.is_absolute() and raw_path.exists():
            img_p = raw_path
        elif raw_path.exists():
            img_p = raw_path.resolve()
        elif (UPLOAD_DIR / raw_path.name).exists():
            img_p = UPLOAD_DIR / raw_path.name
        elif (RESULT_DIR / raw_path.name).exists():
            img_p = RESULT_DIR / raw_path.name
        elif (BASE_DIR.parent / raw_path).exists():
            img_p = (BASE_DIR.parent / raw_path).resolve()
        else:
            img_p = UPLOAD_DIR / raw_path.name

        img = cv2.imread(str(img_p))
        if img is None:
            return LengthMeasurementResponse(
                success=False,
                validation_status="EXPERIMENTAL",
                warnings=[f"Gambar tidak ditemukan atau rusak: {req.image_path}"],
                scientific_disclaimer=scientific_disclaimer
            )

        h, w = img.shape[:2]
        measured_img = img.copy()

        # Step 1: Calibration calculation
        scale_px_per_cm = req.calibration.pixels_per_cm
        is_calibrated = False
        scale_source = "UNSPECIFIED"
        scale_rel_err = 0.05

        # Check for ArUco marker in image first
        corners, ids, _ = self.aruco_detector.detectMarkers(img)
        if ids is not None and len(ids) > 0:
            primary_id = int(np.array(ids).flatten()[0])
            pts = corners[0][0]
            side_top = float(np.linalg.norm(pts[1] - pts[0]))
            side_right = float(np.linalg.norm(pts[2] - pts[1]))
            side_bottom = float(np.linalg.norm(pts[3] - pts[2]))
            side_left = float(np.linalg.norm(pts[0] - pts[3]))
            avg_marker_px = (side_top + side_right + side_bottom + side_left) / 4.0
            # Standard 50mm (5.0 cm) marker
            ref_len_cm = req.calibration.reference_length_cm if (req.calibration.reference_length_cm and req.calibration.reference_length_cm > 0) else 5.0
            scale_px_per_cm = avg_marker_px / ref_len_cm
            is_calibrated = True
            scale_source = f"ARUCO_MARKER_ID_{primary_id}"

            # Check perspective distortion of marker
            aspect_ratio = (side_top + side_bottom) / (side_right + side_left + 1e-8)
            diag1 = float(np.linalg.norm(pts[2] - pts[0]))
            diag2 = float(np.linalg.norm(pts[3] - pts[1]))
            diag_ratio = diag1 / (diag2 + 1e-8)
            is_valid_marker = (0.90 <= aspect_ratio <= 1.10) and (0.90 <= diag_ratio <= 1.10)

            scale_rel_err = 0.0006 if is_valid_marker else 0.02
            if not is_valid_marker:
                warnings.append("Peringatan: Penanda ArUco terdeteksi distorsi perspektif atau sudut kemiringan > 10 derajat.")

            # Draw ArUco marker
            cv2.polylines(measured_img, [np.int32(pts)], True, (0, 255, 255), 2)
            cv2.putText(
                measured_img,
                f"ArUco #{primary_id}: {ref_len_cm} cm",
                (int(pts[0][0]), max(15, int(pts[0][1]) - 6)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 255),
                1
            )
        elif req.calibration.mode == "marker_reference" and req.calibration.marker_box and req.calibration.reference_length_cm:
            mx1, my1, mx2, my2 = req.calibration.marker_box
            marker_px_len = max(abs(mx2 - mx1), abs(my2 - my1))
            if marker_px_len > 10 and req.calibration.reference_length_cm > 0:
                scale_px_per_cm = marker_px_len / req.calibration.reference_length_cm
                is_calibrated = True
                scale_source = "MANUAL_MARKER_BOX"
                scale_rel_err = 0.02
                cv2.rectangle(measured_img, (int(mx1), int(my1)), (int(mx2), int(my2)), (0, 255, 255), 2)
                cv2.putText(
                    measured_img,
                    f"Marker Ref: {req.calibration.reference_length_cm} cm",
                    (int(mx1), max(15, int(my1) - 5)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 255),
                    1
                )
            else:
                warnings.append("Dimensi marker referensi tidak memadai untuk menghitung rasio piksel.")
        elif scale_px_per_cm and scale_px_per_cm > 0:
            is_calibrated = True
            scale_source = "USER_CALIBRATED_SCALE"
            scale_rel_err = 0.02
        else:
            # Rig spec default uncalibrated fallback
            scale_px_per_cm = float(w) / 60.4  # nominal FoV = 60.4 cm
            warnings.append("PERINGATAN: Kalibrasi eksplisit tidak ditemukan. Menggunakan proyeksi nominal rig FoV=60.4cm.")
            scale_source = "NOMINAL_RIG_UNVERIFIED"
            scale_rel_err = 0.08

        # Step 2: Determine Snout and Tail points & Curvature
        snout = req.snout_point
        tail = req.tail_point
        contour_found = False
        centerline_pts = []
        curvature_ratio = 1.0

        if snout is None or tail is None:
            extracted = self._analyze_contour_detailed(img)
            if extracted:
                snout = extracted["snout"]
                tail = extracted["tail"]
                centerline_pts = extracted["centerline_pts"]
                curvature_ratio = extracted["curvature_ratio"]
                contour_found = True
            else:
                snout = [int(w * 0.15), int(h * 0.5)]
                tail = [int(w * 0.85), int(h * 0.5)]
                warnings.append("Kontur ikan tidak terdeteksi otomatis; menggunakan sumbu utama bidang citra.")

        # Step 3: Compute distances (straight and curved)
        dx = tail[0] - snout[0]
        dy = tail[1] - snout[1]
        straight_px = round(math.sqrt(dx * dx + dy * dy), 2)
        curved_px = round(straight_px * curvature_ratio, 2)
        pixel_distance = straight_px

        total_length_cm = None
        uncertainty_cm = None
        validation_status = "EXPERIMENTAL"
        confidence_level = "UNCALIBRATED_EXPERIMENTAL"

        if scale_px_per_cm and scale_px_per_cm > 0:
            straight_cm = straight_px / scale_px_per_cm
            curved_cm = curved_px / scale_px_per_cm
            use_curved = curvature_ratio > 1.03
            total_length_cm = round(curved_cm if use_curved else straight_cm, 2)

            # Uncertainty calculation
            rel_seg_err = 3.0 / max(10.0, straight_px)
            rel_tilt_err = 0.015
            rel_curv_err = 0.5 * abs(curvature_ratio - 1.0)
            combined_unc = math.sqrt(scale_rel_err**2 + rel_seg_err**2 + rel_tilt_err**2 + rel_curv_err**2)
            uncertainty_cm = round(total_length_cm * combined_unc * 1.96, 2)
            mape_estimated = combined_unc * 100.0

            if not is_calibrated:
                validation_status = "EXPERIMENTAL"
                confidence_level = "UNCALIBRATED_EXPERIMENTAL"
            elif mape_estimated <= 5.0:
                validation_status = "VALIDATED"
                confidence_level = "VALIDATED"
            elif mape_estimated <= 10.0:
                validation_status = "LIMITED"
                confidence_level = "LIMITED"
            else:
                validation_status = "EXPERIMENTAL"
                confidence_level = "EXPERIMENTAL"

        # Step 4: Draw caliper annotations
        cv2.circle(measured_img, (int(snout[0]), int(snout[1])), 6, (0, 0, 255), -1)
        cv2.putText(measured_img, "Moncong (Snout)", (int(snout[0]) - 40, int(snout[1]) - 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)

        cv2.circle(measured_img, (int(tail[0]), int(tail[1])), 6, (255, 0, 0), -1)
        cv2.putText(measured_img, "Ujung Ekor (TL)", (int(tail[0]) - 40, int(tail[1]) - 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 0, 0), 1)

        # Draw centerline if curved, else straight line
        if len(centerline_pts) >= 2 and curvature_ratio > 1.03:
            for i in range(len(centerline_pts) - 1):
                cv2.line(measured_img, tuple(centerline_pts[i]), tuple(centerline_pts[i + 1]), (0, 255, 0), 2)
        else:
            cv2.line(measured_img, (int(snout[0]), int(snout[1])), (int(tail[0]), int(tail[1])), (255, 255, 0), 2)

        # Measurement Label Badge
        mid_x = int((snout[0] + tail[0]) / 2)
        mid_y = int((snout[1] + tail[1]) / 2) - 15

        unc_str = f" +/- {uncertainty_cm}cm" if uncertainty_cm else ""
        if is_calibrated and total_length_cm is not None:
            length_label = f"TL: {total_length_cm} cm{unc_str} [{validation_status}]"
        else:
            length_label = f"TL: {total_length_cm or 0.0} cm (Uncalibrated) [{validation_status}]"

        (lw, lh), _ = cv2.getTextSize(length_label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
        cv2.rectangle(measured_img, (mid_x - 10, mid_y - lh - 8), (mid_x + lw + 10, mid_y + 8), (15, 23, 42), -1)
        badge_border = (34, 197, 94) if validation_status == "VALIDATED" else ((234, 179, 8) if validation_status == "LIMITED" else (239, 68, 68))
        cv2.rectangle(measured_img, (mid_x - 10, mid_y - lh - 8), (mid_x + lw + 10, mid_y + 8), badge_border, 1)
        cv2.putText(measured_img, length_label, (mid_x, mid_y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)

        # Scale bar
        if is_calibrated and scale_px_per_cm:
            bar_len_px = int(scale_px_per_cm * 5)  # 5 cm scale bar
            bar_x = 30
            bar_y = h - 35
            if bar_x + bar_len_px < w:
                cv2.line(measured_img, (bar_x, bar_y), (bar_x + bar_len_px, bar_y), (255, 255, 255), 3)
                cv2.line(measured_img, (bar_x, bar_y - 6), (bar_x, bar_y + 6), (255, 255, 255), 2)
                cv2.line(measured_img, (bar_x + bar_len_px, bar_y - 6), (bar_x + bar_len_px, bar_y + 6), (255, 255, 255), 2)
                cv2.putText(measured_img, "5 cm", (bar_x + int(bar_len_px / 2) - 15, bar_y - 8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

        # Save measured image
        ts = str(int(time.time() * 1000))
        measured_filename = f"measured_{ts}_{img_p.name}"
        measured_path = RESULT_DIR / measured_filename
        cv2.imwrite(str(measured_path), measured_img)

        return LengthMeasurementResponse(
            success=True,
            total_length_cm=total_length_cm,
            pixel_distance=pixel_distance,
            scale_pixels_per_cm=round(scale_px_per_cm, 2) if scale_px_per_cm else None,
            measured_image_url=f"/static/results/{measured_filename}",
            snout_point=snout,
            tail_point=tail,
            contour_detected=contour_found,
            is_calibrated=is_calibrated,
            confidence_level=confidence_level,
            validation_status=validation_status,
            curvature_ratio=round(curvature_ratio, 4),
            uncertainty_cm=uncertainty_cm,
            warnings=warnings,
            scientific_disclaimer=scientific_disclaimer
        )

    def _analyze_contour_detailed(self, img: np.ndarray) -> Optional[Dict[str, Any]]:
        """Identifies extreme anatomical points and calculates body curvature."""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (9, 9), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None

        largest_cnt = max(contours, key=cv2.contourArea)
        if cv2.contourArea(largest_cnt) < (img.shape[0] * img.shape[1] * 0.02):
            return None

        leftmost = tuple(largest_cnt[largest_cnt[:, :, 0].argmin()][0])
        rightmost = tuple(largest_cnt[largest_cnt[:, :, 0].argmax()][0])
        topmost = tuple(largest_cnt[largest_cnt[:, :, 1].argmin()][0])
        bottommost = tuple(largest_cnt[largest_cnt[:, :, 1].argmax()][0])

        horiz_dist = abs(rightmost[0] - leftmost[0])
        vert_dist = abs(bottommost[1] - topmost[1])

        if horiz_dist >= vert_dist:
            pt_a = leftmost
            pt_b = rightmost
        else:
            pt_a = topmost
            pt_b = bottommost

        straight_dist = math.dist(pt_a, pt_b)

        # Approximate curvature along horizontal slices
        centerline = []
        curved_len = 0.0
        n_slices = 8
        pts_2d = largest_cnt.reshape(-1, 2)
        if horiz_dist >= vert_dist and straight_dist > 20:
            x_min = min(pt_a[0], pt_b[0])
            x_max = max(pt_a[0], pt_b[0])
            step = max(1, (x_max - x_min) // n_slices)
            x_samples = list(range(x_min, x_max + 1, step))
            for xs in x_samples:
                pts_in_slice = pts_2d[np.abs(pts_2d[:, 0] - xs) <= max(2, step // 2)]
                if len(pts_in_slice) > 0:
                    y_avg = int(np.mean(pts_in_slice[:, 1]))
                    centerline.append((xs, y_avg))
            if len(centerline) >= 2:
                for i in range(len(centerline) - 1):
                    curved_len += math.dist(centerline[i], centerline[i + 1])
            else:
                curved_len = straight_dist
        elif straight_dist > 20:
            y_min = min(pt_a[1], pt_b[1])
            y_max = max(pt_a[1], pt_b[1])
            step = max(1, (y_max - y_min) // n_slices)
            y_samples = list(range(y_min, y_max + 1, step))
            for ys in y_samples:
                pts_in_slice = pts_2d[np.abs(pts_2d[:, 1] - ys) <= max(2, step // 2)]
                if len(pts_in_slice) > 0:
                    x_avg = int(np.mean(pts_in_slice[:, 0]))
                    centerline.append((x_avg, ys))
            if len(centerline) >= 2:
                for i in range(len(centerline) - 1):
                    curved_len += math.dist(centerline[i], centerline[i + 1])
            else:
                curved_len = straight_dist
        else:
            curved_len = straight_dist

        curvature_ratio = max(1.0, curved_len / (straight_dist + 1e-8))

        return {
            "snout": [int(pt_a[0]), int(pt_a[1])],
            "tail": [int(pt_b[0]), int(pt_b[1])],
            "centerline_pts": centerline,
            "curvature_ratio": curvature_ratio
        }

length_service_instance = LengthEstimationService()
