#!/bin/bash

set -e

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port ${BACKEND_PORT:-8000}

