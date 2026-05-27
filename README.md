# Local Retail Ops Dashboard MVP

A Next.js MVP dashboard for hardware stores, building supply shops, auto parts shops, and similar local retailers.

## What was built

- **Next.js app** using TypeScript and the App Router.
- **Responsive/mobile-first UI** with desktop sidebar and mobile bottom navigation.
- **PWA-ready foundation** with `public/manifest.webmanifest` and app metadata.
- **Overview dashboard** with KPIs, low-stock alerts, reorder suggestions, slow-moving items, sales trend, quote/supplier follow-up placeholders, and Google review/local visibility tasks.
- **Inventory screen** with touch-friendly responsive table for stock, reorder, margin, supplier, and actions.
- **Team/time screen** for future employee time management: today’s shifts, clocked-in status, and placeholder clock in/out CTA.
- **CSV import preview** for fast pilots using POS/spreadsheet exports before deeper integrations.
- **Supabase migrations** for retail operations plus employee/time-management foundations.

## Key files

```text
app/                         Next.js App Router pages and global CSS
app/page.tsx                 Overview dashboard
app/inventory/page.tsx       Inventory/low-stock/margin screen
app/team/page.tsx            Mobile-friendly team/time screen
app/import/page.tsx          Client-side CSV import preview
lib/demo-data.ts             Demo products, tasks, quotes, sales, team data
lib/supabase.ts              Safe browser Supabase client helper
public/manifest.webmanifest  PWA manifest
supabase/migrations/*.sql    Backend schema and demo seed data
data/sample_inventory.csv    CSV import sample
RESEARCH.md                  Research and MVP assumptions
SUPABASE_SETUP.md            Supabase deployment instructions
MOBILE_PLAN.md               PWA/native mobile path
.env.example                 Environment variable template
```

The earlier static prototype (`index.html`, `styles.css`, `app.js`) is still present as a fallback/reference, but the active MVP direction is now the Next.js app.

## How to run locally

This scheduler environment did not have Node/npm installed, so dependencies could not be installed here. On a machine with Node 18+:

```bash
cd /root/side-hustle-google-maps-growth/business-dashboard-mvp
cp .env.example .env.local
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Build check:

```bash
npm run typecheck
npm run build
```

## Supabase backend status

Supabase backend was **prepared locally** but **not applied to the user’s Supabase account** in this run because the environment had no Supabase CLI, no Node/npm, no `psql`, and no Supabase credentials/project ref exposed.

Prepared migrations:

- `supabase/migrations/202605260001_business_dashboard_mvp.sql`
- `supabase/migrations/202605260002_seed_demo.sql`

See `SUPABASE_SETUP.md` for exact setup steps.

## CSV import format

Required columns:

```csv
sku,name,category,stock,reorder_point,cost,price,last_sold,supplier,avg_daily_sales
```

A sample is available at `data/sample_inventory.csv`.

## Recommended first pilot flow

1. Pick one independent hardware/building supply/auto parts retailer.
2. Offer a 30-day pilot: “daily reorder, slow-stock, margin, quote and review dashboard.”
3. Ask for product/SKU export, recent sales export, supplier list, and open quotes/orders.
4. Load data by CSV first; avoid custom POS integration until value is validated.
5. Track stockouts avoided, slow-stock cash reduced, margin issues found, quotes followed up, and owner usage.
