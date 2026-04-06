# Zorvyn Assessment

Full-stack assignment project with:
- Backend: Express + MongoDB REST API with JWT auth and role-based access
- Frontend: React documentation and API playground UI

## Submission
- GitHub Repository: <add-your-github-repo-link>
- Live Project: https://zorvyn-assesment-krishna.vercel.app/
- Backend API: https://zorvyn-assesment-phi.vercel.app

## Repository
- Source code: this Git repository
- Main folders:

```text
backend/   # Express API
frontend/  # React app (docs + playground)
```

## Key Features
- JWT-based authentication (`/api/auth/login`)
- Role-based authorization (`admin`, `analyst`, `viewer`)
- Financial records CRUD and filtering
- Dashboard analytics endpoints
- API docs and live request playground in frontend

## Tech Stack
| Layer | Stack |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express, Mongoose, JWT, express-validator |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend + backend) |

## Local Setup
### 1) Clone
```bash
git clone <your-repo-url>
cd zorvyn-assesment
```

### 2) Backend setup
```bash
cd backend
npm install
```

Create `.env` in `backend/`:
```dotenv
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
PORT=5000
```

Run backend:
```bash
npm run dev
```

### 3) Frontend setup
```bash
cd ../frontend
npm install
```

Create `.env` in `frontend/`:
```dotenv
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

## API Route Summary
| Module | Base Path | Notes |
|---|---|---|
| Auth | `/api/auth` | Register / Login |
| Users | `/api/users` | User management (protected) |
| Records | `/api/records` | Financial records operations |
| Dashboard | `/api/dashboard` | Analytics and summaries |

## Deployment Notes
- Backend is configured for Vercel serverless under `backend/api/index.js`.
- Frontend uses `VITE_API_BASE_URL` to target deployed API.
- For production, set environment variables in Vercel project settings.
