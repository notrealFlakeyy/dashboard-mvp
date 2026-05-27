#!/usr/bin/env python3
"""Static validation for the Next.js MVP when Node/npm is unavailable."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

required = [
    "package.json",
    "tsconfig.json",
    "next.config.mjs",
    "app/layout.tsx",
    "app/shell.tsx",
    "app/page.tsx",
    "app/inventory/page.tsx",
    "app/team/page.tsx",
    "app/import/page.tsx",
    "app/globals.css",
    "lib/demo-data.ts",
    "lib/supabase.ts",
    "public/manifest.webmanifest",
    "supabase/migrations/202605260001_business_dashboard_mvp.sql",
    "supabase/migrations/202605260002_seed_demo.sql",
    "README.md",
    "RESEARCH.md",
    "SUPABASE_SETUP.md",
    "MOBILE_PLAN.md",
]

for rel in required:
    path = ROOT / rel
    if not path.exists():
        raise SystemExit(f"missing required file: {rel}")
    if path.stat().st_size == 0:
        raise SystemExit(f"empty required file: {rel}")

json.loads((ROOT / "package.json").read_text())
json.loads((ROOT / "tsconfig.json").read_text())
json.loads((ROOT / "public/manifest.webmanifest").read_text())

schema = (ROOT / "supabase/migrations/202605260001_business_dashboard_mvp.sql").read_text()
for token in [
    "create table if not exists public.locations",
    "create table if not exists public.employees",
    "create table if not exists public.shifts",
    "create table if not exists public.time_entries",
    "create or replace view public.dashboard_product_health",
    "enable row level security",
    "create policy \"members read time entries\"",
]:
    if token not in schema:
        raise SystemExit(f"schema missing: {token}")

# Very lightweight SQL balance checks; not a replacement for Postgres parsing.
if schema.count("(") != schema.count(")"):
    raise SystemExit("schema has unbalanced parentheses")
if schema.count("$$") % 2 != 0:
    raise SystemExit("schema has unbalanced dollar quotes")

for rel in ["app/page.tsx", "app/team/page.tsx", "app/import/page.tsx"]:
    text = (ROOT / rel).read_text()
    for bad in ["TODO", "FIXME", "any;"]:
        if bad in text:
            raise SystemExit(f"{rel} contains {bad}")

home = (ROOT / "app/page.tsx").read_text()
for feature in ["Low-stock alerts", "Reorder suggestions", "Slow-moving stock", "Google visibility tasks"]:
    if feature not in home:
        raise SystemExit(f"home page missing feature: {feature}")

team = (ROOT / "app/team/page.tsx").read_text()
for feature in ["Clock in / out placeholder", "time_entries", "Today at Main Store"]:
    if feature not in team:
        raise SystemExit(f"team page missing feature: {feature}")

css = (ROOT / "app/globals.css").read_text()
if "@media (max-width: 900px)" not in css or ".bottomNav" not in css:
    raise SystemExit("mobile CSS checks failed")

print("static validation passed")
