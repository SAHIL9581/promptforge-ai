from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    level = Column(String, default="Beginner")
    xp = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    
    attempts = relationship("Attempt", back_populates="user")
    user_badges = relationship("UserBadge", back_populates="user")
    progress = relationship("Progress", back_populates="user", uselist=False)

class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_text = Column(Text, nullable=False)
    problem_source = Column(String, nullable=False)
    user_prompt = Column(Text, nullable=False)
    overall_score = Column(Float, nullable=False)
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
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="attempts")

class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String)
    criteria = Column(String)
    
    user_badges = relationship("UserBadge", back_populates="badge")

class UserBadge(Base):
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    badge_id = Column(Integer, ForeignKey("badges.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="user_badges")

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    average_score = Column(Float, default=0.0)
    best_score = Column(Float, default=0.0)
    total_xp = Column(Integer, default=0)
    current_level = Column(String, default="Beginner")
    attempts_count = Column(Integer, default=0)
    
    user = relationship("User", back_populates="progress")
