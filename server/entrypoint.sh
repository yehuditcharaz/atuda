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

echo "📁 Listing files and directories in the root:"
ls -la /

cd app
echo "🗂️ In app directory:"
ls -la /

echo "🚚 run the code"

python -m src.services.main


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