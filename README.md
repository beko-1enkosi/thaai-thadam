# Thaai Thadam

**Mother's Footprint**

A mobility application for women travelling in Trichy, Tamil Nadu. Thaai Thadam brings journey planning, places to wait, community safety reporting and practical emergency tools into one responsive experience.

## The problem and the approach

A journey includes more than a ride. The walk to a bus stop, the waiting point, transport changes and the final stretch home all affect comfort and confidence. Local information is often fragmented, and everyday concerns can be difficult to share.

Thaai Thadam helps people consider the whole journey, understand the factors behind safety information, share mobility concerns anonymously and access emergency tools quickly. It is a working hackathon MVP, not an official municipal service. No partnerships or operational hub facilities are claimed.

## Implemented features

| Feature | Current behaviour |
| --- | --- |
| Journey planning | Three fixed route options between Thillai Nagar, Chathiram Bus Stand and Trichy Junction, with estimates, selection and detail views. |
| Safety scores | Explained indicators covering lighting, activity, hub access, community reports and transport assumptions. |
| Interactive maps | Leaflet and OpenStreetMap tiles, route lines, endpoints, hub markers and selection shared with lists. |
| Browser location | Optional one-time capture on Journey, Safe Hubs and Emergency. Permission failures retain manual alternatives. |
| Safe Mobility Hubs | Six proposed hub records, name/area search, combined amenity filters, access information, detail views and external directions. |
| Reporting | Validated anonymous submissions saved through FastAPI to SQLite, with a reference and received status. |
| Community insights | Stored reports presented without landmarks or descriptions, category/area filters, summaries and empty/error states. |
| Emergency Help | Intentional dialler links for 112 and 181, captured location, Web Share, clipboard copying and manual-copy fallback. |
| Ask Thaai | Conversational product and mobility guidance through a backend OpenAI integration, suggestions, safe internal navigation and clear conversation. |
| Text to speech | User-triggered browser reading of assistant replies, with stop controls and English voice fallback. |
| Responsive design | Navy, coral and cream identity, mobile navigation, keyboard focus, reduced motion, real loading skeletons and a session splash. |

## Technology and architecture

Frontend: React, Vite, JavaScript, React Router, plain CSS, Leaflet and React Leaflet. Map imagery comes from OpenStreetMap. Raleway and DM Serif Display load from Google Fonts, with system font fallbacks. Icons are local SVG components.

Backend: Python, FastAPI, Uvicorn, SQLAlchemy, SQLite and Pydantic. The official OpenAI Python SDK calls the Responses API for Ask Thaai. React never calls OpenAI directly.

```text
Browser / React
  |-- Local journey and hub data --> Leaflet + OpenStreetMap tiles
  |-- Explicit location request --> Browser geolocation
  |-- Reports and Community ------> FastAPI --> SQLAlchemy --> SQLite
  |-- Ask Thaai ------------------> FastAPI --> OpenAI Responses API
  |-- Read response aloud --------> Browser SpeechSynthesis
```

```text
thaai-thadam/
  frontend/
    src/
      components/           Shared shell, notices, cards, loading states
        assistant/          Ask Thaai panel and speech controls
        map/                Shared map and location controls
      config/               Emergency phone configuration
      data/                 Fixed journey/hub data and report options
      hooks/                One-time browser location
      pages/                Existing application routes
      services/             Report, Community and assistant fetch calls
      styles.css            Shared layout and controls
      visual.css            Brand treatments and responsive design
      assistant.css         Ask Thaai layout and interactions
    tests/                  Deterministic map data tests
    .env.example
  backend/
    app/
      api/                  Health, reports, Community and assistant routes
      models/               Report database model
      schemas/              Validated API contracts
      services/             Public report projection and assistant context/calls
      database.py           SQLite engine and shared Base
      main.py               FastAPI application, startup and CORS
    tests/                  Backend privacy and assistant integration tests
    requirements.txt
    .env.example
  docs/original_prototype/   Original concept references, preserved
  README.md
```

## Local setup

Prerequisites: Node.js 22.12 or later and Python 3.10 or later. Node 24 and Python 3.14 were used for local validation. Run frontend and backend in separate terminals from the repository root.

### Frontend

