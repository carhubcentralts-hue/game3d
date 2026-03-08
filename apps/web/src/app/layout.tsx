import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'הכלים של פרוסאס',
  description: 'מערכת יצירת וידאו פרטית מבוססת Remotion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <nav className="border-b border-slate-800 px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-400">🎬 הכלים של פרוסאס</h1>
            <div className="flex gap-4 text-sm">
              <a href="/" className="text-slate-300 hover:text-white transition-colors">ראשי</a>
              <a href="/new" className="text-slate-300 hover:text-white transition-colors">פרויקט חדש</a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
