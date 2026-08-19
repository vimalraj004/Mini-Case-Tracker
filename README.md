# Mini Case Tracker — MERN Stack

Production-oriented take-home implementation for the Verifact Mini Case Tracker.

## Stack

- Frontend: React + Vite + Material UI + React Router + Axios
- Backend: Node.js + Express + MongoDB/Mongoose
- Auth: JWT + bcrypt
- Validation: Zod
- Uploads: Multer + local `uploads/`
- Security: Helmet, CORS, rate limiting
- Roles: Manager, Agent

## Core status flow

`New -> Assigned -> In Progress -> Submitted -> Cleared / Discrepant`

Status transitions are enforced on the server and every transition is written to the audit log.

## Run

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173`.
Backend defaults to `http://localhost:5000`.

## Test credentials

Seeded by `npm run seed`:

- Manager: `manager@demo.com` / `Manager@123`
- Agent: `agent@demo.com` / `Agent@123`

Change these credentials before deployment.

## Environment

See `backend/.env.example`.

## Production notes

- Use MongoDB Atlas in deployment.
- Replace the local upload directory with object storage for a production deployment if required.
- Restrict CORS to the deployed frontend origin.
- Store JWT secret only in environment variables.
- Do not commit `.env` or uploaded documents.
