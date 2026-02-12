from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import (
    auth_routes, 
    problem_routes, 
    evaluation_routes, 
    profile_routes, 
    prompt_routes, 
    report_routes,
    technical_challenge_routes
)
from .services.gamification_service import initialize_badges
from .config import settings  # Add this import

app = FastAPI(title="PromptForge AI", version="1.0.0")

# CORS Configuration - FIXED!
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://promptforge-ai-delta.vercel.app",  # ← ADD YOUR VERCEL URL
        "*"  # TEMP: Allow all origins (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event
@app.on_event("startup")
def on_startup():
    init_db()
    initialize_badges()

# Root Endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to PromptForge AI API - Backend LIVE!"}

@app.get("/test-config")
def test_config():
    return {
        "openai_key_set": bool(settings.OPENAI_API_KEY),
        "openai_key_length": len(settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else 0,
        "openai_key_prefix": settings.OPENAI_API_KEY[:10] if settings.OPENAI_API_KEY else "NOT SET",
        "backend_url": "https://promptforge-ai-nr0a.onrender.com",
        "status": "Backend working perfectly!"
    }

# API Routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(problem_routes.router, prefix="/api/problem", tags=["Problems"])
app.include_router(prompt_routes.router, prefix="/api", tags=["Prompt Generation"])
app.include_router(evaluation_routes.router, prefix="/api", tags=["Evaluation"])
app.include_router(profile_routes.router, prefix="/api", tags=["Profile"])
app.include_router(report_routes.router, prefix="/api", tags=["Reports"])
app.include_router(technical_challenge_routes.router, prefix="/api", tags=["Technical Challenges"])
