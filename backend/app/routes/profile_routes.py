from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, timedelta
from typing import List, Dict, Optional
from ..database import get_db
from ..schemas import ProfileResponse, ProfileUpdateRequest, UserResponse, BadgeSchema, AttemptHistory
from ..auth import get_current_user
from ..models import User, Attempt, UserBadge, Progress, Badge
from pydantic import BaseModel

router = APIRouter()


# Enhanced Response Models
class CategoryStat(BaseModel):
    completed: int
    avg_score: float

class SkillLevels(BaseModel):
    clarity: float
    specificity: float
    effectiveness: float
    problem_solving: float
    code_quality: float

class EnhancedProfileResponse(BaseModel):
    name: str
    email: str
    bio: str
    level: int
    xp: int
    total_attempts: int
    average_score: float
    streak: int
    badges: List[BadgeSchema]
    joined_date: datetime
    recent_scores: List[float]
    category_stats: Dict[str, CategoryStat]
    skill_levels: SkillLevels
    active_days: int
    best_score: float

    class Config:
        from_attributes = True


def calculate_streak(user: User, db: Session) -> int:
    """Calculate user's current streak based on attempt dates"""
    attempts = db.query(Attempt).filter(
        Attempt.user_id == user.id
    ).order_by(Attempt.created_at.desc()).all()
    
    if not attempts:
        return 0
    
    # Get unique dates of attempts
    attempt_dates = sorted(set(a.created_at.date() for a in attempts), reverse=True)
    
    if not attempt_dates:
        return 0
    
    # Check if today or yesterday has an attempt
    today = date.today()
    if attempt_dates[0] not in [today, today - timedelta(days=1)]:
        return 0  # Streak broken
    
    # Count consecutive days
    streak = 1
    expected_date = attempt_dates[0] - timedelta(days=1)
    
    for attempt_date in attempt_dates[1:]:
        if attempt_date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
        elif attempt_date < expected_date:
            # Gap found, streak ends
            break
    
    return streak


