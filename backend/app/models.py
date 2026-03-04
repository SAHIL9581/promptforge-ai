from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, Date, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    bio = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    level = Column(String, default="1")  # Changed to string to store level number
    xp = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_attempt_date = Column(Date, nullable=True)
    
    # Relationships
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    user_badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, level={self.level}, xp={self.xp})>"


class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    problem_text = Column(Text, nullable=False)
    problem_source = Column(String, nullable=False)
    user_prompt = Column(Text, nullable=False)
    overall_score = Column(Float, nullable=False, index=True)
    clarity_score = Column(Float, nullable=False)
    structure_score = Column(Float, nullable=False)
    specificity_score = Column(Float, nullable=False)
    context_score = Column(Float, nullable=False)
    creativity_score = Column(Float, nullable=False)
    technical_depth_score = Column(Float, nullable=False)
    strengths = Column(Text)
    weaknesses = Column(Text)
    suggestions = Column(Text)
    ai_improved_prompt = Column(Text)
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="attempts")

    # Indexes for better query performance
    __table_args__ = (
        Index('idx_user_created', 'user_id', 'created_at'),
        Index('idx_user_score', 'user_id', 'overall_score'),
    )

    def __repr__(self):
        return f"<Attempt(id={self.id}, user_id={self.user_id}, score={self.overall_score})>"


class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    icon = Column(String, default="🏆")
    criteria = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=True)  # ✅ Added nullable=True

    
    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Badge(id={self.id}, name={self.name}, icon={self.icon})>"


class UserBadge(Base):
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    badge_id = Column(Integer, ForeignKey("badges.id", ondelete="CASCADE"), index=True)
    earned_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="user_badges")

    # Composite index for faster lookups
    __table_args__ = (
        Index('idx_user_badge', 'user_id', 'badge_id', unique=True),
    )

    def __repr__(self):
        return f"<UserBadge(user_id={self.user_id}, badge_id={self.badge_id})>"


class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    average_score = Column(Float, default=0.0)
    best_score = Column(Float, default=0.0)
    total_xp = Column(Integer, default=0)
    current_level = Column(String, default="1")
    attempts_count = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)  # ✅ Added nullable=True
    
    # Relationships
    user = relationship("User", back_populates="progress")

    def __repr__(self):
        return f"<Progress(user_id={self.user_id}, level={self.current_level}, xp={self.total_xp})>"
