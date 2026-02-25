import pandas as pd
import re
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("dataset.csv")
print(df.head())
print(df.columns)

# Define suspicious words for feature extraction
suspicious_words_list = [
    "urgent", "bank", "password", "verify", "transfer",
    "money", "account", "login", "secure", "confirm"
]

# Extract cyber security related features
def cyber_features(text):
    text = str(text).lower()
    features = {}
    features["url_count"] = len(re.findall(r'http[s]?://', text))
    features["https_count"] = len(re.findall(r'https://', text))
    features["suspicious_word_score"] = sum(1 for word in suspicious_words_list if word in text)
    return features

# Clean text
def clean_text(text):
    text = re.sub(r'http\S+', '', str(text))
    text = re.sub(r'\S+@\S+', '', str(text))
    text = re.sub(r'[^a-zA-Z ]', ' ', str(text))
    return text.lower()

# Combine subject and body
df["text"] = df["subject"].fillna("") + " " + df["body"].fillna("")
df["text"] = df["text"].apply(clean_text)

# Add cyber features
df["url_count"] = df["text"].apply(lambda x: cyber_features(x)["url_count"])
df["https_count"] = df["text"].apply(lambda x: cyber_features(x)["https_count"])
df["suspicious_word_score"] = df["text"].apply(lambda x: cyber_features(x)["suspicious_word_score"])

# Simple trick: append numeric features into text
df["text"] = df["text"] + " " + df["url_count"].astype(str) + " " + df["suspicious_word_score"].astype(str)

# Prepare data
X = df["text"]
y = df["label"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=5000)),
    ("classifier", LogisticRegression(max_iter=1000))
])

# Train
print("Training model...")
model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)
accuracy = accuracy_score(y_test, pred)
print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "edushield_spam_model.pkl")
print("Model saved successfully!")