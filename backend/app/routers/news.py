from fastapi import APIRouter, Depends, Query, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional
from uuid import UUID
import logging

from app.db import get_db, NewsItem
from app.schemas import NewsItemResponse, NewsListResponse, TranslateRequest, TranslateResponse
from app.agents import translate_content
from app.tasks import ingest_and_process_news

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=NewsListResponse)
async def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    """List news items with pagination and search. Also triggers lightweight ingestion check."""
    # Trigger lightweight ingestion on each request (non-blocking)
    try:
        background_tasks.add_task(ingest_and_process_news)
    except Exception as e:
        logger.warning(f"Failed to schedule ingestion task: {str(e)}")
    
    # Build query
    query = db.query(NewsItem)
    
    # Apply search filter
    if search:
        search_term = f"%{search}%"
        search_lower = search.lower()
        # For PostgreSQL array search, use array_to_string or any()
        query = query.filter(
            or_(
                NewsItem.title.ilike(search_term),
                NewsItem.summary.ilike(search_term),
                NewsItem.content.ilike(search_term),
                func.array_to_string(NewsItem.tags, '|').ilike(search_term)
            )
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    items = query.order_by(NewsItem.published_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return NewsListResponse(
        items=[NewsItemResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        has_more=(page * page_size) < total
    )


@router.get("/{id}", response_model=NewsItemResponse)
async def get_news_item(id: UUID, db: Session = Depends(get_db)):
    """Get a specific news item by ID"""
    item = db.query(NewsItem).filter(NewsItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    return NewsItemResponse.model_validate(item)


@router.post("/{id}/translate", response_model=TranslateResponse)
async def translate_news_item(
    id: UUID,
    request: TranslateRequest,
    db: Session = Depends(get_db)
):
    """Translate the content of a news item to the target language"""
    item = db.query(NewsItem).filter(NewsItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    
    content_to_translate = item.content or item.summary or item.title
    translated = await translate_content(content_to_translate, request.language)
    
    return TranslateResponse(
        translated_content=translated,
        language=request.language
    )

