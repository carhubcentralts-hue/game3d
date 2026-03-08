import Link from 'next/link';

const MOCK_PROJECTS = [
  { id: '1', name: 'פרסומת SaaS', status: 'done' as const, scenes: 6, updatedAt: '2026-03-07' },
  { id: '2', name: 'סרטון הסבר', status: 'draft' as const, scenes: 4, updatedAt: '2026-03-06' },
  { id: '3', name: 'Reel לאינסטגרם', status: 'rendering' as const, scenes: 5, updatedAt: '2026-03-08' },
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">הכלים של פרוסאס</h2>
          <p className="mt-1 text-slate-400">ניהול וצפייה בכל סרטוני הוידאו</p>
        </div>
        <Link
          href="/new"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          + פרויקט חדש
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-indigo-500/50 hover:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
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
  );
}
