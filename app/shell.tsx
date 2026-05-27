'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Overview', icon: '▦' },
  { href: '/inventory', label: 'Inventory', icon: '▤' },
  { href: '/team', label: 'Team', icon: '◷' },
  { href: '/import', label: 'Import', icon: '⇧' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <aside className="sidebar" aria-label="Desktop navigation">
        <div className="brand">
          <span className="brandMark">▣</span>
          <div>
            <strong>Retail Ops</strong>
            <small>Hardware MVP</small>
          </div>
        </div>
        <nav>
          {nav.map((item) => (
            <Link key={item.href} className={pathname === item.href ? 'active' : ''} href={item.href}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">
        {children}
      </main>
      <nav className="bottomNav" aria-label="Mobile navigation">
        {nav.map((item) => (
          <Link key={item.href} className={pathname === item.href ? 'active' : ''} href={item.href}>
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </Link>
        ))}
      </nav>
    </>
  );
}