def calculate_level(xp: int) -> int:
    """Calculate user level based on XP"""
    # Level formula: Level = floor(XP / 100) + 1
    return (xp // 100) + 1


def check_and_award_badges(user_id: int, db: Session) -> List[str]:
    """Check if user qualifies for new badges and award them"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return []
    
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id).all()
    
    # Get existing badges
    existing_badges = db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
    existing_badge_names = set()
    for ub in existing_badges:
        badge = db.query(Badge).filter(Badge.id == ub.badge_id).first()
        if badge:
            existing_badge_names.add(badge.name)
    
    newly_awarded = []
    
    # Badge criteria
    total_attempts = len(attempts)
    avg_score = sum(a.overall_score for a in attempts) / total_attempts if total_attempts > 0 else 0
    
    badge_criteria = {
        "First Attempt": total_attempts >= 1,
        "Clarity Champion": any(a.clarity_score >= 90 for a in attempts),
        "Structure Master": any(a.structure_score >= 90 for a in attempts),
        "Consistent": user.streak >= 7,
        "Expert Promper": total_attempts >= 10,
        "Prompt Pro": avg_score >= 85 and total_attempts > 0,
    }
    
    # Check each badge
    for badge_name, criteria_met in badge_criteria.items():
        if criteria_met and badge_name not in existing_badge_names:
            # Get or create badge
            badge = db.query(Badge).filter(Badge.name == badge_name).first()
            if not badge:
                badge = Badge(
                    name=badge_name,
                    description=get_badge_description(badge_name),
                    icon=get_badge_icon(badge_name),
                    criteria=badge_name
                )
                db.add(badge)
                db.commit()
                db.refresh(badge)
            
            # Award badge to user
            user_badge = UserBadge(
                user_id=user_id,
                badge_id=badge.id,
                earned_at=datetime.utcnow()
            )
            db.add(user_badge)
            newly_awarded.append(badge_name)
    
    db.commit()
    return newly_awarded


def get_badge_description(badge_name: str) -> str:
    """Get description for badge"""
    descriptions = {
        "First Attempt": "Complete your first challenge",
        "Clarity Champion": "Achieve a clarity score of 90 or higher",
        "Structure Master": "Achieve a structure score of 90 or higher",
        "Consistent": "Maintain a 7-day streak",
        "Expert Promper": "Complete 10 challenges",
        "Prompt Pro": "Maintain an average score above 85",
    }
    return descriptions.get(badge_name, "")


def get_badge_icon(badge_name: str) -> str:
    """Get icon for badge"""
    icons = {
        "First Attempt": "🎯",
        "Clarity Champion": "🌟",
        "Structure Master": "📝",
        "Consistent": "💪",
        "Expert Promper": "🏆",
        "Prompt Pro": "⚡",
    }
    return icons.get(badge_name, "🏆")


@router.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get enhanced user profile with all stats, badges, and analytics"""
    
    # Calculate and update streak
    streak = calculate_streak(current_user, db)
    if current_user.streak != streak:
        current_user.streak = streak
        db.commit()
    
    # Get all attempts for comprehensive stats
    all_attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id
    ).order_by(Attempt.created_at.desc()).all()
    
    total_attempts = len(all_attempts)
    
    # Calculate statistics
    if total_attempts > 0:
        average_score = sum(a.overall_score for a in all_attempts) / total_attempts
        best_score = max(a.overall_score for a in all_attempts)
        recent_scores = [a.overall_score for a in all_attempts[:10]]
    else:
        average_score = 0.0
        best_score = 0.0
        recent_scores = []
    
    # Calculate active days
    active_days = len(set(a.created_at.date() for a in all_attempts))
    
    # Get user's badges
    user_badges = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    badges = [
        BadgeSchema(
            id=ub.badge.id,
            name=ub.badge.name,
            description=ub.badge.description,
            icon=ub.badge.icon,
            earned_at=ub.earned_at
        )
        for ub in user_badges
    ]
    
    # Get recent attempts for history (last 10)
    recent_attempts = all_attempts[:10]
    attempt_history = [
        AttemptHistory(
            id=attempt.id,
            problem_text=attempt.problem_text[:100] + "..." if len(attempt.problem_text) > 100 else attempt.problem_text,
            overall_score=attempt.overall_score,
            created_at=attempt.created_at,
            xp_earned=attempt.xp_earned
        )
        for attempt in recent_attempts
    ]
    
    # Calculate category stats
    category_stats = {
        "Prompt Engineering": CategoryStat(
            completed=total_attempts,
            avg_score=round(average_score, 1)
        ),
        "Technical Challenges": CategoryStat(
            completed=0,
            avg_score=0.0
        ),
        "System Design": CategoryStat(
            completed=0,
            avg_score=0.0
        )
    }
    
    # Calculate skill levels from recent attempts
    if len(recent_attempts) > 0:
        skill_levels = SkillLevels(
            clarity=round(sum(a.clarity_score for a in recent_attempts) / len(recent_attempts), 1),
            specificity=round(sum(a.specificity_score for a in recent_attempts) / len(recent_attempts), 1),
            effectiveness=round(sum(a.overall_score for a in recent_attempts) / len(recent_attempts), 1),
            problem_solving=round(sum(a.technical_depth_score for a in recent_attempts) / len(recent_attempts), 1),
            code_quality=round(sum(a.structure_score for a in recent_attempts) / len(recent_attempts), 1)
        )
    else:
        skill_levels = SkillLevels(
            clarity=0.0,
            specificity=0.0,
            effectiveness=0.0,
            problem_solving=0.0,
            code_quality=0.0
        )
    
    # Calculate level based on XP
    level = calculate_level(current_user.xp)
    
    # Update user statistics
    current_user.total_attempts = total_attempts
    current_user.level = str(level)
    
    # Get or create progress
    progress = current_user.progress
    if not progress:
        progress = Progress(
            user_id=current_user.id,
            attempts_count=total_attempts,
            total_xp=current_user.xp,
            current_level=str(level),
            average_score=average_score,
            best_score=best_score
        )
        db.add(progress)
    else:
        progress.average_score = average_score
        progress.best_score = best_score
        progress.attempts_count = total_attempts
        progress.total_xp = current_user.xp
        progress.current_level = str(level)
    
    db.commit()
    
    # Check and award new badges
    newly_awarded = check_and_award_badges(current_user.id, db)
    
    # Return comprehensive profile data
    return {
        "name": current_user.name,
        "email": current_user.email,
        "bio": current_user.bio or "",
        "level": level,
        "xp": current_user.xp,
        "total_attempts": total_attempts,
        "average_score": round(average_score, 1),
        "streak": streak,
        "badges": badges,
        "joined_date": current_user.created_at,
        "recent_scores": recent_scores,
        "category_stats": category_stats,
        "skill_levels": skill_levels.__dict__,
        "active_days": active_days,
        "best_score": round(best_score, 1),
        "attempts": attempt_history,
        "total_xp": current_user.xp,
        "current_level": str(level),
        "total_challenges": total_attempts,
        "newly_awarded_badges": newly_awarded
    }


