def calculate_risk_score(ml_prob: float, rule_score: float) -> dict:

    # Weighted scoring
    final_score = (ml_prob * 0.7) + (rule_score * 0.3)

    # Label mapping
    if final_score <= 40:
        label = "Safe"
    elif final_score <= 70:
        label = "Suspicious"
    else:
        label = "Phishing"

    return {
        "risk_score": round(final_score, 2),
        "label": label
    }