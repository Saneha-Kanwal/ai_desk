import pytest
from unittest.mock import patch, MagicMock
from app.agents import process_news_item_with_agent, parse_agent_output, truncate_content


def test_truncate_content():
    """Test content truncation"""
    short_content = "Short content"
    assert truncate_content(short_content) == short_content
    
    long_content = "a" * 200000  # ~50k tokens
    truncated = truncate_content(long_content)
    assert len(truncated) < len(long_content)
    assert "[truncated]" in truncated


def test_parse_agent_output_json():
    """Test parsing agent output with JSON"""
    output = """
    Here is the analysis:
    
    {
      "summary": "Test summary",
      "explanation": "Test explanation",
      "yt_queries": ["query1", "query2"]
    }
    """
    result = parse_agent_output(output)
    assert result["summary"] == "Test summary"
    assert result["explanation"] == "Test explanation"
    assert len(result["yt_queries"]) == 2


def test_parse_agent_output_text():
    """Test parsing agent output without JSON"""
    output = """
    Summary: This is a test summary
    
    Explanation: This is a detailed explanation
    
    YouTube queries:
    - AI news
    - Machine learning
    """
    result = parse_agent_output(output)
    assert "summary" in result
    assert "explanation" in result


@pytest.mark.asyncio
@patch('app.agents.client')
async def test_process_news_item_with_agent(mock_client):
    """Test processing news item with agent"""
    # Mock OpenAI response
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = """
    {
      "summary": "Test summary",
      "explanation": "Test explanation",
      "yt_queries": ["test query"]
    }
    """
    mock_client.chat.completions.create.return_value = mock_response
    
    result = await process_news_item_with_agent(
        title="Test Title",
        content="Test content",
        url="https://example.com"
    )
    
    assert "summary" in result
    assert "explanation" in result
    assert "yt_queries" in result

