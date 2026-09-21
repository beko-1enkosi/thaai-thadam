# Thaai Thadam — Mother's Footprint

A safe-mobility platform for women using public and last-mile transport in Trichy, Tamil Nadu, India.

## Problem and proposed solution

Women navigating public transport and the last stretch of a journey need accessible local information about their surroundings and where to find support. Thaai Thadam proposes bringing journey planning, safe-hub information, community safety reporting, and emergency-support information into one mobile-first application.

The intended experience is calm, trustworthy, accessible, and suitable for everyday use in India. These are design goals; the prototype does not yet provide verified safety information or operational assistance.

## MVP purpose and current status

The hackathon MVP will demonstrate a realistic application to judges. **This revision adds the shared application shell, Home dashboard, a local-demo Journey experience, a searchable Safe Hubs directory, anonymous issue reporting backed by SQLite, and a Community page using public report summaries.**

Implemented:

- Responsive React application with desktop navigation, mobile bottom navigation, and persistent emergency access.
- Home dashboard with destination shortcuts and quick actions. A session dismissible notice explains the simulated route and mobility information.
- Journey form, three route options, explained sample safety scores, route details, and a demo start confirmation.
- Safe Hubs search, combined amenity filters, hub details, and links to and from Journey.
- Plain CSS and reusable UI components inspired by the original coral and forest-green identity.
- Routes: `/`, `/journey`, `/safe-hubs`, `/report`, `/community`, `/emergency`, `/about` and a missing-page fallback.
- FastAPI server with `GET /api/health`, a Pydantic response schema, and local development CORS.
- Anonymous issue reporting with request validation, SQLite storage, and receipt confirmation.
- Community reports, category and area summaries, filtering, and useful empty/error states without exposing free text.
- SQLAlchemy reports table created automatically at application startup.

Not implemented: real route calculation, maps, GPS navigation, verified hubs, community discussions, emergency alerts, authentication, or external integrations. Emergency remains an informational placeholder. Report submission requires the backend; Journey and Safe Hubs continue using local demo data.

## Journey demo data

`frontend/src/data/demoJourneys.js` contains three real place names (Thillai Nagar, Chathiram Bus Stand, and Trichy Junction), three fictional route profiles, and fixed estimates for each supported location pair. Reverse trips reuse the same example estimates. The data is deterministic; repeated searches do not change scores or travel times.

The three route profiles use sample scores of 9.2, 8.5, and 7.4 out of 10, with explicit reasons involving lighting, activity, hub access, transport assumptions, and community reports. These are assigned illustrations, not computed safety predictions, verified routes, or live city information. Hub names, amenities, and community updates are fictional. Production use would require validated datasets and community/municipal input.

The example location button explicitly uses Thillai Nagar without requesting device location. Selecting the same start and destination shows an error. Changing either location clears previous results. Starting a journey displays a demo confirmation only; it does not start tracking, navigation, booking, or emergency monitoring.

## Safe Hubs demo data

`frontend/src/data/demoHubs.js` defines six fictional hubs around Thillai Nagar, Chathiram Bus Stand, Trichy Junction, Cantonment, Rockfort, and Srirangam. Each record has a stable ID, explicit demo flag, area and landmark description, fixed example distance, simulated status/access hours, sample score and reasons, amenity IDs, illustrative transport connections, and a fixed demo review date. Distances are from a fictional reference point in Thillai Nagar, not device location. No coordinates, real inspections, verified providers, or live availability are claimed.

Search matches hub name or area without case sensitivity and ignores outer whitespace. Amenity filters combine using AND: a result must include every selected amenity. Search, filters, and hub selection live in the URL for reloads and shareable detail links. Empty results offer a reset.

Journey routes link to the matching hub record. "Use in journey" keeps the chosen hub as a labelled reference and prefills a matching supported area when available. Hubs outside the three supported areas remain references only; no route to the hub is calculated. "Get directions" displays a prototype message without opening a map or starting navigation.

## Prototype notice and reporting

A global yellow notice identifies the prototype environment. Dismissal is stored in `sessionStorage` for the current browser session, not permanently. A new session shows the notice again. When browser storage is blocked, dismissal still works until the page is reloaded. Individual UI labels are simplified, while score explanations and notices about unavailable navigation and emergency assistance remain. All route and hub data described above is still simulated, even after the notice is dismissed.

