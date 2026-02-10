from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import TechnicalChallengeRequest, TechnicalChallengeResponse, TechnicalEvaluationRequest, TechnicalEvaluationResponse
from ..auth import get_current_user
from ..models import User
from ..services.technical_challenge_service import generate_technical_challenge, evaluate_technical_prompt
from ..services.gamification_service import calculate_xp, update_user_level, check_and_award_badges
import traceback

router = APIRouter()

@router.post("/technical-challenge", response_model=TechnicalChallengeResponse)
def get_technical_challenge(
    request: TechnicalChallengeRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a new technical challenge (DSA/DBMS/DAA)"""
    try:
        if request.category not in ["dsa", "dbms", "daa"]:
            raise HTTPException(status_code=400, detail="Invalid category. Must be 'dsa', 'dbms', or 'daa'")
        
        problem = generate_technical_challenge(request.category, request.difficulty)
        return TechnicalChallengeResponse(**problem)
    except Exception as e:
        print(f"Error generating technical challenge: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate challenge: {str(e)}")

@router.post("/technical-evaluate", response_model=TechnicalEvaluationResponse)
def evaluate_technical_challenge(
    request: TechnicalEvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Evaluate a technical challenge prompt"""
    try:
        print("=" * 50)
        print("TECHNICAL CHALLENGE EVALUATION STARTED")
        print(f"Category: {request.problem.get('category', 'unknown')}")
        print(f"Prompt length: {len(request.user_prompt)}")
        print(f"Constraints: {request.constraints}")
        print("=" * 50)
        
        evaluation = evaluate_technical_prompt(request.problem, request.user_prompt, request.constraints)
        
        print(f"Evaluation completed! Score: {evaluation['overall_score']}")
        
        # Calculate XP with bonus for constraint adherence
        base_xp = calculate_xp(evaluation["overall_score"])
        bonus_xp = 50 if evaluation["constraints_met"] else 0
        total_xp = base_xp + bonus_xp
        
        current_user.xp += total_xp
        current_user.total_attempts += 1
        
        new_level = update_user_level(current_user.xp)
        current_user.level = new_level
        
        badges_earned = check_and_award_badges(current_user, db)
        
        db.commit()
        
        # Add gamification data
        evaluation["xp_earned"] = total_xp
        evaluation["new_level"] = new_level
        evaluation["badges_earned"] = badges_earned
        
        return TechnicalEvaluationResponse(**evaluation)
        
    except Exception as e:
        db.rollback()
        print("=" * 50)
        print("ERROR IN TECHNICAL EVALUATION:")
        print(traceback.format_exc())
        print("=" * 50)
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
