def generate_explanations(text, ml_prob):

    reasons = []

    text_lower = text.lower()

    # Rule based reasoning
    suspicious_words = [
        "urgent",
        "verify",
        "password",
        "bank",
        "account",
        "transfer",
        "click",
        "login"
    ]

    if any(word in text_lower for word in suspicious_words):
        reasons.append("Contains suspicious phishing keywords")

    if "http" in text_lower:
        reasons.append("Contains links which may be risky")

    if ml_prob > 0.7:
        reasons.append("ML model detected phishing pattern confidence")

    if not reasons:
        reasons.append("No major phishing patterns detected")

    return {
        "reasons": reasons
    }