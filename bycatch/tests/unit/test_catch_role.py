"""
Unit tests for Catch Role Classification Rule Engine (Phase 10).
"""

import pytest
from src.inference.catch_role import determine_catch_role

def test_target_catch_match():
    res = determine_catch_role(
        detected_species_name="kembung_perempuan",
        target_species="Kembung perempuan, Selar kuning",
        catch_handling="retained"
    )
    assert res["catch_role"] == "target"
    assert res["is_target"] is True
    assert res["is_bycatch"] is False

def test_incidental_retained_bycatch():
    res = determine_catch_role(
        detected_species_name="kuniran",
        target_species="Selar kuning",
        catch_handling="retained"
    )
    assert res["catch_role"] == "incidental_non_target_retained"
    assert res["is_target"] is False
    assert res["is_bycatch"] is True

def test_discarded_bycatch():
    res = determine_catch_role(
        detected_species_name="kuniran",
        target_species="Kembung perempuan",
        catch_handling="discarded"
    )
    assert res["catch_role"] == "discarded_non_target"
    assert res["is_target"] is False
    assert res["is_bycatch"] is True

def test_unverified_missing_context():
    res = determine_catch_role(
        detected_species_name="selar_kuning",
        target_species="",
        catch_handling="retained"
    )
    assert res["catch_role"] == "unverified"
    assert res["is_target"] is False
    assert res["is_bycatch"] is False
