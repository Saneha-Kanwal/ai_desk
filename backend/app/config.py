from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str
    
    # Admin
    admin_token: str
    
    # JWT (optional, defaults to admin_token)
    jwt_secret_key: Optional[str] = None
    
    # YouTube (optional)
    youtube_api_key: Optional[str] = None
    
    # Server
    backend_port: int = 8000
    frontend_port: int = 3000  # For reference, not used by backend
    environment: str = "development"
    
    class Config:
        # Look for .env in project root (parent of backend directory)
        env_file = os.path.join(Path(__file__).parent.parent.parent, ".env")
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields from .env that aren't in the model


settings = Settings()

