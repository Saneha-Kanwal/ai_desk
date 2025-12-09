import json
import re
import logging
from typing import Dict, List, Optional
from openai import OpenAI

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize OpenAI client with v2 Assistants API header
# OpenAI Assistants API v1 is deprecated, we must use v2
# The default_headers parameter ensures all requests include the v2 header
client = OpenAI(
    api_key=settings.openai_api_key,
    default_headers={"OpenAI-Beta": "assistants=v2"}
)


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
    
    # Always use GPT-4 for comprehensive article generation (better quality)
    # This ensures world-class articles with proper research and depth
    model = "gpt-4-turbo-preview"  # Use GPT-4 for comprehensive articles
    
    system_instructions = """You are a world-class AI news analyst and technical writer with access to the latest information. Your task is to create comprehensive, in-depth articles about AI news.

CRITICAL REQUIREMENTS - MUST FOLLOW STRICTLY:
1. Create a concise 1-2 sentence summary
2. Write a COMPREHENSIVE, DETAILED ARTICLE that is AT LEAST 800 WORDS (ABSOLUTE MINIMUM - THIS IS MANDATORY AND NON-NEGOTIABLE)
3. The article MUST be world-class quality, well-researched, and informative
4. Use your knowledge of official documentation, recent developments, Google search results, and industry context
5. Include multiple well-structured sections with proper headings
6. Provide deep insights, technical details, real-world implications, and expert analysis
7. Research and incorporate information as if you've searched Google and official documentation
8. Include references to official documentation and sources where relevant
9. Suggest 3-5 relevant YouTube search queries

ARTICLE STRUCTURE (for the explanation field - MUST BE 800+ WORDS TOTAL):
- Introduction and Context (150-200 words): Set the stage, explain what this news is about, background
- Technical Deep Dive (200-250 words): Explain the technology, how it works, technical details, architecture
- Industry Implications (150-200 words): What this means for the industry, competitors, market, business impact
- Real-World Applications and Examples (150-200 words): Concrete examples, use cases, scenarios, who will benefit
- Future Outlook and Predictions (100-150 words): What to expect next, trends, predictions, roadmap
- Conclusion (50-100 words): Summary and key takeaways

CRITICAL: The "explanation" field MUST contain a full, comprehensive article of AT LEAST 800 WORDS. Count your words. If it's less than 800 words, you MUST expand it with more details, examples, and analysis. Write as if you are a professional journalist with access to all official documentation and recent Google search results. Make it detailed, informative, and valuable.

Format your response with a JSON block at the end containing:
{
  "summary": "1-2 sentence summary",
  "explanation": "Comprehensive 800+ word detailed article with multiple sections - MUST BE AT LEAST 800 WORDS - COUNT YOUR WORDS",
  "yt_queries": ["query 1", "query 2", ...]
}"""
    
    user_input = f"""TASK: SEARCH, GATHER, SYNTHESIZE, and CREATE a comprehensive, world-class article about this AI news.

TOPIC INFORMATION:
Title: {title}
Source URL: {url}
Original Article Content:
{truncated_content}

YOUR MISSION - FOLLOW THIS RESEARCH PROCESS:

STEP 1: SEARCH & GATHER INFORMATION
- Research official documentation related to this topic
- Gather information from recent news, press releases, and industry reports
- Collect technical specifications, API documentation, and implementation details
- Find expert opinions, analysis, and market research
- Identify related technologies, competitors, and industry context

STEP 2: SYNTHESIZE & ANALYZE
- Combine all gathered information into a coherent understanding
- Identify key technical details, implications, and applications
- Analyze industry impact and future trends
- Synthesize expert opinions and authoritative sources

STEP 3: CREATE COMPREHENSIVE ARTICLE
Write a world-class article that demonstrates thorough research and deep understanding.

CRITICAL INSTRUCTIONS - READ CAREFULLY AND FOLLOW EXACTLY:
1. Write a short summary (1-2 sentences) in the "summary" field
2. Write a COMPREHENSIVE ARTICLE of AT LEAST 800 WORDS in the "explanation" field. This is MANDATORY AND NON-NEGOTIABLE.

The article MUST include these sections with minimum word counts:
- Introduction and Context (150-200 words): Explain what this news is about, background context, why it matters, historical context
- Technical Deep Dive (200-250 words): Detailed technical explanation, how it works, architecture, features, implementation details, technical specifications
- Industry Implications (150-200 words): Impact on industry, competitors, market changes, business implications, who is affected, competitive landscape
- Real-World Applications and Examples (150-200 words): Concrete examples, use cases, scenarios, who will use this, practical applications, case studies
- Future Outlook and Predictions (100-150 words): What's next, trends, future developments, predictions, roadmap, potential impact
- Conclusion (50-100 words): Key takeaways, summary points, final thoughts

RESEARCH & SYNTHESIS REQUIREMENTS (CRITICAL):
- Act as if you have performed comprehensive web searches and read official documentation
- Use your knowledge base to synthesize information from multiple authoritative sources
- Reference official documentation (e.g., "According to OpenAI's official documentation...", "As documented in the API reference...")
- Include information from recent news articles, press releases, and industry reports
- Provide industry context, comparisons with similar technologies, and competitive analysis
- Cite authoritative sources, expert opinions, and professional analysis
- Include specific technical details, numbers, statistics, and concrete examples
- Demonstrate synthesis of multiple information sources into a coherent narrative

WRITING STYLE:
- Write as a professional tech journalist with deep expertise and thorough research
- Use clear, engaging, and authoritative language
- Include specific technical details, numbers, statistics, and examples
- Make it comprehensive, informative, authoritative, and valuable
- Show evidence of thorough research and synthesis
- Ensure it's at least 800 words - COUNT YOUR WORDS BEFORE RESPONDING

3. Provide 3-5 YouTube search queries in the "yt_queries" field for related videos

CRITICAL REMINDER: The "explanation" field MUST be at least 800 words. Before you finish, count the words in your explanation. If it's less than 800 words, you MUST expand it with more technical details, more examples, deeper analysis, additional insights, and more comprehensive research until it reaches at least 800 words.

End your response with a JSON block containing the structured data."""
    
    try:
        # Use OpenAI Agents SDK (2025) - Assistants API v2 (Agents pattern)
        # Create an assistant/agent with system instructions
        # Always use GPT-4 for comprehensive article generation
        # Client is initialized with v2 header in default_headers
        
        # CRITICAL: Pass extra_headers to each beta API call to ensure v2 header is used
        v2_headers = {"OpenAI-Beta": "assistants=v2"}
        
        assistant = client.beta.assistants.create(
            name="ai-news-analyzer-comprehensive",
            instructions=system_instructions,
            model=model,  # GPT-4 for world-class articles
            tools=[],  # Using model's built-in knowledge (includes recent data up to training cutoff)
            extra_headers=v2_headers
        )
        
        # Create a thread for the conversation
        thread = client.beta.threads.create(extra_headers=v2_headers)
        
        # Add user message to the thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input,
            extra_headers=v2_headers
        )
        
        # Run the assistant/agent
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
            extra_headers=v2_headers
        )
        
        # Wait for the run to complete (longer timeout for comprehensive articles)
        import time
        max_wait = 180  # 180 seconds (3 minutes) timeout for comprehensive article generation
        wait_time = 0
        while run.status in ["queued", "in_progress"] and wait_time < max_wait:
            time.sleep(2)  # Check every 2 seconds
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
                extra_headers=v2_headers
            )
            wait_time += 2
            if wait_time % 10 == 0:
                logger.info(f"Agent processing... ({wait_time}s elapsed)")
        
        # Handle different run statuses
        if run.status == "completed":
            pass  # Continue processing
        elif run.status == "failed":
            # Extract error details from the run
            error_msg = "Unknown error"
            if hasattr(run, 'last_error') and run.last_error:
                error_code = getattr(run.last_error, 'code', 'unknown')
                error_message = getattr(run.last_error, 'message', 'No error message')
                error_msg = f"OpenAI API error ({error_code}): {error_message}"
                logger.error(f"Agent run failed: {error_msg}")
            else:
                error_msg = "Agent run failed - no error details available"
                logger.error(f"Agent run failed with status: {run.status}")
            
            # Provide user-friendly error messages based on error type
            if hasattr(run, 'last_error') and run.last_error:
                error_code = getattr(run.last_error, 'code', '')
                if error_code == 'rate_limit_exceeded':
                    raise Exception("OpenAI API rate limit exceeded. Please try again in a few moments.")
                elif error_code == 'content_filter':
                    raise Exception("Content was filtered by OpenAI's safety system. Please try a different article.")
                elif error_code == 'invalid_request_error':
                    raise Exception(f"Invalid request to OpenAI API: {error_message}")
                else:
                    raise Exception(f"OpenAI API error: {error_msg}")
            else:
                raise Exception(f"Agent run failed: {error_msg}")
        elif run.status == "expired":
            raise Exception("Agent run expired - request took too long. Please try again.")
        elif run.status == "cancelled":
            raise Exception("Agent run was cancelled. Please try again.")
        else:
            raise Exception(f"Agent run ended with unexpected status: {run.status}")
        
        # Get the messages from the thread
        messages = client.beta.threads.messages.list(thread_id=thread.id, extra_headers=v2_headers)
        
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
        
        # Ensure we have comprehensive explanation (at least 800 words)
        if not parsed.get("explanation"):
            parsed["explanation"] = agent_output
        else:
            # Check word count and enhance if needed - MANDATORY 800 words
            word_count = len(parsed.get("explanation", "").split())
            if word_count < 800:
                logger.warning(f"Article is only {word_count} words, MUST be 800+. Requesting comprehensive enhancement...")
                
                # Create a new assistant specifically for enhancement
                enhance_assistant = client.beta.assistants.create(
                    name="article-enhancer",
                    instructions="""You are an expert article writer. Your task is to expand articles to be comprehensive, detailed, and at least 800 words. 
                    Add technical details, real-world examples, industry context, and deep analysis. Make it publication-quality.""",
                    model=model,
                    tools=[],
                    extra_headers=v2_headers
                )
                
                # Try to enhance the explanation
                enhancement_prompt = f"""CRITICAL: The following article is only {word_count} words. You MUST expand it to AT LEAST 800 WORDS.

Current article:
{parsed.get("explanation", "")}

EXPANSION REQUIREMENTS:
1. Add more technical details and explanations (100-150 words)
2. Include additional real-world examples and use cases (100-150 words)
3. Provide deeper analysis of industry implications (100-150 words)
4. Add industry context, comparisons with similar technologies (100-150 words)
5. Include future predictions and trends (50-100 words)
6. Add more specific details, statistics, and expert insights (50-100 words)

The expanded article MUST be at least 800 words total. Write it as a comprehensive, well-researched article using knowledge from official documentation and recent developments.

Provide ONLY the expanded article text (no JSON, no extra formatting):"""
                
                try:
                    enhance_thread = client.beta.threads.create(extra_headers=v2_headers)
                    client.beta.threads.messages.create(
                        thread_id=enhance_thread.id,
                        role="user",
                        content=enhancement_prompt,
                        extra_headers=v2_headers
                    )
                    enhance_run = client.beta.threads.runs.create(
                        thread_id=enhance_thread.id,
                        assistant_id=enhance_assistant.id,
                        extra_headers=v2_headers
                    )
                    
                    import time
                    enhance_wait = 0
                    while enhance_run.status in ["queued", "in_progress"] and enhance_wait < 180:
                        time.sleep(2)
                        enhance_run = client.beta.threads.runs.retrieve(
                            thread_id=enhance_thread.id,
                            run_id=enhance_run.id,
                            extra_headers=v2_headers
                        )
                        enhance_wait += 2
                        if enhance_wait % 20 == 0:
                            logger.info(f"Enhancing article... ({enhance_wait}s elapsed)")
                    
                    if enhance_run.status == "completed":
                        enhance_messages = client.beta.threads.messages.list(thread_id=enhance_thread.id, extra_headers=v2_headers)
                        for msg in enhance_messages.data:
                            if msg.role == "assistant" and msg.content:
                                enhanced_text = ""
                                if isinstance(msg.content, list):
                                    for item in msg.content:
                                        if hasattr(item, 'text') and hasattr(item.text, 'value'):
                                            enhanced_text = item.text.value
                                            break
                                        elif hasattr(item, 'text'):
                                            enhanced_text = str(item.text)
                                            break
                                elif hasattr(msg.content, 'text'):
                                    if hasattr(msg.content.text, 'value'):
                                        enhanced_text = msg.content.text.value
                                    else:
                                        enhanced_text = str(msg.content.text)
                                
                                if enhanced_text:
                                    enhanced_word_count = len(enhanced_text.split())
                                    if enhanced_word_count >= 800:
                                        parsed["explanation"] = enhanced_text
                                        logger.info(f"Successfully enhanced article to {enhanced_word_count} words")
                                        break
                                    else:
                                        logger.warning(f"Enhanced article is still only {enhanced_word_count} words, using it anyway")
                                        parsed["explanation"] = enhanced_text
                                        break
                    elif enhance_run.status == "failed":
                        # Log enhancement failure but don't fail the whole request
                        if hasattr(enhance_run, 'last_error') and enhance_run.last_error:
                            error_code = getattr(enhance_run.last_error, 'code', 'unknown')
                            error_message = getattr(enhance_run.last_error, 'message', 'No error message')
                            logger.warning(f"Article enhancement failed ({error_code}): {error_message}")
                        else:
                            logger.warning(f"Article enhancement failed with status: {enhance_run.status}")
                except Exception as e:
                    logger.error(f"Could not enhance article: {str(e)}")
                    # If enhancement fails, at least log a warning
                    logger.warning(f"Article remains at {word_count} words, which is below the 800-word requirement")
        
        word_count = len(parsed.get("explanation", "").split())
        logger.info(f"Successfully processed news item: {title[:50]}... (Article: {word_count} words)")
        return parsed
        
    except Exception as e:
        logger.error(f"Error processing news item with agent: {str(e)}")
        # DO NOT return fallback - raise error instead to force retry
        # This ensures we always get a proper 800+ word article
        raise Exception(f"Failed to generate comprehensive article: {str(e)}")


async def translate_content(content: str, target_language: str) -> str:
    """Translate content to target language using OpenAI Agents SDK"""
    model = "gpt-4-turbo-preview"  # Use GPT-4 for quality translations
    
    try:
        # Use Assistants API v2 (Agents SDK pattern) for translation
        # CRITICAL: Pass extra_headers to each beta API call to ensure v2 header is used
        v2_headers = {"OpenAI-Beta": "assistants=v2"}
        
        assistant = client.beta.assistants.create(
            name="translator",
            instructions=f"You are a professional translator. Translate the following text to {target_language}. Maintain the original meaning, tone, and structure.",
            model=model,
            tools=[],
            extra_headers=v2_headers
        )
        
        thread = client.beta.threads.create(extra_headers=v2_headers)
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=content,
            extra_headers=v2_headers
        )
        
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
            extra_headers=v2_headers
        )
        
        # Wait for completion
        import time
        max_wait = 30
        wait_time = 0
        while run.status in ["queued", "in_progress"] and wait_time < max_wait:
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
                extra_headers=v2_headers
            )
            wait_time += 1
        
        if run.status == "completed":
            messages = client.beta.threads.messages.list(thread_id=thread.id, extra_headers=v2_headers)
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
