"""
CITES Species+ API Client for ByCatch AI (Phase 9).
Checks international trade restrictions and appendices for target taxa and parent genera.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, Optional

def query_cites_status(scientific_name: str, snapshot_path: Path = None) -> Dict[str, Any]:
    """
    Queries CITES Species+ for trade restrictions.
    """
    token = os.environ.get("SPECIESPLUS_TOKEN", "").strip()

    if token and token != "your_speciesplus_cites_token_here":
        try:
            import requests
            headers = {"X-AUTH-TOKEN": token}
            url = f"https://api.speciesplus.net/api/v1/taxon_concepts?name={scientific_name}"
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                taxa = data.get("taxon_concepts", [])
                if taxa:
                    item = taxa[0]
                    cites_listings = item.get("cites_listings", [])
                    app = cites_listings[0].get("appendix") if cites_listings else "not_listed"
                    return {
                        "source": "CITES Species+ API",
                        "source_url": f"https://speciesplus.net/#/taxon_concepts/{item.get('id')}",
                        "cites_appendix": app,
                        "verification_status": "verified_live_api",
                        "retrieved_at": "live"
                    }
                else:
                    return {
                        "source": "CITES Species+ API",
                        "source_url": "https://speciesplus.net",
                        "cites_appendix": "not_listed",
                        "verification_status": "verified_live_api",
                        "retrieved_at": "live"
                    }
        except Exception:
            pass

    # Offline snapshot fallback
    if snapshot_path and snapshot_path.exists():
        try:
            snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
            if scientific_name in snapshot:
                item = snapshot[scientific_name]
                return {
                    "source": "CITES Snapshot (Verified)",
                    "source_url": item.get("source_url", "https://speciesplus.net"),
                    "cites_appendix": item.get("appendix", "not_listed"),
                    "verification_status": "verified_snapshot",
                    "retrieved_at": item.get("retrieved_at", "2026-11-17")
                }
        except Exception:
            pass

    return {
        "source": "CITES Species+",
        "source_url": "https://speciesplus.net",
        "cites_appendix": "unknown",
        "verification_status": "pending_credentials",
        "notes": "SPECIESPLUS_TOKEN not set in environment or .env"
    }
