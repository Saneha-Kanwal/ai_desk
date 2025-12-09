# Project Structure

```
ai_desk/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── config.py          # Configuration & settings
│   │   ├── db.py              # Database models & connection
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── agents.py          # OpenAI Agents SDK wrapper
│   │   ├── ingest.py          # News ingestion (RSS + APIs)
│   │   ├── tasks.py           # Background tasks & processing
│   │   ├── youtube.py          # YouTube API integration
│   │   └── routers/           # API route handlers
│   │       ├── __init__.py
│   │       ├── news.py        # News endpoints
│   │       ├── admin.py       # Admin endpoints
│   │       └── health.py      # Health check
│   ├── alembic/               # Database migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── 001_initial.py
│   ├── tests/                 # Backend tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_api.py
│   │   ├── test_agents.py
│   │   └── test_ingest.py
│   ├── alembic.ini            # Alembic configuration
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend Docker image
│   └── run_server.sh          # Development server script
│
├── frontend/                   # Next.js frontend application
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   └── news/
│   │       └── [id]/
│   │           └── page.tsx   # News detail page
│   ├── components/            # React components
│   │   ├── NewsCard.tsx      # News card component
│   │   └── SearchBar.tsx     # Search bar component
│   ├── lib/                  # Utilities
│   │   └── api.ts            # API client
│   ├── tests/                # Frontend tests
│   │   └── example.spec.ts   # Playwright E2E tests
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   ├── next.config.js        # Next.js configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration
│   ├── playwright.config.ts  # Playwright configuration
│   ├── Dockerfile            # Frontend Docker image
│   └── run_frontend.sh       # Development server script
│
├── scripts/                   # Helper scripts
│   ├── migrate.sh            # Run database migrations
│   └── seed.sh               # Seed sample data
│
├── docker-compose.yml        # Docker Compose configuration
├── start_dev.sh              # Start all services
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # Main documentation
├── SETUP.md                  # Setup instructions
└── PROJECT_STRUCTURE.md     # This file
```

## Key Files Explained

### Backend

- **`app/main.py`**: FastAPI application with lifespan management, scheduler setup, and route registration
- **`app/agents.py`**: OpenAI integration for generating summaries, explanations, and translations
- **`app/ingest.py`**: RSS feed parsing and custom API integration for news ingestion
- **`app/tasks.py`**: Background processing of news items through AI agents
- **`app/youtube.py`**: YouTube Data API integration for video recommendations

### Frontend

- **`app/page.tsx`**: Home page with news cards, search, and pagination
- **`app/news/[id]/page.tsx`**: News detail page with translation support
- **`lib/api.ts`**: TypeScript API client for backend communication
- **`components/NewsCard.tsx`**: Reusable news card component

### Configuration

- **`.env`**: Environment variables (not in repo, copy from `.env.example`)
- **`docker-compose.yml`**: Orchestrates PostgreSQL, backend, and frontend
- **`alembic/versions/001_initial.py`**: Initial database schema migration

## Data Flow

1. **Ingestion**: RSS feeds → `ingest.py` → Raw news items
2. **Processing**: Raw items → `tasks.py` → AI agent (`agents.py`) → Processed items
3. **Storage**: Processed items → Database (PostgreSQL)
4. **Display**: Database → API (`routers/news.py`) → Frontend (`lib/api.ts`) → UI

## Scheduled Tasks

- **News Ingestion**: Runs every 5 minutes via APScheduler
- **Lightweight Check**: Triggered on each home page request (non-blocking)

