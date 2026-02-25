from fastapi import APIRouter, Request, Form, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates

from app.services.risk_engine import calculate_risk_score
from app.services.explanation_engine import generate_explanations
from app.models.ml_model import model   # or predict_email function
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

    # If user typed email text
    if email_content:
        text_data = email_content

    # If user uploaded file
    if email_file:
        content = await email_file.read()
        text_data = content.decode("utf-8")

    # If nothing provided
    if not text_data:
        return JSONResponse({
            "risk_score": 0,
            "label": "Invalid Input",
            "reasons": ["No email content provided"]
        })

    # Hash email BEFORE processing
    email_hash = hash_email_content(text_data)

    # Dummy ML + risk logic (replace with your ML model)
    ml_prob = 0.8
    rule_score = 0.6

    risk_result = calculate_risk_score(ml_prob, rule_score)
    explanation = generate_explanations(text_data, ml_prob)

    # Save privacy-safe log
    save_prediction(
        email_hash,
        risk_result["risk_score"],
        risk_result["label"]
    )

    # Clear raw data reference (good practice)
    text_data = None

    return {
        **risk_result,
        **explanation,
        "confidence": round(float(ml_prob), 2)
    }

