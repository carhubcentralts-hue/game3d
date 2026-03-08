import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProSaaS Tools',
  description: 'פלטפורמת כלים פנימית — ProSaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
