FROM ghcr.io/open-webui/open-webui:0.6.5

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN node -v && npm -v || echo "npm not installed"

WORKDIR /app
COPY ./ /app

RUN npm install

COPY src/renderNavigationElements.sh /usr/local/bin/renderNavigationElements.sh
COPY src/navigationElements.js /app/build/assets/

COPY assets/logo.jpg /app/build/assets/images/adam.jpg
COPY assets/logo.jpg /app/build/assets/images/earth.jpg
COPY assets/logo.jpg /app/build/assets/images/galaxy.jpg
COPY assets/logo.jpg /app/build/assets/images/space.jpg

ENV DEFAULT_LOCALE=he
ENV DEFAULT_USER_ROLE=user
ENV ENABLE_AUTOCOMPLETE_GENERATION=false
ENV ENABLE_CODE_INTERPRETER=false
ENV ENABLE_EVALUATION_ARENA_MODELS=false
ENV ENABLE_NEW_SIGNUP=true
ENV ENABLE_OLLAMA_API=false
ENV ENABLE_RETRIEVAL_QUERY_GENERATION=false
ENV ENABLE_SEARCH_QUERY_GENERATION=false
ENV ENABLE_TAGS_GENERATION=false

ENV OPENAI_API_BASE_URLS=https://api.openai.com/v1;https://pipeline-dev-633427059080.us-central1.run.app
# ARG OPENAI_API_BASE_URLS
# ENV OPENAI_API_BASE_URLS=https://api.openai.com/v1;${OPENAI_API_BASE_URLS}
# ENV OPENAI_API_BASE_URLS=https://api.openai.com/v1;https://custom-pipeline-v3-633427059080.us-central1.run.app

ENV OPENAI_API_KEY=;0p3n-w3bu!
ENV RESET_CONFIG_ON_START=false
ENV TITLE_GENERATION_PROMPT_TEMPLATE="Create a concise 3-5 word title with an emoji that summarizes the chat conversation."
ENV USER_PERMISSIONS_CHAT_FILE_UPLOAD=false
ENV USER_PERMISSIONS_CHAT_TEMPORARY=false
ENV WEBUI_NAME="ofer chat"

RUN chmod +x /usr/local/bin/renderNavigationElements.sh

RUN /usr/local/bin/renderNavigationElements.sh

CMD ["/bin/bash", "-c", "node src/feedback/app.js & exec /app/backend/start.sh"]

EXPOSE 5454
