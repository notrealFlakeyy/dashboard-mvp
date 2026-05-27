-- Demo seed data. For a real pilot, replace with imported POS/accounting CSV data.
-- This seed is intentionally anonymous/fake.

insert into public.businesses (id, name, business_type, currency, timezone)
values ('00000000-0000-0000-0000-000000000001', 'Demo Hardware Store', 'hardware_store', 'EUR', 'Europe/Helsinki')
on conflict (id) do nothing;

insert into public.locations (id, business_id, name, address, timezone) values
('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Main store','Demo street 1','Europe/Helsinki'),
('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Warehouse','Demo street 3','Europe/Helsinki')
on conflict (id) do nothing;

insert into public.employees (id, business_id, location_id, full_name, email, role, active) values
('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Aino Korhonen','aino@example.invalid','manager',true),
('30000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Mika Lehto','mika@example.invalid','staff',true),
('30000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Sara Niemi','sara@example.invalid','staff',true)
on conflict (id) do nothing;

insert into public.shifts (id, business_id, employee_id, location_id, starts_at, ends_at, status) values
('40000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001', date_trunc('day', now()) + interval '8 hours', date_trunc('day', now()) + interval '16 hours', 'scheduled'),
('40000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001', date_trunc('day', now()) + interval '10 hours', date_trunc('day', now()) + interval '18 hours', 'scheduled'),
('40000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000002', date_trunc('day', now()) + interval '12 hours', date_trunc('day', now()) + interval '20 hours', 'scheduled')
on conflict (id) do nothing;

insert into public.time_entries (id, business_id, employee_id, location_id, shift_id, started_at, source, note) values
('50000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001', date_trunc('day', now()) + interval '7 hours 56 minutes', 'mobile_web', 'Demo clock-in'),
('50000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002', date_trunc('day', now()) + interval '9 hours 58 minutes', 'mobile_web', 'Demo clock-in')
on conflict (id) do nothing;

insert into public.suppliers (id, business_id, name, contact_name, email, lead_time_days, min_order_value) values
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Nordic Fixings','Demo Contact','orders@example.invalid',3,150),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','ColorPro','Demo Contact','orders@example.invalid',4,250),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','BuildSupply','Demo Contact','orders@example.invalid',2,300),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','ToolSource','Demo Contact','orders@example.invalid',5,500)
on conflict (id) do nothing;

insert into public.products (business_id, supplier_id, sku, name, category, stock_on_hand, reorder_point, cost, price, avg_daily_sales, last_sold_at) values
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','FAST-8X2','8x2 wood screws 200pk','Fasteners',8,30,4.20,8.99,5.2,current_date - interval '1 day'),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','PAINT-WHT10','White interior paint 10L','Paint',12,18,31.00,58.00,2.1,current_date),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','DRILL-18V','18V cordless drill kit','Tools',3,5,78.00,119.00,0.35,current_date - interval '6 days'),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','PIPE-CU15','15mm copper pipe 3m','Plumbing',22,40,7.80,12.50,4.4,current_date - interval '2 days'),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','HINGE-BRASS','Brass cabinet hinge pair','Hardware',140,25,3.10,5.49,0.05,current_date - interval '86 days'),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','BLADE-10IN','10 inch saw blade','Tools',26,12,9.50,15.99,0.18,current_date - interval '25 days')
on conflict (business_id, sku) do update set
  stock_on_hand = excluded.stock_on_hand,
  reorder_point = excluded.reorder_point,
  cost = excluded.cost,
  price = excluded.price,
  avg_daily_sales = excluded.avg_daily_sales,
  last_sold_at = excluded.last_sold_at;

insert into public.sales_daily (business_id, sale_date, revenue, gross_margin, transactions, new_customers) values
('00000000-0000-0000-0000-000000000001', current_date - 5, 3120, 1180, 86, 7),
('00000000-0000-0000-0000-000000000001', current_date - 4, 2840, 1020, 74, 4),
('00000000-0000-0000-0000-000000000001', current_date - 3, 3650, 1360, 91, 8),
('00000000-0000-0000-0000-000000000001', current_date - 2, 3310, 1240, 83, 5),
('00000000-0000-0000-0000-000000000001', current_date - 1, 4920, 1810, 112, 10)
on conflict (business_id, sale_date) do update set revenue=excluded.revenue, gross_margin=excluded.gross_margin, transactions=excluded.transactions, new_customers=excluded.new_customers;

insert into public.quotes (business_id, customer_name, customer_contact, status, value, due_at, next_action) values
('00000000-0000-0000-0000-000000000001','Kallio Renovations','demo@example.invalid','follow_up',1840,current_date,'Call today - quote opened twice'),
('00000000-0000-0000-0000-000000000001','Mikko / rental flat repair','demo@example.invalid','open',420,current_date + 1,'Send reminder SMS'),
('00000000-0000-0000-0000-000000000001','Northside Café','demo@example.invalid','open',760,current_date + 2,'Waiting on paint color confirmation');

insert into public.review_snapshots (business_id, source, rating, review_count, unreplied_count)
values ('00000000-0000-0000-0000-000000000001','google',4.4,128,2);

insert into public.tasks (business_id, title, area, due_at) values
('00000000-0000-0000-0000-000000000001','Reply to 2 new Google reviews','reviews',current_date),
('00000000-0000-0000-0000-000000000001','Check Friday delivery from BuildSupply','supplier',current_date + 1),
('00000000-0000-0000-0000-000000000001','Cycle count fasteners aisle','inventory',current_date + 2),
('00000000-0000-0000-0000-000000000001','Update weekend paint promo sign','operations',current_date + 3);
