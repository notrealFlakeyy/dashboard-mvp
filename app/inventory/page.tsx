import { daysSince, margin, money, products } from '@/lib/demo-data';

export default function InventoryPage() {
  const sorted = [...products].sort((a, b) => Number(b.stock <= b.reorderPoint) - Number(a.stock <= a.reorderPoint));
  return (
    <section className="pageStack">
      <header className="pageHeader">
        <p className="eyebrow">Inventory</p>
        <h1>Low-stock, margin, and slow-moving SKU control.</h1>
        <p className="subcopy">Responsive table cards work on phones during aisle walks and on desktop for manager review.</p>
      </header>
      <article className="card wide">
        <div className="cardHeader"><h2>Inventory table</h2><span>{products.length} demo SKUs</span></div>
        <div className="tableScroller">
          <table>
            <thead><tr><th>SKU</th><th>Item</th><th>Category</th><th>Stock</th><th>Reorder</th><th>Margin</th><th>Supplier</th><th>Suggested action</th></tr></thead>
            <tbody>
              {sorted.map((product) => {
                const low = product.stock <= product.reorderPoint;
                const slow = daysSince(product.lastSold) > 21 && product.stock * product.cost > 100;
                const lowMargin = margin(product) < 0.35;
                return (
                  <tr key={product.sku}>
                    <td>{product.sku}</td><td>{product.name}</td><td>{product.category}</td>
                    <td className={low ? 'riskText' : ''}>{product.stock}</td><td>{product.reorderPoint}</td>
                    <td className={lowMargin ? 'riskText' : ''}>{Math.round(margin(product) * 100)}%</td>
                    <td>{product.supplier}</td>
                    <td>{low ? `Reorder ${Math.ceil(product.reorderPoint * 2 - product.stock)} (${money(Math.max(0, Math.ceil(product.reorderPoint * 2 - product.stock)) * product.cost)})` : slow ? 'Promote/return slow stock' : lowMargin ? 'Review price/cost' : 'OK'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
