import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';

export const metadata: Metadata = {
  title: 'Habitat Capital',
  description: 'Gestión básica de inmuebles (casas y apartamentos) y contratos de arriendo / compraventa.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>
          <Header />
          <main id="app">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
