# AI Desk - AI News Aggregator & Explainer

A full-stack AI news website that aggregates the latest AI-related news, generates intelligent summaries and explanations using OpenAI Agents, and provides relevant YouTube video recommendations.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.11+), Uvicorn
- **Database**: PostgreSQL
- **AI**: OpenAI Agents SDK (2025) - Agents API
- **Authentication**: JWT token-based (email/password)
- **Optional**: YouTube Data API v3

## Features

- 📰 Real-time AI news aggregation from RSS feeds and APIs
- 🤖 AI-generated summaries and detailed explanations using OpenAI Agents SDK
- 🔐 Token-based authentication (email/password)
- 🎥 YouTube video recommendations
- 🔍 Search and pagination
- 🌐 Multi-language translation support
- 📱 Responsive, modern UI

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (or Docker)
- OpenAI API key

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd ai_desk
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and set required variables:**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_deskl
   ADMIN_TOKEN=your_admin_token_here
   YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
   AGENT_MODE=detailed  # or 'cheap' for lighter usage
   ```

4. **Start services:**
   ```bash
   ./start_dev.sh
   ```
   
   Or manually:
   ```bash
   # Ensure PostgreSQL is running locally
   # Run migrations
   ./scripts/migrate.sh
   
   # Seed sample data (optional)
   curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8000/admin/seed
   
   # Start backend (in one terminal)
   cd backend
   ./start_backend.sh
   
   # Or manually:
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   
   # Start frontend (in another terminal)
   cd frontend
   npm install
   npm run dev
   ```

5. **Visit the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Project Structure

```
ai_desk/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── db.py             # Database models & connection
│   │   ├── schemas.py        # Pydantic models
│   │   ├── agents.py         # OpenAI Agents SDK wrapper
│   │   ├── ingest.py         # News ingestion (RSS + APIs)
│   │   ├── tasks.py          # Background tasks & scheduler
│   │   └── routers/
│   │       ├── news.py       # News endpoints
│   │       ├── admin.py      # Admin endpoints
│   │       └── health.py     # Health check
│   ├── alembic/              # Database migrations
│   ├── tests/                # Backend tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── run_server.sh
├── frontend/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Home page
│   │   ├── news/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Detail page
│   │   └── api/              # API routes (if needed)
│   ├── components/           # React components
│   ├── lib/                  # Utilities & API client
│   ├── tests/                # Frontend tests
│   ├── package.json
│   └── run_frontend.sh
├── scripts/
│   ├── migrate.sh
│   └── seed.sh
├── .env.example
├── start_dev.sh
└── README.md
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_TOKEN` | Yes | Token for admin endpoints |
| `YOUTUBE_API_KEY` | No | YouTube Data API v3 key (optional) |
| `AGENT_MODE` | No | `detailed` (default) or `cheap` |
| `BACKEND_PORT` | No | Backend port (default: 8000) |
| `FRONTEND_PORT` | No | Frontend port (default: 3000) |

### Agent Modes

- **`detailed`**: Uses GPT-4 or GPT-4-turbo for comprehensive explanations
- **`cheap`**: Uses GPT-3.5-turbo for faster, cheaper summaries

## API Endpoints

### Public

- `GET /api/news` - List news items (with pagination & search)
- `GET /api/news/{id}` - Get news item details
- `GET /api/health` - Health check

### Authentication

- `POST /api/auth/register` - Register a new user (email, password)
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires authentication)

### Admin

- `POST /admin/seed` - Seed database with sample data (requires `Authorization: Bearer {ADMIN_TOKEN}`)

## Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

**Backend:**
```bash
cd backend
pytest tests/
```

**Frontend:**
```bash
cd frontend
npm run test:e2e  # Playwright tests
```

## Deployment

### Manual Deployment

1. Set up PostgreSQL database
2. Run migrations: `./scripts/migrate.sh`
3. Deploy backend (FastAPI + Uvicorn)
4. Deploy frontend (Next.js build)
5. Configure reverse proxy (nginx) if needed

## Cost Considerations

### OpenAI Token Usage

- **Per news item processing:**
  - Input: ~2,000-5,000 tokens (article content)
  - Output: ~500-1,500 tokens (summary + explanation)
  - **Estimated cost per item**: $0.01-0.05 (GPT-4) or $0.001-0.005 (GPT-3.5)

- **Recommendations:**
  - Use `AGENT_MODE=cheap` for development
  - Implement caching to avoid reprocessing
  - Rate limit ingestion to control costs

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and `DATABASE_URL` is correct:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### OpenAI API Errors

- Verify `OPENAI_API_KEY` is set correctly
- Check API quota and billing
- Review logs for specific error messages

### YouTube API (Optional)

If `YOUTUBE_API_KEY` is not provided, the system will:
- Still function normally
- Show suggested search queries instead of direct video links
- Allow manual YouTube searches

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

# ai_desk
