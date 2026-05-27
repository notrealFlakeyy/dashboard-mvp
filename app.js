const fallbackProducts = [
  {sku:'FAST-8X2', name:'8x2 wood screws 200pk', category:'Fasteners', stock:8, reorder_point:30, cost:4.2, price:8.99, last_sold:'2026-05-25', supplier:'Nordic Fixings', avg_daily_sales:5.2},
  {sku:'PAINT-WHT10', name:'White interior paint 10L', category:'Paint', stock:12, reorder_point:18, cost:31, price:58, last_sold:'2026-05-26', supplier:'ColorPro', avg_daily_sales:2.1},
  {sku:'DRILL-18V', name:'18V cordless drill kit', category:'Tools', stock:3, reorder_point:5, cost:78, price:119, last_sold:'2026-05-20', supplier:'ToolSource', avg_daily_sales:.35},
  {sku:'PIPE-CU15', name:'15mm copper pipe 3m', category:'Plumbing', stock:22, reorder_point:40, cost:7.8, price:12.5, last_sold:'2026-05-24', supplier:'BuildSupply', avg_daily_sales:4.4},
  {sku:'HINGE-BRASS', name:'Brass cabinet hinge pair', category:'Hardware', stock:140, reorder_point:25, cost:3.1, price:5.49, last_sold:'2026-03-01', supplier:'Nordic Fixings', avg_daily_sales:.05},
  {sku:'GARD-HOSE50', name:'50m garden hose', category:'Garden', stock:44, reorder_point:15, cost:14, price:24.99, last_sold:'2026-04-03', supplier:'Seasonal Goods', avg_daily_sales:.08},
  {sku:'BAT-AA24', name:'AA batteries 24pk', category:'Electrical', stock:19, reorder_point:35, cost:5.4, price:9.99, last_sold:'2026-05-25', supplier:'ElectroWholesaler', avg_daily_sales:3.1},
  {sku:'BLADE-10IN', name:'10 inch saw blade', category:'Tools', stock:26, reorder_point:12, cost:9.5, price:15.99, last_sold:'2026-05-01', supplier:'ToolSource', avg_daily_sales:.18}
];
const quotes = [
  {customer:'Kallio Renovations', value:1840, age:3, next:'Call today - quote opened twice'},
  {customer:'Mikko / rental flat repair', value:420, age:6, next:'Send reminder SMS'},
  {customer:'Northside Café', value:760, age:1, next:'Waiting on paint color confirmation'}
];
const tasks = ['Reply to 2 new Google reviews', 'Check Friday delivery from BuildSupply', 'Cycle count fasteners aisle', 'Update weekend paint promo sign'];
const salesTrend = [{d:'Mon',v:3120},{d:'Tue',v:2840},{d:'Wed',v:3650},{d:'Thu',v:3310},{d:'Fri',v:4920},{d:'Sat',v:6180}];
let products = JSON.parse(localStorage.getItem('products') || 'null') || fallbackProducts;
function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n)}
function daysSince(date){return Math.max(0, Math.round((new Date('2026-05-26') - new Date(date))/(1000*60*60*24)))}
function parseCSV(text){const [head,...rows]=text.trim().split(/\r?\n/); const cols=head.split(',').map(s=>s.trim()); return rows.map(r=>{const vals=r.split(',').map(s=>s.trim()); const o={}; cols.forEach((c,i)=>o[c]=vals[i]); ['stock','reorder_point','cost','price','avg_daily_sales'].forEach(k=>o[k]=Number(o[k]||0)); return o;});}
function render(){
  localStorage.setItem('products', JSON.stringify(products));
  const invValue = products.reduce((s,p)=>s+p.stock*p.cost,0);
  const atRisk = products.filter(p=>p.stock<=p.reorder_point).length;
  const low = products.filter(p=>p.stock<=p.reorder_point).sort((a,b)=>(a.stock/a.reorder_point)-(b.stock/b.reorder_point));
  const slow = products.filter(p=>daysSince(p.last_sold)>21 && p.stock*p.cost>100).sort((a,b)=>b.stock*b.cost-a.stock*a.cost);
  const avgMargin = products.reduce((s,p)=>s+((p.price-p.cost)/p.price),0)/products.length;
  document.getElementById('kpis').innerHTML = [
    ['Inventory value', money(invValue), '+ CSV/import-ready'],
    ['Low-stock SKUs', atRisk, 'Needs reorder review'],
    ['Avg gross margin', Math.round(avgMargin*100)+'%', 'Flag items under 35%'],
    ['Open quote value', money(quotes.reduce((s,q)=>s+q.value,0)), '3 follow-ups'],
    ['Google rating', '4.4 ★', '2 reviews need replies']
  ].map(k=>`<article class="card kpi"><div class="label">${k[0]}</div><div class="value">${k[1]}</div><div class="delta">${k[2]}</div></article>`).join('');
  document.getElementById('lowStockCount').textContent = `${low.length} SKUs`;
  document.getElementById('lowStockRows').innerHTML = low.map(p=>`<tr><td>${p.sku}</td><td>${p.name}</td><td class="risk">${p.stock}</td><td>${p.reorder_point}</td><td>${p.avg_daily_sales?Math.max(1,Math.floor(p.stock/p.avg_daily_sales)):'n/a'}</td></tr>`).join('') || '<tr><td colspan="5">No low stock items.</td></tr>';
  document.getElementById('reorderRows').innerHTML = low.map(p=>{const qty=Math.max(0, Math.ceil((p.reorder_point*2)-p.stock)); return `<tr><td>${p.supplier||'TBD'}</td><td>${p.name}</td><td>${qty}</td><td>${money(qty*p.cost)}</td></tr>`}).join('') || '<tr><td colspan="4">No reorder suggestions.</td></tr>';
  document.getElementById('slowRows').innerHTML = slow.map(p=>`<tr><td>${p.sku}</td><td>${p.name}</td><td>${money(p.stock*p.cost)}</td><td>${daysSince(p.last_sold)} days ago</td><td>Bundle, discount, or return</td></tr>`).join('') || '<tr><td colspan="5">No slow-moving high-value stock.</td></tr>';
  document.getElementById('marginRows').innerHTML = products.slice().sort((a,b)=>((a.price-a.cost)/a.price)-((b.price-b.cost)/b.price)).slice(0,5).map(p=>{const m=(p.price-p.cost)/p.price; return `<tr><td>${p.name}</td><td class="${m<.35?'risk':m<.45?'warn':'ok'}">${Math.round(m*100)}%</td><td>${money(p.price)}</td><td>${m<.35?'Review price/cost':'OK'}</td></tr>`}).join('');
  const max=Math.max(...salesTrend.map(x=>x.v));
  document.getElementById('trendBars').innerHTML=salesTrend.map(x=>`<div class="bar-row"><span>${x.d}</span><div class="bar"><span style="width:${x.v/max*100}%"></span></div><strong>${money(x.v)}</strong></div>`).join('');
  document.getElementById('quoteList').innerHTML=quotes.map(q=>`<li><strong>${q.customer}</strong><br>${money(q.value)} · ${q.age} days old<br><span class="warn">${q.next}</span></li>`).join('');
  document.getElementById('reviewPanel').innerHTML='<div class="review-score">4.4 ★</div><p class="sub">Mock Google review KPI. Production can store manual review snapshots or connect through approved Google Business Profile flows.</p>';
  document.getElementById('taskList').innerHTML=tasks.map(t=>`<li>☐ ${t}</li>`).join('');
}
document.getElementById('csvInput').addEventListener('change', async e=>{const file=e.target.files[0]; if(!file)return; products=parseCSV(await file.text()); render();});
document.getElementById('resetDemo').addEventListener('click',()=>{products=fallbackProducts; localStorage.removeItem('products'); render();});
render();
