# Quick Start Guide: Complete AI News Aggregator Platform

**Date**: 2025-01-27  
**Feature**: Complete AI News Aggregator Platform

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ installed
- OpenAI API key
- (Optional) YouTube Data API v3 key

## Environment Setup

1. **Create `.env` file in project root**:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET_KEY=your_secret_key_here_min_32_chars

# Optional
YOUTUBE_API_KEY=your_youtube_api_key_here
ADMIN_TOKEN=your_admin_token_here
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

## Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Start backend server**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`  
API docs available at: `http://localhost:8000/docs`

## Frontend Setup

1. **Navigate to frontend directory** (in new terminal):
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## First Steps

### 1. Verify Backend Health

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{"status": "healthy"}
```

### 2. Create User Account

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword123"}'
```

Expected response:
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "is_active": true,
  "is_verified": false,
  "created_at": "2025-01-27T10:00:00Z"
}
```

### 3. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword123"}' \
  -c cookies.txt
```

Expected response:
```json
{
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

Cookie will be stored in `cookies.txt` file.

### 4. Fetch News Articles

```bash
curl http://localhost:8000/api/news?page=1&page_size=20
```

Expected response:
```json
{
  "items": [
    {
      "id": "uuid-here",
      "title": "Article Title",
      "url": "https://...",
      "source": "Source Name",
      "published_at": "2025-01-27T10:00:00Z",
      "summary": "Article summary...",
      "category": "AI-Related News",
      "thumbnail": "https://...",
      "tags": ["tag1", "tag2"],
      "created_at": "2025-01-27T10:00:00Z",
      "updated_at": "2025-01-27T10:00:00Z",
      "videos": []
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "has_more": true
}
```

### 5. Get Article with Generated Content

```bash
curl http://localhost:8000/api/news/{article-id} \
  -H "Authorization: Bearer {jwt-token}" \
  -b cookies.txt
```

Expected response includes `content` field with 800+ word article.

## Frontend Usage

1. **Open browser**: Navigate to `http://localhost:3000`

2. **Browse news**: Homepage displays news cards automatically

3. **Filter by category**: Click category tabs (AI-Related News, Inventions, Technologies, Breakthroughs)

4. **View article**: Click any news card to generate and view comprehensive article

5. **Register/Login**: Use header buttons to create account or login

## Development Workflow

### Backend Development

- Backend auto-reloads on file changes (--reload flag)
- Check logs in terminal for errors
- API docs at `/docs` for interactive testing
- Tests: `pytest tests/`

### Frontend Development

- Frontend hot-reloads on file changes
- Check browser console for errors
- TypeScript type checking: `npm run build`
- E2E tests: `npm run test:e2e`

## Common Issues

### Backend won't start

- Check Python version: `python3 --version` (must be 3.11+)
- Verify virtual environment is activated
- Check `.env` file exists with `OPENAI_API_KEY`
- Verify port 8000 is not in use

### Frontend won't start

- Check Node.js version: `node --version` (must be 18+)
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check port 3000 is not in use

### News not loading

- Verify backend is running on port 8000
- Check backend logs for RSS feed errors
- Verify network connectivity
- Check CORS settings in backend

### Article generation fails

- Verify `OPENAI_API_KEY` is valid
- Check OpenAI API quota/balance
- Review backend logs for error details
- Ensure article meets 800+ word requirement (retry logic handles this)

### Authentication issues

- Verify JWT_SECRET_KEY is set in `.env`
- Check cookie settings (HttpOnly, Secure, SameSite)
- Clear browser cookies and try again
- Verify user exists in in-memory storage

## Next Steps

- Review [data-model.md](./data-model.md) for entity definitions
- Check [contracts/api.yaml](./contracts/api.yaml) for API specification
- See [spec.md](./spec.md) for complete feature requirements
- Review [plan.md](./plan.md) for implementation details

## Production Deployment

**Note**: This system uses in-memory storage. For production:

1. Consider file-based persistence for user accounts
2. Implement proper logging and monitoring
3. Set up reverse proxy (nginx) for frontend
4. Configure HTTPS/SSL certificates
5. Set up environment-specific `.env` files
6. Implement rate limiting for API endpoints
7. Add error tracking (Sentry, etc.)

---

**Happy Coding!** 🚀

