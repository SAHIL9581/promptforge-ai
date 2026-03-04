from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import TechnicalChallengeRequest, TechnicalChallengeResponse, TechnicalEvaluationRequest, TechnicalEvaluationResponse
from ..auth import get_current_user
from ..models import User, Attempt
from ..services.technical_challenge_service import generate_technical_challenge, evaluate_technical_prompt
from ..services.gamification_service import calculate_xp, update_user_level, check_and_award_badges
import traceback

router = APIRouter()


@router.post("/technical-challenge", response_model=TechnicalChallengeResponse)
def create_technical_challenge(
    request: TechnicalChallengeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a technical challenge (DSA/DBMS/DAA)"""
    try:
        problem = generate_technical_challenge(request.category, request.difficulty)
        return problem
    except Exception as e:
        print(f"Error generating technical challenge: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate challenge: {str(e)}")


@router.post("/technical-evaluate", response_model=TechnicalEvaluationResponse)
def evaluate_technical_challenge(
    evaluation_req: TechnicalEvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Evaluate a technical challenge submission"""
    try:
        print("=" * 50)
        print("TECHNICAL EVALUATION STARTED")
        print(f"Problem: {evaluation_req.problem.get('title', 'Unknown')}")
        print(f"Category: {evaluation_req.problem.get('category', 'Unknown')}")
        print(f"Prompt length: {len(evaluation_req.user_prompt)}")
        print("=" * 50)
        
        # Evaluate the prompt
        evaluation_result = evaluate_technical_prompt(
            evaluation_req.problem,
            evaluation_req.user_prompt,
            evaluation_req.constraints
        )
        
        print("Technical evaluation completed successfully!")
        print(f"Overall score: {evaluation_result['overall_score']}")
        
        # Calculate XP
        xp_earned = evaluation_result.get("xp_earned", calculate_xp(evaluation_result["overall_score"]))
        
        # Update user stats
        current_user.xp += xp_earned
        current_user.total_attempts += 1
        
        new_level = update_user_level(current_user.xp)
        current_user.level = new_level
        
        # ✅ SAVE ATTEMPT TO DATABASE
        problem_text = f"[{evaluation_req.problem.get('category', 'Technical').upper()}] {evaluation_req.problem.get('title', 'Challenge')}\n\n"
        if 'description' in evaluation_req.problem:
            problem_text += evaluation_req.problem['description']
        elif 'problem_statement' in evaluation_req.problem:
            problem_text += evaluation_req.problem['problem_statement']
        elif 'scenario' in evaluation_req.problem:
            problem_text += evaluation_req.problem['scenario']
        
        attempt = Attempt(
            user_id=current_user.id,
            problem_text=problem_text,
            problem_source=f"Technical Challenge - {evaluation_req.problem.get('category_name', 'Unknown')}",
            user_prompt=evaluation_req.user_prompt,
            overall_score=evaluation_result["overall_score"],
            clarity_score=evaluation_result.get("approach_clarity", 75.0),
            structure_score=evaluation_result.get("code_structure", 75.0),
            specificity_score=evaluation_result.get("implementation_details", 75.0),
            context_score=evaluation_result.get("problem_understanding", 75.0),
            creativity_score=evaluation_result.get("edge_case_handling", 75.0),
            technical_depth_score=evaluation_result.get("complexity_analysis", 75.0),
            strengths=", ".join(evaluation_result.get("strengths", [])),
            weaknesses=", ".join(evaluation_result.get("weaknesses", [])),
            suggestions=", ".join(evaluation_result.get("suggestions", [])),
            ai_improved_prompt=evaluation_result.get("improved_prompt", ""),
            xp_earned=xp_earned
        )
        db.add(attempt)
        
        # Update user progress
        progress = current_user.progress
        if progress:
            progress.attempts_count = current_user.total_attempts
            progress.total_xp = current_user.xp
            progress.current_level = new_level
            
            # Recalculate average and best scores
            all_attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id).all()
            if all_attempts:
                progress.average_score = sum(a.overall_score for a in all_attempts) / len(all_attempts)
                progress.best_score = max(a.overall_score for a in all_attempts)
        
        # Check for badges
        badges_earned = check_and_award_badges(current_user, db)
        
        db.commit()
        
        # Add user info to response
        evaluation_result["xp_earned"] = xp_earned
        evaluation_result["new_level"] = new_level
        evaluation_result["badges_earned"] = badges_earned
        
        return TechnicalEvaluationResponse(**evaluation_result)
        
    except Exception as e:
        db.rollback()
        print("=" * 50)
        print("ERROR IN TECHNICAL EVALUATION:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        print("=" * 50)
        raise HTTPException(status_code=500, detail=f"Technical evaluation failed: {str(e)}")