```powershell
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. If PowerShell blocks `npm.ps1`, use `npm.cmd`. To change the backend URL, copy `frontend/.env.example` to `frontend/.env.local` and edit `VITE_API_BASE_URL`, then restart Vite.

### Backend on Windows PowerShell

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# Optional: set these in this terminal to enable provider-backed Ask Thaai replies.
$env:OPENAI_API_KEY = [System.Net.NetworkCredential]::new('', (Read-Host 'OpenAI API key' -AsSecureString)).Password
$env:OPENAI_MODEL = 'gpt-5.6-luna'

.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Omit the two environment assignments to run without an OpenAI key. No virtual environment activation or execution-policy change is required. The key input is masked and the command does not print it.

### Backend on macOS or Linux

```sh
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
# Optional: supply OPENAI_API_KEY through your shell or a secret manager.
export OPENAI_MODEL=gpt-5.6-luna
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health: http://127.0.0.1:8000/api/health. Interactive API documentation: http://127.0.0.1:8000/docs.

SQLite is created at `backend/thaai_thadam.db`, independent of the process working directory. Startup creates missing tables with SQLAlchemy `Base.metadata.create_all`; it does not migrate existing columns. Local CORS permits localhost and 127.0.0.1 on ports 5173 and 4173.

### Environment variables

| Variable | Where | Default / purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Backend only | Optional secret. Required for provider-backed assistant replies. |
| `OPENAI_MODEL` | Backend only | `gpt-5.6-luna`. Must be available to the configured API project. |
| `VITE_API_BASE_URL` | Frontend | `http://127.0.0.1:8000`. Public backend base URL. |

**Never commit API keys. Never prefix a provider key with `VITE_`.** Vite variables are public build-time values. `.env`, `.env.local` and other `.env.*` files are ignored; only `.env.example` files are tracked. `backend/.env.example` is a reference template: the backend reads process environment variables and does not automatically load `.env` files. No real key is included in this repository.

## API endpoints

| Method and path | Contract |
| --- | --- |
| `GET /api/health` | `{ "status": "ok", "message": "Thaai Thadam API is running" }`. Does not test provider or database readiness. |
| `POST /api/reports` | Accepts category, area, optional landmark, description and optional timezone-aware occurred_at. Returns HTTP 201 with id, status and created_at. |
| `GET /api/reports` | Public fields only: id, category, area, occurred_at, created_at and status, newest first. |
| `GET /api/community/reports` | Public reports plus summary.total_reports, summary.by_category and summary.by_area. |
| `POST /api/assistant` | Accepts message, up to 10 history messages and current_path. Returns `{ "message": "..." }`. |

Report descriptions must contain 10 to 2,000 trimmed characters. Optional landmarks allow up to 160 characters. Category and area use fixed options, occurrence times cannot be in the future, and new reports have status `received`. Receipt does not mean verification or resolution.

Assistant request example:

```json
{
  "message": "How does the safety score work?",
  "history": [],
  "current_path": "/journey"
}
```

Assistant messages allow 1 to 2,000 trimmed characters. History roles are limited to user and assistant. Current paths are limited to the seven existing routes. Unknown fields, excessive history and invalid paths return 422. Missing configuration, empty/incomplete responses or provider failures return a friendly 503; provider rate limiting returns 429. No raw provider diagnostics are returned.

## Ask Thaai

Ask Thaai uses the existing footprint identity, with a floating launcher and a keyboard-accessible dialog. Conversation stays in React state across page navigation and closes without clearing it. Clear conversation or a full reload resets it. Introductory launcher behaviour uses only a session preference.

The backend sends the latest ten relevant messages plus the new question and a whitelisted page path. Product knowledge and safety instructions live in `backend/app/services/assistant_context.py`. Responses use `store=False`, a bounded output, a 25 second provider timeout and no automatic retries. The frontend times out after 30 seconds. There are no agent tools, database lookups, location attachments, report submissions or bookings through the assistant.

Common urgent phrases trigger fixed emergency guidance before any provider call, including when no key exists. This conservative rule does not detect every emergency; the system instructions also prioritize concise emergency help. The assistant is automated and can make mistakes. Its plain text is never rendered as HTML or converted into arbitrary clickable URLs. Feature links come only from a fixed route allowlist.

