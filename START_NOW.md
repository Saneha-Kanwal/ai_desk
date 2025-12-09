# 🚀 Start AI Desk Now

## Current Status

✅ **Frontend**: Running on http://localhost:3000  
❌ **Backend**: Not running (needs to be started)

## Quick Start (3 Steps)

### 1️⃣ Start Backend Server

Open a new terminal and run:

```bash
cd ~/Documents/ai_desk/backend
./start_backend.sh
```

**Wait for this message:**
```
✅ Database connection successful
🚀 Starting backend server on port 8000...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!**

### 2️⃣ Run Database Migrations (First Time Only)

Open another terminal:

```bash
cd ~/Documents/ai_desk
./scripts/migrate.sh
```

This creates the database tables.

### 3️⃣ Verify Everything Works

1. **Check Backend**: Visit http://localhost:8000/docs
   - Should show API documentation
   
2. **Check Frontend**: Visit http://localhost:3000
   - Should show AI Desk homepage
   - No connection errors in browser console

## 🎯 What You Can Do Now

Once backend is running:

1. **Browse News**: Visit http://localhost:3000
2. **Register Account**: Click "Sign Up" in the header
3. **Login**: Use your credentials to login
4. **Search**: Use the search bar to find articles
5. **Read Articles**: Click any news card to read details
6. **Translate**: Use the translation buttons on article pages

## 🔍 Verify Backend is Running

```bash
curl http://localhost:8000/api/health
```

Should return: `{"status":"healthy","service":"ai-desk-backend"}`

## ⚠️ Common Issues

### "ERR_CONNECTION_REFUSED" in Browser

**Solution**: Backend is not running. Start it with:
```bash
cd backend && ./start_backend.sh
```

### "Database connection failed"

**Solution**: 
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify DATABASE_URL in `.env` is correct
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### "Port 8000 already in use"

**Solution**:
```bash
lsof -ti:8000 | xargs kill
```

Or change `BACKEND_PORT` in `.env` to a different port.

## 📝 Terminal Setup

You'll need **3 terminals**:

**Terminal 1 - Backend:**
```bash
cd ~/Documents/ai_desk/backend
./start_backend.sh
```

**Terminal 2 - Migrations (one-time):**
```bash
cd ~/Documents/ai_desk
./scripts/migrate.sh
```

**Terminal 3 - Frontend (if not already running):**
```bash
cd ~/Documents/ai_desk/frontend
npm run dev
```

## ✅ Success Indicators

- ✅ Backend terminal shows "Uvicorn running"
- ✅ http://localhost:8000/docs loads API documentation
- ✅ http://localhost:3000 loads without errors
- ✅ No red errors in browser console
- ✅ Can register/login successfully

## 🎉 You're Ready!

Once both servers are running, visit **http://localhost:3000** and start exploring!

For detailed documentation, see `COMPLETE_SETUP.md` or `README.md`.

