from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import ProblemResponse
from ..auth import get_current_user
from ..models import User
from ..services.problem_fetch_service import fetch_real_world_problem
from ..services.openai_service import generate_ai_problem

router = APIRouter()

@router.get("/system", response_model=ProblemResponse)
def get_system_problem(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        problem_data = fetch_real_world_problem()
        return problem_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch problem: {str(e)}")

@router.get("/ai", response_model=ProblemResponse)
def get_ai_problem(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        problem_data = generate_ai_problem()
        return problem_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI problem: {str(e)}")
