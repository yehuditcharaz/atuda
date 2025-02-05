FROM python:3.10.0

ENV PROJECT_ID=project-for-version

WORKDIR /app
COPY . /app/
USER root

RUN pip install .
RUN python3 -c "import nltk; nltk.download('all')"
RUN apt-get update && apt-get install -y libgl1 \
    && apt-get install -y poppler-utils \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y tesseract-ocr

ENV PATH="/usr/local/gcloud/google-cloud-sdk/bin:$PATH"

RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz
RUN mkdir -p /usr/local/gcloud \
  && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
  && /usr/local/gcloud/google-cloud-sdk/install.sh 

RUN gcloud config set project $PROJECT_ID 

RUN pip install --upgrade flask-socketio

EXPOSE 8000

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
