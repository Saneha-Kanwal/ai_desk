# Environment Setup Guide

## Quick Setup

The `.env` file has been created from `.env.example`. You need to:

1. **Add your OpenAI API key** (already filled in your case)
2. **Verify database connection** (already configured)
3. **Set admin token** (optional, for admin endpoints)

## Current Configuration

Your `.env` file contains:
- ✅ OpenAI API Key: Already set
- ✅ Database URL: `postgresql://postgres:123456@localhost:5432/ai_deskl`

## Next Steps

### 1. Install Python Virtual Environment (Recommended)

```bash
sudo apt install python3-venv
```

This allows the backend to use an isolated Python environment.

### 2. Start the Backend

```bash
cd backend
./start_backend.sh
```

If `python3-venv` is not installed, the script will use system Python (less ideal but works).

### 3. Run Database Migrations

```bash
./scripts/migrate.sh
```

### 4. Start Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Virtual Environment Issues

If you see "ensurepip is not available":
```bash
sudo apt install python3-venv python3-pip
```

### Database Connection

Test your database connection:
```bash
psql postgresql://postgres:123456@localhost:5432/ai_deskl -c "SELECT 1"
```

### Port Already in Use

If port 8000 is busy:
```bash
lsof -ti:8000 | xargs kill
```

Or change `BACKEND_PORT` in `.env`.

