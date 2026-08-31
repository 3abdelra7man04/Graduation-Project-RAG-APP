# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**UniAsk** — a RAG-based AI assistant for university documentation. Students ask questions in
natural language (Arabic or English); an agent retrieves from indexed university PDFs
(regulations, curricula, course schedules, department guidelines) and answers with citations.
Admins upload/index documents and monitor retrieval quality, token cost and coverage gaps.

The source documents in `data/` are **Arabic**. The vector store therefore holds Arabic text —
the agent's search tool is instructed to translate English questions into Arabic keywords before
retrieval. Keep that in mind when changing prompts or the search path.

## Repository layout

```
src/                    FastAPI backend (run from INSIDE this directory)
  main.py               App wiring: Mongo, LLM/embedding/rerank clients, Qdrant, agent, routers
  helpers/config.py     Settings (pydantic-settings) — every env var lives here
  routes/               HTTP layer, one router per domain; schemes/ holds request bodies
  services/             Business logic (NLPService, ProcessService, MonitorService, ...)
  models/               Mongo data access; db_schemes/ = pydantic docs, enums/ = constants
  stores/llm/           LLM provider factory + interface + prompt templates
  stores/vectordb/      Vector DB factory + interface (Qdrant provider)
  agents/               pydantic-ai agent deps and tools
  assets/files/         Uploaded documents + page images (gitignored)
  views/Chating_UI/     Student chat frontend (React 19 + Vite)
  views/Adminstiration_Panel/  Admin dashboard (React via CDN + Babel, no bundler)
eval/                   Ragas-based retrieval/answer evaluation harness (separate venv)
docker/                 docker-compose for MongoDB + Qdrant
data/                   Source Arabic PDFs
```

## Commands

Two separate virtualenvs by design — `.venv` for the backend, `.venv_eval` for evaluation.
Their dependency sets conflict; do not merge them.

**Backend** (PowerShell, from repo root):
```powershell
.venv\Scripts\Activate.ps1
cd src
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```
`uvicorn` **must** be launched from `src/` — imports are top-level packages (`routes`, `models`,
`stores`), and `TemplateParser` resolves templates via `__import__("stores.llm.templates...")`.

**Infrastructure:**
```powershell
cd docker
docker compose up -d      # MongoDB on :27007, Qdrant on :6333
```

**Frontends:**
```powershell
cd src\views\Chating_UI          ; npm install ; npm run dev   # http://localhost:5173
cd src\views\Adminstiration_Panel; npm install ; npm run dev   # http://localhost:3000
```

**Evaluation** (needs the backend running on :5000):
```powershell
.venv_eval\Scripts\Activate.ps1
cd eval
pip install -r requirements.txt
python test.py
```
`test.py` reads CSVs (`question,expected` columns) from `eval/datasets/` and writes
`eval/tests/test_results_v{N}.csv`. Both directories are gitignored — create them before running,
and bump `test_version` in `test.py` so results aren't overwritten. It hits
`/api/v1/nlp/index/search/0` and `/api/v1/nlp/index/answer/0` (project `0`).

There is no unit test suite and no linter for the backend. `Chating_UI` has `npm run lint`.

## Configuration

`src/.env` (copy from `src/.env.example`) — all keys are required unless `helpers/config.py` gives
them a default. `docker/.env` is separate.

LLM traffic is routed through **OpenRouter**: `OPENAI_API_URL` points at
`https://openrouter.ai/api/v1` and `OPENAI_API_KEY` holds the OpenRouter key. `AGENT_MODEL` uses
pydantic-ai's `openrouter:<model>` form. Cohere is used only for reranking. There are four
separate model roles — `GENERATION_*` (HyDE + RAG answers), `EMBEDDING_*`, `RERANKING_*`,
`CLASSIFICATION_*` (topic/failure tagging) — plus the OCR model hardcoded in
`models/enums/MyPDFLoaderEnum.py`.

Adding config = add the field to `Settings` in `helpers/config.py` **and** to `.env.example`.

## Architecture

### Request flow (chat)
`routes/chat.py` → pydantic-ai `Agent` (built once at startup in `main.py`) → `semantic_search`
tool (`agents/tools.py`) → `NLPService.search_in_vectordb` → Qdrant. The answer is then classified
by topic/failure, monitoring data is aggregated, and both a `Chat` and a `Query` document are
written to Mongo.

`routes/nlp.py` exposes the older non-agentic path (`/index/search`, `/index/answer`) that calls
`NLPService` directly. The evaluation harness targets this path.

### Retrieval pipeline
1. Embed the raw query.
2. Generate a **HyDE** hypothetical document (`NLPService.generate_hypothetical_document`) and
   embed it.
3. Qdrant hybrid search: four prefetches — dense query, BM25-sparse query, dense HyDE,
   BM25-sparse HyDE — fused with **RRF**, over-fetching `5 * limit`.
4. **Cohere rerank** down to `limit`.

