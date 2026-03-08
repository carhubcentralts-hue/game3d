'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'דשבורד', icon: '🏠' },
  { href: '/tools', label: 'כלים', icon: '🧰' },
  { href: '/tools/video-studio', label: 'Video Studio', icon: '🎬' },
];

export function Sidebar({ username }: { username?: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="flex w-64 flex-col border-e border-slate-800 bg-slate-900/50">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">
          🔧
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">ProSaaS Tools</h1>
          <p className="text-xs text-slate-500">v1.0.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {username?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <span className="text-sm text-slate-300">{username ?? 'Guest'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            יציאה
          </button>
        </div>
      </div>
    </aside>
  );
}
