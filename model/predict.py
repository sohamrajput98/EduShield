import joblib
import re

model = joblib.load("edushield_spam_model.pkl")

def clean_text(text):
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-Z ]', ' ', text)
    return text.lower()

while True:
    text = input("\nEnter email text (or type exit): ")

    if text == "exit":
        break

    text = clean_text(text)

    pred = model.predict([text])

    if pred[0] == 1:
        print("🚨 Phishing / Spam Detected")
    else:
        print("✅ Safe Email")