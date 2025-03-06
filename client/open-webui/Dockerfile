FROM ghcr.io/open-webui/open-webui:main

COPY add.sh /usr/local/bin/add.sh
COPY addCode.js /app/build/assets/
COPY logo.png /app/build/static/favicon.png
COPY logo2.jpg /app/build/assets/images/earth.jpg
COPY logo2.jpg /app/build/assets/images/galaxy.jpg
COPY logo2.jpg /app/build/assets/images/space.jpg
COPY logo2.jpg /app/build/assets/images/adam.jpg

ENV WEBUI_NAME="ofer chat"
ENV DEFAULT_LOCALE=he
ENV DEFAULT_USER_ROLE=user
ENV RESET_CONFIG_ON_START=true
ENV ENABLE_CODE_INTERPRETER=false
ENV USER_PERMISSIONS_CHAT_FILE_UPLOAD=false
ENV USER_PERMISSIONS_CHAT_TEMPORARY=false

ENV OPENAI_API_BASE_URLS=https://api.openai.com/v1;https://pipeline-633427059080.us-central1.run.app
ENV OPENAI_API_KEY=;0p3n-w3bu!

ENV ENABLE_OLLAMA_API=false
ENV ENABLE_EVALUATION_ARENA_MODELS=false
ENV TITLE_GENERATION_PROMPT_TEMPLATE="Create a concise 3-5 word title with an emoji that summarizes the chat conversation."
ENV ENABLE_AUTOCOMPLETE_GENERATION=false
ENV ENABLE_TAGS_GENERATION=false
ENV ENABLE_RETRIEVAL_QUERY_GENERATION=false
ENV ENABLE_SEARCH_QUERY_GENERATION=false

ENV AUDIO_TTS_ENGINE=false
ENV WHISPER_MODEL=false
ENV AUDIO_TTS_VOICE=false 
ENV AUDIO_TTS_OPENAI_API_BASE_URL=false
ENV AUDIO_TTS_OPENAI_API_KEY=false
ENV AUDIO_TTS_SPLIT_ON=false
ENV AUDIO_TTS_MODEL=false
ENV AUDIO_TTS_API_KEY=false

RUN chmod +x /usr/local/bin/add.sh
RUN /usr/local/bin/add.sh

# EXPOSE 8080