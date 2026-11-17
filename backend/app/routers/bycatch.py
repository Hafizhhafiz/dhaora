"""
ByCatch AI Router for ASIK VOL VI Unified Platform.
Integrates ByCatch AI module into the unified platform without disturbing FishGuard.
Preserves genuine ByCatch models, rule engine, conservation databases, and SQLite storage.
"""

import os
import sys
import uuid
import hashlib
import cv2
import numpy as np
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

# Resolve workspace and bycatch paths
CURRENT_FILE = Path(__file__).resolve()
WORKSPACE_ROOT = CURRENT_FILE.parent.parent.parent.parent
BYCATCH_DIR = WORKSPACE_ROOT / "bycatch"

if str(BYCATCH_DIR) not in sys.path:
    sys.path.insert(0, str(BYCATCH_DIR))

from ..config import UPLOAD_DIR, RESULT_DIR
from src.inference.predictor import FishDetector
from src.inference.catch_role import determine_catch_role
from src.conservation.service import ConservationService
from src.database.db import get_connection
from src.database.repository import ByCatchRepository

router = APIRouter(prefix="/api/bycatch", tags=["ByCatch AI Module"])

# Initialize singletons for ByCatch
BYCATCH_DATA_DIR = BYCATCH_DIR / "data"
BYCATCH_METADATA_DIR = BYCATCH_DIR / "metadata"
BYCATCH_DB_PATH = BYCATCH_DATA_DIR / "app.sqlite"

detector = FishDetector(BYCATCH_DIR)
conservation_svc = ConservationService(BYCATCH_DATA_DIR, BYCATCH_METADATA_DIR)

# Species taxonomy lookup for ByCatch canonical classes
SPECIES_TAXONOMY = {
    0: {
        "class_id": 0,
        "name": "kembung_perempuan",
        "scientific_name": "Rastrelliger brachysoma",
        "common_name": "Kembung Perempuan",
        "family": "Scombridae"
    },
    1: {
        "class_id": 1,
        "name": "selar_kuning",
        "scientific_name": "Selaroides leptolepis",
        "common_name": "Selar Kuning",
        "family": "Carangidae"
    },
    2: {
        "class_id": 2,
        "name": "kuniran",
        "scientific_name": "Upeneus sulphureus",
        "common_name": "Kuniran",
        "family": "Mullidae"
    }
}

class CatchRoleRequest(BaseModel):
    detected_species_name: str
    target_species: Optional[str] = None
    catch_handling: str = "retained"
    gear_info: Optional[str] = None

class TripRecordRequest(BaseModel):
    landing_date: str
    fishing_gear: str
    detected_species: str
    catch_role: str
    target_species: Optional[str] = ""
    vessel_trip_id: Optional[str] = ""
    catch_handling: Optional[str] = "retained"
    notes: Optional[str] = ""
    image_id: Optional[str] = None

@router.get("/health")
def bycatch_health():
    """Reports status of ByCatch detector, models, conservation snapshots, and database."""
    iucn_available = (BYCATCH_DATA_DIR / "conservation_snapshots" / "iucn_snapshot.json").exists()
    cites_available = (BYCATCH_DATA_DIR / "conservation_snapshots" / "cites_snapshot.json").exists()
    reg_available = (BYCATCH_METADATA_DIR / "regulation_registry.csv").exists()
    db_connected = BYCATCH_DB_PATH.exists()

    return {
        "module": "ByCatch AI",
        "status": "healthy" if db_connected else "degraded",
        "model_status": detector.model_status,
        "active_model_metadata": detector.model_metadata,
        "classes_supported": list(detector.class_names.values()) if detector.class_names else [
            "kembung_perempuan", "selar_kuning", "kuniran"
        ],
        "conservation_sources": {
            "iucn_snapshot_available": iucn_available,
            "cites_snapshot_available": cites_available,
            "kkp_regulations_available": reg_available
        },
        "database_connected": db_connected,
        "database_file": str(BYCATCH_DB_PATH)
    }

@router.post("/roles")
def evaluate_catch_role_endpoint(payload: CatchRoleRequest):
    """Evaluates FAO catch role rule engine for target vs bycatch context."""
    res = determine_catch_role(
        detected_species_name=payload.detected_species_name,
        target_species=payload.target_species,
        catch_handling=payload.catch_handling,
        gear_info=payload.gear_info
    )
    return res

@router.get("/conservation/{scientific_name}")
def get_conservation_profile_endpoint(scientific_name: str):
    """Retrieves authoritative IUCN, CITES, and KKP conservation data."""
    try:
        profile = conservation_svc.get_species_conservation_profile(scientific_name)
        profile["legal_disclaimer"] = (
            "Data konservasi bersumber dari snapshot resmi otoritatif (IUCN Red List v4, "
            "CITES Species+, JDIH KKP RI) dan ditujukan sebagai penyaringan awal pemantauan perikanan, "
            "bukan penetapan hukum status spesies."
        )
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data konservasi: {str(e)}")

