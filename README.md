# Mini Case Tracker

A full-stack case management application built with React, Node.js, Express.js, and MongoDB. The application provides role-based access for Managers and Agents with case management, dashboard analytics, audit logging, and document upload functionality.

## Live Demo

- **Frontend:** https://mini-case-tracker-eight.vercel.app/
- **Backend:** https://mini-case-tracker-h8se.onrender.com
- **Health Check:** https://mini-case-tracker-h8se.onrender.com/api/health

## Features

- JWT-based authentication
- Role-based authorization
- Manager and Agent roles
- Case creation and management
- Case assignment to Agents
- Case status management
- Dashboard analytics
- Audit logging
- Document uploads
- Protected API routes
- API rate limiting
- Input validation
- Health check endpoint

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Material UI
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Helmet
- CORS
- Morgan
- Express Rate Limit

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account

### Backend Setup

cd backend
npm install

Create a .env file using .env.example and add your MongoDB and JWT configuration.

Then initialize the database:

npm run seed

Start the backend:

npm start

Backend:

http://localhost:5000
Frontend Setup
cd frontend
npm install

Create a .env file:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Frontend:

http://localhost:5173
Database Seeding

The project uses a seed script to initialize the database with demo users and initial data.

Run:

npm run seed

Important: Run the seed command before logging in with the demo credentials on a fresh database.

Demo Credentials
Manager
Email: manager@demo.com
Password: Manager@123
Role: Manager
Agent
Email: agent@demo.com
Password: Agent@123
Role: Agent

These credentials are provided for demonstration and evaluation purposes.

Environment Variables

Create a .env.example file with:

MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
CLIENT_URL=
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
PORT=5000

Do not commit the actual .env file or production secrets.

API Routes

Main API modules:

/api/auth
/api/cases
/api/users
/api/audit-logs
/api/dashboard
/api/health

Health check:

GET /api/health
Assumptions
The application has two primary roles: Manager and Agent.
Managers have broader access to case management and administrative features.
Agents can access and update cases according to their permissions.
MongoDB Atlas is used as the hosted database.
JWT is used for authentication.
Demo users are created using the seed script.
Uploaded files use the configured upload directory.
The provided credentials are for evaluation purposes only.
Development Time

Approximately 10–12 hours, including development, testing, debugging, and deployment.

Repository

GitHub:
https://github.com/vimalraj004/Mini-Case-Tracker

Author

Vimalraj J
MERN Full Stack Developer
