#!/bin/bash

echo "👋 Starting entry point"

if [ -z "$GOOGLE_CREDENTIALS" ]; then
    echo "🤖 ERROR: GOOGLE_CREDENTIALS is not set."
    exit 1
fi

echo "$GOOGLE_CREDENTIALS" | sed "s/^'//;s/'$//" > /key.json
echo "✏️ service account writed successfully"

export GOOGLE_APPLICATION_CREDENTIALS="/key.json"

gcloud auth activate-service-account --key-file=/key.json
echo "🔐 after service account authorization"

echo "🚚 run the FastAPI app with Uvicorn"
cd /app

exec uvicorn src.routes.chat:app --host 0.0.0.0 --port 8080 --workers 4
