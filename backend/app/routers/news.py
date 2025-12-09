from fastapi import APIRouter, Query, HTTPException, BackgroundTasks, Depends
from typing import Optional
from uuid import UUID
import logging
import uuid
from datetime import datetime

from app.storage import get_news_item as get_stored_item, get_all_news_items, search_news_items, get_news_by_category, add_news_item, clear_old_items, news_storage
from app.schemas import NewsItemResponse, NewsListResponse, TranslateRequest, TranslateResponse, VideoResponse
from app.agents import translate_content, process_news_item_with_agent
from app.ingest import ingest_news_items
from app.routers.auth_memory import get_current_active_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=NewsListResponse)
async def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    time_period: Optional[str] = Query(None, regex="^(20s|30m|6h|1d|4d|older)$"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """List news items with pagination, search, category filtering, and time period filtering. Fetches from RSS feeds on-the-fly."""
    # Fetch news items from RSS feeds (non-blocking)
    try:
        background_tasks.add_task(fetch_and_store_news)
    except Exception as e:
        logger.warning(f"Failed to schedule news fetch: {str(e)}")
    
    # Get items from in-memory storage
    if search:
        all_items = search_news_items(search, category=category, time_period=time_period)
    elif category or time_period:
        all_items = get_news_by_category(category, time_period=time_period)
    else:
        all_items = get_all_news_items()
    
    # Sort by published_at (newest first)
    all_items.sort(key=lambda x: x["published_at"], reverse=True)
    
    # Apply pagination
    total = len(all_items)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_items = all_items[start_idx:end_idx]
    
    # Convert to NewsItemResponse
    items_response = []
    for item in paginated_items:
        items_response.append(NewsItemResponse(
            id=UUID(item["id"]),
            title=item["title"],
            url=item["url"],
            source=item["source"],
            published_at=item["published_at"],
            summary=item.get("summary"),
            content=None,  # Generated on-the-fly
            tags=item.get("tags", []),
            thumbnail=item.get("thumbnail"),
            category=item.get("category", "AI-Related News"),
            created_at=item["created_at"],
            updated_at=item["updated_at"],
            videos=[]  # Generated on-the-fly
        ))
    
    return NewsListResponse(
        items=items_response,
        total=total,
        page=page,
        page_size=page_size,
        has_more=(page * page_size) < total
    )


async def fetch_and_store_news():
    """Fetch news from RSS feeds and store in memory"""
    try:
        items = await ingest_news_items()
        for item_data in items:
            # Check if URL already exists
            existing = None
            for stored_item in news_storage.values():
                if stored_item["url"] == item_data["url"]:
                    existing = stored_item
                    break
            
            if not existing:
                add_news_item(item_data)
        
        # Keep only recent items
        clear_old_items(keep_recent=1000)
        logger.info(f"Fetched and stored {len(items)} news items in memory")
    except Exception as e:
        logger.error(f"Error fetching news: {str(e)}")


@router.post("/{id}/regenerate", response_model=NewsItemResponse)
async def regenerate_article(id: UUID):
    """Regenerate comprehensive article (800+ words) - same as get endpoint"""
    return await get_news_item(id, force_regenerate=True)


@router.get("/{id}", response_model=NewsItemResponse)
async def get_news_item(
    id: UUID, 
    force_regenerate: bool = Query(False),
    current_user = Depends(get_current_active_user)
):
    """Get a specific news item by ID. ALWAYS generates comprehensive 800+ word article on-the-fly (no database). Requires authentication."""
    item = get_stored_item(str(id))
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    
    # ALWAYS generate fresh comprehensive article on-the-fly (no database storage)
    logger.info(f"🤖 AI Agent generating comprehensive 800+ word article on-the-fly for: {item['title'][:50]}...")
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Generate comprehensive article using AI agent
            agent_result = await process_news_item_with_agent(
                title=item["title"],
                content=item.get("summary", ""),
                url=item["url"]
            )
            
            if agent_result.get("explanation"):
                new_word_count = len(agent_result["explanation"].split())
                logger.info(f"✅ Generated comprehensive article with {new_word_count} words")
                
                # CRITICAL: Verify article meets minimum word count requirement
                if new_word_count < 800:
                    logger.warning(f"⚠️ Generated article is only {new_word_count} words, retrying... (attempt {retry_count + 1}/{max_retries})")
                    retry_count += 1
                    if retry_count < max_retries:
                        import asyncio
                        await asyncio.sleep(3)  # Wait before retry
                        continue  # Retry generation
                    else:
                        logger.error(f"❌ Failed to generate 800+ word article after {max_retries} attempts")
                        raise HTTPException(status_code=500, detail=f"Generated article is only {new_word_count} words. Minimum 800 words required.")
                
                # Article meets requirements - return on-the-fly (NO database storage)
                # Process YouTube videos if queries are provided
                videos = []
                yt_queries = agent_result.get("yt_queries", [])
                if yt_queries:
                    from app.youtube import search_youtube_videos
                    try:
                        video_data_list = await search_youtube_videos(yt_queries, limit_per_query=1)
                        for video_data in video_data_list[:3]:
                            videos.append(VideoResponse(
                                id=uuid.uuid4(),
                                youtube_id=video_data.get("youtube_id"),
                                title=video_data["title"],
                                url=video_data["url"],
                                published_at=video_data.get("published_at")
                            ))
                        logger.info(f"✅ Added {len(videos)} YouTube videos")
                    except Exception as e:
                        logger.warning(f"Could not fetch YouTube videos: {str(e)}")
                
                # Return article on-the-fly without storing in database
                return NewsItemResponse(
                    id=UUID(item["id"]),
                    title=item["title"],
                    url=item["url"],
                    source=item["source"],
                    published_at=item["published_at"],
                    summary=agent_result.get("summary", item.get("summary")),
                    content=agent_result["explanation"],  # Generated article (800+ words)
                    tags=item.get("tags", []),
                    thumbnail=item.get("thumbnail"),
                    category=item.get("category", "AI-Related News"),
                    created_at=item["created_at"],
                    updated_at=datetime.utcnow(),
                    videos=videos
                )
            else:
                logger.error("❌ Agent did not return explanation field")
                retry_count += 1
                if retry_count >= max_retries:
                    raise HTTPException(status_code=500, detail="Failed to generate article content after multiple attempts")
        except HTTPException:
            raise
        except Exception as e:
            retry_count += 1
            logger.error(f"❌ Error generating article (attempt {retry_count}/{max_retries}): {str(e)}")
            if retry_count >= max_retries:
                raise HTTPException(status_code=500, detail=f"Failed to generate article after {max_retries} attempts: {str(e)}")
            # Wait a bit before retrying
            import asyncio
            await asyncio.sleep(3)
    
    # Fallback (should not reach here)
    raise HTTPException(status_code=500, detail="Failed to generate article")


@router.post("/{id}/translate", response_model=TranslateResponse)
async def translate_news_item(
    id: UUID,
    request: TranslateRequest
):
    """Translate the content of a news item to the target language"""
    item = get_stored_item(str(id))
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    
    # Generate article first (on-the-fly), then translate
    agent_result = await process_news_item_with_agent(
        title=item["title"],
        content=item.get("summary", ""),
        url=item["url"]
    )
    
    content_to_translate = agent_result.get("explanation") or agent_result.get("summary") or item.get("summary") or item["title"]
    translated = await translate_content(content_to_translate, request.language)
    
    return TranslateResponse(
        translated_content=translated,
        language=request.language
    )

