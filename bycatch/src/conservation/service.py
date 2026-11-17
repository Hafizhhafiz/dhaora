"""
Unified Conservation Service for ByCatch AI (Phase 9).
Combines IUCN Red List, CITES Species+, and KKP National Regulation checks.
Never matches on common/local name; requires verified scientific name.
"""

from pathlib import Path
from typing import Dict, Any

from .taxon_mapper import resolve_scientific_name
from .sources.iucn import query_iucn_status
from .sources.cites import query_cites_status
from .sources.kkp_regulation import query_national_regulation_status

class ConservationService:
    def __init__(self, data_dir: Path, metadata_dir: Path):
        self.data_dir = data_dir
        self.metadata_dir = metadata_dir
        self.iucn_snapshot = data_dir / "conservation_snapshots" / "iucn_snapshot.json"
        self.cites_snapshot = data_dir / "conservation_snapshots" / "cites_snapshot.json"
        self.reg_csv = metadata_dir / "regulation_registry.csv"

    def get_species_conservation_profile(self, scientific_name: str) -> Dict[str, Any]:
        """
        Retrieves complete conservation profile for a verified scientific name.
        """
        taxon_info = resolve_scientific_name(scientific_name)
        if not taxon_info:
            return {
                "scientific_name": scientific_name,
                "is_verified_taxon": False,
                "status": "unverified",
                "notes": f"Scientific name '{scientific_name}' could not be matched to canonical registry."
            }

        # Query all three sources
        iucn_data = query_iucn_status(scientific_name, self.iucn_snapshot)
        cites_data = query_cites_status(scientific_name, self.cites_snapshot)
        national_data = query_national_regulation_status(scientific_name, self.reg_csv)

        return {
            "scientific_name": scientific_name,
            "accepted_name": taxon_info["accepted_name"],
            "family": taxon_info["family"],
            "order": taxon_info["order"],
            "worms_aphia_id": taxon_info["worms_aphia_id"],
            "fishbase_speccode": taxon_info["fishbase_speccode"],
            "iucn": iucn_data,
            "cites": cites_data,
            "national_protection": national_data
        }