Without a key or backend connection, the panel remains usable and explains that Thaai is unavailable. It does not invent a conversational reply. The user can still open every product feature. Text to speech starts only on a speaker-button press, prefers an available en-IN voice, falls back to another English voice, and stops on close, clear or an explicit stop action. Browser/OS voice availability varies; some voices may use remote speech services.

Implementation references: [OpenAI text generation](https://developers.openai.com/api/docs/guides/text) and [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna).

## Data, privacy and limitations

Journey estimates, scores and route geometry are fixed illustrations. The six hub coordinates identify proposed example points, not confirmed facilities. Paths may not follow streets and must not be treated as turn by turn navigation. OpenStreetMap imagery is external map data; it does not validate the overlaid safety information. Only matching hubs appear after filtering.

Browser location is requested only on a button press. It remains in frontend page state and is not stored in SQLite, browser storage or report records. Journey may choose the nearest supported planning area within 3 km; it never invents a connecting route from arbitrary coordinates. Map tile requests reveal the viewed area to OpenStreetMap. External directions share the chosen hub coordinates when intentionally opened. Geolocation and clipboard features require HTTPS or localhost; a phone visiting a laptop's plain HTTP LAN address may not have access.

Reports are anonymous and do not request names, phone numbers, emails or ID numbers. Free text can still contain identifying details, so the form discourages them. SQLite retains submitted landmarks and descriptions locally; neither report listing endpoint exposes those fields. Community counts represent received submissions only, not official crime or safety statistics.

Ask Thaai never automatically receives browser location, emergency coordinates, report descriptions, landmarks, phone numbers or database contents. Text intentionally entered by the user and recent chat turns are sent through FastAPI to OpenAI. Do not include identifying details. No chat messages are saved in SQLite or browser storage. `store=False` disables hosted response retrieval storage; it is not a promise of zero provider retention. See [OpenAI data controls](https://platform.openai.com/docs/guides/your-data) for provider policies. Application code does not log messages or keys.

Emergency Help provides real contact links for **112** and **181**. It does not place a call automatically, send an alert, contact police or dispatch responders. Sharing requires the user to choose an app/recipient and complete sending. Sharing success is not delivery confirmation. Browser location accuracy is device dependent. No continuous GPS tracking occurs.

The dismissible global prototype notice explains illustrative mobility data. The original concept files in `docs/original_prototype` remain reference material and are not working application code.

## Checks

```powershell
# From frontend
npm run build
npm run preview
node --test tests/mapData.test.js

# From backend
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe -m pip check
```

Preview runs at http://localhost:4173. Backend tests use isolated data and mocked provider calls, including request bounds, missing configuration, emergency wording, output contracts and sanitized provider failures. No OpenAI key was available during implementation, so real model quality and latency still need validation with a configured account. No paid provider call is required by the tests.

Browser validation covers suggestions, sending, errors, clear/close/reopen, internal navigation, bounded/private request payloads, speech controls, keyboard focus, reduced motion and mobile layouts, alongside the existing product flows. A mocked provider reply tests UI behaviour without pretending it came from a live model. Physical GPS, native share sheets, speech audio and mobile keyboards should also be checked on real devices. Temporary automated report records should be deleted after testing without removing genuine submissions.

## Production deployment considerations

Deployment is not included in this task. Before public release:

- Serve the frontend with HTTPS and an SPA fallback to index.html. Build with the correct public backend URL and configure explicit backend CORS origins.
- Keep OpenAI secrets in the server environment or a secret manager. Confirm model access, budgets and billing. Add request size limits, rate limiting, abuse controls and monitoring before exposing the currently unauthenticated assistant endpoint publicly.
- Establish report moderation, retention, deletion and access policies. Protect the SQLite file, plan backups and introduce managed schema migrations when needed.
- Validate route and facility datasets before making real safety or availability claims. No official affiliation or emergency dispatch integration exists.
- Follow the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/), including attribution, caching and capacity planning. No tile prefetch or offline download is implemented.
- Test accessibility, language needs, mobile browsers, voice availability, location permissions, service outages and provider responses with intended users. Preserve a usable experience without the assistant.
