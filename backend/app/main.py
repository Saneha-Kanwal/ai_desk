from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import settings
from app.db import engine, Base
from app.routers import news, admin, health, auth
from app.tasks import ingest_and_process_news

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
    logger.info("Starting AI Desk backend...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified")
    
    # Start scheduler for periodic ingestion
    scheduler.add_job(
        ingest_and_process_news,
        "interval",
        minutes=5,
        id="ingest_news",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started (ingestion every 5 minutes)")
    
    # Run initial ingestion
    try:
        await ingest_and_process_news()
    except Exception as e:
        logger.warning(f"Initial ingestion failed: {str(e)}")
    
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

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(news.router)
app.include_router(admin.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Desk API",
        "version": "1.0.0",
        "docs": "/docs"
    }

