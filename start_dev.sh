#!/bin/bash

set -e

echo "🚀 Starting AI Desk development environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your OPENAI_API_KEY and other required variables"
    echo "Press Enter to continue after editing .env, or Ctrl+C to exit..."
    read
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check for required variables
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ ERROR: OPENAI_API_KEY not set in .env"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set in .env"
    exit 1
fi

# Check if PostgreSQL is running
echo "🐘 Checking PostgreSQL connection..."
if ! psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ ERROR: Cannot connect to PostgreSQL at $DATABASE_URL"
    echo "Please ensure PostgreSQL is running and DATABASE_URL is correct"
    exit 1
fi

# Run migrations
echo "🔄 Running database migrations..."
./scripts/migrate.sh

# Start backend in background
echo "🎯 Starting backend server..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
./run_server.sh &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎯 Starting frontend server..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

