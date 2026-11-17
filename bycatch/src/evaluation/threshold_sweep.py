"""
Confidence Threshold Sweep Tool for ByCatch AI (Phase 8).
Sweeps confidence thresholds from 0.05 to 0.95 to select optimal operating thresholds.
"""

from typing import List, Dict, Any

def sweep_thresholds(
    precision_recall_curve_data: List[Dict[str, float]],
    target_min_recall: float = 0.70
) -> Dict[str, Any]:
    """
    Selects two operating thresholds:
    1. conf_detect: Threshold maximizing F1 score while meeting target recall.
    2. conf_review: Lower threshold below which detections are flagged for human review.
    """
    best_f1 = 0.0
    conf_detect = 0.40
    conf_review = 0.20

    for item in precision_recall_curve_data:
        p = item.get("precision", 0.0)
        r = item.get("recall", 0.0)
        c = item.get("conf", 0.5)
        f1 = (2 * p * r) / max(1e-6, (p + r))

        if r >= target_min_recall and f1 > best_f1:
            best_f1 = f1
            conf_detect = c

    conf_review = max(0.15, conf_detect - 0.20)

    return {
        "best_f1": round(best_f1, 4),
        "conf_detect": round(conf_detect, 2),
        "conf_review": round(conf_review, 2),
        "target_min_recall": target_min_recall
    }
