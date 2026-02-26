from fastapi import APIRouter, Request, Form, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates

import email
from email import policy
from email.parser import BytesParser
import io
import re

from app.services.risk_engine import calculate_risk_score
from app.services.explanation_engine import generate_explanations, categorize_email
from app.models.ml_model import model   
from app.models.ml_model import predict_email
from app.database.db import save_prediction
from app.services.privacy_service import hash_email_content
router = APIRouter()

templates = Jinja2Templates(directory="app/templates")


@router.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@router.post("/analyze")
async def analyze_email(
    email_content: str = Form(None),
    email_file: UploadFile = File(None)
):
    text_data = ""

    # Handle Input Sources
    if email_content:
        text_data = email_content

    import re 

    if email_file:
        content_bytes = await email_file.read()
        try:
            msg = BytesParser(policy=policy.default).parsebytes(content_bytes)
            clean_body = ""
            
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    
                    if content_type == "text/plain":
                        clean_body = part.get_content()
                        break
                    
                    elif content_type == "text/html":
                        clean_body = part.get_content()
                
                text_data = clean_body if clean_body else str(msg.get_payload())
            else:
                text_data = msg.get_content()

            
            text_data = re.sub(r'<[^>]+>', '', text_data)
            
           
            if "Received:" in text_data[:200]:
                parts = text_data.split("\n\n", 1)
                text_data = parts[-1] if len(parts) > 1 else text_data

          
            text_data = text_data.replace("=3D", "=").replace("=0A", "\n").strip()

        except Exception as e:
            text_data = content_bytes.decode("utf-8", errors="ignore")

    if not text_data:
        return JSONResponse({
            "risk_score": 0,
            "label": "Invalid Input",
            "reasons": ["No email content provided"]
        })

    
    email_hash = hash_email_content(text_data)
    ml_prob = predict_email(text_data)
    rule_score = 0.0

    risk_result = calculate_risk_score(ml_prob, text_data)
    category = None

    if risk_result["label"] == "Safe":
        category = categorize_email(text_data)

    explanation = generate_explanations(
        text_data,
        ml_prob,
        risk_result["label"]
    )

    print("ML Probability:", ml_prob)
    print("Risk Result:", risk_result)

    save_prediction(
        email_hash,
        risk_result["risk_score"],
        risk_result["label"]
    )

   
    return {
        "summary": {
            "risk_score": risk_result["risk_score"],
            "label": risk_result["label"],
            "reasons": risk_result["reasons"],
            "confidence": round(float(ml_prob), 2),
            "category": category,
            "explanations": explanation,
            "email_preview": text_data  
        },
        "advanced": {
            "ml_probability": round(float(ml_prob), 2),
            "url_features": risk_result.get("url_features", {}),
            "engine_logs": [
                "🔥 NEURAL DECODER ACTIVE 🔥",
                f"ML Probability: {ml_prob}",
                f"Risk Result: {risk_result}",
                f"Body Length: {len(text_data)} chars"
            ]
        }
    }