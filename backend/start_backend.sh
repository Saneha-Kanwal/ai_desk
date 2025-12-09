#!/bin/bash

# Script to start the backend server
# Make sure you're in the backend directory or adjust paths accordingly

cd "$(dirname "$0")"

# Check if .env exists in parent directory
if [ ! -f ../.env ]; then
    echo "⚠️  .env file not found in parent directory"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Load environment variables
export $(cat ../.env | grep -v '^#' | xargs)

# Check for virtual environment
USE_VENV=true
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    if python3 -m venv venv 2>/dev/null; then
        USE_VENV=true
    else
        echo "⚠️  Virtual environment creation failed."
        echo "💡 Installing python3-venv..."
        echo "   Run: sudo apt install python3-venv"
        echo ""
        echo "📦 Attempting to continue with system Python..."
        USE_VENV=false
    fi
fi

# Activate virtual environment if it exists
if [ "$USE_VENV" = "true" ] && [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Using virtual environment"
else
    echo "⚠️  Using system Python (install python3-venv for isolation)"
    # Check if we can use pip3 directly
    if ! command -v pip3 &> /dev/null; then
        echo "❌ pip3 not found. Please install Python pip."
        exit 1
    fi
fi

# Install/update dependencies
echo "📦 Installing dependencies..."
if [ "$USE_VENV" = "true" ] && [ -d "venv" ]; then
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
else
    pip3 install -q --user --upgrade pip
    pip3 install -q --user -r requirements.txt
fi

# Check database connection
echo "🔍 Checking database connection..."
python3 -c "
import sys
sys.path.insert(0, '.')
from app.config import settings
from sqlalchemy import create_engine, text
try:
    engine = create_engine(settings.database_url)
    with engine.connect() as conn:
        result = conn.execute(text('SELECT 1'))
        result.fetchone()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    print('Please ensure PostgreSQL is running and DATABASE_URL is correct')
    sys.exit(1)
" || exit 1

# Start the server
echo "🚀 Starting backend server on port ${BACKEND_PORT:-8000}..."
uvicorn app.main:app --reload --host 0.0.0.0 --port ${BACKEND_PORT:-8000}

