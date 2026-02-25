import hashlib


def hash_email_content(text):

    return hashlib.sha256(
        text.encode("utf-8")
    ).hexdigest()