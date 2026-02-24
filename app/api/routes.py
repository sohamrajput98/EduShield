from fastapi import APIRouter, Request, Form, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()


templates = Jinja2Templates(directory="app/templates")


@router.get("/")
def home(request: Request):
    """
    Render main dashboard page.
    """
    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/analyze")
async def analyze_email(
    email_content: str = Form(None),
    email_file: UploadFile = File(None)
):
    
    dummy_response = {
        "risk_score": 50,
        "label": "Suspicious",
        "reasons": ["System under development"]
    }

    return JSONResponse(content=dummy_response)