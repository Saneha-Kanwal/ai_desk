# Troubleshooting Guide

## Backend Connection Errors

### Error: `ERR_CONNECTION_REFUSED`

This means the backend server is not running. 

**Solution:**
```bash
cd backend
./start_backend.sh
```

**Verify it's running:**
```bash
curl http://localhost:8000/api/health
```

Should return: `{"status":"healthy","service":"ai-desk-backend"}`

### Error: Browser Extension Warnings

Warnings like `data-liner-extension-version` or `cz-shortcut-listen` are from browser extensions and are harmless. They've been suppressed in the code.

### Error: 404 for favicon

Fixed! A favicon has been added. Clear your browser cache if you still see the error.

## Common Issues

### Backend won't start

1. **Check PostgreSQL:**
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. **Check environment variables:**
   ```bash
   cat .env | grep -v '^#'
   ```

3. **Check port availability:**
   ```bash
   lsof -i :8000
   ```

### Frontend shows connection errors

1. Make sure backend is running (see above)
2. Check browser console for specific errors
3. Verify `NEXT_PUBLIC_API_URL` matches backend URL

### Registration/Login fails

1. Ensure backend is running
2. Check error message - it will tell you if backend is offline
3. Verify database is accessible
4. Check backend logs for detailed errors

## Quick Fixes

**Restart everything:**
```bash
# Terminal 1 - Backend
cd backend && ./start_backend.sh

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

**Check backend status:**
Visit http://localhost:8000/docs - if you see API docs, backend is running.

**Check frontend:**
Visit http://localhost:3000 - should see the homepage without connection errors.
