# Quick Setup Guide

## Prerequisites

1. **Python 3.11+** - Install from [python.org](https://www.python.org/)
2. **Node.js 18+** - Install from [nodejs.org](https://nodejs.org/)
3. **PostgreSQL 14+** - Install from [postgresql.org](https://www.postgresql.org/) or use Docker
4. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com/api-keys)
5. **YouTube API Key (Optional)** - Get from [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your keys
nano .env  # or use your preferred editor
```

Required variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_TOKEN` - A secure token for admin endpoints

Optional:
- `YOUTUBE_API_KEY` - For YouTube video integration
- `AGENT_MODE` - Set to `cheap` for development (uses GPT-3.5)

### 2. Database Setup

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d postgres
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb ai_deskl

# Or using psql
psql -U postgres -c "CREATE DATABASE ai_deskl;"
```

### 3. Run Migrations

```bash
./scripts/migrate.sh
```

### 4. Start Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
./run_server.sh
```

The backend will start on http://localhost:8000

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:3000

### 6. Seed Sample Data (Optional)

In a new terminal:
```bash
./scripts/seed.sh
```

Or manually:
```bash
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/admin/seed
```

## Using Docker Compose (All-in-One)

```bash
# Make sure .env is configured
cp .env.example .env
# Edit .env with your keys

# Start all services
./start_dev.sh
```

This will start:
- PostgreSQL on port 5432
- Backend on port 8000
- Frontend on port 3000

## Verifying Installation

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **API Documentation:**
   Visit http://localhost:8000/docs

3. **Frontend:**
   Visit http://localhost:3000

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1"
```

### Port Already in Use

Change ports in `.env`:
```env
BACKEND_PORT=8001
FRONTEND_PORT=3001
```

### OpenAI API Errors

- Verify your API key is correct
- Check your OpenAI account has credits
- Review logs in the backend terminal

### YouTube API (Optional)

If you don't have a YouTube API key:
- The system will still work
- Videos will show as search links instead of direct embeds
- You can add the key later without restarting

## Next Steps

1. Customize RSS feeds in `backend/app/ingest.py`
2. Adjust agent prompts in `backend/app/agents.py`
3. Customize UI in `frontend/app/` and `frontend/components/`
4. Add more news sources or APIs

## Getting API Keys

### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key to your `.env` file

### YouTube Data API Key (Optional)

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the key to your `.env` file

## Development Tips

- Use `AGENT_MODE=cheap` during development to save costs
- Check backend logs for ingestion status
- Use the `/admin/seed` endpoint to quickly populate test data
- The scheduler runs ingestion every 5 minutes automatically

