import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from './shell';

export const metadata: Metadata = {
  title: 'Local Retail Ops Dashboard',
  description: 'MVP dashboard for hardware stores and local retailers',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Retail Ops',
    statusBarStyle: 'black-translucent'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
