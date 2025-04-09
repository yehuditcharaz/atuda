# :helicopter:  Ofer knowledge rag - RAG service

## :card_index_dividers: Table of Contents

* [Overview](#overview)
* [Technologies Used](#technologies-used)
* [Configuration](#configuration)
* [Installation](#installation)
* [Learning Resources](#learning-resources)

## :rocket: Overview

This service implements a complete Retrieval-Augmented Generation (RAG) pipeline using LangChain. It is responsible for receiving a user question, retrieving relevant documents from an indexed knowledge base, and generating a context-aware response using a language model.

## :computer: Technologies Used

- **AI Methodology:** RAG (Retrieval-Augmented Generation).
- **Resources:**
  - Vertex AI vector search
  - GCS bucket
- **LLM:**
  - gemini-2.0-flash
  - text-embedding-004
- **Libraries:**
  - **Langchain:** A framework to build with LLMs by chaining interoperable
    components.
  - **unstructed:** Provides open-source components for ingesting and
    pre-processing images and text documents.

## :wrench: Configuration

You need to set the `.env` settings for that service .
For instructions click [here](../../README.md#configuration).

## :gear: Installation

Please run this commands to install and configure the project on your local
machine:

1. Build the Docker image

   ```powershell
   docker build -t ofer-knowledge-rag .
   ```
2. Build the Docker container

   ```powershell
   docker run -it -p 8000:8000 --entrypoint bash -v ${pwd}:/app ofer-knowledge-rag
   ```
3. Enter to the app folder

   ```cmd
   cd app
   ```
4. Login to your google cloud account

   ```cmd
   gcloud auth application-default login
   ```
5. Run the app server

   ```cmd
   python src/routes/chat.py
   ```

Your app will be accessible at [http://localhost:8000](http://localhost:8080).

## :books: Learning Resources

To learn more about the technologies used in this project, you can refer to the
following resources:

- [Langchain Documentation](https://python.langchain.com/api_reference/reference.html)
- [Vector Search](https://cloud.google.com/vertex-ai/docs/vector-search/overview)
- [Unstructured documentation](https://docs.unstructured.io/welcome)
- [EnsembleRetriever](https://python.langchain.com/api_reference/langchain/retrievers/langchain.retrievers.ensemble.EnsembleRetriever.html)
