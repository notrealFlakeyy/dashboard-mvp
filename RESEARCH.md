# Research: MVP dashboard for hardware stores and similar local retailers

## Target customer

Independent hardware stores, auto parts shops, building supply stores, paint/plumbing/electrical specialty retailers, and small multi-category local retailers.

Assumption: most prospects already have a POS/accounting/inventory system, but the owner/manager still uses spreadsheets, manual supplier checks, or staff memory to answer operational questions.

## Practical pain points worth paying for

1. **Inventory visibility without digging through POS screens**
   - Owners need a quick morning list of items that will run out soon, not a full ERP replacement.
   - Relevant reference: Shopify retail inventory management explains stockouts, overstocks, reorder points, and inventory tracking as core retail controls: https://www.shopify.com/retail/inventory-management

2. **Low-stock alerts and reorder planning**
   - Stores lose sales when common consumables are out of stock: fasteners, batteries, adhesives, paint, blades, filters, fittings.
   - MVP value: daily reorder suggestions grouped by supplier with estimated cost.
   - Reference: Square discusses reorder points and low-stock alerts for retail operations: https://squareup.com/us/en/the-bottom-line/operating-your-business/reorder-point

3. **Slow-moving and dead stock**
   - Hardware/building supply stores can have many SKUs; cash gets trapped in items that have not sold for weeks/months.
   - MVP value: show stock value and last sold date, then suggest discount/bundle/return/cycle-count action.
   - Reference: Lightspeed describes slow-moving inventory as a cash-flow and storage issue for retailers: https://www.lightspeedhq.com/blog/dead-stock/

4. **Margin / price monitoring**
   - Supplier cost changes can silently shrink margin if shelf/POS prices are not reviewed.
   - MVP value: flag SKUs below target gross margin or with changed cost.

5. **Sales and customer trends**
   - Owners want fast answers: What days are strongest? Are transactions up/down? Are quotes being followed up?
   - MVP should not try to be advanced BI; simple daily revenue, transactions, gross margin, new customers, and open quote value are enough.

6. **Quote/order follow-up**
   - Building supply, paint, tools, and local repair-oriented shops often quote contractors or project customers.
   - MVP value: open quotes with age, value, and next action.

7. **Google reviews/local visibility**
   - Local retail depends on map visibility and trust. Even if automated Google integration is deferred, a manual review snapshot and staff task workflow can be valuable.
   - Reference: Google Business Profile help covers reading and replying to reviews: https://support.google.com/business/answer/3474122

8. **Staff task checklist and future time management**
   - A simple mobile task/time screen creates daily usage beyond owner-only analytics.
   - Start with shifts and clocked-in status; avoid payroll, compliance, GPS/geofencing, and native app complexity until validated.

## Recommended lean MVP format

**Product name:** Local Retail Ops Dashboard

**Pilot promise:** “Every morning, see what needs attention: what to reorder, what is tying up cash, which margins need review, which quotes/reviews/tasks need follow-up, and who is clocked in today.”

**MVP modules:**

- Overview KPIs: inventory value, low-stock SKU count, average margin, open quote value, current clock-ins.
- Low-stock watchlist: SKU, item, on-hand, reorder point, estimated days left.
- Reorder suggestions: supplier, item, suggested quantity, estimated cost.
- Slow-moving stock: item, stock value, last sold, recommended action.
- Margin/price monitor: gross margin %, price, review flag.
- Sales/customer trends: simple daily revenue/transaction bars.
- Quote/order follow-up: value, customer, age, next action.
- Reviews/staff tasks: review rating snapshot and daily checklist.
- CSV import: enough for a pilot using exports from POS/accounting/spreadsheets.
- Team/time foundation: locations, employees, shifts, open time entries, and mobile clock-in/out placeholder.

## What NOT to build in v1

- Full POS replacement.
- Complex demand forecasting.
- Automated purchase orders with supplier EDI.
- Paid Google API integration before a pilot validates willingness to pay.
- Payroll/legal compliance/time rounding rules.
- Native mobile app store deployment.
- Multi-location enterprise features beyond simple schema support.

## Pilot offer

**Setup fee:** €299–€799 depending on data cleanup.

**Monthly pilot:** €99–€249/month for 1 location.

**Pilot duration:** 30 days.

**Deliverables:**

1. Import current SKU/export CSV.
2. Configure reorder points and margin threshold with owner.
3. Provide a daily dashboard link that works on desktop and phone.
4. Optional manager-only team/time view for clocked-in status.
5. Weekly 20-minute review: reorder misses, slow-stock actions, quote follow-up.

## Data needed from first pilot customer

- Product/SKU export: SKU, product name, category, stock on hand, cost, sell price, supplier if available.
- Sales export: date, SKU or category, quantity, revenue, margin/cost if available.
- Supplier list: supplier name, lead time, minimum order value.
- Open quotes/orders list if available.
- Staff list and weekly shifts only if testing the team/time screen.
- Manual Google review snapshot or approved Google Business Profile workflow later.

## Success metrics for the pilot

- Fewer stockouts on top-moving SKUs.
- Reduction in slow/dead-stock value or clear actions taken.
- Margin issues found and corrected.
- Quotes followed up faster.
- Owner/manager uses the dashboard at least 3 times/week.
- If team/time is piloted: employees can clock in/out on mobile without manager confusion.
