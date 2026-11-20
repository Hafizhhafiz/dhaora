"""
DHAORA Server Runner
Launches unified FastAPI gateway on http://0.0.0.0:5173 or $PORT
(Serves both backend API and production frontend SPA)
"""

import uvicorn
import os
import sys
import socket
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

if __name__ == "__main__":
    # Support cloud container dynamic port binding (Render, Railway, Fly.io, Hugging Face)
    port = int(os.environ.get("PORT", os.environ.get("DHAORA_PORT", 5173)))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print("================================================================")
    print("  DHAORA — Integrated Marine Platform (ASIK V & Vol. VI)")
    print(f"  Host URL: http://{host}:{port}")
    print("  Location: PPN Karangantu, Teluk Banten (WPPNRI 712)")
    print("  Integrated Modules: CatchForecast AI + FishGuard AI + ByCatch AI")
    print("================================================================")
    
    uvicorn.run(
        "dhaora.backend.main:app",
        host=host,
        port=port,
        reload=False,
        log_level="info"
    )
