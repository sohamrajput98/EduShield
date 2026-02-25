import joblib
import re

MODEL_PATH = "model/phishing_model.pkl"

# Load model once
model = joblib.load(MODEL_PATH)

def clean_text(text):
    text = re.sub(r'http\S+', '', str(text))
    text = re.sub(r'\S+@\S+', '', str(text))
    text = re.sub(r'[^a-zA-Z ]', ' ', str(text))
    return text.lower()

def predict_email(email_text):

    text = clean_text(email_text)

    prediction = model.predict([text])[0]

    return {
        "prediction": int(prediction),
        "message": "Phishing Detected" if prediction == 1 else "Safe Email"
    }