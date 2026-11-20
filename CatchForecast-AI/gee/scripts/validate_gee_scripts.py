"""
CatchForecast AI - Static Validator for GEE Scripts (Phase 04)
Performs static analysis, credential leak detection, and parameter verification on GEE scripts.
"""

import os
import re
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
GEE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))

TARGET_SCRIPTS = [
    os.path.join(GEE_DIR, "config.example.js"),
    os.path.join(SCRIPT_DIR, "01_asset_and_aoi_setup.js"),
    os.path.join(SCRIPT_DIR, "02_collection_inspection.js"),
    os.path.join(SCRIPT_DIR, "03_environmental_preview.js")
]

SECRET_PATTERNS = [
    r'(?i)private[_-]?key',
    r'(?i)api[_-]?key\s*[:=]\s*["\'][a-zA-Z0-9_\-]{16,}["\']',
    r'(?i)client[_-]?secret\s*[:=]\s*["\'][a-zA-Z0-9_\-]{16,}["\']',
    r'-----BEGIN\s+PRIVATE\s+KEY-----',
    r'"type":\s*"service_account"'
]

REQUIRED_DATASETS = [
    "JPL/MURSST41/DAILY",
    "COPERNICUS/OCEAN_COLOR/GLOBAL/4KM/V6",
    "NOAA/NGDC/ETOPO1"
]

def check_script_syntax_and_secrets(filepath):
    """Checks for balanced brackets, potential secrets, and expected parameters."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    fname = os.path.basename(filepath)
    issues = []

    # 1. Secret Scanning
    for pat in SECRET_PATTERNS:
        if re.search(pat, content):
            issues.append(f"CRITICAL: Potential credential/secret pattern matched: {pat}")

    # 2. Bracket Balance
    for open_b, close_b in [('{', '}'), ('(', ')'), ('[', ']')]:
        if content.count(open_b) != content.count(close_b):
            issues.append(f"SYNTAX: Unbalanced brackets: {open_b} ({content.count(open_b)}) vs {close_b} ({content.count(close_b)})")

    # 3. Check AOI Coordinates presence
    has_aoi = "105.9" in content and "106.35" in content and "-6.15" in content and "-5.85" in content
    
    return {
        "filename": fname,
        "size_bytes": len(content),
        "issues": issues,
        "has_aoi_coords": has_aoi,
        "clean": len(issues) == 0
    }

def run_all_checks():
    print("="*70)
    print("GEE SCRIPTS STATIC ANALYSIS & VALIDATION REPORT")
    print("="*70)
    
    all_clean = True
    results = {}
    
    for s_path in TARGET_SCRIPTS:
        if not os.path.exists(s_path):
            print(f"[!] File not found: {s_path}")
            all_clean = False
            continue
            
        res = check_script_syntax_and_secrets(s_path)
        results[res["filename"]] = res
        status = "PASSED" if res["clean"] else "FAILED"
        print(f"[*] {res['filename']:<35} [{status}] (AOI match: {res['has_aoi_coords']})")
        
        if res["issues"]:
            all_clean = False
            for iss in res["issues"]:
                print(f"    - {iss}")
                
    print("="*70)
    if all_clean:
        print("[+] SUCCESS: All GEE scripts passed static checks with zero credential leaks.")
    else:
        print("[!] WARNING: Issues found in GEE script validation.")
    print("="*70 + "\n")
    
    return all_clean, results

if __name__ == "__main__":
    success, _ = run_all_checks()
    exit(0 if success else 1)
