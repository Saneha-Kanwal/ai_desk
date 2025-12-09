from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from datetime import datetime

from app.db import get_db, NewsItem, Video
from app.config import settings
from app.tasks import process_and_store_news_item

router = APIRouter(prefix="/admin", tags=["admin"])


def verify_admin_token(authorization: str = Header(None)):
    """Verify admin token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.replace("Bearer ", "")
        if token != settings.admin_token:
            raise HTTPException(status_code=403, detail="Invalid admin token")
        return token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authorization format")


@router.post("/seed")
async def seed_database(
    db: Session = Depends(get_db),
    token: str = Depends(verify_admin_token)
):
    """Seed database with sample AI news items"""
    sample_items = [
        {
            "title": "OpenAI Releases GPT-4 Turbo with Enhanced Capabilities",
            "url": "https://example.com/gpt4-turbo",
            "source": "AI News",
            "published_at": datetime.utcnow(),
            "summary": "OpenAI announces GPT-4 Turbo with improved performance and lower costs.",
            "content": "OpenAI has released GPT-4 Turbo, a more powerful and cost-effective version of their flagship language model. The new model offers enhanced reasoning capabilities, better instruction following, and reduced API costs. This update represents a significant advancement in accessible AI technology, making advanced language models more affordable for developers and businesses. The improvements include faster response times, larger context windows, and more accurate outputs across various tasks.",
            "tags": ["OpenAI", "GPT-4", "AI Models"]
        },
        {
            "title": "Google DeepMind's Gemini AI Model Shows Promise",
            "url": "https://example.com/gemini",
            "source": "Tech News",
            "published_at": datetime.utcnow(),
            "summary": "Google DeepMind unveils Gemini, a multimodal AI model competing with GPT-4.",
            "content": "Google DeepMind has introduced Gemini, a new multimodal AI model designed to understand and process text, images, audio, and video simultaneously. The model demonstrates strong performance across various benchmarks and represents Google's latest effort to compete in the advanced AI space. Gemini's multimodal capabilities enable it to perform complex tasks that require understanding multiple types of input, such as analyzing scientific papers with charts and graphs, or understanding video content with audio narration.",
            "tags": ["Google", "DeepMind", "Multimodal AI"]
        },
        {
            "title": "AI Regulation Framework Proposed by EU",
            "url": "https://example.com/eu-ai-regulation",
            "source": "Policy News",
            "published_at": datetime.utcnow(),
            "summary": "European Union proposes comprehensive AI regulation framework.",
            "content": "The European Union has proposed a comprehensive AI regulation framework aimed at ensuring safe and ethical AI development. The framework includes requirements for transparency, accountability, and risk assessment for high-risk AI systems. This represents one of the first major attempts to create comprehensive legislation for artificial intelligence, potentially setting a global standard for AI governance. The regulations would apply to AI systems used in critical sectors like healthcare, transportation, and finance.",
            "tags": ["Regulation", "EU", "AI Policy"]
        },
        {
            "title": "Anthropic's Claude AI Assistant Gains Enterprise Adoption",
            "url": "https://example.com/claude-enterprise",
            "source": "Business News",
            "published_at": datetime.utcnow(),
            "summary": "Anthropic's Claude AI sees growing adoption in enterprise environments.",
            "content": "Anthropic's Claude AI assistant is gaining traction in enterprise environments, with companies adopting it for customer service, content generation, and data analysis tasks. The model's focus on safety and helpfulness has made it attractive to businesses concerned about AI reliability and ethical considerations. Enterprise customers report improved efficiency in document processing, code generation, and customer interaction workflows.",
            "tags": ["Anthropic", "Claude", "Enterprise AI"]
        },
        {
            "title": "AI-Powered Drug Discovery Accelerates Pharmaceutical Research",
            "url": "https://example.com/ai-drug-discovery",
            "source": "Science News",
            "published_at": datetime.utcnow(),
            "summary": "AI models are revolutionizing drug discovery and development processes.",
            "content": "Artificial intelligence is transforming pharmaceutical research by accelerating drug discovery and development. AI models can predict molecular interactions, identify potential drug candidates, and optimize clinical trial designs. This technology has the potential to significantly reduce the time and cost of bringing new medications to market, which traditionally takes over a decade and billions of dollars. Recent breakthroughs include AI-discovered compounds showing promise in treating rare diseases and cancer.",
            "tags": ["AI Healthcare", "Drug Discovery", "Pharmaceuticals"]
        }
    ]
    
    created_count = 0
    for item_data in sample_items:
        try:
            # Check if already exists
            existing = db.query(NewsItem).filter(NewsItem.url == item_data["url"]).first()
            if existing:
                continue
            
            # Process through agent (this will generate AI summaries)
            result = await process_and_store_news_item(item_data, db)
            if result:
                created_count += 1
        except Exception as e:
            # Continue with other items if one fails
            continue
    
    return {
        "message": f"Seeded {created_count} news items",
        "total_provided": len(sample_items)
    }

