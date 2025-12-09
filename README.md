# AI Desk - AI News Aggregator & Explainer

A full-stack AI news website that aggregates the latest AI-related news, generates intelligent summaries and explanations using OpenAI Agents, and provides relevant YouTube video recommendations.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.11+), Uvicorn
- **Storage**: In-memory (no database required)
- **AI**: OpenAI Agents SDK (2025) - Assistants API v2
- **Authentication**: JWT token-based (email/password) with in-memory storage
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
- OpenAI API key
- **No database required** - uses in-memory storage

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
   JWT_SECRET_KEY=your_secret_key_here_min_32_chars
   ADMIN_TOKEN=your_admin_token_here
   YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
   BACKEND_PORT=8000  # Optional, defaults to 8000
   FRONTEND_PORT=3000  # Optional, defaults to 3000
   ```

4. **Start services:**
   
   **Start backend (in one terminal):**
   ```bash
   cd backend
   ./start_backend.sh
   ```
   
   Or manually:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
   
   **Start frontend (in another terminal):**
   ```bash
   cd frontend
   ./run_frontend.sh
   ```
   
   Or manually:
   ```bash
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
│   │   ├── config.py         # Configuration & environment variables
│   │   ├── storage.py        # In-memory news storage
│   │   ├── auth_memory.py    # In-memory authentication storage
│   │   ├── schemas.py        # Pydantic models
│   │   ├── agents.py         # OpenAI Assistants API v2 wrapper
│   │   ├── ingest.py         # News ingestion (RSS feeds)
│   │   ├── youtube.py        # YouTube API integration (optional)
│   │   └── routers/
│   │       ├── news.py       # News endpoints
│   │       ├── auth_memory.py # Authentication endpoints
│   │       └── health.py     # Health check
│   ├── tests/                # Backend tests
│   ├── requirements.txt
│   └── start_backend.sh
├── frontend/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Home page
│   │   ├── news/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Article detail page
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   └── register/
│   │       └── page.tsx      # Registration page
│   ├── components/           # React components
│   │   ├── NewsCard.tsx
│   │   ├── CategoryNavbar.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── lib/                  # Utilities & API client
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── public/               # Static assets
│   ├── package.json
│   └── run_frontend.sh
├── .env.example
└── README.md
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `JWT_SECRET_KEY` | Yes | Secret key for JWT tokens (minimum 32 characters) |
| `ADMIN_TOKEN` | Yes | Token for admin endpoints |
| `YOUTUBE_API_KEY` | No | YouTube Data API v3 key (optional) |
| `BACKEND_PORT` | No | Backend port (default: 8000) |
| `FRONTEND_PORT` | No | Frontend port (default: 3000) |
| `ENVIRONMENT` | No | Environment name (default: development) |

### Storage

This project uses **in-memory storage** - no database required! All data is stored in memory during runtime:
- News articles are fetched from RSS feeds and stored in memory
- User accounts are stored in memory (will be lost on server restart)
- Articles are generated on-the-fly when requested (not stored)

## API Endpoints

### Public

- `GET /api/news` - List news items (with pagination & search)
- `GET /api/news/{id}` - Get news item details
- `GET /api/health` - Health check

### Authentication

- `POST /api/auth/register` - Register a new user (email, password)
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires authentication)

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token (stored in HttpOnly cookie)
- `GET /api/auth/me` - Get current user info (requires authentication)
- `POST /api/auth/logout` - Logout and clear JWT cookie

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

1. Set environment variables in `.env`
2. Deploy backend (FastAPI + Uvicorn)
3. Deploy frontend (Next.js build)
4. Configure reverse proxy (nginx) if needed

**Note**: Since this uses in-memory storage, data will be lost on server restart. For production, consider:
- Implementing persistent storage (file-based or database)
- Using a process manager (PM2, systemd) to keep the server running
- Setting up periodic backups if needed

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
# ai_desk
