# Airport Assets Management System

A full-stack asset management platform for airport operations — built with React, FastAPI, and PostgreSQL.

## Quick Start

```bash
git clone https://github.com/addisalem-d/airport-assets.git
cd airport-assets
docker compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:8000        |
| API Docs | http://localhost:8000/docs   |

**Default credentials**
- `admin` / `admin123` — Administrator
- `user1` / `manager123` — Manager

---

## Features

- **Dashboard** — KPI cards + D3 bar chart (assets by category), asset status breakdown, maintenance stats
- **User Management** — CRUD, role filter, search, active/inactive toggle
- **Assets** — Full asset inventory with category filter, add/edit/delete
- **Locations** — Airport zones and facilities management
- **Maintenance** — Ticket tracking with priority and status management
- **JWT Auth** — Login/logout with token-based authentication

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, Vite, CSS Modules |
| Charts    | D3.js                                   |
| State     | Zustand                                 |
| Backend   | FastAPI, Python 3.12                    |
| ORM       | SQLAlchemy 2.0 + Alembic                |
| Database  | PostgreSQL 16                           |
| Auth      | JWT (python-jose + bcrypt)              |
| Container | Docker + Docker Compose                 |
| CI        | GitHub Actions                          |

---

## Project Structure

```
airport-assets/
├── src/                    # React frontend
│   ├── components/
│   │   ├── charts/         # D3 chart components
│   │   ├── layout/         # Sidebar, Topbar
│   │   └── ui/             # Shared UI components
│   ├── pages/              # Dashboard, Users, Assets, Locations, Maintenance
│   ├── services/           # API service layer (mock/real swap)
│   ├── types/              # TypeScript interfaces
│   └── data/               # Mock data
├── backend/
│   ├── routers/            # FastAPI route handlers
│   ├── models/             # SQLAlchemy ORM models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── core/               # Config, security, dependencies
│   └── db/                 # Database setup + seed script
├── docker-compose.yml
├── Dockerfile              # Frontend container
└── .github/workflows/ci.yml
```

---

## Development

### Without Docker

**Frontend**
```bash
npm install
VITE_USE_MOCK=true npm run dev
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
# Start PostgreSQL then:
PYTHONPATH=. python db/seed.py
uvicorn main:app --reload
```

### Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable                    | Default                                          |
|-----------------------------|--------------------------------------------------|
| `VITE_USE_MOCK`             | `false`                                          |
| `VITE_API_URL`              | `http://localhost:8000`                          |
| `DATABASE_URL`              | `postgresql://admin:secret@db:5432/airport_assets` |
| `SECRET_KEY`                | change in production                             |

---

## CI/CD

GitHub Actions runs on every push to `main` and `feature/*`:
- Frontend: `npm ci` → `vite build`
- Backend: pip install → import check

---

## API Endpoints

Full interactive docs at `http://localhost:8000/docs`

| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | /auth/login            | Login, get JWT token |
| GET    | /users                 | List all users       |
| POST   | /users                 | Create user          |
| PATCH  | /users/{id}            | Update user          |
| DELETE | /users/{id}            | Delete user          |
| GET    | /assets                | List all assets      |
| POST   | /assets                | Create asset         |
| GET    | /locations             | List all locations   |
| POST   | /locations             | Create location      |
| GET    | /maintenance           | List all tickets     |
| POST   | /maintenance           | Create ticket        |
| PATCH  | /maintenance/{id}      | Update ticket status |
| GET    | /dashboard/summary     | Dashboard stats      |