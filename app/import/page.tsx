'use client';

import { useMemo, useState } from 'react';

type ImportedRow = Record<string, string>;

export default function ImportPage() {
  const [rows, setRows] = useState<ImportedRow[]>([]);
  const headers = useMemo(() => rows[0] ? Object.keys(rows[0]) : [], [rows]);

  async function handleFile(file?: File) {
    if (!file) return;
    const text = await file.text();
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const cols = headerLine.split(',').map((col) => col.trim());
    setRows(lines.map((line) => {
      const values = line.split(',').map((value) => value.trim());
      return Object.fromEntries(cols.map((col, index) => [col, values[index] ?? '']));
    }));
  }

  return (
    <section className="pageStack">
      <header className="pageHeader">
        <p className="eyebrow">CSV import</p>
        <h1>Fast pilot path without POS integration.</h1>
        <p className="subcopy">Upload the sample inventory CSV or a POS export with matching columns. This client-side preview avoids storing data until Supabase is configured.</p>
      </header>
      <article className="card wide">
        <label className="uploadBox">
          <input type="file" accept=".csv,text/csv" onChange={(event) => handleFile(event.target.files?.[0])} />
          <strong>Tap to upload inventory CSV</strong>
          <span>Required columns: sku, name, category, stock, reorder_point, cost, price, last_sold, supplier, avg_daily_sales</span>
        </label>
        {rows.length > 0 && (
          <div className="tableScroller importPreview">
            <table>
              <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
              <tbody>{rows.slice(0, 8).map((row, index) => <tr key={index}>{headers.map((header) => <td key={header}>{row[header]}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
