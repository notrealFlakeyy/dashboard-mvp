# Mobile plan: responsive web now, PWA next, native later

## What is included now

The MVP is built as a mobile-friendly Next.js web app:

- Responsive layout for phone, tablet, and desktop.
- Desktop sidebar navigation.
- Mobile bottom navigation with large tap targets.
- Touch-friendly cards and scrollable tables.
- Dedicated `/team` screen designed for in-store employee use.
- PWA manifest at `public/manifest.webmanifest`.
- App metadata for installable/mobile web behavior.

This is the best starting point because a pilot customer can use it immediately from a browser without app store work.

## Employee time-management foundation

Current MVP screen:

- Shows today’s employees.
- Shows clocked-in / due-soon / off-today status.
- Shows shifts and last actions.
- Includes a placeholder clock in/out button.

Backend foundations are ready in Supabase:

- `locations`: store/warehouse/branch records.
- `employees`: staff records linked to a business and optional profile.
- `shifts`: scheduled work periods.
- `time_entries`: clock-in/clock-out records with `started_at`, `ended_at`, `source`, and optional shift/location.

## What not to overbuild yet

Do not add these until a pilot validates the need:

- Payroll calculations.
- Legal compliance logic.
- Break rules/overtime rules.
- Native GPS/geofencing requirements.
- App store deployment.
- Offline-first conflict resolution.

## PWA next step

After the dashboard is running with Supabase:

1. Add a service worker for cached app shell and offline fallback.
2. Add install prompt instructions for iOS/Android.
3. Store pending clock-in/out actions locally if offline, then sync when online.
4. Add manager approval for edited time entries.
5. Add audit logs for time-entry changes.

## Native app path later

If a customer truly needs app-store/native capabilities:

- **Capacitor wrapper** is the fastest path from this Next.js/PWA codebase to iOS/Android shells.
- **React Native/Expo** is better only if native UX, device APIs, background behavior, or offline-first workflows become core.

Recommendation: keep the first 1–3 pilots as responsive web/PWA. Move to native only after repeated usage and a clear reason: e.g., required camera barcode scanning, managed devices, robust offline time clock, GPS/geofence checks, or app store distribution.
