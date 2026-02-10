from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./promptforge.db"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200
    OPENAI_API_KEY: str
    NEWS_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
