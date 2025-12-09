# How to Start the Backend Server

## Quick Start

```bash
cd backend
./start_backend.sh
```

## What the Script Does

1. ✅ Checks for `.env` file in parent directory
2. ✅ Creates Python virtual environment if needed
3. ✅ Installs/updates dependencies
4. ✅ Verifies database connection
5. ✅ Starts FastAPI server on port 8000

## Manual Start (Alternative)

If the script doesn't work, start manually:

```bash
cd backend

# Create virtual environment (first time only)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --port 8000
```

## Verify Backend is Running

1. **Check the terminal output:**
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   INFO:     Application startup complete.
   ```

2. **Test the health endpoint:**
   ```bash
   curl http://localhost:8000/api/health
   ```
   Should return: `{"status":"healthy","service":"ai-desk-backend"}`

3. **Visit API docs:**
   Open http://localhost:8000/docs in your browser

## Common Issues

### "Database connection failed"
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env` is correct
- Verify database exists: `createdb ai_deskl`

### "Port 8000 already in use"
- Change `BACKEND_PORT` in `.env` to a different port
- Or kill the process using port 8000:
  ```bash
  lsof -ti:8000 | xargs kill
  ```

### "Module not found"
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

### "OPENAI_API_KEY not set"
- Add your OpenAI API key to `.env` file:
  ```env
  OPENAI_API_KEY=sk-your-key-here
  ```

## Next Steps

Once backend is running:
1. Start frontend in another terminal: `cd frontend && npm run dev`
2. Visit http://localhost:3000
3. The frontend will automatically connect to the backend

