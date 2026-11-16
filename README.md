# Crossroads - Choose Your Own Adventure AI

app runs live on https://cross-roads-frontend.onrender.com/

Type a theme and Google Gemini writes a branching adventure with multiple endings. You pick the path.

- Backend: FastAPI, SQLAlchemy + SQLite, LangChain + Gemini
- Frontend: React + Vite

## Setup

You need: [uv](https://docs.astral.sh/uv/) (Python 3.13 is installed by uv if missing) and [Node.js](https://nodejs.org/) 20 or newer.

1. Get a free Gemini API key at https://aistudio.google.com/apikey
2. Copy `backend/.env.example` to `backend/.env` and paste the key after `GEMINI_API_KEY=` (no quotes, no spaces).

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
| `DATABASE_URL` | SQLite file. Default `sqlite:///./database.db`. |
| `DEBUG` | `True` for local development. `False` in production (secure cookies, no auto-reload). |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS. No trailing slash. |

## Deploying

Backend (needs a long-running host, not serverless, because story generation runs as a background task):

- Root directory `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment: `DEBUG=False`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `ALLOWED_ORIGINS=https://your-frontend-domain`
- SQLite lives in a file. Without a persistent disk the file is wiped on every redeploy or restart. To keep stories, mount a volume and set `DATABASE_URL=sqlite:////data/database.db`.

Frontend:

- Root directory `frontend`, build `npm run build`, output `dist`
- Set `VITE_API_BASE_URL=https://your-backend-url/api` before building. It is baked in at build time.

Never commit `backend/.env`. It is already in `.gitignore`.
