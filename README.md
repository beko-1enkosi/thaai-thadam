# Thaai Thadam — Mother's Footprint

A safe-mobility platform for women using public and last-mile transport in Trichy, Tamil Nadu, India.

## Problem and proposed solution

Women navigating public transport and the last stretch of a journey need accessible local information about their surroundings and where to find support. Thaai Thadam proposes bringing journey planning, safe-hub information, community safety reporting, and emergency-support information into one mobile-first application.

The intended experience is calm, trustworthy, accessible, and suitable for everyday use in India. These are design goals; the prototype does not yet provide verified safety information or operational assistance.

## MVP purpose and current status

The hackathon MVP will demonstrate a realistic application to judges. **This revision establishes only the project foundation.**

Implemented:

- React application with shared navigation, plain CSS, and placeholder pages.
- Routes: `/`, `/journey`, `/safe-hubs`, `/report`, `/community`, `/emergency`, `/about` and a missing-page fallback.
- FastAPI server with `GET /api/health`, a Pydantic response schema, and local development CORS.
- SQLAlchemy engine, session dependency, and base class prepared for SQLite.

Not implemented: journey routing, verified hubs, report submission, community interactions, emergency alerts, authentication, external integrations, or product database tables. Navigation works independently of the backend; frontend API calls will be added when features need them.

## Architecture

```text
thaai-thadam/
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared layout and placeholder wrapper
│   │   ├── pages/        # Individual route pages
│   │   ├── services/     # Reserved for future API calls
│   │   ├── data/         # Reserved for future local data
│   │   ├── assets/       # Reserved for future assets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── api/          # HTTP endpoints
│   │   ├── models/       # Reserved for SQLAlchemy models
│   │   ├── schemas/      # Pydantic request/response contracts
│   │   ├── services/     # Reserved for feature logic
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
├── docs/
│   └── original_prototype/ # Existing reference material, preserved
├── .gitignore
└── README.md
```

The frontend uses React, Vite, JavaScript, React Router, and CSS. The backend uses Python, FastAPI, Uvicorn, SQLAlchemy, SQLite, and Pydantic. Future browser requests will go to the FastAPI API; database access belongs in the backend.

The existing reference folder is named `docs/original_prototype` (underscore), rather than `docs/original-prototype`. Its files have not been moved or modified.

## Local setup

Prerequisites: Node.js 22.12+ (Node 24 supported), npm, and Python 3.10+ with pip and venv. Run the frontend and backend in separate terminals, starting from the repository root.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The port is fixed so it matches the API's CORS configuration. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

After the first installation, use `npm ci` to reproduce the committed dependency lockfile.

### Backend (Windows PowerShell)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

These commands do not require activating the virtual environment or changing PowerShell execution policy.

On macOS/Linux:

```sh
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API health: http://127.0.0.1:8000/api/health

Interactive API documentation: http://127.0.0.1:8000/docs

Expected health response:

```json
{"status":"ok","message":"Thaai Thadam API is running"}
```

No environment variables or external accounts are needed. CORS permits `localhost` and `127.0.0.1` on Vite ports 5173 (development) and 4173 (build preview). Only GET is enabled for now; extend allowed methods when implementing write endpoints.

SQLite is configured at `backend/thaai_thadam.db`, resolved relative to `database.py`. Importing the configuration does not open a database connection or create tables. A future database connection will create the file; it is ignored by Git. The health endpoint checks API availability only, not database readiness.

## Checks

Build and preview the frontend:

```powershell
cd frontend
npm run build
npm run preview
```

Open http://localhost:4173, navigate through all seven pages, and refresh a nested route such as `/journey`. Check keyboard navigation and a narrow viewport. A future deployment must serve `index.html` for frontend routes; Vite handles this locally.

With the backend running, check health in PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

Check Python dependency compatibility from `backend`:

```powershell
.\.venv\Scripts\python.exe -m pip check
```

## Development boundaries

Keep future work beginner-readable and add product features incrementally. No Docker, Kubernetes, cloud database, microservices, AI models, or authentication infrastructure is included. Treat original prototype documents as reference material, not working application code.

Framework references: [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/installation), [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/), and [SQLAlchemy SQLite](https://docs.sqlalchemy.org/en/20/dialects/sqlite.html).
