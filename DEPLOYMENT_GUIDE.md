# TailorAI - Deployment Guide
## Complete Infrastructure & Deployment Documentation

---

## 1. Architecture Overview

```
                    +------------------+
                    |   Load Balancer  |
                    |  (nginx/cloud)   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
     /api/* requests              All other requests
              |                             |
    +---------v----------+     +------------v-----------+
    |   Backend (API)    |     |   Frontend (SPA)       |
    |   FastAPI + Python |     |   Vite + React + TS    |
    |   Port: 8001       |     |   Port: 3000 (dev)     |
    +--------+-----------+     |   Static files (prod)  |
             |                 +------------------------+
    +--------v-----------+
    |     MongoDB        |
    |     Port: 27017    |
    +--------------------+
    
    External Services:
    - Resend API (email)
    - OpenAI API via Emergent LLM Key (AI chat)
```

---

## 2. Technology Stack

| Component        | Technology           | Version    |
|-----------------|---------------------|------------|
| **Runtime**     | Python              | 3.11+      |
| **Runtime**     | Node.js             | 20.x LTS   |
| **Backend**     | FastAPI             | 0.110+     |
| **ASGI Server** | Uvicorn             | latest     |
| **Frontend**    | React               | 18.3.1     |
| **Bundler**     | Vite                | 6.4+       |
| **CSS**         | Tailwind CSS        | 4.1+       |
| **Language**    | TypeScript          | (via Vite) |
| **Database**    | MongoDB             | 7.0+       |
| **DB Driver**   | Motor (async)       | latest     |
| **PDF Gen**     | fpdf2               | 2.8+       |
| **Email**       | Resend SDK          | 2.26+      |
| **AI/LLM**     | emergentintegrations | 0.1.0      |
| **Pkg Manager** | yarn                | 1.22+      |

---

## 3. Environment Variables

### 3.1 Backend (`/backend/.env`)

| Variable           | Required | Description                                    | Example                          |
|-------------------|----------|------------------------------------------------|----------------------------------|
| `MONGO_URL`       | Yes      | MongoDB connection string                      | `mongodb://localhost:27017`      |
| `DB_NAME`         | Yes      | MongoDB database name                          | `portfolio_db`                   |
| `EMERGENT_LLM_KEY`| Yes      | API key for AI chat (OpenAI via Emergent)      | `sk-emergent-xxxxx`             |
| `ADMIN_PASSWORD`  | Yes      | Admin dashboard password                       | `your-secure-password`           |
| `RESEND_API_KEY`  | Yes      | Resend email service API key                   | `re_xxxxx`                       |
| `SENDER_EMAIL`    | Yes      | Email sender address (Resend verified)         | `hello@yourdomain.com`           |
| `ADMIN_EMAIL`     | Yes      | Admin notification recipient email             | `admin@yourdomain.com`           |

### 3.2 Frontend (`/frontend/.env`)

| Variable                 | Required | Description                     | Example                              |
|-------------------------|----------|---------------------------------|--------------------------------------|
| `REACT_APP_BACKEND_URL` | Yes      | Public URL of the application   | `https://tailorai.yourdomain.com`    |

**Important**: In production with a reverse proxy, the frontend calls `/api/*` which the proxy routes to the backend. The `REACT_APP_BACKEND_URL` is used only for absolute URL references.

---

## 4. MongoDB Collections

| Collection      | Description                        | Key Fields                                          |
|----------------|------------------------------------|-----------------------------------------------------|
| `contacts`     | Contact form submissions           | contact_id, name, email, subject, message, status   |
| `appointments` | Consultation bookings              | appointment_id, name, email, date, time, topic      |
| `chats`        | AI chat message history            | session_id, user_message, ai_response               |
| `leads`        | Lead magnet email captures         | lead_id, name, email, company                       |
| `notifications`| Admin notification queue           | notification_id, type, title, message, read         |

No indexes are required beyond MongoDB defaults. All queries use projections (`{"_id": 0}`) and limits.

---

## 5. API Endpoints

| Method | Path                                          | Description                    | Auth     |
|--------|-----------------------------------------------|--------------------------------|----------|
| GET    | `/api/health`                                 | Health check                   | None     |
| POST   | `/api/contact`                                | Submit contact form            | None     |
| GET    | `/api/contacts`                               | List all contacts              | None     |
| POST   | `/api/appointments`                           | Book consultation              | None     |
| GET    | `/api/appointments/available?date=YYYY-MM-DD` | Get available time slots       | None     |
| GET    | `/api/appointments/{id}/calendar`             | Download ICS calendar file     | None     |
| POST   | `/api/chat`                                   | Send message to AI assistant   | None     |
| GET    | `/api/chat/history/{session_id}`              | Get chat history               | None     |
| POST   | `/api/leads`                                  | Capture lead magnet email      | None     |
| GET    | `/api/leads/guide-pdf`                        | Get PDF guide download URL     | None     |
| POST   | `/api/admin/login`                            | Admin authentication           | Password |
| GET    | `/api/admin/stats`                            | Dashboard statistics           | Token    |
| GET    | `/api/admin/notifications`                    | List notifications             | Token    |
| PUT    | `/api/admin/notifications/{id}/read`          | Mark notification read         | Token    |
| PUT    | `/api/admin/notifications/read-all`           | Mark all notifications read    | Token    |
| PUT    | `/api/admin/appointments/{id}/status?status=x`| Update appointment status      | Token    |

