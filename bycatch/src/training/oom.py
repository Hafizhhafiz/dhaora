"""
CUDA Out-Of-Memory (OOM) Fallback Ladder for ByCatch AI (Phase 7).
Gracefully steps down resolution and batch size upon encountering OOM.
"""

import json
from pathlib import Path
from typing import Tuple, Optional
import torch

OOM_LADDER = [
    (640, 4),  # Step 0: Baseline target
    (640, 2),  # Step 1: Reduce batch to 2
    (512, 4),  # Step 2: Reduce resolution to 512, batch 4
    (512, 2),  # Step 3: Reduce resolution to 512, batch 2
    (416, 2),  # Step 4: Minimum viable training configuration
]

def get_next_fallback_config(current_imgsz: int, current_batch: int) -> Optional[Tuple[int, int]]:
    """Returns the next lower (imgsz, batch) configuration on the ladder."""
    try:
        idx = OOM_LADDER.index((current_imgsz, current_batch))
        if idx + 1 < len(OOM_LADDER):
            return OOM_LADDER[idx + 1]
    except ValueError:
        pass
    return None

def log_oom_event(
    error_msg: str,
    failed_imgsz: int,
    failed_batch: int,
    fallback_config: Optional[Tuple[int, int]],
    log_path: Path
):
    """Logs OOM details to oom_log.json and clears CUDA cache."""
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    event = {
        "error": str(error_msg),
        "failed_imgsz": failed_imgsz,
        "failed_batch": failed_batch,
        "fallback_imgsz": fallback_config[0] if fallback_config else None,
        "fallback_batch": fallback_config[1] if fallback_config else None,
    }

    logs = []
    if log_path.exists():
        try:
            logs = json.loads(log_path.read_text(encoding="utf-8"))
        except Exception:
            logs = []

    logs.append(event)
    log_path.write_text(json.dumps(logs, indent=2), encoding="utf-8")
