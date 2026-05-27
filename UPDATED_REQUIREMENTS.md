# Updated dashboard MVP requirements

Saved: 2026-05-26T19:10:00Z

User requested the business dashboard MVP be built with:

- Next.js frontend
- Supabase backend
- Mobile-friendly/mobile-port direction
- Future support for employee time management

## Interpretation

Build the MVP as a responsive Next.js app that works well on desktop and mobile web now. Structure it so it can later be packaged as a mobile app/PWA or wrapped with Capacitor/React Native if needed.

## Dashboard modules for MVP

For hardware stores and similar local retail businesses:

- Overview KPIs
- Inventory / low-stock alerts
- Slow-moving stock
- Reorder suggestions
- Sales/customer trend placeholders
- Supplier/order follow-up placeholders
- Google reviews/local visibility/task panel
- CSV import/mock data

## Future employee time-management foundations

Add Supabase schema support for:

- employees
- shifts
- time_entries / clock-in clock-out
- locations / stores
- roles / permissions later

The MVP UI can include a mobile-friendly placeholder/time-management screen showing:

- Today’s employees
- Clocked-in status
- Shift list
- Future clock-in/out button placeholder

Do not overbuild payroll or legal compliance yet.
