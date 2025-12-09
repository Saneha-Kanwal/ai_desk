import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.db import SessionLocal, NewsItem, Video
from app.ingest import ingest_news_items, check_if_new_item
from app.agents import process_news_item_with_agent
from app.youtube import search_youtube_videos

logger = logging.getLogger(__name__)


async def process_and_store_news_item(item_data: dict, db: Session) -> Optional[NewsItem]:
    """Store news item metadata in database (NO article content storage - generated on-the-fly)"""
    try:
        # Check if item already exists
        existing = db.query(NewsItem).filter(NewsItem.url == item_data["url"]).first()
        if existing:
            logger.debug(f"News item already exists: {item_data['url']}")
            return existing
        
        # Store ONLY metadata (title, url, source, published_at, tags)
        # Article content will be generated on-the-fly when requested
        news_item = NewsItem(
            title=item_data["title"],
            url=item_data["url"],
            source=item_data["source"],
            published_at=item_data["published_at"],
            summary=item_data.get("summary", ""),  # Keep summary from RSS feed
            content=None,  # NO content storage - generated on-the-fly
            tags=item_data.get("tags", [])
        )
        
        db.add(news_item)
        db.commit()
        db.refresh(news_item)
        
        # NO YouTube videos stored - generated on-the-fly when article is requested
        
        logger.info(f"Successfully stored news item metadata: {news_item.id} (content will be generated on-the-fly)")
        return news_item
        
    except Exception as e:
        logger.error(f"Error storing news item: {str(e)}")
        db.rollback()
        return None


async def ingest_and_process_news():
    """Main ingestion task: fetch news and process through agent"""
    logger.info("Starting news ingestion task...")
    db = SessionLocal()
    
    try:
        # Ingest news items
        items = await ingest_news_items()
        
        # Process each item
        processed_count = 0
        for item_data in items:
            result = await process_and_store_news_item(item_data, db)
            if result:
                processed_count += 1
        
        logger.info(f"Ingestion complete: {processed_count} new items processed")
        return processed_count
        
    except Exception as e:
        logger.error(f"Error in ingestion task: {str(e)}")
        return 0
    finally:
        db.close()

