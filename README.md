# TaskFlow Frontend

The Next.js frontend for TaskFlow — a full-stack task management application.

## Tech Stack

- **Next.js 16** — React framework with App Router
- **TypeScript** — type safety throughout
- **Tailwind CSS** — utility-first styling
- **Turbopack** — fast dev server bundler
- **Bun** — package manager and runtime

## Backend

This frontend connects to the TaskFlow REST API.
Backend repo: [TaskFlow](https://github.com/KAMRANKHANALWI/TaskFlow)
Backend runs on: `http://localhost:8000`

## Project Structure

```
app/
├── layout.tsx        # root layout — fonts, metadata
├── page.tsx          # home page
├── globals.css       # global styles + Tailwind
│
├── (auth)/           # auth route group
│   ├── login/
│   └── register/
│
├── dashboard/        # protected pages
│   ├── page.tsx      # dashboard home
│   ├── projects/     # project pages
│   └── tasks/        # task pages
│
├── components/       # reusable UI components
│   ├── ui/           # base components (button, input, card)
│   ├── auth/         # login form, register form
│   ├── projects/     # project card, project list
│   └── tasks/        # task card, task list, task filters
│
├── lib/              # utilities
│   ├── api.ts        # axios instance + API calls
│   ├── auth.ts       # token storage + auth helpers
│   └── types.ts      # TypeScript types matching backend schemas
│
└── hooks/            # custom React hooks
    ├── useAuth.ts    # auth state
    ├── useProjects.ts
    └── useTasks.ts
```

## Setup

```bash
# clone
git clone https://github.com/KAMRANKHANALWI/TaskFlow-Frontend.git
cd taskflow-frontend

# install dependencies
bun install

# create environment file
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:8000

# run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:8000 | FastAPI backend URL |

## Pages

| Route | Description | Auth required |
|-------|-------------|---------------|
| / | Landing page | No |
| /login | Login form | No |
| /register | Register form | No |
| /dashboard | Overview | Yes |
| /dashboard/projects | Project list | Yes |
| /dashboard/projects/[id] | Project detail + tasks | Yes |
| /dashboard/tasks | All tasks with filters | Yes |

## Running with Backend

Start both servers:

```bash
# terminal 1 — backend
cd TaskFlow
uv run uvicorn app.main:app --reload

# terminal 2 — frontend
cd taskflow-frontend
bun dev
```

## Roadmap

- [ ] Auth pages — login, register
- [ ] Dashboard layout with sidebar
- [ ] Projects — list, create, edit, delete
- [ ] Tasks — list, create, edit, delete, filters
- [ ] Tags — create and assign to tasks
- [ ] Deploy frontend to Vercel
