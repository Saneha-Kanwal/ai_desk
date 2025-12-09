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
    """Process a news item through the agent and store it in the database"""
    try:
        # Check if item already exists
        existing = db.query(NewsItem).filter(NewsItem.url == item_data["url"]).first()
        if existing:
            logger.debug(f"News item already exists: {item_data['url']}")
            return existing
        
        # Process with AI agent
        logger.info(f"Processing news item: {item_data['title'][:50]}...")
        agent_result = await process_news_item_with_agent(
            title=item_data["title"],
            content=item_data.get("content", item_data.get("summary", "")),
            url=item_data["url"]
        )
        
        # Create news item
        news_item = NewsItem(
            title=item_data["title"],
            url=item_data["url"],
            source=item_data["source"],
            published_at=item_data["published_at"],
            summary=agent_result.get("summary", item_data.get("summary", "")),
            content=agent_result.get("explanation", item_data.get("content", "")),
            tags=item_data.get("tags", [])
        )
        
        db.add(news_item)
        db.commit()
        db.refresh(news_item)
        
        # Process YouTube videos
        yt_queries = agent_result.get("yt_queries", [])
        if yt_queries:
            videos = await search_youtube_videos(yt_queries, limit_per_query=1)
            for video_data in videos[:3]:  # Limit to top 3 videos
                video = Video(
                    news_id=news_item.id,
                    youtube_id=video_data.get("youtube_id"),
                    title=video_data["title"],
                    url=video_data["url"],
                    published_at=video_data.get("published_at")
                )
                db.add(video)
        
        db.commit()
        logger.info(f"Successfully stored news item: {news_item.id}")
        return news_item
        
    except Exception as e:
        logger.error(f"Error processing news item: {str(e)}")
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

