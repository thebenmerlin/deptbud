import type { Metadata } from 'next';
import Providers from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Department Budget Management',
  description: 'Smart budget management and expense analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
