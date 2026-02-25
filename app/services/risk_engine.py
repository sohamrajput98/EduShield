def calculate_risk_score(ml_prob, rule_score):

    # Weighted scoring
    final_score = (ml_prob * 0.7) + (rule_score * 0.3)

    # Convert to 0-100 scale
    final_score = final_score * 100

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