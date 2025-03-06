# FROM ghcr.io/open-webui/pipelines:main
# COPY pipeline.py /app/pipelines
# EXPOSE 9099

FROM ghcr.io/open-webui/pipelines:main

COPY ./src /app/pipelines
ENV SERVER_URL="https://rag-service-633427059080.us-central1.run.app"
EXPOSE 9099