#!/usr/bin/env python3
"""
Hardware & Resource Benchmark for ByCatch AI (Phase 6).
Measures peak VRAM, RAM, and inference latency on NVIDIA RTX 3050 Laptop GPU.
Saves results to results/phase6_architecture/resource_benchmark.csv.
"""

import sys
import time
import csv
import psutil
from pathlib import Path
import torch

def benchmark_model(model_name: str, imgsz: int, batch_size: int, device_str: str = "cuda") -> dict:
    from ultralytics import YOLO

    device = torch.device(device_str if torch.cuda.is_available() else "cpu")
    print(f"\nBenchmarking {model_name} | imgsz={imgsz} | batch={batch_size} | device={device}...")

    # Reset CUDA stats
    if device.type == "cuda":
        torch.cuda.empty_cache()
        torch.cuda.reset_peak_memory_stats()

    process = psutil.Process()
    ram_before = process.memory_info().rss / (1024 * 1024)

    # 1. Load model
    load_start = time.perf_counter()
    model = YOLO(model_name)
    load_time = time.perf_counter() - load_start

    # Count parameters
    params_count = sum(p.numel() for p in model.model.parameters())

    # Move model to device
    model.to(device)

    # 2. Warm-up
    dummy_input = torch.randn(batch_size, 3, imgsz, imgsz, device=device)
    for _ in range(10):
        _ = model(dummy_input, verbose=False)

    if device.type == "cuda":
        torch.cuda.synchronize()

    # 3. Latency measurement (50 iterations)
    latencies = []
    num_runs = 50
    for _ in range(num_runs):
        t0 = time.perf_counter()
        _ = model(dummy_input, verbose=False)
        if device.type == "cuda":
            torch.cuda.synchronize()
        latencies.append((time.perf_counter() - t0) * 1000)  # ms

    latencies.sort()
    p50 = latencies[len(latencies) // 2]
    p95 = latencies[int(len(latencies) * 0.95)]
    avg_latency = sum(latencies) / len(latencies)

    # 4. Memory measurements
    if device.type == "cuda":
        peak_vram_mb = torch.cuda.max_memory_allocated() / (1024 * 1024)
    else:
        peak_vram_mb = 0.0

    ram_after = process.memory_info().rss / (1024 * 1024)
    peak_ram_mb = ram_after

    result = {
        "model_name": model_name,
        "device": str(device),
        "imgsz": imgsz,
        "batch_size": batch_size,
        "params_million": round(params_count / 1_000_000, 2),
        "peak_vram_mb": round(peak_vram_mb, 2),
        "process_ram_mb": round(peak_ram_mb, 2),
        "latency_p50_ms": round(p50, 2),
        "latency_p95_ms": round(p95, 2),
        "latency_avg_ms": round(avg_latency, 2),
        "fps": round((1000.0 / avg_latency) * batch_size, 1),
        "vram_limit_4gb_safe": peak_vram_mb < 3500.0
    }
    print(f"  -> Peak VRAM: {result['peak_vram_mb']} MB | Avg Latency: {result['latency_avg_ms']} ms | FPS: {result['fps']}")
    return result

def main():
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "results" / "phase6_architecture"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_csv = out_dir / "resource_benchmark.csv"

    # Candidates: yolo11n.pt, yolov8n.pt (and yolo26n when officially published)
    candidates = ["yolo11n.pt", "yolov8n.pt"]
    img_sizes = [640, 512]
    batches = [2, 4]

    results = []
    for model_name in candidates:
        for imgsz in img_sizes:
            for b in batches:
                try:
                    res = benchmark_model(model_name, imgsz, b)
                    results.append(res)
                except Exception as e:
                    print(f"Benchmark error for {model_name} (imgsz={imgsz}, b={b}): {e}")

    if results:
        fieldnames = list(results[0].keys())
        with open(out_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        print(f"\nBenchmark completed. Results written to: {out_csv}")

if __name__ == "__main__":
    main()
