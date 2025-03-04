# Ofer-knowledge-rag Server

## :dart: Goal

Developing an interactive chatbot that allows flight course students to receive
answers to technical questions about helicopter systems and operation.

## :rocket: Overview

This project is a smart system based on artificial intelligence that aims to
make technical information about helicopter systems accessible to flight course
trainees. The chatbot allows users to type questions on a variety of topics,
such as hydraulic systems, engines, avionics, flight safety, and more,
and receive clear and accurate answers with images and links to the relevant
documents.

## :computer: Technologies Used

- **Backend Language:** Python
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

The `.env` file contains environment settings for the application.
You can customize them to your own needs.
All what you need to do is:

1. **Editing the .env File:** Find/create the `.env` file  which located in  
the main project directory and open it using a text editor of your choice.
2. **Environment Variables:** Find the specific key that you want to edit, and
customize it's value.
For example, if you want to change the value of the `PORT` key to a different
port (e.g. because you want to set your application run port), just change the
value.
3. **Saving Changes:** Save the changes you made to the `.env` file after
modifying the variables.

## :gear: Installation

Please run this commands to install and configure the project on your local
machine:

1. Build the Docker image

    ```powershell
    docker build -t ofer-knowledge-rag .
    ```

2. Build the Docker container

    ```powershell
    docker run -it -p 8080:8080 --entrypoint bash -v ${pwd}:/app ofer-knowledge-rag
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
    python routes/chat.py
    ```

Your app will be accessible at <http://localhost:8080>.

## :potted_plant:Usage

:white_check_mark: Flight course students can use the chatbot to check
information about the helicopter's systems  
:white_check_mark: Instructors can use it as a tool during lessons

## :books: Learning Resources

To learn more about the technologies used in this project, you can refer to the
following resources:

- [Langchain Documentation](<https://python.langchain.com/api_reference/reference.html>)
- [Vector Search](<https://cloud.google.com/vertex-ai/docs/vector-search/overview>)
- [Unstructured documentation](<https://docs.unstructured.io/welcome>)
- [EnsembleRetriever](https://python.langchain.com/api_reference/langchain/retrievers/langchain.retrievers.ensemble.EnsembleRetriever.html)
