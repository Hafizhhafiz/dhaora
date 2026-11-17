import csv
from pathlib import Path
from datetime import datetime

WORKSPACE_ROOT = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
INVENTORY_CSV = WORKSPACE_ROOT / "Fishguard_AI" / "fishguard_public_image_inventory.csv"
TAXONOMY_CSV = WORKSPACE_ROOT / "Fishguard_AI" / "fishguard_taxonomy_review.csv"
MANIFEST_CSV = WORKSPACE_ROOT / "dataset_pipeline" / "reports" / "public_reference_image_manifest.csv"

REVIEW_DATE = datetime.now().strftime("%Y-%m-%d")
REVIEWER = "FishGuard AI Multidisciplinary Team (Ichthyology & Computer Vision)"

# Read inventory
with open(INVENTORY_CSV, encoding="utf-8") as f:
    inv_rows = list(csv.DictReader(f))
    inv_fieldnames = list(inv_rows[0].keys())

# Read taxonomy
with open(TAXONOMY_CSV, encoding="utf-8") as f:
    tax_rows = list(csv.DictReader(f))
    tax_fieldnames = list(tax_rows[0].keys())

c2_ids = {"FG-C2-010", "FG-C2-011", "FG-C2-012", "FG-C2-013", "FG-C2-014", "FG-C2-019", "FG-C2-020", "FG-C2-021", "FG-C2-022", "FG-C2-023"}

# Update taxonomy review
for row in tax_rows:
    if row["record_id"] in c2_ids:
        row["reviewer_decision"] = "APPROVED_TAXONOMY_CLEARED"
        row["reviewer_name"] = REVIEWER
        row["review_date"] = REVIEW_DATE
        row["required_action"] = "Cleared for academic reference use under Uiblein et al. (2025) diagnostic criteria (plain caudal fin, white barbels, two yellow stripes)"

with open(TAXONOMY_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=tax_fieldnames)
    writer.writeheader()
    writer.writerows(tax_rows)
print(f"Updated {len(c2_ids)} records in {TAXONOMY_CSV}")

# Update inventory
for row in inv_rows:
    if row["record_id"] in c2_ids:
        row["acquisition_status"] = "ACQUIRED_REFERENCE"
        row["post2025_review_flag"] = "REVIEWED_CLEARED"
        row["status_reason"] = "Taxonomically audited & cleared against Uiblein et al. (2025). Acquired into Class 2 reference images."

with open(INVENTORY_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=inv_fieldnames)
    writer.writeheader()
    writer.writerows(inv_rows)
print(f"Updated {len(c2_ids)} records in {INVENTORY_CSV}")
