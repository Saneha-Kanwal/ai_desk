from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import settings
from app.routers import news, health, auth_memory
from app.routers.news import fetch_and_store_news

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize scheduler
scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    # Startup
    logger.info("Starting AI Desk backend (no database - all on-the-fly)...")
    
    # Start scheduler for periodic news fetching (in-memory storage)
    scheduler.add_job(
        fetch_and_store_news,
        "interval",
        minutes=10,
        id="fetch_news",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started (fetching news every 10 minutes)")
    
    # Run initial news fetch
    try:
        await fetch_and_store_news()
    except Exception as e:
        logger.warning(f"Initial news fetch failed: {str(e)}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Desk backend...")
    scheduler.shutdown()


# Create FastAPI app
app = FastAPI(
    title="AI Desk API",
    description="AI News Aggregator & Explainer API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Allow requests from frontend on any port
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(auth_memory.router)  # JWT auth with in-memory storage
app.include_router(news.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Desk API",
        "version": "1.0.0",
        "docs": "/docs"
    }

