from app.services.email_parser import (
    extract_url_features,
    extract_header_features
)


def calculate_rule_score(email_text: str):
    print("🔥 NEW RISK ENGINE LOADED 🔥")
    url_features = extract_url_features(email_text)
    header_features = extract_header_features(email_text)

    score = 0
    reasons = []

    # URL scoring
    if url_features["url_count"] > 1:
        score += url_features["url_count"] * 5
        reasons.append("Multiple external links detected")

    if url_features["has_ip_address"]:
        score += 20
        reasons.append("IP address used in URL")

    if url_features["has_suspicious_tld"]:
        score += 15
        reasons.append("Suspicious domain extension detected")

    if url_features["has_at_symbol"]:
        score += 10
        reasons.append("URL contains @ symbol")

    if url_features["has_double_slash"]:
        score += 10
        reasons.append("URL redirection pattern detected")

    if url_features["high_entropy"]:
        score += 10
        reasons.append("Randomized URL structure detected")

    if url_features["many_subdomains"]:
        score += 10
        reasons.append("Excessive subdomains detected")

    if url_features["long_url"]:
        score += 5
        reasons.append("Unusually long URL detected")

    # Header scoring
    if header_features["replyto_mismatch"]:
        score += 15
        reasons.append("Reply-To domain mismatch")

    if header_features["spf_fail"]:
        score += 20
        reasons.append("SPF authentication failure")
    print("URL Features:", url_features)
    return min(score, 100), reasons

def calculate_risk_score(ml_prob: float, email_text: str) -> dict:

    computed_rule_score, rule_reasons = calculate_rule_score(email_text)

    reasons = []

    if computed_rule_score == 0:
        final_score = ml_prob * 0.5
    else:
        final_score = (ml_prob * 0.7) + (computed_rule_score * 0.3)
        reasons.extend(rule_reasons)

    if ml_prob > 70:
        reasons.append("High ML phishing probability detected")

    if not reasons:
        reasons.append("No significant phishing indicators found")

    if final_score <= 40:
        label = "Safe"
    elif final_score <= 70:
        label = "Suspicious"
    else:
        label = "Phishing"
  
    print("Email Text Received:", email_text)
    return {
        "risk_score": round(final_score, 2),
        "label": label,
        "reasons": reasons
    }