@router.get("/records")
def get_bycatch_records(limit: int = 50):
    """Retrieves catch records and dashboard statistics from ByCatch SQLite database."""
    if not BYCATCH_DB_PATH.exists():
        return {"records": [], "summary": {}}

    try:
        conn = get_connection(BYCATCH_DB_PATH)
        repo = ByCatchRepository(conn)
        summary = repo.get_dashboard_summary()

        cursor = conn.cursor()
        cursor.execute("""
            SELECT record_id, image_id, landing_date, vessel_trip_id, fishing_gear,
                   target_species, detected_species, catch_role, catch_handling, notes, created_at
            FROM catch_records
            ORDER BY record_id DESC
            LIMIT ?;
        """, (limit,))
        records = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return {
            "status": "success",
            "summary": summary,
            "records": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membaca database ByCatch: {str(e)}")

@router.post("/trips")
def create_trip_record(payload: TripRecordRequest):
    """Logs a fishing trip / catch record into ByCatch SQLite database."""
    try:
        conn = get_connection(BYCATCH_DB_PATH)
        repo = ByCatchRepository(conn)
        record_id = repo.insert_catch_record(
            landing_date=payload.landing_date,
            fishing_gear=payload.fishing_gear,
            detected_species=payload.detected_species,
            catch_role=payload.catch_role,
            target_species=payload.target_species or "",
            vessel_trip_id=payload.vessel_trip_id or "",
            catch_handling=payload.catch_handling or "retained",
            notes=payload.notes or "",
            image_id=payload.image_id
        )
        conn.close()
        return {"status": "success", "record_id": record_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan catatan trip: {str(e)}")

@router.post("/detect")
async def detect_bycatch(
    file: UploadFile = File(...),
    target_species: str = Form(""),
    fishing_gear: str = Form("Jaring Insang / Gillnet"),
    catch_handling: str = Form("retained"),
    confidence: float = Form(0.25)
):
    """
    Executes ByCatch AI detection, rule-based catch role classification,
    and authoritative conservation verification.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berformat citra gambar (JPEG/PNG/WebP).")

    MAX_FILE_SIZE = 15 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file melebihi batas 15 MB (diterima: {len(content)/(1024*1024):.2f} MB)."
        )
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File yang diunggah kosong (0 bytes).")

    analysis_id = f"bc_{uuid.uuid4().hex[:8]}"
    file_ext = Path(file.filename).suffix or ".jpg"
    unique_filename = f"{analysis_id}_{Path(file.filename).stem}{file_ext}"
    uploaded_filepath = UPLOAD_DIR / unique_filename

    try:
        with open(uploaded_filepath, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan file upload: {str(e)}")

    # Compute sha256
    file_sha256 = hashlib.sha256(content).hexdigest()

    # Run ByCatch FishDetector
    pred_res = detector.predict(str(uploaded_filepath), conf_thresh=confidence)
    if pred_res.get("status") != "success":
        raise HTTPException(
            status_code=500,
            detail=f"Deteksi ByCatch gagal: {pred_res.get('error', 'Status model tidak siap')}"
        )

    raw_detections = pred_res.get("detections", [])
    orig_w, orig_h = pred_res.get("image_size", (1280, 720))

    # Read image for annotation
    img_bgr = cv2.imread(str(uploaded_filepath))
    if img_bgr is None:
        img_bgr = np.zeros((orig_h, orig_w, 3), dtype=np.uint8)

    annotated_img = img_bgr.copy()
    processed_detections = []
    target_count = 0
    bycatch_count = 0

    # Process each detection with Catch Role & Conservation
    for det in raw_detections:
        cls_id = det["class_id"]
        conf = det["confidence"]
        bbox_pixel = det["bbox_pixel"]
        raw_name = det["class_name"]

        # Resolve species info
        tax = SPECIES_TAXONOMY.get(cls_id, {
            "name": raw_name,
            "scientific_name": raw_name.replace("_", " ").title(),
            "common_name": raw_name.replace("_", " ").title(),
            "family": "Pisces"
        })

        # 1. Determine Catch Role
        role_info = determine_catch_role(
            detected_species_name=tax["name"],
            target_species=target_species,
            catch_handling=catch_handling,
            gear_info=fishing_gear
        )

        if role_info.get("is_target"):
            target_count += 1
            box_color = (0, 200, 0)      # Green for Target
            role_label = "TARGET"
        elif role_info.get("is_bycatch"):
            bycatch_count += 1
            if role_info.get("catch_role") == "discarded_non_target":
                box_color = (0, 0, 230)  # Red for Discarded Bycatch
                role_label = "BYCATCH (Discarded)"
            else:
                box_color = (0, 165, 255) # Orange for Retained Bycatch
                role_label = "BYCATCH (Retained)"
        else:
            box_color = (180, 180, 180) # Gray for Unverified
            role_label = "UNVERIFIED"

        # 2. Query Conservation Profile
        try:
            cons_prof = conservation_svc.get_species_conservation_profile(tax["scientific_name"])
            iucn_cat = cons_prof.get("iucn", {}).get("iucn_status", "Not Evaluated")
            cites_app = cons_prof.get("cites", {}).get("cites_appendix", "Not Listed")
            nat_prot = cons_prof.get("national_protection", {}).get("national_protection_status", "Tidak Dilindungi")
        except Exception:
            iucn_cat = "Tidak Tersedia"
            cites_app = "Tidak Tersedia"
            nat_prot = "Tidak Tersedia"

        # Draw bounding box
        x1, y1, x2, y2 = bbox_pixel
        cv2.rectangle(annotated_img, (x1, y1), (x2, y2), box_color, 2)
        tag_text = f"{tax['common_name']} | {role_label} ({conf*100:.1f}%)"
        (tw, th), _ = cv2.getTextSize(tag_text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
        cv2.rectangle(annotated_img, (x1, max(0, y1 - th - 6)), (x1 + tw + 4, y1), box_color, -1)
        cv2.putText(
            annotated_img,
            tag_text,
            (x1 + 2, max(th, y1 - 3)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            (255, 255, 255),
            1,
            cv2.LINE_AA
        )

        processed_detections.append({
            "class_id": cls_id,
            "class_name": tax["name"],
            "scientific_name": tax["scientific_name"],
            "common_name": tax["common_name"],
            "family": tax["family"],
            "confidence": conf,
            "bbox_pixel": bbox_pixel,
            "catch_role": role_info,
            "conservation": {
                "iucn_category": iucn_cat,
                "cites_appendix": cites_app,
                "national_protection": nat_prot
            }
        })

    # Save annotated image
    result_filename = f"bc_result_{unique_filename}"
    result_filepath = RESULT_DIR / result_filename
    cv2.imwrite(str(result_filepath), annotated_img)

    total_detected = len(processed_detections)
    bycatch_ratio = round((bycatch_count / total_detected * 100), 1) if total_detected > 0 else 0.0

    # Log into ByCatch SQLite database
    try:
        conn = get_connection(BYCATCH_DB_PATH)
        repo = ByCatchRepository(conn)
        repo.insert_image(
            image_id=analysis_id,
            filename=unique_filename,
            file_path=str(uploaded_filepath),
            width=orig_w,
            height=orig_h,
            sha256=file_sha256
        )

        for det in processed_detections:
            x1, y1, x2, y2 = det["bbox_pixel"]
            repo.insert_detection(
                image_id=analysis_id,
                class_id=det["class_id"],
                confidence=det["confidence"],
                x1=x1, y1=y1, x2=x2, y2=y2,
                model_id=detector.model_metadata.get("model_name", "bycatch_yolo11n")
            )
            repo.insert_catch_record(
                landing_date=unique_filename[:8],
                fishing_gear=fishing_gear,
                detected_species=det["scientific_name"],
                catch_role=det["catch_role"]["catch_role"],
                target_species=target_species,
                vessel_trip_id="TRIP-" + analysis_id,
                catch_handling=catch_handling,
                notes=f"Auto-classified by ByCatch AI. Rule: {det['catch_role']['rule_id']}",
                image_id=analysis_id
            )
        conn.close()
    except Exception as e:
        print(f"[Warning] Gagal mencatat ke ByCatch SQLite: {e}")

    return {
        "status": "success",
        "analysis_id": analysis_id,
        "filename": unique_filename,
        "image_url": f"/static/uploads/{unique_filename}",
        "result_image_url": f"/static/results/{result_filename}",
        "trip_context": {
            "fishing_gear": fishing_gear,
            "target_species": target_species or "(Tidak dispesifikasikan)",
            "catch_handling": catch_handling
        },
        "total_detected": total_detected,
        "summary": {
            "target_count": target_count,
            "bycatch_count": bycatch_count,
            "bycatch_ratio_percent": bycatch_ratio
        },
        "detections": processed_detections,
        "disclaimer": (
            "Hasil klasifikasi peran tangkapan dan status konservasi merupakan penyaringan "
            "otomatis untuk pemantauan perikanan, bukan penetapan hukum status spesies."
        )
    }
