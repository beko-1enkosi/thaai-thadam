# Thaai Thadam — Mother's Footprint

A safe-mobility platform for women using public and last-mile transport in Trichy, Tamil Nadu, India.

## Problem and proposed solution

Women navigating public transport and the last stretch of a journey need accessible local information about their surroundings and where to find support. Thaai Thadam proposes bringing journey planning, safe-hub information, community safety reporting, and emergency-support information into one mobile-first application.

The intended experience is calm, trustworthy, accessible, and suitable for everyday use in India. These are design goals; the prototype does not yet provide verified safety information or operational assistance.

## MVP purpose and current status

The hackathon MVP will demonstrate a realistic application to judges. **This revision adds the shared application shell, Home dashboard, a local-demo Journey experience, and a searchable Safe Hubs directory.**

Implemented:

- Responsive React application with desktop navigation, mobile bottom navigation, and persistent emergency access.
- Home dashboard with destination shortcuts, quick actions, and clearly labelled sample context.
- Journey form, three route options, explained sample safety scores, route details, and a demo start confirmation.
- Safe Hubs search, combined amenity filters, hub details, and links to and from Journey.
- Plain CSS and reusable UI components inspired by the original coral and forest-green identity.
- Routes: `/`, `/journey`, `/safe-hubs`, `/report`, `/community`, `/emergency`, `/about` and a missing-page fallback.
- FastAPI server with `GET /api/health`, a Pydantic response schema, and local development CORS.
- SQLAlchemy engine, session dependency, and base class prepared for SQLite.

Not implemented: real route calculation, maps, GPS navigation, verified hubs, report submission, community interactions, emergency alerts, authentication, external integrations, or product database tables. Report, Community, Emergency, and About retain their existing placeholder content. Navigation works independently of the backend; frontend API calls will be added when features need them.

## Journey demo data

`frontend/src/data/demoJourneys.js` contains three real place names (Thillai Nagar, Chathiram Bus Stand, and Trichy Junction), three fictional route profiles, and fixed estimates for each supported location pair. Reverse trips reuse the same example estimates. The data is deterministic; repeated searches do not change scores or travel times.

The three route profiles use sample scores of 9.2, 8.5, and 7.4 out of 10, with explicit reasons involving lighting, activity, hub access, transport assumptions, and community reports. These are assigned illustrations, not computed safety predictions, verified routes, or live city information. Hub names, amenities, and community updates are fictional. Production use would require validated datasets and community/municipal input.

The current-location button explicitly simulates Thillai Nagar without requesting device location. Selecting the same start and destination shows an error. Changing either location clears previous results. Starting a journey displays a demo confirmation only; it does not start tracking, navigation, booking, or emergency monitoring.

## Safe Hubs demo data

`frontend/src/data/demoHubs.js` defines six fictional hubs around Thillai Nagar, Chathiram Bus Stand, Trichy Junction, Cantonment, Rockfort, and Srirangam. Each record has a stable ID, explicit demo flag, area and landmark description, fixed example distance, simulated status/access hours, sample score and reasons, amenity IDs, illustrative transport connections, and a fixed demo review date. Distances are from a fictional reference point in Thillai Nagar, not device location. No coordinates, real inspections, verified providers, or live availability are claimed.

Search matches hub name or area without case sensitivity and ignores outer whitespace. Amenity filters combine using AND: a result must include every selected amenity. Search, filters, and hub selection live in the URL for reloads and shareable detail links. Empty results offer a reset.

Journey routes link to the matching hub record. "Use in journey" keeps the chosen hub as a labelled reference and prefills a matching supported area when available. Hubs outside the three supported areas remain references only; no route to the hub is calculated. "Get directions" displays a prototype message without opening a map or starting navigation.

## Architecture

```text
thaai-thadam/
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared shell, navigation, route cards, and notices
│   │   ├── pages/        # Individual route pages
│   │   ├── services/     # Reserved for future API calls
│   │   ├── data/         # Deterministic demo journeys and navigation
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
