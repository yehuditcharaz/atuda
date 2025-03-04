#!/bin/bash

echo "👋 Starting entry point"

if [ -z "$GOOGLE_CREDENTIALS" ]; then
    echo "🤖 ERROR: GOOGLE_CREDENTIALS is not set."
    exit 1
fi
echo "$GOOGLE_CREDENTIALS" | sed "s/^'//;s/'$//" > /project-for-version.json
echo "✏️ service account writed successfully"

gcloud auth activate-service-account --key-file=/project-for-version.json
echo "🔐 after service account authorization"

echo "🚚 run the code"
cd /app
# python src/services/data_preparation.py
# echo "🔚 after run the code"

python src/routes/chat.py
