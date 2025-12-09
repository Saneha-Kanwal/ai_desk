# Complete Setup Guide - AI Desk

## ✅ Current Status

- ✅ `.env` file created and configured
- ✅ Database connection verified
- ✅ Backend configuration fixed
- ✅ Startup scripts ready

## 🚀 Quick Start

### Step 1: Start Backend Server

Open Terminal 1:
```bash
cd ~/Documents/ai_desk/backend
./start_backend.sh
```

You should see:
```
✅ Database connection successful
🚀 Starting backend server on port 8000...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!**

### Step 2: Run Database Migrations (First Time Only)

Open Terminal 2:
```bash
cd ~/Documents/ai_desk
./scripts/migrate.sh
```

This creates the database tables (users, news, videos).

### Step 3: Seed Sample Data (Optional)

```bash
cd ~/Documents/ai_desk
./scripts/seed.sh
```

Or manually:
```bash
export $(cat .env | grep -v '^#' | xargs)
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8000/admin/seed
```

### Step 4: Start Frontend

Open Terminal 3:
```bash
cd ~/Documents/ai_desk/frontend
npm install  # First time only
npm run dev
```

You should see:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📋 Verification Checklist

- [ ] Backend server running (Terminal 1 shows "Uvicorn running")
- [ ] Database migrations completed
- [ ] Frontend server running (Terminal 3 shows "Ready")
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/docs
- [ ] No connection errors in browser console

## 🔧 Troubleshooting

### Backend won't start

1. **Check PostgreSQL:**
   ```bash
   psql postgresql://postgres:123456@localhost:5432/ai_deskl -c "SELECT 1"
   ```

2. **Check .env file:**
   ```bash
   cat .env | grep -v '^#'
   ```

3. **Check port availability:**
   ```bash
   lsof -i :8000
   ```

### Frontend connection errors

1. Ensure backend is running (check Terminal 1)
2. Verify backend health:
   ```bash
   curl http://localhost:8000/api/health
   ```
3. Check browser console for specific errors

### Database migration errors

```bash
cd backend
source venv/bin/activate  # or use system Python
alembic upgrade head
```

## 📝 Environment Variables

Your `.env` file should contain:

```env
OPENAI_API_KEY=sk-proj-...
DATABASE_URL=postgresql://postgres:123456@localhost:5432/ai_deskl
ADMIN_TOKEN=dev-admin-token-change-in-production
YOUTUBE_API_KEY=  # Optional
AGENT_MODE=detailed
BACKEND_PORT=8000
FRONTEND_PORT=3000
ENVIRONMENT=development
```

## 🎯 Features Available

Once everything is running:

1. **Home Page** (`/`) - Browse AI news articles
2. **Search** - Search articles by title, content, or tags
3. **Article Details** (`/news/[id]`) - Read full article with AI explanations
4. **Authentication** (`/login`, `/register`) - Create account and login
5. **Translation** - Translate articles to different languages
6. **YouTube Videos** - Related video recommendations

## 🛑 Stopping Servers

- **Backend**: Press `Ctrl+C` in Terminal 1
- **Frontend**: Press `Ctrl+C` in Terminal 3

## 📚 Additional Resources

- `README.md` - Full documentation
- `QUICK_START.md` - Quick reference
- `TROUBLESHOOTING.md` - Common issues and solutions
- `SETUP_ENV.md` - Environment setup details

## ✨ Next Steps

1. Start both servers (backend + frontend)
2. Visit http://localhost:3000
3. Register an account
4. Browse AI news articles
5. Explore the features!

Enjoy using AI Desk! 🚀