Collections are named `collection_{project_id}`. Point IDs are
`uuid5(NAMESPACE_OID, str(chunk_mongo_id)).hex` — the same formula is used on insert and delete;
changing it orphans existing vectors.

### Ingestion pipeline
`routes/data.py:process_and_index_pipeline` runs as a FastAPI background task and moves the asset
through `AssetStatusEnum`: `processing` → `indexing` → `success` / `error` (note the existing
`IDNEXING` typo in the enum member name — the *value* is `"indexing"`).

PDFs are **not** parsed with a text extractor. `MyPDFLoader` → `services/utils/data.py:extract_pages`
rasterizes each page with `pdf2image` (requires **poppler** on PATH), preprocesses it
(greyscale, resize, contrast), then runs a vision-LLM OCR pass returning JSON matched to
`PageScheme`. This costs API calls per page and is the slow part of upload. Text files use
LangChain's `TextLoader`. Both are then split with `RecursiveCharacterTextSplitter`.

### Patterns to follow
- **Factory + interface** for pluggable backends. Adding an LLM provider: implement
  `stores/llm/llm_interface.py`, add a value to `llm_enums.py`, add a branch to `LLMFactory`.
  Same shape for `stores/vectordb/`.
- **Prompt templates** live in `stores/llm/templates/locales/<lang>/<group>.py` as
  `string.Template` objects, read via `template_parser.get(group, key, vars)`. Missing groups fall
  back to `DEFAULT_LANG`. Never inline prompt text in services or routes.
- **Mongo models** subclass `BaseDataModel` and are constructed with
  `await XModel.create_instance(db_client)`, which calls `init_collection()` / `init_connection()`
  to create the collection and its indexes from the schema's `get_indexes()` classmethod.
  Collection names come from `DataBaseEnum`.
- **Response payloads** use `ResponseSignal` enum values under a `"signal"` key — add new
  strings there rather than literals in routes.
- Long-lived clients (Mongo, LLM, embedding, rerank, Qdrant, template parser, agent) hang off the
  `app` object and are reached via `request.app.*`. Per-request services are constructed fresh:
  `ChatService.from_app(request.app)` unpacks those clients in one call, and it builds its own
  `NLPService` / `MonitorService` per turn.
- Chat orchestration and persistence live in `services/ChatService.py`, not the route.
  `routes/chat.py` only resolves the project, calls the service and shapes the `JSONResponse`.
  Anything touching the agent run, classification, monitoring or the `Query` record belongs in
  `ChatService._run_agent_turn` / `_build_query` — both are single-source, so a new tracked field
  is added in exactly one place.
- The eight query topics live in `models/enums/QueryTopicEnum.py`. `services/schemes/
  query_classification.py` derives its `Literal` from it — keep it a `Literal`, not the enum type,
  so `model_json_schema()` keeps emitting an inline string enum for the provider's strict
  structured-output mode.
- `project_id` is a path parameter on nearly every endpoint;
  `ProjectModel.get_project_or_create_one` creates it on first use.

### Monitoring & cost
`MonitorService` reconstructs a step-by-step `trace` from pydantic-ai messages and totals tokens
across the agent, HyDE, embeddings and classification. Per-million prices are **hardcoded
constants** at the top of `services/MonitorService.py` — update them there when models change.
The result is persisted on the `Query` document and served by `routes/Monitor.py`,
`routes/dashboard.py` and `routes/gap_analysis.py` to the admin panel.

## Conventions

- Comments are short and lowercase, sitting above the block they describe. Match the surrounding
  density rather than adding docstrings everywhere.
- Async throughout for Mongo (motor) and routes; the LLM/vector clients are **synchronous** and
  called directly from async handlers — this is existing behavior, keep it consistent unless
  asked to change it.
- Errors in routes return `JSONResponse` with an explicit `status_code` and a `signal`, not raised
  exceptions.

## Known gaps

Do not "quietly fix" these; raise them if relevant to the task at hand.

- User and admin passwords are stored and compared in **plaintext** (`routes/user.py`,
  `routes/admin.py`), and admin invites hardcode `12345678`. There is no session token or auth
  middleware — endpoints are unauthenticated.
- CORS in `main.py` allows all origins.
- The admin panel's `js/pages/Settings.js` is local React state only — it makes no API calls, so
  the LLM config, chunking and feature-flag controls render but change nothing. `INIT_DOCS` and
  `INIT_ADMINS` in `js/data.js` are leftover mock constants, now referenced nowhere (only
  `TYPE_COLORS` is still used). Every other admin page fetches the live API.
- Backend URLs are hardcoded in both frontends — `http://localhost:5000` across ~20 call sites in
  the admin panel, `http://127.0.0.1:5000` in `Chating_UI/src/context/AppContext.jsx`. Neither
  reads an env var.
- `project_id` is hardcoded `"0"` throughout both frontends, except
  `Adminstiration_Panel/js/SignIn.js`, which logs admins in against project `"1"`.
- `main.py` uses the deprecated `app.on_event` startup/shutdown hooks.
