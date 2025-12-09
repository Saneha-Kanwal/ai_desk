import pytest
from unittest.mock import patch, AsyncMock
from app.ingest import fetch_rss_feed, fetch_custom_api, ingest_news_items


@pytest.mark.asyncio
@patch('app.ingest.httpx.AsyncClient')
async def test_fetch_rss_feed(mock_client_class):
    """Test RSS feed fetching"""
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client
    
    # Mock RSS response
    mock_response = AsyncMock()
    mock_response.text = """<?xml version="1.0"?>
    <rss version="2.0">
      <channel>
        <title>Test Feed</title>
        <item>
          <title>Test Article</title>
          <link>https://example.com/article</link>
          <description>Test description</description>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>
    """
    mock_response.raise_for_status = AsyncMock()
    mock_client.get.return_value = mock_response
    
    items = await fetch_rss_feed("https://example.com/feed")
    assert len(items) > 0
    assert items[0]["title"] == "Test Article"


@pytest.mark.asyncio
@patch('app.ingest.httpx.AsyncClient')
async def test_fetch_custom_api(mock_client_class):
    """Test custom API fetching"""
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client
    
    # Mock API response
    mock_response = AsyncMock()
    mock_response.json.return_value = {
        "articles": [
            {
                "title": "Test Article",
                "url": "https://example.com/article",
                "source": {"name": "Test Source"},
                "publishedAt": "2024-01-01T00:00:00Z",
                "description": "Test description"
            }
        ]
    }
    mock_response.raise_for_status = AsyncMock()
    mock_client.get.return_value = mock_response
    
    items = await fetch_custom_api("https://example.com/api")
    assert len(items) > 0
    assert items[0]["title"] == "Test Article"

