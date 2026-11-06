# Crossroads - Choose Your Own Adventure AI

Type a theme and Google Gemini writes a branching adventure with multiple endings. You pick the path.

- Backend: FastAPI, SQLAlchemy (SQLite for local use), LangChain + Gemini
- Frontend: React + Vite

## Setup

You need: [uv](https://docs.astral.sh/uv/) (Python 3.13 is installed by uv if missing) and [Node.js](https://nodejs.org/) 20 or newer.

1. Get a free Gemini API key at https://aistudio.google.com/apikey
2. Open `backend/.env` and paste the key after `GEMINI_API_KEY=` (no quotes, no spaces). If the file is missing, copy `backend/.env.example` to `backend/.env` first.

### Run the backend (terminal 1)

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Run the frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Configuration (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Your Gemini API key. Required. |
| `GEMINI_MODEL` | Model used to write stories. Default `gemini-3.5-flash-lite`. If you get quota errors, try `gemini-3.8-flash`. |
| `DATABASE_URL` | Local SQLite file by default. |
| `DEBUG` | `True` uses `DATABASE_URL`. `False` builds a PostgreSQL URL from `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`. |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS. |

## Deploying

Build the frontend with `VITE_API_BASE_URL=https://your-backend-url/api npm run build` and add your frontend URL to `ALLOWED_ORIGINS` on the backend.

Never commit `backend/.env`. It is already in `.gitignore`.
