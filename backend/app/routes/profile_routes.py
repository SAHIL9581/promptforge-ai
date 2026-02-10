from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import ProfileResponse, UserResponse, BadgeSchema, AttemptHistory
from ..auth import get_current_user
from ..models import User, Attempt

router = APIRouter()

@router.get("/profile", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    badges = []
    for ub in current_user.user_badges:
        badges.append(BadgeSchema(
            id=ub.badge.id,
            name=ub.badge.name,
            description=ub.badge.description,
            icon=ub.badge.icon,
            earned_at=ub.earned_at
        ))
    
    attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id
    ).order_by(Attempt.created_at.desc()).limit(10).all()
    
    attempt_history = [
        AttemptHistory(
            id=a.id,
            problem_text=a.problem_text[:100] + "...",
            overall_score=a.overall_score,
            created_at=a.created_at,
            xp_earned=a.xp_earned
        ) for a in attempts
    ]
    
    progress = current_user.progress
    average_score = progress.average_score if progress else 0.0
    best_score = progress.best_score if progress else 0.0
    
    return ProfileResponse(
        user=UserResponse.from_orm(current_user),
        badges=badges,
        attempts=attempt_history,
        average_score=average_score,
        best_score=best_score
    )
