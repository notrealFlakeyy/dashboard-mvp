import Link from 'next/link';
import { daysSince, margin, money, products, quotes, salesTrend, tasks, team } from '@/lib/demo-data';

const lowStock = products.filter((product) => product.stock <= product.reorderPoint);
const slowMoving = products.filter((product) => daysSince(product.lastSold) > 21 && product.stock * product.cost > 100);
const inventoryValue = products.reduce((sum, product) => sum + product.stock * product.cost, 0);
const averageMargin = products.reduce((sum, product) => sum + margin(product), 0) / products.length;
const maxRevenue = Math.max(...salesTrend.map((day) => day.revenue));

export default function HomePage() {
  return (
    <section className="pageStack">
      <header className="hero">
        <div>
          <p className="eyebrow">Morning operations dashboard</p>
          <h1>Know what needs attention before the shop gets busy.</h1>
          <p className="subcopy">Built for hardware stores and local retailers: low-stock alerts, reorder suggestions, slow-moving cash, quote follow-ups, Google review tasks, and team/time foundations.</p>
        </div>
        <Link href="/team" className="primaryButton">Open mobile team view</Link>
      </header>

      <div className="kpiGrid">
        <Kpi title="Inventory value" value={money(inventoryValue)} detail="From SKU/import data" />
        <Kpi title="Low-stock SKUs" value={String(lowStock.length)} detail="Needs reorder review" tone="warning" />
        <Kpi title="Avg gross margin" value={`${Math.round(averageMargin * 100)}%`} detail="Flag items under 35%" />
        <Kpi title="Clocked in now" value={String(team.filter((member) => member.status === 'Clocked in').length)} detail="Team/time foundation" />
      </div>

      <div className="dashboardGrid">
        <article className="card wide">
          <div className="cardHeader"><h2>Low-stock alerts</h2><Link href="/inventory">View all</Link></div>
          <div className="tableScroller">
            <table>
              <thead><tr><th>SKU</th><th>Item</th><th>Stock</th><th>Reorder point</th><th>Days left</th></tr></thead>
              <tbody>
                {lowStock.map((product) => (
                  <tr key={product.sku}>
                    <td>{product.sku}</td><td>{product.name}</td><td className="riskText">{product.stock}</td><td>{product.reorderPoint}</td><td>{product.avgDailySales ? Math.max(1, Math.floor(product.stock / product.avgDailySales)) : 'n/a'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <div className="cardHeader"><h2>Sales trend</h2><span>Demo week</span></div>
          <div className="bars">
            {salesTrend.map((day) => (
              <div className="barRow" key={day.day}>
                <span>{day.day}</span><div><i style={{ width: `${(day.revenue / maxRevenue) * 100}%` }} /></div><strong>{money(day.revenue)}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="cardHeader"><h2>Reorder suggestions</h2><span>{lowStock.length} lines</span></div>
          <ul className="stackList">
            {lowStock.map((product) => {
              const qty = Math.max(0, Math.ceil(product.reorderPoint * 2 - product.stock));
              return <li key={product.sku}><strong>{product.supplier}</strong><span>{qty} × {product.name}</span><em>{money(qty * product.cost)}</em></li>;
            })}
          </ul>
        </article>

        <article className="card">
          <div className="cardHeader"><h2>Slow-moving stock</h2><span>{slowMoving.length} items</span></div>
          <ul className="stackList">
            {slowMoving.map((product) => <li key={product.sku}><strong>{product.name}</strong><span>{money(product.stock * product.cost)} tied up · last sold {daysSince(product.lastSold)} days ago</span><em>Bundle, discount, return, or cycle count</em></li>)}
          </ul>
        </article>

        <article className="card">
          <div className="cardHeader"><h2>Quotes & supplier follow-up</h2><span>Placeholder CRM</span></div>
          <ul className="stackList">
            {quotes.map((quote) => <li key={quote.customer}><strong>{quote.customer}</strong><span>{money(quote.value)} · {quote.age} days old</span><em>{quote.next}</em></li>)}
          </ul>
        </article>

        <article className="card">
          <div className="cardHeader"><h2>Google visibility tasks</h2><span>4.4 ★</span></div>
          <p className="subcopy compact">Manual snapshot now; approved Google Business Profile integration can come after pilot validation.</p>
          <ul className="checkList">{tasks.map((task) => <li key={task}>☐ {task}</li>)}</ul>
        </article>
      </div>
    </section>
  );
}

function Kpi({ title, value, detail, tone }: { title: string; value: string; detail: string; tone?: 'warning' }) {
  return <article className={`kpiCard ${tone ?? ''}`}><span>{title}</span><strong>{value}</strong><small>{detail}</small></article>;
}
