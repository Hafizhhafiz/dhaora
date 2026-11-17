#!/usr/bin/env python3
"""
Verify installation script for ByCatch AI environment.
Checks Python version, PyTorch, CUDA 12.8 availability on RTX 3050,
runs a sample GPU tensor operation, and checks essential dependencies.
"""

import sys
import platform
import json
from pathlib import Path

def main():
    print("=" * 60)
    print("ByCatch AI — Environment & Dependency Verification")
    print("=" * 60)
    
    results = {
        "python_version": platform.python_version(),
        "platform": platform.platform(),
        "torch_installed": False,
        "torch_version": None,
        "cuda_available": False,
        "cuda_version": None,
        "gpu_name": None,
        "tensor_op_gpu_success": False,
        "ultralytics_installed": False,
        "ultralytics_version": None,
        "pillow_installed": False,
        "all_checks_passed": False
    }

    print(f"[1] Python: {results['python_version']} ({platform.architecture()[0]})")

    # Check Pillow
    try:
        import PIL
        results["pillow_installed"] = True
        print(f"[2] Pillow: {PIL.__version__} (OK)")
    except ImportError as e:
        print(f"[2] Pillow: NOT INSTALLED ({e})")

    # Check PyTorch
    try:
        import torch
        results["torch_installed"] = True
        results["torch_version"] = torch.__version__
        print(f"[3] PyTorch: {torch.__version__} (OK)")
        
        results["cuda_available"] = torch.cuda.is_available()
        if results["cuda_available"]:
            results["cuda_version"] = torch.version.cuda
            results["gpu_name"] = torch.cuda.get_device_name(0)
            print(f"[4] CUDA Available: YES (CUDA {results['cuda_version']})")
            print(f"[5] GPU Device: {results['gpu_name']}")
            
            # Tensor operation on GPU
            try:
                x = torch.randn(100, 100, device="cuda")
                y = torch.matmul(x, x)
                results["tensor_op_gpu_success"] = True
                print(f"[6] GPU Tensor MatMul Test: PASSED (Shape: {list(y.shape)})")
            except Exception as e:
                print(f"[6] GPU Tensor MatMul Test: FAILED ({e})")
        else:
            print("[4] CUDA Available: NO (CPU fallback mode)")
    except ImportError as e:
        print(f"[3] PyTorch: NOT INSTALLED ({e})")

    # Check Ultralytics
    try:
        import ultralytics
        results["ultralytics_installed"] = True
        results["ultralytics_version"] = ultralytics.__version__
        print(f"[7] Ultralytics: {ultralytics.__version__} (OK)")
    except ImportError as e:
        print(f"[7] Ultralytics: NOT INSTALLED ({e})")

    # Final verdict
    results["all_checks_passed"] = (
        results["torch_installed"] and 
        results["cuda_available"] and 
        results["tensor_op_gpu_success"]
    )
    
    print("-" * 60)
    if results["all_checks_passed"]:
        print("VERDICT: PASS — Environment is fully configured for GPU training/inference.")
    else:
        print("VERDICT: INCOMPLETE — Some components are missing or running in CPU mode.")
    print("=" * 60)

    # Save output snapshot
    out_file = Path("results/phase0_inspection/verify_install_results.json")
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    return 0 if results["all_checks_passed"] else 1

if __name__ == "__main__":
    sys.exit(main())
