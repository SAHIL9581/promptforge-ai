from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db, engine, Base
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
from .config import settings
from sqlalchemy import text, inspect
from datetime import datetime


app = FastAPI(title="PromptForge AI", version="1.0.0")


# ✅ ENHANCED CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)


# ✅ AUTO-MIGRATION FUNCTION
def run_migrations():
    """Run database migrations automatically on startup"""
    try:
        print("🔧 Running database migrations...")
        
        with engine.connect() as conn:
            # Get inspector to check existing columns
            inspector = inspect(engine)
            
            # Check badges table
            badges_columns = [col['name'] for col in inspector.get_columns('badges')]
            if 'created_at' not in badges_columns:
                conn.execute(text("ALTER TABLE badges ADD COLUMN created_at TIMESTAMP"))
                conn.execute(text(f"UPDATE badges SET created_at = '{datetime.utcnow().isoformat()}' WHERE created_at IS NULL"))
                conn.commit()
                print("  ✓ Added badges.created_at")
            
            # Check users table
            users_columns = [col['name'] for col in inspector.get_columns('users')]
            if 'bio' not in users_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''"))
                conn.commit()
                print("  ✓ Added users.bio")
            
            if 'streak' not in users_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0"))
                conn.commit()
                print("  ✓ Added users.streak")
            
            if 'last_attempt_date' not in users_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN last_attempt_date DATE"))
                conn.commit()
                print("  ✓ Added users.last_attempt_date")
            
            # Check progress table
            progress_columns = [col['name'] for col in inspector.get_columns('progress')]
            if 'last_updated' not in progress_columns:
                conn.execute(text("ALTER TABLE progress ADD COLUMN last_updated TIMESTAMP"))
                conn.execute(text(f"UPDATE progress SET last_updated = '{datetime.utcnow().isoformat()}' WHERE last_updated IS NULL"))
                conn.commit()
                print("  ✓ Added progress.last_updated")
            
            # Update user levels from "Beginner" to "1"
            conn.execute(text("UPDATE users SET level = '1' WHERE level = 'Beginner' OR level = 'beginner'"))
            conn.commit()
            print("  ✓ Updated user levels")
        
        print("✅ Database migrations completed successfully!\n")
        
    except Exception as e:
        print(f"⚠️ Migration warning: {e}")
        # Continue anyway - non-critical errors


# Startup Event
@app.on_event("startup")
def on_startup():
    print("🚀 Starting PromptForge AI Backend...")
    
    # Create tables
    init_db()
    print("✓ Database initialized")
    
    # Run migrations
    run_migrations()
    
    # Initialize badges
    initialize_badges()
    print("✓ Badges initialized")
    
    print("🎉 Backend startup complete!\n")


# Root Endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to PromptForge AI API - Backend LIVE!"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend is running"}


@app.get("/test-config")
def test_config():
    return {
        "gemini_key_set": bool(settings.GEMINI_API_KEY),
        "gemini_key_length": len(settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else 0,
        "backend_url": "Backend working!",
        "status": "All systems operational"
    }


# API Routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(problem_routes.router, prefix="/api/problem", tags=["Problems"])
app.include_router(prompt_routes.router, prefix="/api", tags=["Prompt Generation"])
app.include_router(evaluation_routes.router, prefix="/api", tags=["Evaluation"])
app.include_router(profile_routes.router, prefix="/api", tags=["Profile"])
app.include_router(report_routes.router, prefix="/api", tags=["Reports"])
app.include_router(technical_challenge_routes.router, prefix="/api", tags=["Technical Challenges"])
