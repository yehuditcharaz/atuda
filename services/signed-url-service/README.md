# :helicopter: Ofer knowledge rag - signed url service

## :card_index_dividers: Table Of Contents

- [Overview](#rocket-overview)
- [Configuration](#wrench-configuration)
- [Installation](#gear-installation)
- [Learning Resources](#books-learning-resources)

## :rocket: Overview

The server handles redirects to images or files stored in a private storage bucket. When a request is made for a protected resource, the server creates a signed URL that provides temporary access to the requested asset, and returns the image itself to the user. This allows unauthenticated clients (e.g., browsers without login credentials) to securely access private resources via the signed URL, without exposing the bucket or requiring direct authentication.

## :wrench: Configuration

You need to set the `.env` settings for that service .
For instructions click [here](../../README.md#configuration).

## :gear: Installation

Please run this commands to install and configure the project on your local machine:

1. Build the Docker image

   ```powershell
   docker build -t signed-url-service .
   ```
2. Build the Docker container

   ```powershell
   docker run -it -p 5000:5000 --entrypoint bash -v ${pwd}:/app signed-url-service
   ```

Your app will be accessible at [http://localhost:5000](http://localhost:5000)

## :books: Learning Resources

To learn more about the technologies used in this project,

you can refer to the following resource:  [signed-url](https://cloud.google.com/storage/docs/access-control/signed-urls).
