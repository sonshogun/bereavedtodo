# bereavedtodo — Project Plan

## What We're Building

A webapp that helps people overwhelmed by loss navigate settling a deceased loved one's affairs. The core value is **clarity under pressure** — a simple, time-aware checklist so users know what needs to happen now vs. what can wait.

---

## Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Backend:** FastAPI (Python) — task generation logic, future API layer for DB
- **Data:** localStorage for anonymous users; Supabase Postgres planned for authenticated users
- **Auth:** None for v1; Supabase Auth planned (primary: Google OAuth, secondary: magic link email)
- **Deployment:** Vercel (`@vercel/python` for FastAPI serverless functions)

---

## Core Flow

### Step 1 — Intake Form
Short set of questions to personalize the checklist:
- State (for legal context)
- Relationship to deceased (spouse, parent, child, sibling, other — affects legal responsibilities)
- Did they have a will?
- Are you the executor?

### Step 2 — Name the Board
User names the checklist after their loved one. Makes it feel personal and grounding — this is *their* person's board, not a generic to-do list.

### Step 3 — Review & Customize Tasks
Before the final checklist is created, show the user the generated task list with the ability to toggle tasks on/off. Lets them remove anything irrelevant without feeling overwhelmed.

Task filtering has two mechanisms:
- Backend filter — hides the task entirely based on intake answers (e.g. executor-only tasks). Logic lives in `api/index.py`.
- `defaultEnabled` — task appears but is toggled off by default for situational items (e.g. veteran benefits, safe deposit box)

### Step 4 — Time-Bucketed Checklist
Tasks organized into time buckets:
- **Today / Next 24–48 hours** — urgent, time-sensitive
- **This Week** — important but not immediate
- **This Month** — legal and financial steps
- **Within 6 Months** — longer-horizon estate tasks

Each task includes:
- What to do
- Why it matters
- A concrete next step or resource

Progress counter shown (e.g. "4 of 13 tasks complete") to give a sense of forward motion.

### Step 5 — Persistence & Cross-Device Sync (future)
Checklist state saved to localStorage immediately (no friction). After the checklist is generated, a fixed bottom banner will prompt: *"Save your checklist"* with Google OAuth and magic link email options inline, plus a one-line privacy reassurance.

On sign-in, localStorage board migrates to Supabase. Authenticated users can have **multiple boards** (e.g. handling two estates) and access them from any device via `/boards`. Returning authenticated users skip the intake flow and land on `/boards`.

---

## Design Decisions Resolved

- **Task completion interaction** — circle checkbox
- **Task reordering** — drag-to-reorder via @dnd-kit, within and across time buckets
- **Custom tasks** — users can add their own tasks per bucket; deletable
- **Task generation** — lives on FastAPI backend (`POST /api/tasks/generate`); frontend sends intake, receives filtered list. Keeps business logic off the client.
- **Database** — SQLite is not viable on Vercel serverless. Supabase (Postgres) is the planned DB when auth is added.

---

## Future / Explore Later

- **Printable/shareable checklist** — PDF export or shareable link
- **State-specific legal detail** — deeper content per state

---

## File Structure

```
fastapi-react-app/
  api/
    index.py          # FastAPI app — task catalog + generate endpoint
    requirements.txt
  src/
    types.ts          # Shared TypeScript types
    lib/
      storage.ts      # localStorage helpers
      api.ts          # fetch wrapper for backend
    components/
      IntakeForm.tsx
      ReviewTasks.tsx
      ChecklistView.tsx
  App.tsx             # React Router setup (/ and /checklist)
  main.tsx
```

---

## Status

- [x] Project scaffold (React + Vite + TypeScript + Tailwind v4)
- [x] Intake form (Steps 1–2)
- [x] Shared types — `src/types.ts`
- [x] Checklist data and personalization logic — `api/index.py` (`POST /api/tasks/generate`)
- [x] Review & customize tasks step — `src/components/ReviewTasks.tsx`
- [x] Checklist UI with progress counter, expand/collapse, drag-to-reorder, custom tasks — `src/components/ChecklistView.tsx`
- [x] localStorage persistence (anonymous users)
- [ ] Supabase auth + DB (Google OAuth primary, magic link fallback)
- [ ] `/boards` page for authenticated multi-board management
- [ ] localStorage → Supabase migration on first sign-in
- [ ] Polish and deploy to Vercel

## Build Order

1. ~~Project scaffold~~
2. ~~Intake form~~
3. ~~Board naming step~~
4. ~~Checklist data (task content, time buckets, personalization logic — on FastAPI)~~
5. ~~Review & customize tasks step~~
6. ~~Checklist UI with progress counter~~
7. ~~localStorage persistence (anonymous users)~~
8. Supabase auth + DB (Google OAuth primary, magic link fallback)
9. `/boards` page for authenticated multi-board management
10. localStorage → Supabase migration on first sign-in
11. Polish and deploy to Vercel
