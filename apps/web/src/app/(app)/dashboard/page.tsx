import Link from 'next/link';

const TOOLS = [
  {
    key: 'video-studio',
    name: 'Video Studio',
    description: 'צור סרטוני שיווק מקצועיים עם AI ו-Remotion',
    icon: '🎬',
    href: '/tools/video-studio',
    enabled: true,
  },
  {
    key: 'prompt-tools',
    name: 'Prompt Tools',
    description: 'כלי פרומפט מתקדמים ליצירת תוכן',
    icon: '✍️',
    href: '#',
    enabled: false,
  },
  {
    key: 'campaign-manager',
    name: 'Campaign Manager',
    description: 'ניהול קמפיינים ותזמון פרסום',
    icon: '📊',
    href: '#',
    enabled: false,
  },
];

const MOCK_RECENT_PROJECTS = [
  { id: '1', name: 'פרסומת SaaS', status: 'done', scenes: 6, updatedAt: '2026-03-07' },
  { id: '2', name: 'סרטון הסבר', status: 'draft', scenes: 4, updatedAt: '2026-03-06' },
  { id: '3', name: 'Reel לאינסטגרם', status: 'rendering', scenes: 5, updatedAt: '2026-03-08' },
];

const statusColors: Record<string, string> = {
  draft: 'bg-slate-600',
  ready: 'bg-blue-600',
  rendering: 'bg-amber-600',
  done: 'bg-emerald-600',
  failed: 'bg-red-600',
};

const statusLabels: Record<string, string> = {
  draft: 'טיוטה',
  ready: 'מוכן',
  rendering: 'מרנדר...',
  done: 'הושלם',
  failed: 'נכשל',
};

export default function DashboardPage() {
  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">שלום 👋</h2>
        <p className="mt-1 text-slate-400">ברוכים הבאים ל-ProSaaS Tools</p>
      </div>

      {/* Tools Grid */}
      <div className="mb-10">
        <h3 className="mb-4 text-lg font-semibold text-slate-200">כלים</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.key}
              href={tool.enabled ? tool.href : '#'}
              className={`group relative rounded-2xl border p-6 transition-all ${
                tool.enabled
                  ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer'
                  : 'border-slate-800/50 bg-slate-900/20 opacity-50 cursor-not-allowed'
              }`}
            >
              {!tool.enabled && (
                <span className="absolute top-3 start-3 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-slate-400">
                  בקרוב
                </span>
              )}
              <div className="mb-3 text-3xl">{tool.icon}</div>
              <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </h4>
              <p className="mt-1 text-sm text-slate-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-200">פרויקטים אחרונים</h3>
          <Link href="/tools/video-studio" className="text-sm text-indigo-400 hover:text-indigo-300">
            הצג הכול ←
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_RECENT_PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={`/tools/video-studio/project/${project.id}`}
              className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold group-hover:text-indigo-400 transition-colors">
                  {project.name}
                </h4>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{project.scenes} סצנות</span>
                <span>עודכן {project.updatedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
