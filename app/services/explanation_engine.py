def generate_explanations(text, ml_prob, final_label):

    reasons = []
    text_lower = text.lower()

    suspicious_words = [
        "urgent", "verify", "password",
        "bank", "transfer"
    ]

    keyword_count = sum(word in text_lower for word in suspicious_words)

    url_count = text_lower.count("http")

    # Only show indicators if email is NOT Safe
    if final_label != "Safe":

        if keyword_count >= 2:
            reasons.append("Multiple phishing-related keywords detected")

        if url_count > 2:
            reasons.append("Multiple external links detected")

        if ml_prob >= 70:
            reasons.append("High ML phishing probability detected")

    if not reasons:
        reasons.append("No significant phishing indicators found")

    return {
        "reasons": reasons
    }

def categorize_email(text: str) -> str:

    text_lower = text.lower()

    promotional_keywords = [
        "offer", "discount", "limited time",
        "deal", "sale", "buy now", "sponsored"
    ]

    transactional_keywords = [
        "invoice", "receipt", "order",
        "payment", "confirmation"
    ]

    newsletter_keywords = [
        "newsletter", "weekly update",
        "subscription", "unsubscribe"
    ]

    if any(word in text_lower for word in promotional_keywords):
        return "Promotional / Brand Deal"

    if any(word in text_lower for word in transactional_keywords):
        return "Transactional"

    if any(word in text_lower for word in newsletter_keywords):
        return "Newsletter"

    return "General Email"