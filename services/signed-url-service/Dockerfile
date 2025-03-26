FROM python:3.10.0

ENV PROJECT_ID=knowledge-rag

WORKDIR /app
COPY . /app/
USER root

RUN pip install .
RUN python3 -c "import nltk; nltk.download('all')"
RUN apt-get update && apt-get install -y libgl1 \
  && apt-get install -y poppler-utils \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y tesseract-ocr

EXPOSE 5000

CMD [ "python", "src/routes/signed_url.py" ]
