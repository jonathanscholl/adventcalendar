import type { Metadata, Viewport } from 'next';
import './globals.css';
import Layout from '@/components/Layout';
import Snowflakes from './Snowflakes';

export const metadata: Metadata = {
  title: 'Skriiiiki Kalender',
  description: 'HIHI',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Snowflakes />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

