"""
Catch Role Classification Rule Engine for ByCatch AI (Phase 10).
Separates species identity from operational fisheries catch role (target vs bycatch).
Never guesses bycatch role purely from visual morphological features.
"""

from typing import Dict, Any, Optional

def determine_catch_role(
    detected_species_name: str,
    target_species: Optional[str],
    catch_handling: str = "retained",
    gear_info: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates the operational role of a catch instance based on FAO guidelines.
    Returns catch_role, rule_id, and explanation.
    """
    clean_detected = detected_species_name.lower().strip()
    clean_target = (target_species or "").lower().strip()
    clean_handling = catch_handling.lower().strip()

    # Rule 0: Missing operational context
    if not clean_target:
        return {
            "catch_role": "unverified",
            "rule_id": "RULE_00_NO_TARGET_CONTEXT",
            "evidence": "Target species for the fishing trip was not specified. Cannot determine bycatch status.",
            "is_target": False,
            "is_bycatch": False
        }

    # Rule 1: Species is part of the intended target catch
    # Supports substring match or exact match (e.g. 'selar' in 'selar kuning; kembung')
    if clean_detected in clean_target or any(term.strip() in clean_target for term in clean_detected.split("_")):
        return {
            "catch_role": "target",
            "rule_id": "RULE_01_TARGET_MATCH",
            "evidence": f"'{detected_species_name}' is explicitly listed in trip target species ('{target_species}').",
            "is_target": True,
            "is_bycatch": False
        }

    # Rule 2: Non-target, but retained on board for commercial sale / consumption
    if clean_handling in ("retained", "simpan", "daratkan", "jual"):
        return {
            "catch_role": "incidental_non_target_retained",
            "rule_id": "RULE_02_INCIDENTAL_RETAINED",
            "evidence": f"'{detected_species_name}' is not in target list ('{target_species}') but was retained on board.",
            "is_target": False,
            "is_bycatch": True
        }

    # Rule 3: Non-target, discarded at sea
    if clean_handling in ("discarded", "buang", "lepas"):
        return {
            "catch_role": "discarded_non_target",
            "rule_id": "RULE_03_DISCARDED_BYCATCH",
            "evidence": f"'{detected_species_name}' is not in target list and was discarded.",
            "is_target": False,
            "is_bycatch": True
        }

    # Fallback: Unverified
    return {
        "catch_role": "unverified",
        "rule_id": "RULE_99_UNVERIFIED",
        "evidence": "Catch context information was incomplete.",
        "is_target": False,
        "is_bycatch": False
    }
