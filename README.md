# Graduation Project RAG APP

This is a minimal implementation of the RAG model for question answering.

## Requirements

- Python 3.8 or later

#### Install Python using MiniConda

1) Create a new environment using the following command:
```bash
python -m venv .venv
```
2) Activate the environment:
```bash
.venv\Scripts\Activate.ps1
```

## Installation

### Install the required packages

```bash
pip install -r requirements.txt
```

### Setup the environment variables

```bash
cp .env.example .env
```

Set your environment variables in the `.env` file. Like `OPENAI_API_KEY` value.

### Run the FastAPI Server
```bash
$ uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

### The Postman Collection

Download the POSTMAN collection from [/assets/mini-rag-app.postman_collection.json](/assets/mini-rag-app.postman_collection.json)

## Run Docker Compose Services

```bash
cd docker
cp .env.example .env
```

- update `.env` with your credentials



```bash
cd docker
docker compose up -d
```
