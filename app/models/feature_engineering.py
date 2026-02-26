from sklearn.feature_extraction.text import TfidfVectorizer

from app.services.email_parser import clean_text



vectorizer = TfidfVectorizer(max_features=3000)


def fit_vectorizer(corpus):
    """Fit TF-IDF on training corpus."""
    processed = [clean_text(text) for text in corpus]
    return vectorizer.fit(processed)


def transform_text(text: str):
    """Transform single email text to feature vector."""
    return vectorizer.transform([clean_text(text)])