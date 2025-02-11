// layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import CortexInterface from '@/src/components/global/CortexInterface';
import { ComponentProvider } from '@/src/components/global/ComponentContext';

export const metadata: Metadata = {
  title: 'Cortex',
  description: 'Created with v0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ComponentProvider>
      <html lang="en">
        <body>
          <CortexInterface childWidget={<>{children}</>} />
        </body>
      </html>
    </ComponentProvider>
  );
}