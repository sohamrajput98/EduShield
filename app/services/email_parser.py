import re
import hashlib
import math
from urllib.parse import urlparse


def clean_text(email_text: str) -> str:
    if not email_text:
        return ""

    text = email_text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_urls(email_text: str):
    if not email_text:
        return []

    url_pattern = r"https?://[^\s]+"
    return re.findall(url_pattern, email_text)


def extract_sender_domain(email_text: str) -> str:
    match = re.search(r"from:.*?@([A-Za-z0-9.-]+)", email_text, re.IGNORECASE)
    if match:
        return match.group(1).lower()
    return ""


def hash_email(email_text: str) -> str:
    if not email_text:
        return ""
    return hashlib.sha256(email_text.encode()).hexdigest()


SUSPICIOUS_TLDS = [".xyz", ".top", ".ru", ".tk", ".ml", ".ga"]


def has_ip_in_url(url):
    return bool(re.search(r"http[s]?://\d+\.\d+\.\d+\.\d+", url))


def has_at_symbol(url):
    return "@" in url


def has_double_slash_redirect(url):
    return url.count("//") > 1


def get_subdomain_count(domain):
    return len(domain.split(".")) - 2 if "." in domain else 0


def url_entropy(url):
    prob = [float(url.count(c)) / len(url) for c in dict.fromkeys(list(url))]
    entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
    return entropy


def extract_url_features(email_text: str) -> dict:
    urls = extract_urls(email_text)

    features = {
        "url_count": len(urls),
        "has_ip_address": 0,
        "has_suspicious_tld": 0,
        "has_at_symbol": 0,
        "has_double_slash": 0,
        "high_entropy": 0,
        "many_subdomains": 0,
        "long_url": 0,
    }

    for url in urls:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()

        if has_ip_in_url(url):
            features["has_ip_address"] = 1

        if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            features["has_suspicious_tld"] = 1

        if has_at_symbol(url):
            features["has_at_symbol"] = 1

        if has_double_slash_redirect(url):
            features["has_double_slash"] = 1

        if len(url) > 75:
            features["long_url"] = 1

        if url_entropy(url) > 4.0:
            features["high_entropy"] = 1

        if get_subdomain_count(domain) > 2:
            features["many_subdomains"] = 1

    return features



def extract_header_features(email_text: str) -> dict:
    sender_domain = extract_sender_domain(email_text)

    reply_match = re.search(r"reply-to:.*?@([A-Za-z0-9.-]+)", email_text, re.IGNORECASE)
    reply_domain = reply_match.group(1).lower() if reply_match else ""

    features = {
        "domain_mismatch": 0,
        "replyto_mismatch": 0,
        "spf_fail": 0
    }

    if sender_domain and reply_domain and sender_domain != reply_domain:
        features["replyto_mismatch"] = 1

    if "spf=fail" in email_text.lower():
        features["spf_fail"] = 1

    return features