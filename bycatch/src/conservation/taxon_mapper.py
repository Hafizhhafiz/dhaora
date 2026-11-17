"""
Taxon Mapper for ByCatch AI (Phase 9).
Maps canonical scientific names to known taxonomic IDs and handles parent taxon lookups.
"""

from typing import Dict, Any, Optional

CANONICAL_TAXA = {
    "Rastrelliger brachysoma": {
        "accepted_name": "Rastrelliger brachysoma",
        "genus": "Rastrelliger",
        "family": "Scombridae",
        "order": "Scombriformes",
        "worms_aphia_id": 219717,
        "fishbase_speccode": 109,
        "iucn_taxon_id": 170318
    },
    "Selaroides leptolepis": {
        "accepted_name": "Selaroides leptolepis",
        "genus": "Selaroides",
        "family": "Carangidae",
        "order": "Carangiformes",
        "worms_aphia_id": 218550,
        "fishbase_speccode": 388,
        "iucn_taxon_id": 20434440
    },
    "Upeneus sulphureus": {
        "accepted_name": "Upeneus sulphureus",
        "genus": "Upeneus",
        "family": "Mullidae",
        "order": "Mulliformes",
        "worms_aphia_id": 218671,
        "fishbase_speccode": 4445,
        "iucn_taxon_id": 18105779
    }
}

def resolve_scientific_name(name: str) -> Optional[Dict[str, Any]]:
    """Resolves a scientific name string to canonical taxonomic reference."""
    clean = name.strip()
    return CANONICAL_TAXA.get(clean)
