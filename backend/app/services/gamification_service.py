from sqlalchemy.orm import Session
from ..models import Badge, UserBadge, User, Attempt
from ..database import SessionLocal

def calculate_xp(score: float) -> int:
    if score < 40:
        return 10
    elif score < 60:
        return 25
    elif score < 80:
        return 50
    else:
        return 100

def update_user_level(xp: int) -> str:
    if xp < 100:
        return "Beginner"
    elif xp < 500:
        return "Intermediate"
    elif xp < 1500:
        return "Advanced"
    else:
        return "Expert"

def initialize_badges():
    db = SessionLocal()
    try:
        existing_badges = db.query(Badge).count()
        if existing_badges > 0:
            return
        
        badges = [
            Badge(
                name="First Attempt",
                description="Complete your first prompt evaluation",
                icon="🎯",
                criteria="first_attempt"
            ),
            Badge(
                name="Clarity Champion",
                description="Achieve clarity score above 80",
                icon="💎",
                criteria="clarity_80"
            ),
            Badge(
                name="Structure Master",
                description="Achieve structure score above 80",
                icon="🏗️",
                criteria="structure_80"
            ),
            Badge(
                name="Prompt Pro",
                description="Achieve overall score above 85",
                icon="⭐",
                criteria="overall_85"
            ),
            Badge(
                name="Consistent Improver",
                description="Complete 10 attempts",
                icon="📈",
                criteria="attempts_10"
            ),
            Badge(
                name="Expert Prompter",
                description="Reach Expert level",
                icon="🏆",
                criteria="expert_level"
            )
        ]
        
        db.add_all(badges)
        db.commit()
    finally:
        db.close()

def check_and_award_badges(user: User, db: Session) -> list:
    badges_earned = []
    all_badges = db.query(Badge).all()
    user_badge_ids = [ub.badge_id for ub in user.user_badges]
    
    latest_attempt = db.query(Attempt).filter(
        Attempt.user_id == user.id
    ).order_by(Attempt.created_at.desc()).first()
    
    for badge in all_badges:
        if badge.id in user_badge_ids:
            continue
        
        should_award = False
        
        if badge.criteria == "first_attempt" and user.total_attempts == 1:
            should_award = True
        elif badge.criteria == "clarity_80" and latest_attempt and latest_attempt.clarity_score >= 80:
            should_award = True
        elif badge.criteria == "structure_80" and latest_attempt and latest_attempt.structure_score >= 80:
            should_award = True
        elif badge.criteria == "overall_85" and latest_attempt and latest_attempt.overall_score >= 85:
            should_award = True
        elif badge.criteria == "attempts_10" and user.total_attempts >= 10:
            should_award = True
        elif badge.criteria == "expert_level" and user.level == "Expert":
            should_award = True
        
        if should_award:
            user_badge = UserBadge(user_id=user.id, badge_id=badge.id)
            db.add(user_badge)
            badges_earned.append(badge.name)
    
    return badges_earned
