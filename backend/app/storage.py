"""
In-memory storage for news items (no database)
"""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid
from collections import OrderedDict

# In-memory storage for news items
news_storage: Dict[str, Dict] = OrderedDict()


def add_news_item(item_data: dict) -> str:
    """Add a news item to in-memory storage"""
    item_id = str(uuid.uuid4())
    news_storage[item_id] = {
        "id": item_id,
        "title": item_data.get("title", ""),
        "url": item_data.get("url", ""),
        "source": item_data.get("source", "Unknown"),
        "published_at": item_data.get("published_at", datetime.utcnow()),
        "summary": item_data.get("summary", ""),
        "tags": item_data.get("tags", []),
        "thumbnail": item_data.get("thumbnail"),
        "category": item_data.get("category", "AI-Related News"),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    return item_id


def get_news_item(item_id: str) -> Optional[Dict]:
    """Get a news item by ID"""
    return news_storage.get(item_id)


def get_all_news_items() -> List[Dict]:
    """Get all news items"""
    return list(news_storage.values())


def search_news_items(search_term: str, category: Optional[str] = None, time_period: Optional[str] = None) -> List[Dict]:
    """Search news items by title, summary, or tags, optionally filtered by category and time period"""
    search_lower = search_term.lower()
    results = []
    now = datetime.utcnow()
    
    # Calculate time threshold based on time_period
    time_threshold = None
    if time_period:
        if time_period == "20s":
            time_threshold = now - timedelta(seconds=20)
        elif time_period == "30m":
            time_threshold = now - timedelta(minutes=30)
        elif time_period == "6h":
            time_threshold = now - timedelta(hours=6)
        elif time_period == "1d":
            time_threshold = now - timedelta(days=1)
        elif time_period == "4d":
            time_threshold = now - timedelta(days=4)
        elif time_period == "older":
            time_threshold = now - timedelta(days=4)
    
    for item in news_storage.values():
        # Category filter
        if category and item.get("category") != category:
            continue
        
        # Time period filter
        if time_period:
            published_at = item.get("published_at")
            if isinstance(published_at, str):
                try:
                    published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                except:
                    published_at = datetime.utcnow()
            
            if time_period == "older":
                if published_at >= time_threshold:
                    continue
            else:
                if published_at < time_threshold:
                    continue
        
        # Search filter
        if (search_lower in item["title"].lower() or
            search_lower in item.get("summary", "").lower() or
            any(search_lower in tag.lower() for tag in item.get("tags", []))):
            results.append(item)
    return results


def get_news_by_category(category: Optional[str] = None, time_period: Optional[str] = None) -> List[Dict]:
    """Get news items filtered by category and optionally by time period"""
    now = datetime.utcnow()
    
    # Calculate time threshold based on time_period
    time_threshold = None
    if time_period:
        if time_period == "20s":
            time_threshold = now - timedelta(seconds=20)
        elif time_period == "30m":
            time_threshold = now - timedelta(minutes=30)
        elif time_period == "6h":
            time_threshold = now - timedelta(hours=6)
        elif time_period == "1d":
            time_threshold = now - timedelta(days=1)
        elif time_period == "4d":
            time_threshold = now - timedelta(days=4)
        elif time_period == "older":
            time_threshold = now - timedelta(days=4)
    
    if not category:
        if not time_period:
            return get_all_news_items()
        # Filter by time period only
        results = []
        for item in news_storage.values():
            published_at = item.get("published_at")
            if isinstance(published_at, str):
                try:
                    published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                except:
                    published_at = datetime.utcnow()
            
            if time_period == "older":
                if published_at < time_threshold:
                    results.append(item)
            else:
                if published_at >= time_threshold:
                    results.append(item)
        return results
    
    results = []
    for item in news_storage.values():
        if item.get("category") != category:
            continue
        
        # Time period filter
        if time_period:
            published_at = item.get("published_at")
            if isinstance(published_at, str):
                try:
                    published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                except:
                    published_at = datetime.utcnow()
            
            if time_period == "older":
                if published_at >= time_threshold:
                    continue
            else:
                if published_at < time_threshold:
                    continue
        
        results.append(item)
    return results


def clear_old_items(keep_recent: int = 1000):
    """Keep only the most recent items"""
    if len(news_storage) > keep_recent:
        items_list = list(news_storage.items())
        # Keep most recent items
        items_list.sort(key=lambda x: x[1]["published_at"], reverse=True)
        news_storage.clear()
        news_storage.update(dict(items_list[:keep_recent]))

