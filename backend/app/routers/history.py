from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..services.storage_service import get_recent_analyses, get_statistics, init_db

router = APIRouter(prefix="/api", tags=["History & Statistics"])

@router.get("/history", response_model=List[Dict[str, Any]])
async def fetch_history(limit: int = 50):
    """Returns past fish detection & measurement analyses."""
    return get_recent_analyses(limit=limit)

@router.get("/statistics")
async def fetch_statistics():
    """Returns dashboard aggregated metrics."""
    return get_statistics()
