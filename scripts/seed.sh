#!/bin/bash

set -e

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

if [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ ERROR: ADMIN_TOKEN not set in .env"
    exit 1
fi

echo "🌱 Seeding database with sample data..."
curl -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8000/admin/seed

echo ""
echo "✅ Seeding complete!"

