# Small Team Time-Off Planner

A lightweight leave management system for small teams — replace the sharedspreadsheet with structured requests,
approvals, and visibility.

## The Problem

Small teams don't need enterprise HR software, but they do need answers tosimple questions: Is anyone on leave next
week? Do I have enough PTO daysleft? Did anyone already book this week?

Spreadsheets and Slack messages fail because there's no single source oftruth. Requests get lost, balances go negative,
and two people discoverthey're both off the same week when it's too late. This app gives smallteams the minimum
structure needed to solve that: a request-approvalworkflow, per-person balances, and a shared calendar that makes
collisionsvisible before they happen.

## Core Features

### 1. Request Leave

Any user can submit a leave request: a date range, a leave type (vacation,sick, personal), and optionally a note. Before
anything is saved, thebackend independently calculates how many of those days are working days —weekends excluded. The
backend, not the frontend, owns this calculation:the frontend can suggest, but the server decides. The requester sees
thecomputed working-day count and how it affects their balance before therequest is confirmed.

User journey: Pick dates → see "7 calendar days, 5 working days, youhave 12 vacation days left" → submit → status is
pending.

### 2. Approval Workflow

Requests are a tiny state machine: pending → approved orpending → rejected. Managers see a queue of pending requests for
theirteam, review each one (optionally with a note — "rejected, we need coveragethat week"), and decide. Once a request
is reviewed, its status is final inv1 — no cancellation flow, no re-opening. Requesters see their requeststatus change
and can read the reviewer's note.

The state machine matters more than it looks: it defines exactly whichtransitions are legal, who can perform them, and
what side effects musthappen atomically with each one.

### 3. Balance Tracking

Each user has an annual allowance per leave type (e.g., 25 vacation days,5 personal days for the current year).
Approving a request deducts itsworking days from the balance; rejecting does nothing. The criticalinvariant: the status
change and the balance deduction succeed or failtogether. A request must never be approved with its balance
unchanged,and a balance must never be deducted for a rejected request.

### 4. Team Calendar View

A month grid showing all team members' approved leave (and optionallypending leave, visually distinguished). Anyone on
the team can see who'soff, when, and — most importantly — where the collisions are beforesubmitting their own request.
This is the feature that replaces thespreadsheet's real value: ambient awareness.

### 5. Overlap Warning

When a manager is about to approve a request, the UI checks whether anotherteammate already has approved leave
overlapping those dates. It's a softwarning, not a block — two people being off the same week is sometimesfine. The
manager decides with full information. This is a deliberatedesign choice: it keeps the approval state machine simple
while stillsurfacing the risk.

## Database Schema

Five tables. Read the relationships carefully — the app's logic lives inthem.
users

```text
id, email, password_hash, name, team_id, role
```

The team_id foreign key scopes everything: calendars, manager queues,and balances are all team-scoped. role is either
member or manager— a manager is a member of a team who has approval rights for that team,not global admin power. This
single-role design keeps permissions simple;resist the urge to add a role hierarchy in v1.
teams

```text
id, name
```

The anchor for scoping. A team exists even if it has no leave requests —it's the organizational unit.
leave_types

```text
id, name, default_allowance
```

Vacation, sick, personal. default_allowance (e.g., 25 for vacation) isthe seed value used to create a user's balance for
a new year. Storingleave types in a table rather than an enum means a team could later add"study leave" without a
migration — and it makes leave_balances aproper many-to-many join with attributes.

```text
leave_balances
```

```text
user_id, leave_type_id, year, allowance_days, used_days
```

One row per user per leave type per year. This is the table that makesbalances annual: a user has a 2025 vacation
balance and a 2026 vacationbalance. allowance_days is copied from leave_types.default_allowancewhen the row is created,
so per-user overrides become possible laterwithout schema changes.

The used_days counter is denormalized — you could compute it fromapproved requests on the fly, but storing it makes "
what's my remainingbalance" a single-row read, and it forces you to confront the app'shardest technical problem:
updating it atomically alongside the requeststatus (see API section).
leave_requests

```text
id, user_id, leave_type_id, starts_at, ends_at,working_days, status, reviewer_id, review_note
```

The central table. working_days is stored, not computed on read —it's a snapshot of the backend's calculation at request
time, so arejection reason or audit trail doesn't depend on re-running date math.status is pending | approved |
rejected. reviewer_id andreview_note are nullable — they're only populated at review time, andtheir null-ness is the
record of "not yet reviewed."

#### Relationships in summary:

- users.team_id → teams.id (many-to-one)
- leave_requests.user_id → users.id; leave_requests.leave_type_id → leave_types.id
- leave_requests.reviewer_id → users.id (self-referencing through users — a reviewer is just a user with the manager
  role)
- leave_balances is a junction between users and leave_types, keyed additionally by year (composite uniqueness: a user
  can have exactly one balance per type per year)

## API Endpoints Overview

All routes are prefixed with /api. Authentication is via JWT; the authroutes are conventional and not the learning
focus.

### Auth

| Method | Route          | Purpose                                              |
|--------|----------------|------------------------------------------------------|
| POST   | /auth/register | Create user (auto-creates balances for current year) |
| POST   | /auth/login    | Returns JWT                                          |

### Leave Requests

