import json
import re
import logging
from typing import Dict, List, Optional
from openai import OpenAI

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)


def truncate_content(content: str, max_tokens: int = 40000) -> str:
    """Truncate content to approximately max_tokens (rough estimate: 1 token ≈ 4 chars)"""
    max_chars = max_tokens * 4
    if len(content) <= max_chars:
        return content
    return content[:max_chars] + "... [truncated]"


def parse_agent_output(text: str) -> Dict[str, any]:
    """Parse agent output, looking for JSON block or structured text"""
    # Try to extract JSON block
    json_match = re.search(r'\{[^{}]*"summary"[^{}]*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass
    
    # Try to find JSON anywhere in the text
    try:
        # Look for JSON-like structure
        json_start = text.find('{')
        json_end = text.rfind('}') + 1
        if json_start >= 0 and json_end > json_start:
            parsed = json.loads(text[json_start:json_end])
            if "summary" in parsed:
                return parsed
    except (json.JSONDecodeError, ValueError):
        pass
    
    # Fallback: parse structured text
    result = {
        "summary": "",
        "explanation": "",
        "yt_queries": []
    }
    
    # Try to extract summary
    summary_match = re.search(r'(?:summary|Summary):\s*(.+?)(?:\n\n|\nExplanation|$)', text, re.DOTALL | re.IGNORECASE)
    if summary_match:
        result["summary"] = summary_match.group(1).strip()
    
    # Try to extract explanation
    explanation_match = re.search(r'(?:explanation|Explanation|detailed explanation):\s*(.+?)(?:\n\nYouTube|$)', text, re.DOTALL | re.IGNORECASE)
    if explanation_match:
        result["explanation"] = explanation_match.group(1).strip()
    elif not result["summary"]:
        # If no explanation found, use the whole text
        result["explanation"] = text.strip()
    
    # Try to extract YouTube queries
    yt_match = re.search(r'(?:YouTube|youtube|video).*?queries?:\s*(.+?)(?:\n\n|$)', text, re.DOTALL | re.IGNORECASE)
    if yt_match:
        queries_text = yt_match.group(1)
        # Extract list items or comma-separated
        queries = re.findall(r'[-•]\s*(.+?)(?:\n|$)', queries_text) or queries_text.split(',')
        result["yt_queries"] = [q.strip() for q in queries if q.strip()][:5]
    
    return result


async def process_news_item_with_agent(title: str, content: str, url: str) -> Dict[str, any]:
    """
    Process a news item using OpenAI Agents SDK (2025).
    Returns: {summary, explanation, yt_queries}
    """
    # Truncate content if too long
    truncated_content = truncate_content(content)
    
    # Determine model based on agent mode
    if settings.agent_mode == "cheap":
        model = "gpt-3.5-turbo"
    else:
        model = "gpt-4-turbo-preview"
    
    system_instructions = """You are an expert AI news analyst. Your task is to:
1. Create a concise 1-2 sentence summary of the article
2. Provide a detailed 3-6 paragraph explanation covering:
   - Context and background
   - Key implications
   - Real-world examples or analogies
   - Why this matters
3. Suggest 2-5 relevant YouTube search queries for related videos

Format your response with a JSON block at the end containing:
{
  "summary": "1-2 sentence summary",
  "explanation": "3-6 paragraph detailed explanation",
  "yt_queries": ["query 1", "query 2", ...]
}"""
    
    user_input = f"""Analyze this AI news article:

Title: {title}
URL: {url}

Content:
{truncated_content}

Please provide:
1. A short summary (1-2 sentences)
2. A detailed explanation (3-6 paragraphs) covering context, implications, and examples
3. Suggested YouTube search queries for related videos

End your response with a JSON block containing the structured data."""
    
    try:
        # Use OpenAI Agents SDK (2025) - Assistants API (Agents pattern)
        # Create an assistant/agent with system instructions
        assistant = client.beta.assistants.create(
            name="ai-news-analyzer",
            instructions=system_instructions,
            model=model,
            tools=[]  # No tools needed for this task
        )
        
        # Create a thread for the conversation
        thread = client.beta.threads.create()
        
        # Add user message to the thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input
        )
        
        # Run the assistant/agent
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )
        
        # Wait for the run to complete
        import time
        max_wait = 60  # 60 seconds timeout
        wait_time = 0
        while run.status in ["queued", "in_progress"] and wait_time < max_wait:
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            wait_time += 1
        
        if run.status != "completed":
            raise Exception(f"Agent run failed with status: {run.status}")
        
        # Get the messages from the thread
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        
        # Extract the agent's response
        agent_output = ""
        for msg in messages.data:
            if msg.role == "assistant" and msg.content:
                if isinstance(msg.content, list):
                    for item in msg.content:
                        if hasattr(item, 'text') and hasattr(item.text, 'value'):
                            agent_output = item.text.value
                            break
                        elif hasattr(item, 'text'):
                            agent_output = str(item.text)
                            break
                elif hasattr(msg.content, 'text'):
                    if hasattr(msg.content.text, 'value'):
                        agent_output = msg.content.text.value
                    else:
                        agent_output = str(msg.content.text)
                break
        
        if not agent_output:
            raise Exception("No response from agent")
        
        # Parse the output
        parsed = parse_agent_output(agent_output)
        
        # Ensure we have at least a summary
        if not parsed.get("summary"):
            parsed["summary"] = agent_output[:200] + "..."
        
        if not parsed.get("explanation"):
            parsed["explanation"] = agent_output
        
        logger.info(f"Successfully processed news item: {title[:50]}...")
        return parsed
        
    except Exception as e:
        logger.error(f"Error processing news item with agent: {str(e)}")
        # Final fallback: return basic summary
        return {
            "summary": f"AI news article about {title[:100]}...",
            "explanation": f"This article discusses {title}. Read more at the source link.",
            "yt_queries": [f"{title} AI", "AI news"]
        }


async def translate_content(content: str, target_language: str) -> str:
    """Translate content to target language using OpenAI Agents SDK"""
    model = "gpt-3.5-turbo" if settings.agent_mode == "cheap" else "gpt-4-turbo-preview"
    
    try:
        # Use Assistants API (Agents SDK pattern) for translation
        assistant = client.beta.assistants.create(
            name="translator",
            instructions=f"You are a professional translator. Translate the following text to {target_language}. Maintain the original meaning, tone, and structure.",
            model=model,
            tools=[]
        )
        
        thread = client.beta.threads.create()
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=content
        )
        
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )
        
        # Wait for completion
        import time
        max_wait = 30
        wait_time = 0
        while run.status in ["queued", "in_progress"] and wait_time < max_wait:
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            wait_time += 1
        
        if run.status == "completed":
            messages = client.beta.threads.messages.list(thread_id=thread.id)
            for msg in messages.data:
                if msg.role == "assistant" and msg.content:
                    if isinstance(msg.content, list):
                        for item in msg.content:
                            if hasattr(item, 'text') and hasattr(item.text, 'value'):
                                return item.text.value
                            elif hasattr(item, 'text'):
                                return str(item.text)
                    elif hasattr(msg.content, 'text'):
                        if hasattr(msg.content.text, 'value'):
                            return msg.content.text.value
                        else:
                            return str(msg.content.text)
        
        raise Exception("Translation failed")
    except Exception as e:
        logger.error(f"Error translating content: {str(e)}")
        raise
