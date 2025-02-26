FROM ghcr.io/open-webui/open-webui:main

COPY add.sh /usr/local/bin/add.sh
COPY addCode.js /app/build/assets/
COPY logo.png /app/build/static/favicon.png

ENV WEBUI_NAME="ofer chat"
ENV DEFAULT_LOCALE=he
ENV ENABLE_SIGNUP=true
ENV DEFAULT_USER_ROLE=user
ENV ENABLE_OLLAMA_API=false
ENV ENABLE_OPENAI_API=false
ENV ENABLE_EVALUATION_ARENA_MODELS=false
ENV WEBUI_AUTH=false
ENV RESET_CONFIG_ON_START=true
ENV USER_PERMISSIONS_CHAT_FILE_UPLOAD=false
ENV USER_PERMISSIONS_CHAT_TEMPORARY=false

RUN chmod +x /usr/local/bin/add.sh
RUN /usr/local/bin/add.sh

EXPOSE 8080
