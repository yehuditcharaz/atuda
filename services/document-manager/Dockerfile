FROM python:3.10.0

ENV PROJECT_ID=knowledge-rag

WORKDIR /app
COPY . /app/

USER root
RUN pip install --upgrade pip setuptools

RUN apt-get update && apt-get install -y \
    libgl1 \
    poppler-utils \
    tesseract-ocr \
    && pip install --no-cache-dir . \
    && python3 -c "import nltk; nltk.download('all')"

EXPOSE 5000

CMD ["python", "src/routes/app.py"]
