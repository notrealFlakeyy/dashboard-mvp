#!/usr/bin/env python3
"""Tiny Supabase REST smoke test helper.

Usage:
  SUPABASE_URL=https://PROJECT.supabase.co \
  SUPABASE_ANON_KEY=... \
  python3 scripts/supabase_smoke_test.py

It only prints status codes and row counts; it never prints secrets.
"""
import json
import os
import sys
import urllib.request

url = os.environ.get("SUPABASE_URL", "").rstrip("/")
key = os.environ.get("SUPABASE_ANON_KEY", "")
if not url or not key:
    print("Missing SUPABASE_URL or SUPABASE_ANON_KEY")
    sys.exit(2)

endpoint = f"{url}/rest/v1/dashboard_product_health?select=sku,name,health_status&limit=5"
req = urllib.request.Request(endpoint, headers={"apikey": key, "Authorization": f"Bearer {key}"})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode("utf-8")
        rows = json.loads(body)
        print(f"OK status={resp.status} rows={len(rows)}")
        for row in rows:
            print(f"- {row.get('sku')}: {row.get('health_status')}")
except Exception as exc:
    print(f"Smoke test failed: {type(exc).__name__}: {exc}")
    sys.exit(1)
