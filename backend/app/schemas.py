from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ✅ UPDATED - Added bio and streak
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    bio: Optional[str] = ""
    level: str
    xp: int
    total_attempts: int
    streak: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True


# ✅ NEW - Profile update request
class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None


class ProblemResponse(BaseModel):
    problem_text: str
    source: str


class IdeaInput(BaseModel):
    idea: str


class PromptGenerateResponse(BaseModel):
    generated_prompt: str
    idea: str


class EvaluationRequest(BaseModel):
    problem_text: str
    problem_source: str
    user_prompt: str


class EvaluationResponse(BaseModel):
    overall_score: float
    clarity_score: float
    specificity_score: float
    effectiveness_score: float
    best_practices_score: float
    efficiency_score: float
    safety_score: float
    grammar_score: float
    readability_score: float
    ambiguity_score: float
    has_role_definition: bool
    has_clear_task: bool
    has_output_format: bool
    has_constraints: bool
    has_examples: bool
    has_step_by_step: bool
    estimated_tokens: float
    useful_tokens_percentage: float
    redundant_tokens_percentage: float
    strengths: List[str]
    weaknesses: List[str]
    issues_detected: List[str]
    suggestions: List[str]
    ai_improved_prompt: str
    improvement_potential_score: float
    xp_earned: int
    new_level: str
    badges_earned: List[str]


class BadgeSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon: Optional[str]
    earned_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AttemptHistory(BaseModel):
    id: int
    problem_text: str
    overall_score: float
    created_at: datetime
    xp_earned: int
    
    class Config:
        from_attributes = True


class ProfileResponse(BaseModel):
    user: UserResponse
    badges: List[BadgeSchema]
    attempts: List[AttemptHistory]
    average_score: float
    best_score: float


# ==================== TECHNICAL CHALLENGE SCHEMAS ====================

class TechnicalChallengeRequest(BaseModel):
    category: str  # "dsa", "dbms", "daa"
    difficulty: Optional[str] = None  # "Easy", "Medium", "Hard"


class TechnicalChallengeResponse(BaseModel):
    title: str
    difficulty: str
    category: str
    category_name: str
    # DSA specific fields
    description: Optional[str] = None
    constraints: Optional[List[str]] = []
    examples: Optional[List[dict]] = []
    edge_cases: Optional[List[str]] = []
    optimal_time_complexity: Optional[str] = None
    optimal_space_complexity: Optional[str] = None
    # DBMS specific fields
    scenario: Optional[str] = None
    requirements: Optional[List[str]] = []
    sample_tables: Optional[List[dict]] = []
    sample_data: Optional[str] = None
    expected_output: Optional[str] = None
    considerations: Optional[List[str]] = []
    # DAA specific fields
    topic: Optional[str] = None
    problem_statement: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    hints: Optional[List[str]] = []
    
    class Config:
        from_attributes = True


class TechnicalEvaluationRequest(BaseModel):
    problem: dict
    user_prompt: str
    constraints: dict  # {"word_limit": 200, "token_limit": 300}


class TechnicalEvaluationResponse(BaseModel):
    overall_score: float
    problem_understanding: float
    approach_clarity: float
    implementation_details: float
    edge_case_handling: float
    complexity_analysis: float
    code_structure: float
    constraint_adherence: float
    correctness: float
    would_generate_working_code: bool
    estimated_test_pass_rate: float
    passed_test_cases: int
    total_test_cases: int
    strengths: List[str]
    weaknesses: List[str]
    issues_found: List[str]
    suggestions: List[str]
    improved_prompt: str
    code_generation_quality: str
    readability_score: float
    completeness_score: float
    constraints_met: bool
    constraint_violations: List[str]
    word_count: int
    token_count: int
    xp_earned: int
    new_level: str
    badges_earned: List[str]