Reports are different: valid submissions are actually stored in the local SQLite database. No names, phone numbers, email addresses, ID numbers, accounts, or device locations are requested. The description must contain 10 to 2,000 characters after trimming; optional landmarks are limited to 160 characters. Category and area must be one of the listed options. Optional occurrence timestamps must include a timezone and cannot be in the future. The form converts device local time to UTC; the API stores and returns UTC timestamps.

| Endpoint | Result |
| --- | --- |
| `POST /api/reports` | Saves a report and returns HTTP 201 with `id`, `status`, and `created_at`. |
| `GET /api/reports` | Returns only public report fields, newest first. Landmarks and descriptions are no longer returned. |
| `GET /api/community/reports` | Returns public `reports` and a `summary` containing `total_reports`, `by_category`, and `by_area`. |

A request body example:

```json
{
  "category": "poor_lighting",
  "area": "Thillai Nagar",
  "landmark": "Near a bus stop",
  "description": "The walking approach has insufficient lighting.",
  "occurred_at": null
}
```

All new reports have status `received`. Receipt does not mean verification, resolution, emergency dispatch, or municipal contact. Extra fields, unsupported categories/areas, and invalid descriptions or timestamps return HTTP 422. Storage failures return a generic HTTP 503 message. The frontend keeps entered text when submission fails and offers another report after success.

Public endpoints expose only `id`, `category`, `area`, `occurred_at`, `created_at`, and `status`. They explicitly select those columns rather than loading free text into public responses. The older `GET /api/reports` endpoint now uses this same safe representation. POST submission and its receipt contract are unchanged. Landmarks and descriptions remain in local SQLite but are not exposed by any report listing endpoint. Do not include identifying information in submissions.

The Community page fetches the list and summaries together from the backend on entry and on refresh. Both use the same set of stored reports. No report is duplicated into local demo data. Category and area filters apply together to the list; summaries cover all received reports. Tied leading categories are shown as a tie. Dates are displayed at day precision in India time. Counts describe submissions to Thaai Thadam, not official crime or safety statistics, and receipt does not establish that a report is verified.

When no reports exist, the page invites the first contribution. When filters match nothing, they can be cleared. Backend failures show a retry action rather than invented counts or reports. No emergency service is connected. The global prototype notice still describes the separate simulated Journey and Safe Hubs information.

The frontend API defaults to `http://127.0.0.1:8000`. To override it, copy `frontend/.env.example` to `frontend/.env.local`, set `VITE_API_BASE_URL`, and restart Vite. A different frontend origin also needs an explicit CORS entry in the backend.

## Architecture

```text
thaai-thadam/
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared shell, navigation, route cards, and notices
│   │   ├── pages/        # Individual route pages
│   │   ├── services/     # Report API calls using fetch
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
│   │   ├── models/       # SQLAlchemy Report model
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

The frontend uses React, Vite, JavaScript, React Router, and CSS. The backend uses Python, FastAPI, Uvicorn, SQLAlchemy, SQLite, and Pydantic. Report requests use FastAPI; database access belongs in the backend.

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

No environment variables or external accounts are needed. CORS permits `localhost` and `127.0.0.1` on Vite ports 5173 (development) and 4173 (build preview). GET and POST are enabled for local report requests.

SQLite is configured at `backend/thaai_thadam.db`, resolved relative to `database.py`. The application lifespan creates the database file and missing tables on startup. The file is ignored by Git. This simple prototype uses `Base.metadata.create_all`, not migrations; it does not alter existing columns automatically. The health endpoint checks API availability only, not database readiness.

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

Run isolated backend privacy, ordering and summary tests from `backend`:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

These tests use in-memory SQLite and never modify local reports. For manual integration testing, submit a clearly marked nonincident report, follow "View community updates", and verify that neither the landmark nor description appears in the UI or public API response. Clean up only the exact automated records created for the test. Keep genuine user submissions.

## Development boundaries

Keep future work beginner-readable and add product features incrementally. No Docker, Kubernetes, cloud database, microservices, AI models, or authentication infrastructure is included. Treat original prototype documents as reference material, not working application code.

Framework references: [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/installation), [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/), and [SQLAlchemy SQLite](https://docs.sqlalchemy.org/en/20/dialects/sqlite.html).
