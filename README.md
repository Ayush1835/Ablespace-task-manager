# AbleSpace Task Management System Assessment

This is the full-stack codebase matching the requirements of the AbleSpace technical evaluation. It includes a frontend build using **Next.js 14 App Router** with Tailwind CSS and a backend server powered by **NestJS** and **Prisma ORM (SQLite)**.

---

## 🏗️ Project Architecture

```
ablespace-task-manager/
├── backend/               # NestJS API Server
│   ├── prisma/            # Schema definition and SQLite local database
│   ├── src/
│   │   ├── auth/          # JWT authentication and Guest Login session logic
│   │   ├── tasks/         # User-scoped task CRUD controllers and validation pipes
│   │   ├── prisma.service.ts
│   │   └── app.module.ts
│   └── package.json
│
├── frontend/              # Next.js App Router Client
│   ├── src/
│   │   ├── app/           # Navigation routers and page views
│   │   ├── components/    # Reusable cards, boards, lists, and toggles
│   │   └── globals.css    # Tailwind base styles and glassmorphism utilities
│   └── package.json
└── README.md
```

---

## 🚀 Local Run Instructions

Follow these quick commands to spin up the local server and client pages.

### 1. Start the Backend (NestJS + SQLite)

Open a terminal window and execute:

```bash
# Navigate to the backend directory
cd backend

# Install NestJS, Prisma, and security dependencies
npm install

# Initialize your local dev.db database and run migrations
npm run prisma:db:push

# Generate client models
npm run prisma:generate

# Start the NestJS developer watch server (starts on http://localhost:3001)
npm run start:dev
```

### 2. Start the Frontend (Next.js + Tailwind)

Open a separate terminal window and execute:

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Run the Next.js developer page server (starts on http://localhost:3000)
npm run dev
```

---

## ✨ Implemented Core Features

* **High Figma Fidelity:** Beautiful light/dark theme aesthetics, complete Kanban column drag-and-drop actions, list tabular view tables, custom progress sliders, and assignee card templates.
* **Instant Guest Login:** A single click instantly seeds a mock clinician caseload dashboard in the database and creates an active JWT auth session.
* **Prisma & SQLite Integration:** Extremely clean local database storage with migrations.
* **Input Validation:** Built-in `class-validator` schema guards on NestJS endpoints.
* **Persistent Themes:** The light/dark mode state is persisted in the browser `localStorage` and transitions fluidly to avoid flashing.
