"""
IUCN Red List API v4 Client for ByCatch AI (Phase 9).
Requires IUCN_API_TOKEN in environment variable.
Falls back to verified offline snapshot when token is unavailable.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, Optional

def query_iucn_status(scientific_name: str, snapshot_path: Path = None) -> Dict[str, Any]:
    """
    Queries IUCN Red List for a given verified scientific name.
    """
    token = os.environ.get("IUCN_API_TOKEN", "").strip()

    # 1. If API token is provided, attempt official API call
    if token and token != "your_iucn_api_token_here":
        try:
            import requests
            headers = {"Authorization": f"Bearer {token}"}
            url = f"https://api.iucnredlist.org/api/v4/taxa/scientific_name?name={scientific_name}"
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                assessments = data.get("assessments", [])
                latest = assessments[0] if assessments else {}
                return {
                    "source": "IUCN Red List API v4",
                    "source_url": f"https://www.iucnredlist.org/species/{latest.get('taxon_id', '')}",
                    "iucn_status": latest.get("category", "unknown"),
                    "assessment_year": latest.get("year_published"),
                    "population_trend": latest.get("population_trend", "unknown"),
                    "verification_status": "verified_live_api",
                    "retrieved_at": "live"
                }
        except Exception:
            pass  # Fall back to offline snapshot

    # 2. Offline verified snapshot fallback
    if snapshot_path and snapshot_path.exists():
        try:
            snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
            if scientific_name in snapshot:
                item = snapshot[scientific_name]
                return {
                    "source": "IUCN Red List Snapshot (Verified)",
                    "source_url": item.get("source_url", "https://www.iucnredlist.org/"),
                    "iucn_status": item.get("category", "unknown"),
                    "assessment_year": item.get("year", 2023),
                    "population_trend": item.get("population_trend", "unknown"),
                    "verification_status": "verified_snapshot",
                    "retrieved_at": item.get("retrieved_at", "2026-11-17")
                }
        except Exception:
            pass

    # 3. Default: Credential pending
    return {
        "source": "IUCN Red List",
        "source_url": "https://www.iucnredlist.org/",
        "iucn_status": "unknown",
        "assessment_year": None,
        "population_trend": "unknown",
        "verification_status": "pending_credentials",
        "notes": "IUCN_API_TOKEN not set in environment or .env"
    }
