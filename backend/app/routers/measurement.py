from fastapi import APIRouter, HTTPException
from ..models.schemas import LengthMeasurementRequest, LengthMeasurementResponse
from ..services.length_service import length_service_instance
from ..services.storage_service import update_measurement

router = APIRouter(prefix="/api", tags=["Length Measurement"])

@router.post("/measure", response_model=LengthMeasurementResponse)
async def measure_fish_length(
    req: LengthMeasurementRequest,
    analysis_id: str = None
):
    """
    Computes fish Total Length (TL) based on computer vision contour detection & pixel calibration.
    """
    try:
        response = length_service_instance.measure_length(req)
        
        # If analysis_id is provided, update database record
        if analysis_id and response.success and response.total_length_cm is not None:
            update_measurement(
                analysis_id=analysis_id,
                length_cm=response.total_length_cm,
                measured_url=response.measured_image_url
            )

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses estimasi panjang: {str(e)}")
