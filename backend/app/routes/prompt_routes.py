from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import IdeaInput, PromptGenerateResponse
from ..auth import get_current_user
from ..models import User
from ..services.prompt_generator_service import generate_prompt_from_idea

router = APIRouter()

@router.post("/generate-prompt", response_model=PromptGenerateResponse)
def generate_prompt(
    idea_input: IdeaInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        generated_prompt = generate_prompt_from_idea(idea_input.idea)
        return {
            "generated_prompt": generated_prompt,
            "idea": idea_input.idea
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate prompt: {str(e)}")
