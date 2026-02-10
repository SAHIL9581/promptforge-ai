from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import EvaluationRequest, EvaluationResponse
from ..auth import get_current_user
from ..models import User, Attempt
from ..services.evaluation_service import evaluate_prompt_with_ai
from ..services.gamification_service import calculate_xp, update_user_level, check_and_award_badges
import traceback

router = APIRouter()

@router.post("/evaluate", response_model=EvaluationResponse)
def evaluate_prompt(
    evaluation_req: EvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print("=" * 50)
        print("EVALUATION STARTED")
        print(f"Problem: {evaluation_req.problem_text[:100]}...")
        print(f"Prompt length: {len(evaluation_req.user_prompt)}")
        print("=" * 50)
        
        evaluation_result = evaluate_prompt_with_ai(
            evaluation_req.problem_text,
            evaluation_req.user_prompt
        )
        
        print("Evaluation completed successfully!")
        print(f"Overall score: {evaluation_result['overall_score']}")
        
        xp_earned = calculate_xp(evaluation_result["overall_score"])
        current_user.xp += xp_earned
        current_user.total_attempts += 1
        
        new_level = update_user_level(current_user.xp)
        current_user.level = new_level
        
        # Create attempt record with all new fields
        attempt = Attempt(
            user_id=current_user.id,
            problem_text=evaluation_req.problem_text,
            problem_source=evaluation_req.problem_source,
            user_prompt=evaluation_req.user_prompt,
            overall_score=evaluation_result["overall_score"],
            clarity_score=evaluation_result["clarity_score"],
            structure_score=evaluation_result.get("best_practices_score", 75.0),  # Map to best_practices
            specificity_score=evaluation_result["specificity_score"],
            context_score=evaluation_result.get("effectiveness_score", 75.0),  # Map to effectiveness
            creativity_score=evaluation_result.get("efficiency_score", 75.0),  # Map to efficiency
            technical_depth_score=evaluation_result.get("safety_score", 90.0),  # Map to safety
            strengths=", ".join(evaluation_result["strengths"]),
            weaknesses=", ".join(evaluation_result["weaknesses"]),
            suggestions=", ".join(evaluation_result["suggestions"]),
            ai_improved_prompt=evaluation_result["ai_improved_prompt"],
            xp_earned=xp_earned
        )
        db.add(attempt)
        
        # Update user progress
        progress = current_user.progress
        if progress:
            progress.attempts_count = current_user.total_attempts
            progress.total_xp = current_user.xp
            progress.current_level = new_level
            
            all_attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id).all()
            if all_attempts:
                progress.average_score = sum(a.overall_score for a in all_attempts) / len(all_attempts)
                progress.best_score = max(a.overall_score for a in all_attempts)
        
        badges_earned = check_and_award_badges(current_user, db)
        
        db.commit()
        
        # Return the comprehensive evaluation response
        return EvaluationResponse(
            overall_score=evaluation_result["overall_score"],
            clarity_score=evaluation_result["clarity_score"],
            specificity_score=evaluation_result["specificity_score"],
            effectiveness_score=evaluation_result["effectiveness_score"],
            best_practices_score=evaluation_result["best_practices_score"],
            efficiency_score=evaluation_result["efficiency_score"],
            safety_score=evaluation_result["safety_score"],
            grammar_score=evaluation_result["grammar_score"],
            readability_score=evaluation_result["readability_score"],
            ambiguity_score=evaluation_result["ambiguity_score"],
            has_role_definition=evaluation_result["has_role_definition"],
            has_clear_task=evaluation_result["has_clear_task"],
            has_output_format=evaluation_result["has_output_format"],
            has_constraints=evaluation_result["has_constraints"],
            has_examples=evaluation_result["has_examples"],
            has_step_by_step=evaluation_result["has_step_by_step"],
            estimated_tokens=evaluation_result["estimated_tokens"],
            useful_tokens_percentage=evaluation_result["useful_tokens_percentage"],
            redundant_tokens_percentage=evaluation_result["redundant_tokens_percentage"],
            strengths=evaluation_result["strengths"],
            weaknesses=evaluation_result["weaknesses"],
            issues_detected=evaluation_result["issues_detected"],
            suggestions=evaluation_result["suggestions"],
            ai_improved_prompt=evaluation_result["ai_improved_prompt"],
            improvement_potential_score=evaluation_result["improvement_potential_score"],
            xp_earned=xp_earned,
            new_level=new_level,
            badges_earned=badges_earned
        )
        
    except Exception as e:
        db.rollback()
        print("=" * 50)
        print("ERROR IN EVALUATION:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        print("=" * 50)
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
