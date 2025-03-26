FROM ghcr.io/open-webui/pipelines:main

WORKDIR /app
COPY ./ /app

COPY src/pipelines /app/pipelines

RUN pip install .
COPY ./src /app/pipelines
