# Quick Start Guide

## Resolving Connection Errors

If you see `ERR_CONNECTION_REFUSED` errors, it means the backend server is not running. Follow these steps:

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
./start_backend.sh
```

This script will:
- Check for `.env` file
- Create virtual environment if needed
- Install dependencies
- Verify database connection
- Start the FastAPI server on port 8000

**Expected output:**
```
✅ Database connection successful
🚀 Starting backend server on port 8000...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Verify Backend is Running

In another terminal, test the backend:

```bash
curl http://localhost:8000/api/health
```

You should see:
```json
{"status":"healthy","service":"ai-desk-backend"}
```

### Step 3: Start the Frontend

In a new terminal:

```bash
cd frontend
npm install  # First time only
npm run dev
```

The frontend will start on http://localhost:3000

## Troubleshooting

### Backend won't start

1. **Check PostgreSQL is running:**
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. **Check environment variables:**
   ```bash
   cat .env | grep -v '^#'
   ```
   Ensure `OPENAI_API_KEY` and `DATABASE_URL` are set.

3. **Check port 8000 is available:**
   ```bash
   lsof -i :8000
   ```
   If something is using it, either stop that process or change `BACKEND_PORT` in `.env`.

### Frontend shows connection errors

1. **Verify backend is running:**
   - Visit http://localhost:8000/docs
   - You should see the API documentation

2. **Check API URL in frontend:**
   - The frontend uses `NEXT_PUBLIC_API_URL` or defaults to `http://localhost:8000`
   - Make sure this matches your backend URL

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for CORS errors
   - Backend should allow `http://localhost:3000` in CORS settings

### Database connection errors

1. **PostgreSQL not running:**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start postgresql
   
   # macOS (Homebrew)
   brew services start postgresql
   ```

2. **Wrong DATABASE_URL:**
   - Format: `postgresql://user:password@host:port/database`
   - Example: `postgresql://postgres:postgres@localhost:5432/ai_deskl`

3. **Database doesn't exist:**
   ```bash
   createdb ai_deskl
   ```

## Common Issues

### "Module not found" errors

Install dependencies:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Port already in use"

Change the port in `.env`:
```env
BACKEND_PORT=8001
```

Then update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### OpenAI API errors

- Verify your API key is correct
- Check you have credits/quota
- Review backend logs for specific error messages

## Development Workflow

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   ./start_backend.sh
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Terminal 3 - Database (if needed):**
   ```bash
   # Run migrations
   ./scripts/migrate.sh
   
   # Seed data
   ./scripts/seed.sh
   ```

## Testing the Setup

1. **Backend health check:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Frontend:**
   - Visit http://localhost:3000
   - Should see the AI Desk homepage
   - No connection errors in console

3. **API documentation:**
   - Visit http://localhost:8000/docs
   - Try the `/api/health` endpoint

4. **Authentication:**
   - Click "Sign Up" on the frontend
   - Create an account
   - Login and verify you see your email in the header