@router.put("/profile")
def update_profile(
    profile_update: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    
    if profile_update.name is not None:
        if len(profile_update.name.strip()) == 0:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        current_user.name = profile_update.name.strip()
    
    if profile_update.bio is not None:
        current_user.bio = profile_update.bio.strip()
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Profile updated successfully",
        "user": UserResponse(
            id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            bio=current_user.bio or "",
            level=current_user.level,
            xp=current_user.xp,
            total_attempts=current_user.total_attempts,
            streak=current_user.streak,
            created_at=current_user.created_at
        )
    }


@router.get("/attempt/{attempt_id}")
def get_attempt_detail(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific attempt"""
    
    attempt = db.query(Attempt).filter(
        Attempt.id == attempt_id,
        Attempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    return {
        "id": attempt.id,
        "problem_text": attempt.problem_text,
        "problem_source": attempt.problem_source,
        "user_prompt": attempt.user_prompt,
        "overall_score": attempt.overall_score,
        "clarity_score": attempt.clarity_score,
        "structure_score": attempt.structure_score,
        "specificity_score": attempt.specificity_score,
        "context_score": attempt.context_score,
        "creativity_score": attempt.creativity_score,
        "technical_depth_score": attempt.technical_depth_score,
        "strengths": attempt.strengths.split(", ") if attempt.strengths else [],
        "weaknesses": attempt.weaknesses.split(", ") if attempt.weaknesses else [],
        "suggestions": attempt.suggestions.split(", ") if attempt.suggestions else [],
        "ai_improved_prompt": attempt.ai_improved_prompt,
        "xp_earned": attempt.xp_earned,
        "created_at": attempt.created_at
    }


@router.get("/stats")
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed user statistics for dashboard"""
    
    attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id
    ).order_by(Attempt.created_at.desc()).all()
    
    if not attempts:
        return {
            "total_attempts": 0,
            "average_score": 0.0,
            "best_score": 0.0,
            "recent_trend": [],
            "score_distribution": {},
            "category_breakdown": {}
        }
    
    # Calculate trend (last 10 attempts)
    recent_trend = [
        {"attempt": idx + 1, "score": a.overall_score}
        for idx, a in enumerate(attempts[:10][::-1])
    ]
    
    # Score distribution
    score_ranges = {"0-60": 0, "60-70": 0, "70-80": 0, "80-90": 0, "90-100": 0}
    for attempt in attempts:
        score = attempt.overall_score
        if score < 60:
            score_ranges["0-60"] += 1
        elif score < 70:
            score_ranges["60-70"] += 1
        elif score < 80:
            score_ranges["70-80"] += 1
        elif score < 90:
            score_ranges["80-90"] += 1
        else:
            score_ranges["90-100"] += 1
    
    return {
        "total_attempts": len(attempts),
        "average_score": round(sum(a.overall_score for a in attempts) / len(attempts), 1),
        "best_score": round(max(a.overall_score for a in attempts), 1),
        "recent_trend": recent_trend,
        "score_distribution": score_ranges,
        "category_breakdown": {
            "clarity": round(sum(a.clarity_score for a in attempts) / len(attempts), 1),
            "structure": round(sum(a.structure_score for a in attempts) / len(attempts), 1),
            "specificity": round(sum(a.specificity_score for a in attempts) / len(attempts), 1),
            "creativity": round(sum(a.creativity_score for a in attempts) / len(attempts), 1),
        }
    }
