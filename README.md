# TrackWise 🇩🇪

> Smart compliance assistant for international students in Germany.  
> Track your work hours and important documents — stay legal, stay stress-free.

---

## Features

- **Time Tracking** — Log work hours per job, visualize monthly usage, enforce German student/mini-job/part-time/full-time limits
- **Document Tracking** — Store visa, residence permit, health insurance card, and other documents with expiry alerts
- **AI Guidance** — Claude-powered insights that warn you before you break rules, with an ask-anything chat
- **Automated Alerts** — Daily cron checks for expiring documents and approaching work hour limits

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts, React Router v7 |
| Backend | Node.js, Express, better-sqlite3 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Storage | Local filesystem + SQLite (Docker volume) |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions → GHCR → SSH deploy |
| Reverse Proxy | Nginx |

---

## Quick Start (Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local dev without Docker)
- Anthropic API key

### 1. Clone & configure

```bash
git clone https://github.com/yourname/trackwise.git
cd trackwise
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Run with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:4000
- Via Nginx: http://localhost:80

### 3. Run locally (without Docker)

**Backend:**
```bash
cd backend
npm install
ANTHROPIC_API_KEY=your_key node src/index.js
```

**Frontend:**
```bash
cd frontend
npm install
VITE_API_URL=http://localhost:4000 npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `JWT_SECRET` | Secret for JWT signing | `supersecretkey` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | required |
| `PORT` | Backend port | `4000` |
| `DB_PATH` | SQLite database path | `/app/data/trackwise.db` |
| `VITE_API_URL` | Backend URL for frontend | `http://localhost:4000` |

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) does:

1. **On every push/PR**: Run lint + build tests for both frontend and backend
2. **On `main` branch merge**: Build Docker images and push to GitHub Container Registry (GHCR)
3. **Deploy**: SSH into production server and run `docker compose pull && up -d`

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VITE_API_URL` | Production API URL |
| `JWT_SECRET` | Production JWT secret |
| `DEPLOY_HOST` | Production server IP/hostname |
| `DEPLOY_USER` | SSH user on production server |
| `DEPLOY_SSH_KEY` | SSH private key for deployment |

---

## Production Deployment

On your server:

```bash
mkdir -p /opt/trackwise
cd /opt/trackwise

# Copy docker-compose.prod.yml and nginx/nginx.conf
# Set environment variables
export JWT_SECRET=your_production_secret
export ANTHROPIC_API_KEY=your_key
export GITHUB_REPOSITORY=yourname/trackwise
export IMAGE_TAG=latest

docker compose -f docker-compose.prod.yml up -d
```

---

## German Work Rules Enforced

| Rule | Limit |
|---|---|
| Student annual | 140 full days (≥4h) OR 280 half days |
| Full day threshold | ≥ 4 hours in a day |
| Mini-job monthly | 30 hours |
| Part-time monthly | 80 hours |
| Full-time monthly | 180 hours |
| Visa renewal notice | 3 months before expiry → AI alert |
| Document expiry warning | 90 days → warning, 30 days → critical |

---

## Project Structure

```
trackwise/
├── frontend/               # React 19 + Vite
│   ├── src/
│   │   ├── pages/          # Dashboard, Documents, Time, AI, Settings
│   │   ├── components/     # Layout, reusable UI
│   │   ├── context/        # Auth context
│   │   └── utils/          # API client
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # Node.js + Express
│   ├── src/
│   │   ├── routes/         # auth, documents, time, ai
│   │   ├── middleware/     # JWT auth
│   │   ├── models/         # SQLite init
│   │   └── utils/          # Cron jobs
│   └── Dockerfile
├── nginx/                  # Reverse proxy config
├── .github/workflows/      # CI/CD pipeline
├── docker-compose.yml      # Development
└── docker-compose.prod.yml # Production
```

---

## License

MIT
