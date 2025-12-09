from pydantic import BaseModel, HttpUrl, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class VideoResponse(BaseModel):
    id: UUID
    youtube_id: Optional[str]
    title: str
    url: str
    published_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class NewsItemResponse(BaseModel):
    id: UUID
    title: str
    url: str
    source: str
    published_at: datetime
    summary: Optional[str]
    content: Optional[str]
    tags: List[str]
    thumbnail: Optional[str] = None
    category: str = "AI-Related News"
    created_at: datetime
    updated_at: datetime
    videos: List[VideoResponse] = []
    
    class Config:
        from_attributes = True


class NewsListResponse(BaseModel):
    items: List[NewsItemResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class NewsItemCreate(BaseModel):
    title: str
    url: str
    source: str
    published_at: datetime
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None


class TranslateRequest(BaseModel):
    language: str  # e.g., "Spanish", "French", "German"


class TranslateResponse(BaseModel):
    translated_content: str
    language: str

