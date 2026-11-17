"""
Unit tests for Conservation Information Services (Phase 9).
"""

import pytest
from pathlib import Path
from src.conservation.taxon_mapper import resolve_scientific_name
from src.conservation.service import ConservationService

@pytest.fixture
def service():
    root = Path(__file__).resolve().parents[2]
    return ConservationService(
        data_dir=root / "data",
        metadata_dir=root / "metadata"
    )

def test_taxon_mapper():
    t1 = resolve_scientific_name("Rastrelliger brachysoma")
    assert t1 is not None
    assert t1["family"] == "Scombridae"
    assert t1["worms_aphia_id"] == 219717

    t_invalid = resolve_scientific_name("NonExistentSpecies123")
    assert t_invalid is None

def test_conservation_profile_snapshot(service):
    # Rastrelliger brachysoma (Vulnerable in 2023 IUCN assessment)
    prof = service.get_species_conservation_profile("Rastrelliger brachysoma")
    assert prof["accepted_name"] == "Rastrelliger brachysoma"
    assert "Vulnerable" in prof["iucn"]["iucn_status"]
    assert prof["cites"]["cites_appendix"] == "not_listed"
    assert prof["national_protection"]["national_protection_status"] == "not_listed_in_checked_regulations"

def test_unknown_species_profile(service):
    prof = service.get_species_conservation_profile("UnknownSpecimen")
    assert prof["status"] == "unverified"
