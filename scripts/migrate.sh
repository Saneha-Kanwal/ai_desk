#!/bin/bash

set -e

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

cd ../backend

# Run Alembic migrations
echo "🔄 Running database migrations..."
alembic upgrade head

echo "✅ Migrations complete!"

