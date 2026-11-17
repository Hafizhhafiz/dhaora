#!/usr/bin/env python3
"""
ByCatch AI — Dataset Audit & Curation Tool (Phase 4 CLI Wrapper)
Backward-compatible wrapper script invoking src.data.audit.cli
"""

import sys
from pathlib import Path

# Ensure project root is on sys.path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.data.audit.cli import main

if __name__ == "__main__":
    main()
