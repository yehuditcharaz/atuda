#!/bin/bash

echo "👋 Starting entry point"

if [ -z "$GOOGLE_CREDENTIALS" ]; then
    echo "🤖 ERROR: GOOGLE_CREDENTIALS is not set."
    exit 1
fi
echo "$GOOGLE_CREDENTIALS" | sed "s/^'//;s/'$//" > /key.json
echo "✏️ service account writed successfully"

export GOOGLE_APPLICATION_CREDENTIALS="/key.json"

gcloud auth activate-service-account --key-file=/app/key.json
echo "🔐 after service account authorization"

echo "🚚 run the code"
cd /app

python src/routes/chat.py
