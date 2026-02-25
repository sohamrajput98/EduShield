import pandas as pd
import re
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("data/phishing_dataset.csv")

# Combine text fields
df["text"] = (
    df["subject"].fillna("") +
    " " +
    df["body"].fillna("")
)

# Clean text
def clean_text(text):
    text = re.sub(r'http\S+', '', str(text))
    text = re.sub(r'\S+@\S+', '', str(text))
    text = re.sub(r'[^a-zA-Z ]', ' ', str(text))
    return text.lower()

df["text"] = df["text"].apply(clean_text)

# Features + Labels
X = df["text"]
y = df["label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=5000)),
    ("clf", LogisticRegression(max_iter=1000))
])

print("Training model...")
model.fit(X_train, y_train)

# Evaluate
print("Accuracy:", model.score(X_test, y_test))

# Save model
joblib.dump(model, "model/phishing_model.pkl")

print("Model saved successfully!")