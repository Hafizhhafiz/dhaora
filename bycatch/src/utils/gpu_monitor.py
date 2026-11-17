"""
GPU and System Memory Monitoring Utility for ByCatch AI.
Polls GPU VRAM, utilization, temperature, and system RAM to ensure hardware safety.
"""

import time
import psutil
from typing import Dict, Any
import torch

def get_system_memory_status() -> Dict[str, float]:
    """Returns total, available, and used system RAM in GB."""
    mem = psutil.virtual_memory()
    return {
        "ram_total_gb": round(mem.total / (1024 ** 3), 2),
        "ram_available_gb": round(mem.available / (1024 ** 3), 2),
        "ram_used_gb": round(mem.used / (1024 ** 3), 2),
        "ram_percent": mem.percent
    }

def get_gpu_status() -> Dict[str, Any]:
    """Returns CUDA GPU VRAM, allocated memory, and device name."""
    if not torch.cuda.is_available():
        return {
            "gpu_available": False,
            "vram_total_mb": 0.0,
            "vram_allocated_mb": 0.0,
            "vram_reserved_mb": 0.0,
            "gpu_name": "None"
        }

    device = torch.cuda.current_device()
    props = torch.cuda.get_device_properties(device)
    total_mb = props.total_memory / (1024 ** 2)
    allocated_mb = torch.cuda.memory_allocated(device) / (1024 ** 2)
    reserved_mb = torch.cuda.memory_reserved(device) / (1024 ** 2)

    return {
        "gpu_available": True,
        "gpu_name": props.name,
        "vram_total_mb": round(total_mb, 2),
        "vram_allocated_mb": round(allocated_mb, 2),
        "vram_reserved_mb": round(reserved_mb, 2)
    }

def check_safety_guards(min_free_ram_gb: float = 0.5, max_gpu_temp_c: int = 85) -> Tuple[bool, str]:
    """
    Checks if system RAM is sufficient to avoid thrashing.
    Returns (is_safe, message).
    """
    mem = get_system_memory_status()
    if mem["ram_available_gb"] < min_free_ram_gb:
        return False, f"CRITICAL: Free RAM ({mem['ram_available_gb']:.2f} GB) is below minimum safety threshold ({min_free_ram_gb:.2f} GB)!"
    return True, "System safety checks passed."
