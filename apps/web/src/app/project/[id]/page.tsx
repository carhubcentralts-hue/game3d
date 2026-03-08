import Link from 'next/link';

const SCENE_TYPE_LABELS: Record<string, string> = {
  'hero-intro': '🎬 פתיחה',
  'big-headline': '📝 כותרת גדולה',
  'feature-grid': '⚡ תכונות',
  'cta-outro': '🔔 CTA סיום',
  'kpi-cards': '📊 מדדים',
  'social-proof': '⭐ המלצות',
  'problem-solution': '💡 בעיה/פתרון',
  'offer-discount': '🏷️ מבצע',
};

const MOCK_SCENES = [
  { id: 's1', type: 'hero-intro', headline: 'ברוכים הבאים', durationInFrames: 90 },
  { id: 's2', type: 'problem-solution', headline: 'הבעיה שלך', durationInFrames: 120 },
  { id: 's3', type: 'feature-grid', headline: 'היתרונות', durationInFrames: 120 },
  { id: 's4', type: 'social-proof', headline: 'לקוחות ממליצים', durationInFrames: 90 },
  { id: 's5', type: 'offer-discount', headline: 'מבצע מיוחד', durationInFrames: 90 },
  { id: 's6', type: 'cta-outro', headline: 'התחילו עכשיו', durationInFrames: 90 },
];

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const totalFrames = MOCK_SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  const totalSeconds = (totalFrames / 30).toFixed(1);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-300">← חזרה</Link>
          <h2 className="mt-1 text-3xl font-bold">עורך סצנות</h2>
          <p className="text-slate-400">פרויקט #{id} · {MOCK_SCENES.length} סצנות · {totalSeconds} שניות</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
            תצוגה מקדימה
          </button>
          <button className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
            🎬 רנדר MP4
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-1 rounded-lg bg-slate-900/60 p-2">
          {MOCK_SCENES.map((scene) => {
            const widthPercent = (scene.durationInFrames / totalFrames) * 100;
            return (
              <div
                key={scene.id}
                className="group flex flex-col items-center justify-center rounded-md bg-indigo-500/20 border border-indigo-500/30 px-3 py-2 text-center transition-all hover:bg-indigo-500/30"
                style={{ minWidth: 80, flexBasis: `${widthPercent}%` }}
              >
                <span className="text-xs text-indigo-300">{(scene.durationInFrames / 30).toFixed(1)}s</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene list */}
      <div className="space-y-3">
        {MOCK_SCENES.map((scene, i) => (
          <div
            key={scene.id}
            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-indigo-500/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-mono text-slate-400">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{SCENE_TYPE_LABELS[scene.type] ?? scene.type}</span>
                <span className="text-slate-500">·</span>
                <span className="font-medium">{scene.headline}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {(scene.durationInFrames / 30).toFixed(1)} שניות · {scene.durationInFrames} פריימים
              </div>
            </div>
            <button className="text-sm text-slate-400 hover:text-indigo-400">ערוך</button>
          </div>
        ))}
      </div>
    </div>
  );
}
