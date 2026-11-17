import shutil
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..config import UPLOAD_DIR, RESULT_DIR
from ..models.schemas import DetectionResponse
from ..services.yolo_service import yolo_service_instance
from ..services.storage_service import save_analysis

router = APIRouter(prefix="/api", tags=["Detection & Counting"])

@router.post("/detect", response_model=DetectionResponse)
async def detect_fish(
    file: UploadFile = File(...),
    confidence: float = Form(0.25)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File yang diunggah harus berformat gambar (JPEG/PNG/WebP).")

    # Read and validate file size (maksimum 15 MB)
    MAX_FILE_SIZE = 15 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"Ukuran file melebihi batas maksimum 15 MB (diterima: {len(content)/(1024*1024):.2f} MB).")
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File yang diunggah kosong (0 bytes).")

    # Generate unique analysis ID & save file
    analysis_id = str(uuid.uuid4())[:8]
    file_ext = Path(file.filename).suffix or ".jpg"
    unique_filename = f"{analysis_id}_{Path(file.filename).stem}{file_ext}"
    uploaded_filepath = UPLOAD_DIR / unique_filename

    try:
        with open(uploaded_filepath, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan file upload: {str(e)}")

    # Run YOLO detection
    try:
        detections, result_filename, inference_ms, notes = yolo_service_instance.detect(
            str(uploaded_filepath),
            conf_threshold=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kesalahan saat inferensi model: {str(e)}")

    # Calculate species count and composition for locked 3 MVP classes
    brachysoma_cnt = sum(1 for d in detections if d.class_name.lower() in ["brachysoma", "kembung"])
    leptolepis_cnt = sum(1 for d in detections if d.class_name.lower() in ["leptolepis", "selar", "layang"])
    sulphureus_cnt = sum(1 for d in detections if d.class_name.lower() in ["sulphureus", "kuniran"])
    total_cnt = len(detections)
    other_cnt = total_cnt - (brachysoma_cnt + leptolepis_cnt + sulphureus_cnt)

    species_breakdown = {
        "brachysoma": brachysoma_cnt,
        "leptolepis": leptolepis_cnt,
        "sulphureus": sulphureus_cnt,
        "other": other_cnt
    }

    composition = {}
    if total_cnt > 0:
        composition = {
            "brachysoma": round((brachysoma_cnt / total_cnt) * 100, 1),
            "leptolepis": round((leptolepis_cnt / total_cnt) * 100, 1),
            "sulphureus": round((sulphureus_cnt / total_cnt) * 100, 1),
            "other": round((other_cnt / total_cnt) * 100, 1)
        }
    else:
        composition = {"brachysoma": 0.0, "leptolepis": 0.0, "sulphureus": 0.0, "other": 0.0}

    image_url = f"/static/uploads/{unique_filename}"
    result_image_url = f"/static/results/{result_filename}"

    # Save to SQLite database (MVP schema)
    save_analysis(
        analysis_id=analysis_id,
        filename=file.filename,
        image_url=image_url,
        result_image_url=result_image_url,
        total_count=total_cnt,
        brachysoma_count=brachysoma_cnt,
        leptolepis_count=leptolepis_cnt,
        sulphureus_count=sulphureus_cnt,
        other_count=other_cnt,
        detections=[d.model_dump() for d in detections],
        species_breakdown=species_breakdown,
        composition_percentages=composition,
        inference_time_ms=inference_ms,
        model_mode=yolo_service_instance.model_mode
    )

    from datetime import datetime
    return DetectionResponse(
        id=analysis_id,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        filename=file.filename,
        image_url=image_url,
        result_image_url=result_image_url,
        total_count=total_cnt,
        brachysoma_count=brachysoma_cnt,
        leptolepis_count=leptolepis_cnt,
        sulphureus_count=sulphureus_cnt,
        other_count=other_cnt,
        kembung_count=brachysoma_cnt,
        layang_count=leptolepis_cnt,
        species_breakdown=species_breakdown,
        composition_percentages=composition,
        detections=detections,
        inference_time_ms=inference_ms,
        model_version=f"YOLO ({yolo_service_instance.model_mode})",
        model_mode=yolo_service_instance.model_mode,
        notes=notes
    )
