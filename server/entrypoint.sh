#!/bin/bash

if [ -z "$GOOGLE_CREDENTIALS" ]; then
    echo "ERROR: GOOGLE_CREDENTIALS is not set."
    exit 1
fi

echo "$GOOGLE_CREDENTIALS"
echo "$GOOGLE_CREDENTIALS" > /project-for-version.json

gcloud auth activate-service-account --key-file=/project-for-version.json

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