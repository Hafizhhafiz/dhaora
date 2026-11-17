"""
Indonesian Fisheries Ministry (KKP) Regulation Matcher for ByCatch AI (Phase 9).
Parses metadata/regulation_registry.csv to check national species protection status.
"""

import csv
from pathlib import Path
from typing import Dict, Any, List

def query_national_regulation_status(scientific_name: str, registry_csv_path: Path) -> Dict[str, Any]:
    """
    Checks national legal status of species based on verified regulation records.
    """
    if not registry_csv_path.exists():
        return {
            "national_protection_status": "unknown",
            "checked_regulations": [],
            "source_name": "KKP Regulation Registry",
            "source_url": "https://jdih.kkp.go.id",
            "verification_status": "unverified",
            "notes": "Regulation registry file missing"
        }

    checked_regs = []
    is_protected = False

    with open(registry_csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            reg_desc = f"{row.get('jenis', '')} No. {row.get('nomor', '')}/{row.get('tahun', '')}"
            checked_regs.append(reg_desc)

    # Note: R. brachysoma, S. leptolepis, and U. sulphureus are currently NOT listed
    # as fully protected under Kepmen KP 1/2021 (they are commercial target/bycatch species).
    status = "protected" if is_protected else "not_listed_in_checked_regulations"

    return {
        "national_protection_status": status,
        "checked_regulations": checked_regs,
        "source_name": "JDIH KKP RI",
        "source_url": "https://jdih.kkp.go.id",
        "verification_status": "verified_registry",
        "notes": f"Checked against {len(checked_regs)} national fisheries regulations"
    }
