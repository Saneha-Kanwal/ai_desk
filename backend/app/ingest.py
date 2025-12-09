import feedparser
import httpx
import logging
from typing import List, Dict, Optional
from datetime import datetime
from urllib.parse import urlparse
import hashlib

from app.config import settings

logger = logging.getLogger(__name__)

# Default RSS feeds for AI news
DEFAULT_RSS_FEEDS = [
    "https://techcrunch.com/tag/artificial-intelligence/feed/",
    "https://venturebeat.com/ai/feed/",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.feedburner.com/oreilly/radar",
    "https://www.artificialintelligence-news.com/feed/",
]


async def fetch_rss_feed(feed_url: str) -> List[Dict]:
    """Fetch and parse an RSS feed"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(feed_url)
            response.raise_for_status()
            
            feed = feedparser.parse(response.text)
            
            items = []
            for entry in feed.entries[:20]:  # Limit to 20 items per feed
                try:
                    # Extract published date
                    published = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        published = datetime(*entry.published_parsed[:6])
                    elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                        published = datetime(*entry.updated_parsed[:6])
                    else:
                        published = datetime.utcnow()
                    
                    items.append({
                        "title": entry.get("title", "Untitled"),
                        "url": entry.get("link", ""),
                        "source": feed.feed.get("title", urlparse(feed_url).netloc),
                        "published_at": published,
                        "summary": entry.get("summary", entry.get("description", "")),
                        "content": entry.get("content", [{}])[0].get("value", "") if entry.get("content") else entry.get("summary", ""),
                        "tags": [tag.term for tag in entry.get("tags", [])][:5]
                    })
                except Exception as e:
                    logger.warning(f"Error parsing RSS entry: {str(e)}")
                    continue
            
            return items
    except Exception as e:
        logger.error(f"Error fetching RSS feed {feed_url}: {str(e)}")
        return []


async def fetch_custom_api(api_url: str, api_key: Optional[str] = None) -> List[Dict]:
    """Fetch news from a custom API endpoint"""
    try:
        headers = {}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(api_url, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            # Try to parse common API formats
            items = []
            articles = data.get("articles", data.get("results", data.get("items", [])))
            
            for article in articles[:20]:
                try:
                    published = datetime.utcnow()
                    if article.get("publishedAt"):
                        try:
                            published = datetime.fromisoformat(article["publishedAt"].replace("Z", "+00:00"))
                        except:
                            pass
                    
                    items.append({
                        "title": article.get("title", "Untitled"),
                        "url": article.get("url", article.get("link", "")),
                        "source": article.get("source", {}).get("name", "Unknown") if isinstance(article.get("source"), dict) else article.get("source", "Unknown"),
                        "published_at": published,
                        "summary": article.get("description", article.get("summary", "")),
                        "content": article.get("content", article.get("description", "")),
                        "tags": article.get("tags", article.get("categories", []))[:5]
                    })
                except Exception as e:
                    logger.warning(f"Error parsing API article: {str(e)}")
                    continue
            
            return items
    except Exception as e:
        logger.error(f"Error fetching custom API {api_url}: {str(e)}")
        return []


async def ingest_news_items(rss_feeds: Optional[List[str]] = None, custom_apis: Optional[List[Dict]] = None) -> List[Dict]:
    """
    Ingest news items from RSS feeds and custom APIs.
    Returns a list of news item dictionaries.
    """
    all_items = []
    
    # Fetch from RSS feeds
    feeds = rss_feeds or DEFAULT_RSS_FEEDS
    for feed_url in feeds:
        try:
            items = await fetch_rss_feed(feed_url)
            all_items.extend(items)
            logger.info(f"Fetched {len(items)} items from {feed_url}")
        except Exception as e:
            logger.error(f"Failed to fetch from {feed_url}: {str(e)}")
    
    # Fetch from custom APIs
    if custom_apis:
        for api_config in custom_apis:
            try:
                items = await fetch_custom_api(
                    api_config.get("url"),
                    api_config.get("api_key")
                )
                all_items.extend(items)
                logger.info(f"Fetched {len(items)} items from custom API")
            except Exception as e:
                logger.error(f"Failed to fetch from custom API: {str(e)}")
    
    # Deduplicate by URL
    seen_urls = set()
    unique_items = []
    for item in all_items:
        url_hash = hashlib.md5(item["url"].encode()).hexdigest()
        if url_hash not in seen_urls:
            seen_urls.add(url_hash)
            unique_items.append(item)
    
    logger.info(f"Total unique items ingested: {len(unique_items)}")
    return unique_items


def check_if_new_item(url: str, db_session) -> bool:
    """Check if a news item with this URL already exists in the database"""
    from app.db import NewsItem
    existing = db_session.query(NewsItem).filter(NewsItem.url == url).first()
    return existing is None

