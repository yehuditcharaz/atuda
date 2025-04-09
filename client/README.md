# :helicopter: Ofer knowledge rag - Frontend

## :card_index_dividers: Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Installation](#Installation)
- [Usage](#usage)

## :rocket: Overview

This folder is the client part of the Full Stack application.
Uses `OpenWebUI` as the user interface.

## :computer: Technologies Used

`OpenWebUI` is an extensible artificial intelligence platform.
Serves as an interface for deploying machine learning models, and provides a web interface for interaction, while customizing it for the user.

## :wrench: Configuration

1. You need to set the `.env` settings for that service .
   For instructions click [here](../README.md#configuration).
2. You must ensure that the `ENV OPENAI_API_BASE_URLS` variable in the `Dockerfile.openwebui` file contains the address of the `pipeline` server.

   * If the file is taken from a container, complete it like this:
   
     `https://api.openai.com/v1;http://host.docker.internal:9099`

   * If from a deployed server, complete it like this:

     `https://api.openai.com/v1;https://deployed/server/url`

## :gear: Installation

Please run this command in the client folder:

1. ```powershell
   docker-compose up --build
   ```
2. Your app will be accessible at [http://localhost:3000](http://localhost:3000)

## :books: Learning Resources

To learn more about the technologies used in this project, you can refer to the
following resource:

[Openwebui](https://docs.openwebui.com/)
