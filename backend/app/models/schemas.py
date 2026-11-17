from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Tuple, Any

class FishDetection(BaseModel):
    box: List[float] = Field(..., description="[x1, y1, x2, y2] bounding box coordinates in pixels")
    confidence: float = Field(..., description="Detection confidence score (0.0 - 1.0)")
    class_id: int = Field(..., description="Class identifier")
    class_name: str = Field(..., description="Common name e.g. kembung or layang")
    scientific_name: str = Field(..., description="Scientific name e.g. Rastrelliger kanagurta")
    family: str = Field(..., description="Family name")

class DetectionResponse(BaseModel):
    id: str
    timestamp: str
    filename: str
    image_url: str
    result_image_url: str
    total_count: int
    brachysoma_count: int = 0
    leptolepis_count: int = 0
    sulphureus_count: int = 0
    other_count: int = 0
    # Backward compatibility fields
    kembung_count: Optional[int] = 0
    layang_count: Optional[int] = 0
    species_breakdown: Dict[str, int]
    composition_percentages: Dict[str, float]
    detections: List[FishDetection]
    inference_time_ms: float
    model_version: str
    model_mode: str  # "CUSTOM_SPECIES_MODEL" or "MODEL_NOT_TRAINED"
    notes: List[str]

class CalibrationData(BaseModel):
    mode: str = Field("pixels_per_cm", description="'pixels_per_cm' or 'marker_reference' or 'manual_line'")
    pixels_per_cm: Optional[float] = Field(None, description="Known scale in pixels per cm")
    reference_length_cm: Optional[float] = Field(None, description="Physical length of reference marker in cm")
    marker_box: Optional[List[float]] = Field(None, description="Bounding coordinates of calibration reference [x1, y1, x2, y2]")

class LengthMeasurementRequest(BaseModel):
    image_path: str
    calibration: CalibrationData
    snout_point: Optional[List[int]] = Field(None, description="[x, y] coordinates of the snout")
    tail_point: Optional[List[int]] = Field(None, description="[x, y] coordinates of the caudal fin tip")
    auto_contour: bool = Field(True, description="Whether to use OpenCV contour analysis within the fish region")

class LengthMeasurementResponse(BaseModel):
    success: bool
    total_length_cm: Optional[float] = None
    pixel_distance: Optional[float] = None
    scale_pixels_per_cm: Optional[float] = None
    measured_image_url: Optional[str] = None
    snout_point: Optional[List[int]] = None
    tail_point: Optional[List[int]] = None
    contour_detected: bool = False
    is_calibrated: bool = False
    confidence_level: str = "ESTIMATION"
    validation_status: Optional[str] = "EXPERIMENTAL"
    curvature_ratio: Optional[float] = 1.0
    uncertainty_cm: Optional[float] = None
    warnings: List[str] = []
    scientific_disclaimer: str

class AnalysisSummary(BaseModel):
    total_analyses: int
    total_fish_detected: int
    total_brachysoma: int = 0
    total_leptolepis: int = 0
    total_sulphureus: int = 0
    total_other: int = 0
    # Backward compatibility
    total_kembung: Optional[int] = 0
    total_layang: Optional[int] = 0
    latest_analyses: List[Dict[str, Any]]
