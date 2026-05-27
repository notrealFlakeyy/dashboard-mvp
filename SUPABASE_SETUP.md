# Supabase setup

## Status from this autonomous run

The Supabase backend was prepared as migrations but was **not applied** to the user’s Supabase account because this environment did not expose usable Supabase credentials/project ref and did not have the Supabase CLI, Node/npm, or `psql` installed.

No secrets were printed or stored.

## What the schema includes

Retail operations:

- `businesses`
- `profiles`
- `suppliers`
- `products`
- `inventory_movements`
- `sales_daily`
- `quotes`
- `review_snapshots`
- `tasks`
- `dashboard_product_health` view for low-stock, margin, slow-moving, days-left, and reorder suggestions

Team/time-management foundation:

- `locations`
- `employees`
- `shifts`
- `time_entries`
- RLS policies for business-scoped access
- indexes for today’s shifts and open time entries

## Option A: Apply through Supabase SQL editor

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Paste and run:
   - `supabase/migrations/202605260001_business_dashboard_mvp.sql`
4. Optionally paste and run demo data:
   - `supabase/migrations/202605260002_seed_demo.sql`
5. In the app folder, copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Do not place the service-role key in browser-exposed variables.

## Option B: Apply with Supabase CLI

On a development machine with Node and Supabase CLI:

```bash
cd /root/side-hustle-google-maps-growth/business-dashboard-mvp
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

If you want demo seed data and the CLI does not apply it automatically, run the seed SQL manually in the SQL editor.

## First production connection path

For the MVP, the Next.js UI currently uses local demo data so it can be shown without credentials. Once Supabase is configured, wire pages to Supabase reads in this order:

1. Products from `dashboard_product_health`.
2. Tasks from `tasks` filtered by open/due today.
3. Quotes from `quotes` filtered by open/follow-up.
4. Team/time from `employees`, `shifts`, and open `time_entries`.
5. CSV import writes to `products` and optionally `inventory_movements`.

## Auth/RLS notes

- Policies assume each authenticated user has a `profiles` row with `business_id`.
- Managers/owners can write employees, locations, shifts, suppliers, and sales data.
- Members can read business-scoped records.
- Time entries are business-scoped; before payroll use, add stricter employee ownership checks, audit logs, break handling, approval workflow, and local labor-law review.

## Smoke test after deployment

If you configure env vars, run:

```bash
python3 scripts/supabase_smoke_test.py
```

That script should only use the public anon key and read endpoints expected for a logged-out/demo-safe setup. For authenticated/RLS-protected data, add an authenticated test user.
