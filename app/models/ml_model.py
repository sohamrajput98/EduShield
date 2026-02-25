import joblib

MODEL_PATH = "model/phishing_model.pkl"

model = joblib.load(MODEL_PATH)

def predict_email(email_text: str) -> float:
    
    prob = model.predict_proba([email_text])[0][1]
    return float(prob * 100)