import re
import hashlib


def clean_text(email_text: str) -> str:
    """Basic text cleaning."""
    if not email_text:
        return ""

    text = email_text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_urls(email_text: str):
    """Extract URLs using regex."""
    if not email_text:
        return []

    url_pattern = r"https?://[^\s]+"
    return re.findall(url_pattern, email_text)


def extract_sender_domain(email_text: str) -> str:
    """Extract sender domain from email headers if present."""
    match = re.search(r"from:.*?@([A-Za-z0-9.-]+)", email_text, re.IGNORECASE)

    if match:
        return match.group(1)

    return ""


def hash_email(email_text: str) -> str:
    """Return SHA256 hash of email content."""
    if not email_text:
        return ""

    return hashlib.sha256(email_text.encode()).hexdigest()