| Method | Route             | Purpose                                                                                                                                                                         |
|--------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | /requests         | Submit a request. Body: { leaveTypeId, startsAt, endsAt }. Backend computes working days, returns the created request with status pending and the resulting balance projection. |
| GET    | /requests/me      | The current user's requests, newest first.                                                                                                                                      |
| GET    | /requests/pending | **Manager only**. Pending requests for the manager's team. This is the approval queue.                                                                                          |
| PATCH  | /requests/:id     | **Manager only**. The single state-transition endpoint. Body: { status: "approved"                                                                                              | "rejected", note? }. Only valid from pending. Approval deducts balance atomically. Invalid transitions return 409 Conflict, not 400 — a business-rule violation is semantically different from a malformed request. |

### Calendar & Balance

| Method | Route                | Purpose                                                                                               |
|--------|----------------------|-------------------------------------------------------------------------------------------------------|
| GET    | /calendar?year&month | Approved (and optionally pending) leave for the user's team within a month. Powers the calendar grid. |
| GET    | /balances/me         | Current year's balances per leave type: allowance, used, remaining.                                   |

### Allowed Transitions (the whole state machine)

pending --[manager approves]--> approved   (balance deducted, atomically)
pending --[manager rejects]---> rejected   (no side effects)
approved / rejected --> terminal, no further transitions

Anything else returns `409`. Encoding this table in middleware — a
`validateTransition` guard that checks `(currentStatus, targetStatus,
userRole)` before the handler runs — is the cleanest way to express it.

## Tech Stack & Why It's the Right Fit

### PostgreSQL — where the real logic lives

Three query patterns in this app go well beyond basic CRUD, and all three are techniques you'll reuse forever:

- **Working-day calculation** uses `generate_series` — Postgres's function for producing a set of rows from nothing
  (here: one row per calendar day in the range). Filtering that series for weekdays converts "Jan 6 to Jan 17" into "10
  working days" in one SQL statement. Most developers have never written a query that *generates* rows rather than
  selecting them; this is the friendliest possible introduction.

- **Balance aggregation** uses conditional aggregation —
  `SUM(CASE WHEN status = 'approved' THEN working_days ELSE 0 END)` joined across users, leave types, and balances.
  Learning to aggregate *conditionally* rather than in application code is a genuine SQL maturity milestone.

- **Date-range intersection** powers the calendar and overlap warnings. Two ranges overlap when
  `a.starts_at <= b.ends_at AND a.ends_at >= b.starts_at`. This half-line condition is the foundation of every
  scheduling system ever built; internalizing it is the single most transferable thing in this project.

### Express — as a state machine enforcer

Express's middleware chain is the natural place to encode the request lifecycle: authenticate → authorize (is this user
a manager of the requester's team?) → validate transition (is this status change legal?) → execute transactionally.
Building the approval endpoint teaches you that API design is partly about *encoding business rules in the request
pipeline* rather than burying them in handler bodies.

### TanStack Query + Zustand — dividing state cleanly

The calendar view is the perfect case study. It has two kinds of state:

- **Server state** — the leave data for the current month. It's cached, it goes stale, it needs refetching. That's
  TanStack Query's job, and the month-navigation case exercises the `placeholderData` pattern: when you page from
  January to February, `placeholderData: keepPreviousData` keeps January's grid visible (dimmed) until February's data
  arrives, instead of flashing an empty loading state. It's a small option with a big UX payoff, and this is the ideal
  scenario to learn it.

- **UI state** — which month is selected, whether the month picker is open. This never touches the server. Zustand
  handles it with a two-line store, and the month value becomes the query key that drives TanStack Query.

Knowing *which kind of state you have* — and reaching for the right tool — is the actual skill here.

### shadcn/ui — components that earn their keep

This app genuinely needs a date-range picker, status badges, a data table, and dropdown menus. Rather than hand-rolling
them, you'll compose shadcn/ui primitives and style them with Tailwind — which means learning to *integrate* a component
library into a real data-driven UI, not just render a demo page.

### Jest — date logic is a testing masterclass

Working-day calculation is the best unit-testing target you'll find: pure function, deterministic, and full of sneaky
boundaries. Does a range ending on Friday count the weekend? What about a request from Dec 28 to Jan 3 — which *year's*
balance does it hit? (Decide explicitly.
Any consistent answer is fine; an accidental one is not.) Writing these tests *before* finalizing the implementation
forces you to discover the edge cases instead of shipping them.

### Vite + Biome + Docker + GitHub Actions + Postman

Standard, honest infrastructure: Vite for fast frontend dev, Biome for lint/format in one tool, Docker Compose to run
Postgres (and optionally the API) reproducibly, GitHub Actions running tests and lint on every push, and a Postman
collection that serves as living API documentation while you build.

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

### Setup

```bash
# 1. Clone and install
git clone <repo-url> && cd timeoff-planner
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment
cp .env.example .env
```

### Environment Variables

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/timeoff
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
PORT=3000
VITE_API_URL=http://localhost:3000/api
```

### Run

```bash
# Backend (with auto-reload)
npm run dev:server

# Frontend (Vite dev server)
npm run dev:client

# Tests
npm test

# Lint + format
npm run check
```

### Seed Data

A seed script creates two teams, a manager and two members per team, and a handful of pre-approved requests so the
calendar isn't empty on first load. Register real users through the UI afterward.