export type Product = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  cost: number;
  price: number;
  lastSold: string;
  supplier: string;
  avgDailySales: number;
};

export type TeamMember = {
  name: string;
  role: 'owner' | 'manager' | 'staff';
  location: string;
  shift: string;
  status: 'Clocked in' | 'Due soon' | 'Off today';
  lastAction: string;
};

export const products: Product[] = [
  { sku: 'FAST-8X2', name: '8x2 wood screws 200pk', category: 'Fasteners', stock: 8, reorderPoint: 30, cost: 4.2, price: 8.99, lastSold: '2026-05-25', supplier: 'Nordic Fixings', avgDailySales: 5.2 },
  { sku: 'PAINT-WHT10', name: 'White interior paint 10L', category: 'Paint', stock: 12, reorderPoint: 18, cost: 31, price: 58, lastSold: '2026-05-26', supplier: 'ColorPro', avgDailySales: 2.1 },
  { sku: 'DRILL-18V', name: '18V cordless drill kit', category: 'Tools', stock: 3, reorderPoint: 5, cost: 78, price: 119, lastSold: '2026-05-20', supplier: 'ToolSource', avgDailySales: 0.35 },
  { sku: 'PIPE-CU15', name: '15mm copper pipe 3m', category: 'Plumbing', stock: 22, reorderPoint: 40, cost: 7.8, price: 12.5, lastSold: '2026-05-24', supplier: 'BuildSupply', avgDailySales: 4.4 },
  { sku: 'HINGE-BRASS', name: 'Brass cabinet hinge pair', category: 'Hardware', stock: 140, reorderPoint: 25, cost: 3.1, price: 5.49, lastSold: '2026-03-01', supplier: 'Nordic Fixings', avgDailySales: 0.05 },
  { sku: 'GARD-HOSE50', name: '50m garden hose', category: 'Garden', stock: 44, reorderPoint: 15, cost: 14, price: 24.99, lastSold: '2026-04-03', supplier: 'Seasonal Goods', avgDailySales: 0.08 },
  { sku: 'BAT-AA24', name: 'AA batteries 24pk', category: 'Electrical', stock: 19, reorderPoint: 35, cost: 5.4, price: 9.99, lastSold: '2026-05-25', supplier: 'ElectroWholesaler', avgDailySales: 3.1 },
  { sku: 'BLADE-10IN', name: '10 inch saw blade', category: 'Tools', stock: 26, reorderPoint: 12, cost: 9.5, price: 15.99, lastSold: '2026-05-01', supplier: 'ToolSource', avgDailySales: 0.18 }
];

export const quotes = [
  { customer: 'Kallio Renovations', value: 1840, age: 3, next: 'Call today - quote opened twice' },
  { customer: 'Mikko / rental flat repair', value: 420, age: 6, next: 'Send reminder SMS' },
  { customer: 'Northside Café', value: 760, age: 1, next: 'Waiting on paint color confirmation' }
];

export const tasks = [
  'Reply to 2 new Google reviews',
  'Check Friday delivery from BuildSupply',
  'Cycle count fasteners aisle',
  'Update weekend paint promo sign'
];

export const salesTrend = [
  { day: 'Mon', revenue: 3120 },
  { day: 'Tue', revenue: 2840 },
  { day: 'Wed', revenue: 3650 },
  { day: 'Thu', revenue: 3310 },
  { day: 'Fri', revenue: 4920 },
  { day: 'Sat', revenue: 6180 }
];

export const team: TeamMember[] = [
  { name: 'Aino Korhonen', role: 'manager', location: 'Main store', shift: '08:00–16:00', status: 'Clocked in', lastAction: 'Clocked in 07:56' },
  { name: 'Mika Lehto', role: 'staff', location: 'Paint desk', shift: '10:00–18:00', status: 'Clocked in', lastAction: 'Clocked in 09:58' },
  { name: 'Sara Niemi', role: 'staff', location: 'Warehouse', shift: '12:00–20:00', status: 'Due soon', lastAction: 'No clock-in yet' },
  { name: 'Olli Virtanen', role: 'staff', location: 'Main store', shift: 'Off', status: 'Off today', lastAction: 'Last shift yesterday' }
];

export function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function daysSince(date: string) {
  return Math.max(0, Math.round((new Date('2026-05-26').getTime() - new Date(date).getTime()) / 86_400_000));
}

export function margin(product: Product) {
  return product.price > 0 ? (product.price - product.cost) / product.price : 0;
}