Admin auth: POST `/api/admin/login` with `{"password": "..."}` returns `{"token": "sha256_hash"}`. Use token in `x-admin-token` header.

---

## 6. Frontend Routes

| Path            | Component        | Description                      |
|----------------|------------------|----------------------------------|
| `/`            | Home             | Landing page (11 sections)       |
| `/use-cases`   | UseCases         | Full use cases showcase (8)      |
| `/about`       | About            | Portfolio overview               |
| `/contact`     | Contact          | Contact form                     |
| `/consultation`| Consultation     | Appointment booking              |
| `/ai-app`      | AIApp            | AI Problem Solver tool           |
| `/admin`       | AdminDashboard   | Admin panel (password protected) |

---

## 7. Deployment Instructions by Platform

---

### 7.1 Docker / Docker Compose (Any Cloud)

#### Dockerfile - Backend
```dockerfile
FROM python:3.11-slim

WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8001
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]
```

#### Dockerfile - Frontend (Production Build)
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### nginx.conf (Frontend + API Proxy)
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # API proxy to backend
    location /api/ {
        proxy_pass http://backend:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    restart: always
    env_file:
      - ./backend/.env
    depends_on:
      - mongodb
    ports:
      - "8001:8001"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  mongo_data:
```

#### Deploy Commands
```bash
# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

---

### 7.2 Railway

1. **Create project** at railway.app
2. **Add MongoDB plugin** from Railway marketplace
3. **Add Backend service**:
   - Root directory: `/backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Set env vars: `MONGO_URL` (from Railway MongoDB), `DB_NAME`, `EMERGENT_LLM_KEY`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `SENDER_EMAIL`, `ADMIN_EMAIL`
4. **Add Frontend service**:
   - Root directory: `/frontend`
   - Build command: `yarn install && yarn build`
   - Start command: `npx serve dist -s -l $PORT`
   - Or use static hosting: output directory `dist`
5. **Configure networking**: Point frontend `/api/*` to backend service URL via Railway's internal networking or nginx config

---

### 7.3 Vercel + Railway (Hybrid)

**Frontend on Vercel, Backend on Railway:**

1. **Vercel (Frontend)**:
   - Import repo, set root directory: `frontend`
   - Framework preset: Vite
   - Build command: `yarn build`
   - Output directory: `dist`
   - Add `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://your-railway-backend.up.railway.app/api/:path*" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Railway (Backend + MongoDB)**: Same as 7.2 steps 2-3

---

### 7.4 AWS (EC2 / ECS / Elastic Beanstalk)

#### EC2 (Manual)
```bash
# 1. Launch Ubuntu 22.04 EC2 instance (t3.small minimum)
# 2. Install dependencies
sudo apt update && sudo apt install -y python3.11 python3.11-venv nodejs npm nginx
npm install -g yarn
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# 3. Deploy backend
cd /opt/tailorai/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Deploy frontend
cd /opt/tailorai/frontend
yarn install && yarn build

# 5. Configure nginx (copy nginx.conf from 7.1, point root to frontend/dist)
# 6. Setup systemd service for uvicorn
# 7. Configure SSL with certbot
```

#### ECS / Fargate
Use the Dockerfiles from 7.1, push to ECR, deploy as ECS services with an ALB load balancer. Use MongoDB Atlas for the database.

---

### 7.5 Google Cloud (Cloud Run / GCE)

#### Cloud Run (Serverless)
```bash
# Backend
cd backend
gcloud run deploy tailorai-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGO_URL=mongodb+srv://...,DB_NAME=portfolio_db,..."

# Frontend (build and deploy to Firebase Hosting or Cloud Storage + CDN)
cd frontend
yarn build
gcloud storage cp -r dist/* gs://tailorai-frontend/
```

Use **MongoDB Atlas** for the database (Cloud Run cannot host MongoDB).

---

### 7.6 DigitalOcean (App Platform / Droplet)

#### App Platform
1. Create app from GitHub repo
2. Add component: **Backend** (Python, `/backend`, start: `uvicorn server:app --host 0.0.0.0 --port $PORT`)
3. Add component: **Frontend** (Static Site, `/frontend`, build: `yarn build`, output: `dist`)
4. Add **Database**: MongoDB (managed)
5. Configure env vars and internal routing

#### Droplet
Same as EC2 manual setup (7.4). Use managed MongoDB from DigitalOcean or MongoDB Atlas.

---

### 7.7 Netlify + Fly.io (Hybrid)

1. **Netlify (Frontend)**:
   - Build command: `cd frontend && yarn build`
   - Publish directory: `frontend/dist`
   - Add `_redirects` file in `frontend/public`:
   ```
   /api/*  https://your-fly-backend.fly.dev/api/:splat  200
   /*      /index.html                                    200
   ```

2. **Fly.io (Backend)**:
   ```bash
   fly launch --name tailorai-api
   fly secrets set MONGO_URL="..." DB_NAME="..." EMERGENT_LLM_KEY="..." ...
   fly deploy
   ```
   Use `fly.toml` with the Backend Dockerfile.

---

### 7.8 Hetzner / Bare Metal VPS

Most cost-effective for production. Use the Docker Compose setup from 7.1:

```bash
# 1. Provision VPS (CX21 or higher, 4GB RAM minimum)
# 2. Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
sudo apt install docker-compose-plugin

# 3. Clone repo and deploy
git clone <repo> /opt/tailorai
cd /opt/tailorai
cp .env.example backend/.env  # Configure env vars
docker compose up -d

# 4. Setup reverse proxy with Caddy (auto-SSL)
sudo apt install caddy
# Caddyfile:
# tailorai.com {
#     reverse_proxy localhost:80
# }
```

---

## 8. Production Checklist

### Security
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Configure CORS to allow only your domain (replace `*` in server.py)
- [ ] Use HTTPS (SSL/TLS) - mandatory for production
- [ ] Set `SENDER_EMAIL` to a verified domain email in Resend
- [ ] Store all secrets in a secrets manager (not .env files in production)
- [ ] Add rate limiting to API endpoints (especially `/api/chat` and `/api/contact`)

### Performance
- [ ] Build frontend for production: `yarn build` (outputs static files to `dist/`)
- [ ] Serve frontend from CDN or nginx (not Vite dev server)
- [ ] Set Uvicorn workers to 2-4 for production: `--workers 4`
- [ ] Enable MongoDB connection pooling (Motor handles this by default)
- [ ] Add MongoDB indexes if data grows:
  ```javascript
  db.contacts.createIndex({ "created_at": -1 })
  db.appointments.createIndex({ "date": 1, "time": 1 })
  db.notifications.createIndex({ "read": 1, "created_at": -1 })
  ```

### Monitoring
- [ ] Setup health check monitoring on `/api/health`
- [ ] Configure log aggregation (stdout/stderr)
- [ ] Setup MongoDB backup schedule (daily `mongodump`)
- [ ] Monitor disk usage (MongoDB data growth)

### DNS & Domain
- [ ] Point domain A record to server IP
- [ ] Configure SSL certificate (Let's Encrypt / Cloudflare)
- [ ] Update `REACT_APP_BACKEND_URL` in frontend .env
- [ ] Update Resend sender domain verification

---

## 9. External Service Accounts Required

| Service              | Purpose                    | How to Get                                    | Cost         |
|---------------------|----------------------------|-----------------------------------------------|-------------|
| **Resend**          | Transactional emails       | https://resend.com (sign up)                  | Free: 100/day, Pro: $20/mo |
| **Emergent LLM Key**| AI chat (OpenAI GPT)       | Emergent platform (Profile > Universal Key)   | Pay per use  |
| **MongoDB Atlas**   | Managed database (if not self-hosted) | https://cloud.mongodb.com          | Free tier available |
| **Domain**          | Custom domain              | Any registrar (Namecheap, Cloudflare, etc.)   | ~$10/year    |

---

## 10. Resource Requirements

| Component  | Minimum        | Recommended      |
|-----------|---------------|------------------|
| **CPU**   | 1 vCPU        | 2 vCPU           |
| **RAM**   | 2 GB          | 4 GB             |
| **Disk**  | 10 GB         | 20 GB            |
| **OS**    | Ubuntu 22.04+ | Ubuntu 24.04 LTS |

Estimated monthly cost (VPS): 5-20 EUR depending on provider.

---

## 11. Backup Strategy

```bash
# MongoDB backup (run daily via cron)
mongodump --uri="mongodb://localhost:27017" --db=portfolio_db --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017" --db=portfolio_db /backups/20260401/portfolio_db
```

---

## 12. Quick Start (Development)

```bash
# Clone repository
git clone <repo-url> tailorai
cd tailorai

# Backend
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your values
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (new terminal)
cd frontend
yarn install
yarn dev

# MongoDB (must be running)
mongod --bind_ip_all
```

App available at `http://localhost:3000`
