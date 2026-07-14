# JobTrack – Job Application Tracker

JobTrack is a full-stack application for recording, organizing and monitoring job applications.

## Features

- User registration and login
- JWT authentication
- Protected frontend and backend routes
- Create, view, edit and delete job applications
- Search by company or position
- Filter applications by status
- Dashboard statistics
- Responsive interface
- Backend and frontend unit tests

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Vitest
- React Testing Library

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT and Passport
- bcrypt
- Jest

## Application Workflows

### Authentication workflow

1. Register a new account.
2. Sign in using email and password.
3. Access protected application routes.
4. Sign out.

### Job application workflow

1. Add a job application.
2. View it in the application list.
3. Open its details.
4. Update its status and notes.
5. Delete it when no longer needed.

## Required Software

- Node.js 20.9 or later
- npm
- PostgreSQL
- Git

## Project Structure

```text
job-application-tracker/
├── backend/
├── frontend/
└── README.md
```

## Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE job_tracker_db;
```

## Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Copy the environment example:

### Git Bash, macOS or Linux

```bash
cp .env.example .env
```

### Windows Command Prompt

```cmd
copy .env.example .env
```

Update `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/job_tracker_db?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3001
```

Apply the database migration:

```bash
npx prisma migrate deploy
npx prisma generate
```

Start the backend:

```bash
npm run start:dev
```

The backend runs at:

```text
http://localhost:3001/api
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Copy the environment example:

### Git Bash, macOS or Linux

```bash
cp .env.example .env.local
```

### Windows Command Prompt

```cmd
copy .env.example .env.local
```

Confirm `frontend/.env.local` contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Production Build Checks

### Backend

```bash
cd backend
npm run lint
npm run build
npm test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
npm test
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Applications

```text
POST   /api/applications
GET    /api/applications
GET    /api/applications/statistics
GET    /api/applications/:id
PATCH  /api/applications/:id
DELETE /api/applications/:id
```

## Security Notes

- Passwords are hashed with bcrypt.
- Plain-text passwords are never stored.
- Application routes require JWT authentication.
- Users can access only their own job applications.
- Environment files containing secrets are excluded from Git.

## Author

Ahcmad Angagao