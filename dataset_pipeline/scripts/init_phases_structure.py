import os
from pathlib import Path

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
PHASES_DIR = WORKSPACE / "PHASES"

PHASE_LIST = [
    "PHASE_11_7_3",
    "PHASE_11_7_4",
    "PHASE_11_7_5",
    "PHASE_11_8",
    "PHASE_12",
    "PHASE_13",
    "PHASE_14",
    "PHASE_15",
    "PHASE_16",
    "PHASE_17"
]

def init_phases():
    PHASES_DIR.mkdir(parents=True, exist_ok=True)
    for p in PHASE_LIST:
        p_dir = PHASES_DIR / p
        p_dir.mkdir(parents=True, exist_ok=True)
        (p_dir / "EVIDENCE").mkdir(parents=True, exist_ok=True)
        
        # Create standard phase markdown files if they don't exist
        for fname in ["PLAN.md", "TASKS.md", "COMPLETION_REPORT.md", "LIMITATIONS.md", "HANDOVER.md"]:
            fpath = p_dir / fname
            if not fpath.exists():
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(f"# {p} — {fname.replace('.md', '').replace('_', ' ')}\n\nStatus: PLANNED\n")

    print(f"Created/verified {len(PHASE_LIST)} phase directories in {PHASES_DIR}")

if __name__ == "__main__":
    init_phases()
