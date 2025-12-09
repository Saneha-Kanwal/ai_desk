from sqlalchemy import create_engine, Column, String, Text, DateTime, ARRAY, ForeignKey, Index, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.config import settings

engine = create_engine(settings.database_url, echo=settings.environment == "development")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_users_email', 'email'),
    )


class NewsItem(Base):
    __tablename__ = "news"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    url = Column(Text, nullable=False)
    source = Column(String(200), nullable=False)
    published_at = Column(DateTime, nullable=False)
    summary = Column(Text)
    content = Column(Text)
    tags = Column(ARRAY(String), default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    videos = relationship("Video", back_populates="news_item", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_news_published_at', 'published_at'),
        Index('idx_news_source', 'source'),
        Index('idx_news_tags', 'tags', postgresql_using='gin'),
    )


class Video(Base):
    __tablename__ = "videos"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    news_id = Column(UUID(as_uuid=True), ForeignKey("news.id"), nullable=False)
    youtube_id = Column(String(100))
    title = Column(String(500), nullable=False)
    url = Column(Text, nullable=False)
    published_at = Column(DateTime)
    
    news_item = relationship("NewsItem", back_populates="videos")
    
    __table_args__ = (
        Index('idx_videos_news_id', 'news_id'),
        Index('idx_videos_youtube_id', 'youtube_id'),
    )


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

