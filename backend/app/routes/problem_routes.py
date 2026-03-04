from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User
from ..services.problem_fetch_service import fetch_real_world_problem
from ..services.openai_service import generate_ai_problem

router = APIRouter()

@router.get("/system")
def get_system_problem(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a real-world system design problem from internet sources"""
    try:
        problem_data = fetch_real_world_problem()
        return problem_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch problem: {str(e)}")

@router.get("/ai")
def get_ai_problem(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get an AI-generated problem"""
    try:
        problem_data = generate_ai_problem()
        return problem_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI problem: {str(e)}")
