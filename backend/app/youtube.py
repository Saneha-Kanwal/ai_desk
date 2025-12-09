import logging
from typing import List, Dict, Optional
from datetime import datetime
import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def search_youtube_videos(queries: List[str], limit_per_query: int = 1) -> List[Dict]:
    """
    Search YouTube for videos using the provided queries.
    Returns list of video dictionaries with: youtube_id, title, url, published_at
    """
    if not settings.youtube_api_key:
        logger.info("YouTube API key not provided, returning suggested queries only")
        # Return fallback with search queries
        videos = []
        for query in queries[:3]:
            videos.append({
                "youtube_id": None,
                "title": f"Search: {query}",
                "url": f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}",
                "published_at": None
            })
        return videos
    
    all_videos = []
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            for query in queries[:5]:  # Limit to 5 queries
                try:
                    response = await client.get(
                        "https://www.googleapis.com/youtube/v3/search",
                        params={
                            "part": "snippet",
                            "q": query,
                            "type": "video",
                            "maxResults": limit_per_query,
                            "key": settings.youtube_api_key,
                            "order": "relevance"
                        }
                    )
                    response.raise_for_status()
                    data = response.json()
                    
                    for item in data.get("items", []):
                        snippet = item.get("snippet", {})
                        video_id = item.get("id", {}).get("videoId")
                        
                        if video_id:
                            published_at = None
                            if snippet.get("publishedAt"):
                                try:
                                    published_at = datetime.fromisoformat(
                                        snippet["publishedAt"].replace("Z", "+00:00")
                                    )
                                except:
                                    pass
                            
                            all_videos.append({
                                "youtube_id": video_id,
                                "title": snippet.get("title", "Untitled"),
                                "url": f"https://www.youtube.com/watch?v={video_id}",
                                "published_at": published_at
                            })
                    
                except Exception as e:
                    logger.warning(f"Error searching YouTube for '{query}': {str(e)}")
                    continue
        
        logger.info(f"Found {len(all_videos)} YouTube videos")
        return all_videos
        
    except Exception as e:
        logger.error(f"Error in YouTube search: {str(e)}")
        # Return fallback
        videos = []
        for query in queries[:3]:
            videos.append({
                "youtube_id": None,
                "title": f"Search: {query}",
                "url": f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}",
                "published_at": None
            })
        return videos

