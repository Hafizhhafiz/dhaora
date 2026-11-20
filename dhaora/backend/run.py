"""
DHAORA Server Runner
Launches unified FastAPI gateway on http://127.0.0.1:5173
(Serves both backend API and production frontend SPA on port 5173)
"""

import uvicorn
import os
import sys
import socket
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

def find_available_port(preferred_port=5173):
    for port in [preferred_port, 5173, 5174, 8080, 8081]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return preferred_port

if __name__ == "__main__":
    port = int(os.environ.get("DHAORA_PORT", 5173))
    
    print("================================================================")
    print("  DHAORA — Integrated Marine Platform (ASIK V & Vol. VI)")
    print(f"  Host URL: http://127.0.0.1:{port}")
    print("  Location: PPN Karangantu, Teluk Banten (WPPNRI 712)")
    print("  Integrated Modules: CatchForecast AI + FishGuard AI + ByCatch AI")
    print("================================================================")
    
    uvicorn.run(
        "dhaora.backend.main:app",
        host="127.0.0.1",
        port=port,
        reload=False,
        log_level="info"
    )
