FROM ghcr.io/open-webui/open-webui:main

COPY add.sh /usr/local/bin/add.sh
COPY addCode.js /app/build/assets/

RUN chmod +x /usr/local/bin/add.sh

RUN /usr/local/bin/add.sh

EXPOSE 8080
