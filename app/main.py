from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.api.routes import router
from app.database.db import init_db

def create_app() -> FastAPI:
    
    app = FastAPI(
        title="EduShield",
        description="Privacy-First Offline AI Phishing Detection for Academic Institutions",
        version="0.1.0"
    )
    init_db()
  
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    
    app.mount("/static", StaticFiles(directory="app/static"), name="static")

    
    app.include_router(router)

    return app


app = create_app()


templates = Jinja2Templates(directory="app/static/templates")

@app.get("/")
async def serve_home(request: Request):
  
    return templates.TemplateResponse("index.html", {"request": request})