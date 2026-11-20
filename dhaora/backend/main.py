"""
DHAORA / ASIK VOL VI Master Unified Gateway Server
Exports the master unified app integrating CatchForecast AI, FishGuard AI, and ByCatch AI.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
if str(BASE_DIR / "backend") not in sys.path:
    sys.path.insert(0, str(BASE_DIR / "backend"))

from backend.app.main import app
