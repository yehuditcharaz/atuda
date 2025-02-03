#!/bin/bash

echo "👋 Starting entry point"
if [ -z "$GOOGLE_CREDENTIALS" ]; then
    echo "ERROR: GOOGLE_CREDENTIALS is not set."
    exit 1
fi

echo "🤖 $GOOGLE_CREDENTIALS"
echo "$GOOGLE_CREDENTIALS" | sed "s/^'//;s/'$//" > /project-for-version.json

echo "✏️ service account writed successfully"
gcloud auth activate-service-account --key-file=/project-for-version.json

echo "🔐 after service account authorization"


echo "🚚 run the code"

cd /app
python -m src.services.main

echo "🔚 after run the code"

# _setup() {
#     echo "🗝️ Connect to GCP..."
#     gcloud auth activate-service-account --key-file=project-for-version-d093ae0541e1.json 

#     _run
# }

# _run() {
#     echo "🚀 Running the code..."
#     python -m src.services.main
# }

# _setup