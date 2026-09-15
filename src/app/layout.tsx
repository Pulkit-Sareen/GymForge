import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'GymForge — Smart Gym Workout Planner & PWA Tracker',
  description:
    'Mobile-first intelligent gym workout planner, zero-data-loss active workout tracker, dynamic muscle highlighting, and automated double progression.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GymForge',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-zinc-950 text-zinc-100">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-zinc-950 min-h-screen text-zinc-100 antialiased selection:bg-cyan-500 selection:text-zinc-950">
        <ServiceWorkerRegister />
        <main className="min-h-screen">{children}</main>
        <Navbar />
      </body>
    </html>
  );
}
