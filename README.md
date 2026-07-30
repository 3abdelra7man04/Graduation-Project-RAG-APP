# UNIASK
**UNIASK** is a RAG-Based application that provides a conversational interface for university documentation. by answering student queries directly using the given university resources.  

## 📌 Overview

Navigating university regulations, course schedules, department guidelines, and administrative procedures often involves fragmented documents and delayed support. **UniAsk** unifies university knowledge bases into an interactive, real-time AI assistant capable of delivering precise, context-aware answers with direct document citations.

### Key Highlights
- 💬 **Student Portal:** Modern conversational interface for real-time natural language Q&A.
- ⚙️ **Admin Dashboard:** Control panel to manage document indexing, track retrieval performance, track cost analytics and update knowledge bases dynamically.
- 🎯 **High Retrieval Accuracy:** Powered by vector similarity search with Hyde, re-ranking and other techniques for complex query resolution.

---

## 🛠️ Tech Stack

| Domain | Technology / Framework |
| :--- | :--- |
| **Backend Framework** | Python 3.8+, FastAPI |
| **Frontend Framework** | React.js |
| **Database** | MongoDB |
| **Vector Storage** | Qdrant |
| **LLM & RAG Orchestration** | LangChain / PydanticAI |
| **LLM Providers** | OpenAI / Cohere |
| **Evaluation Framework** | Ragas |
| **Containerization** | Docker, Docker Compose |

---

## Requirements

- Python 3.8 or later

#### Create and Activate Python Environment

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
cd src
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

### Run Docker Compose Services

```bash
cd docker
cp .env.example .env
```

- update `.env` with your credentials



```bash
cd docker
docker compose up -d
```

## Frontend and app UI

To get a local copy of the **UniAsk** frontend up and running, follow these steps.

### Prerequisites

You need **Node.js** installed on your machine.
* **Download:** [nodejs.org](https://nodejs.org/) (LTS version recommended)

Check your installation:
```bash
node -v
npm -v
```

### Chating UI

#### Installation of node packages

```bash
cd src\views\Chating_UI
npm install
```

#### run the frontend

```bash
cd src\views\Chating_UI
npm run dev
```
The application will be available at (http://localhost:5173/)

### Adminstiration Panel

#### Installation of node packages

```bash
cd src\views\Adminstiration_Panel
npm install
```

#### run the frontend

```bash
cd src\views\Adminstiration_Panel
npm run dev
```
The application will be available at (http://localhost:3000/)

## Running evaluation test

1) Create a new environment using the following command:
```bash
python -m venv .venv_eval
```
2) Activate the environment:
```bash
.venv_eval\Scripts\Activate.ps1
```

### Installation

#### Install the required packages

```bash
cd eval
pip install -r requirements.txt
```

### Setup the environment variables

```bash
cp .env.example .env
```

Set your environment variables in the `.env` file. Like `OPENAI_API_KEY` value.
