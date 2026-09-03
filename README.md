# Eri Pharmacy

A pharmacy inventory app — browse, search, sort, add, edit and delete medicines.

React 19 + Vite 6 + Tailwind v4 · Express 5 + `pg` · PostgreSQL 16

There are two ways to run it: **everything in Docker** (recommended — no setup), or **directly on your machine**.

---

## Option A — Docker

The only prerequisite is Docker with Docker Compose.

```bash
docker compose up --build
```

Open **http://localhost:5173**.

The first build takes a few minutes while both images run `npm install`. After that, plain `docker compose up` is enough unless a `package.json` changed.

| Service | Host port |
|---|---|
| frontend (Vite) | 5173 |
| backend (Express) | 3000 |
| db (Postgres) | 5432 |

Both app containers run in watch mode over a bind mount, so **edits on your host reload automatically** — no rebuild needed.

### Seed some data

The `medicines` table is created automatically on backend startup, but it starts **empty** — the app ships with sample data in `backend/src/model/medicines.js` that is never actually called. Load it manually:

```bash
docker compose exec db psql -U postgres -d eri_pharmacy -c "INSERT INTO medicines (name, category, price, quantity) VALUES ('Paracetamol','Pain Reliever',5.99,100),('Amoxicillin','Antibiotic',12.50,50),('Ibuprofen','Anti-inflammatory',7.25,75),('Cetirizine','Antihistamine',3.80,120),('Omeprazole','Antacid',9.40,60);"
```

### Everyday commands

```bash
docker compose up                  # start
docker compose up -d               # start detached
docker compose logs -f backend     # follow one service
docker compose down                # stop, keep the database
docker compose down -v             # stop and DESTROY the database
```

To install a new dependency, do it inside the container — `node_modules` is an anonymous volume, so a host-side `npm install` won't reach it:

```bash
docker compose exec backend npm install <package>
docker compose up --build backend
```

---

## Option B — Local

Requires **Node 22+** and a **PostgreSQL 16** server. Two config values are hardcoded for Docker and must be changed first.

### 1. Start a database

Easiest is to run just the database in Docker and leave the apps on your host:

```bash
docker compose up db
```

Otherwise, point at any local Postgres and create the database:

```bash
createdb eri_pharmacy
```

### 2. Backend

`dotenv.config()` looks for `.env` in the directory you run from, so the root `.env` will **not** be picked up. Create `backend/.env`:

```
POSTGRES_CONNECTION=postgresql://postgres:<your-password>@localhost:5432/eri_pharmacy
```

Note `localhost`, not `db` — `db` is the Compose service name and only resolves inside the Docker network.

```bash
cd backend
npm install
npm run start
```

The API comes up on **http://localhost:3000**. Verify it:

```bash
curl http://localhost:3000/api/medicines
```

### 3. Frontend

The Vite proxy targets the Docker service name, so change it in `frontend/vite.config.js`:

```js
proxy: { "/api": { target: "http://localhost:3000" } }   // was http://backend:3000
```

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Seed data the same way as above, using `psql` against your local database.

---

## Environment variables

Everything lives in one `.env` at the repository root, next to `docker-compose.yml`, where Compose finds it automatically.

| Variable | Used by |
|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Postgres container initialisation |
| `POSTGRES_CONNECTION` | The backend — **the only variable the code actually reads** |
| `POSTGRES_HOST` / `POSTGRES_PORT` | Unused by the code; reference only |
| `VITE_BACKEND_URL` / `VITE_BACKEND_PORT` / `VITE_LOCAL_*` | Passed to the frontend container |

The host inside `POSTGRES_CONNECTION` is the thing that changes between the two setups: **`db`** in Docker, **`localhost`** when running on your machine.

---
