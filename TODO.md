# Implementation TODO — Time-Off Planner

Check these off in order. Steps depend on each other — don't skip ahead.

Build order: Setup → Auth → Working days → Requests → Balances → Approvals → Calendar → Overlap warning → Polish

## Step 1: Project Setup & Database

- [ ] Create repo with server/ (Express) and client/ (Vite + React + Tailwind)
- [ ] Set up docker-compose.yml with PostgreSQL
- [ ] Write migration: teams table
- [ ] Write migration: users table (with team_id and role)
- [ ] Write migration: leave_types table (vacation, sick, personal)
- [ ] Write migration: leave_balances table (add unique constraint on user_id + leave_type_id + year)
- [ ] Write migration: leave_requests table
- [ ] Decision to make: use DATE (not TIMESTAMPTZ) for leave dates — leave is about days, not exact times. This avoids
  timezone bugs
- [ ] Write seed script: 2 teams, 1 manager + 2 members per team
- [ ] Add GitHub Actions: run Biome + Jest on every push

> 💡 The unique constraint on leave_balances makes double balances impossible at the DB level — not just in your code.

## Step 2: Authentication

- [ ] Build POST /auth/register — hash password, create user
- [ ] Register must also create one balance row per leave type (wrap both writes in a transaction)
- [ ] Build POST /auth/login — returns JWT
- [ ] Build requireAuth middleware — verifies token, attaches user to req.user
- [ ] Build requireManager middleware — checks role === 'manager'
- [ ] Test: register creates the balance rows
- [ ] Test: protected routes return 401 without token
- [ ] Test: member gets 403 on manager-only routes

> 💡 Registering = 2 writes (user + balances). Use a transaction here — it's practice for the approval endpoint later.

## Step 3: Working-Day Calculation ⭐ Hard Part #1

- [ ] Write Jest tests first for a countWorkingDays(start, end) function
- [ ] Cover: Mon–Sun range = exactly 5 days
- [ ] Cover: range ending Friday (weekend inside range is excluded)
- [ ] Cover: single Saturday = 0 days (decide: reject this with a 400)
- [ ] Cover: Dec 28 → Jan 3 (year boundary — deduct from the year of starts_at)
- [ ] Implement the function in JS
- [ ] Also write the SQL version using generate_series + EXTRACT(ISODOW FROM day) < 6 — compare both
- [ ] Note in README: public holidays are NOT handled (on purpose)

> 💡 generate_series creates rows out of nothing — one row per day in the range. A brand-new SQL concept worth learning.

## Step 4: Submit a Request

- [ ] Build POST /requests — body: { leaveTypeId, startsAt, endsAt }
- [ ] Validate: valid dates, ends_at >= starts_at, leave type exists
- [ ] Run countWorkingDays on the backend (never trust the frontend's number)
- [ ] Insert request with status pending
- [ ] Decision to make: do NOT block requests that exceed the balance — the manager decides. Document this
- [ ] Return the created request + projected remaining balance
- [ ] Test: correct working_days stored
- [ ] Test: invalid date ranges rejected

> 💡 Handler shape to reuse everywhere: validate → compute → persist → respond.

## Step 5: Balance Tracking ⭐ Hard Part #2

- [ ] Build GET /balances/me — returns allowance, used, remaining per leave type
- [ ] Write the query: JOIN balances → leave types → requests
- [ ] Use conditional aggregation: SUM(CASE WHEN status = 'approved' THEN working_days ELSE 0 END)
- [ ] Make sure year scoping works (a 2024 request never touches the 2025 balance)
- [ ] Test: rejected requests add 0 days
- [ ] Test: pending requests add 0 days
- [ ] Test: requests from a previous year don't leak into this year's balance

> 💡 SUM(CASE WHEN ...) = "only count the rows that match." The core pattern of all reporting SQL.

## Step 6: Approval Workflow ⭐ Hard Part #3 (the centerpiece)

- [ ] Build GET /requests/pending — pending requests from the manager's own team only
- [ ] Define the state machine as data: { pending: ["approved", "rejected"], approved: [], rejected: [] }
- [ ] Build validateTransition middleware using that lookup table
- [ ] Build PATCH /requests/:id with { status, note? }
- [ ] Check 3 things, separately: authenticated? → manager? → is the requester on the manager's team?
- [ ] Block a manager from approving their own request (403)
- [ ] Wrap approve in a transaction: update status AND deduct balance in one commit — or neither
- [ ] In the UPDATE, add AND status = 'pending' — if 0 rows changed, return 409
- [ ] Test: approve → status = approved AND balance deducted (assert both)
- [ ] Test: reject → status = rejected, balance unchanged
- [ ] Test: approving an already-approved request → 409 and balance unchanged
- [ ] Test: manager from another team → 403
- [ ] Test: two parallel approvals → exactly one succeeds

> 💡 The AND status = 'pending' in the UPDATE is the magic: if two managers approve at the same time, the second one
> matches 0 rows. The database itself blocks the race condition. Understand why — this is the best 4 hours of the project.

## Step 7: Team Calendar ⭐ Hard Part #4

### Backend:

- [ ] Build GET /calendar?year&month — all leave for the user's team that month
- [ ] Use the range-overlap condition: starts_at <= month_end AND ends_at >= month_start
- [ ] Include requests that start in the previous month or end in the next
- [ ] Include pending leave too, but flag it (dashed style in UI later)
- [ ] Test: a request spanning the month boundary shows up
- [ ] Test: another team's leave is excluded

### Frontend:

- [ ] Build a Zustand store: selected { year, month }
- [ ] Fetch with query key ['calendar', year, month] — changing months changes the key → auto refetch
- [ ] Add placeholderData: keepPreviousData to the query — old month stays visible while the new one loads
- [ ] Build the month grid (weeks as rows)
- [ ] Render leave as colored spans; pending leave styled differently

> 💡 The split to internalize: Zustand = which data you want (month). TanStack Query = the data itself. And
> keepPreviousData kills the ugly loading flash when paging months.

## Step 8: Overlap Warning

- [ ] Build GET /requests/:id/overlaps — approved teammate leave overlapping this request's dates
- [ ] Reuse the overlap condition, but exclude: the request itself + the same user
- [ ] Only return approved leave (not pending, not rejected)
- [ ] Test: ends Friday / teammate starts Monday → NOT flagged (watch the off-by-one!)
- [ ] Frontend: on the review screen, show a soft warning: "Alex is also off Jan 14–18"
- [ ] Confirm the backend never blocks an overlapping approval — warn only

> 💡 Good features layer on top of the state machine. Step 8 didn't change Step 6 at all.

## Step 9: Polish & Ship

- [ ] Build Postman collection: all endpoints, JWT auto-saved from login
- [ ] Add the error cases to Postman too (409, 403) — if you can't demo an error, you don't fully understand it
- [ ] Final Biome pass
- [ ] Deploy: one Docker container + hosted Postgres + built client
- [ ] Write the run instructions in the README