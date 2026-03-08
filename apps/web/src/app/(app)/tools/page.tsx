import Link from 'next/link';

const TOOLS = [
  {
    key: 'video-studio',
    name: 'Video Studio',
    description: 'צור סרטוני שיווק מקצועיים עם AI-powered scene generation ורינדור Remotion',
    icon: '🎬',
    href: '/tools/video-studio',
    enabled: true,
    features: ['יצירת סצנות מפרומפט', 'תבניות מוכנות', 'רינדור MP4', 'Brand Kit'],
  },
  {
    key: 'prompt-tools',
    name: 'Prompt Tools',
    description: 'כלי פרומפט מתקדמים ליצירת תוכן שיווקי, קופי, ותסריטים',
    icon: '✍️',
    href: '#',
    enabled: false,
    features: ['קופי לקמפיינים', 'תסריטים לסרטונים', 'תוכן לרשתות'],
  },
  {
    key: 'campaign-manager',
    name: 'Campaign Manager',
    description: 'ניהול קמפיינים, תזמון פרסום ומעקב ביצועים',
    icon: '📊',
    href: '#',
    enabled: false,
    features: ['תזמון פרסום', 'מעקב ביצועים', 'A/B Testing'],
  },
  {
    key: 'landing-pages',
    name: 'Landing Pages',
    description: 'בנה דפי נחיתה מקצועיים בקלות',
    icon: '🌐',
    href: '#',
    enabled: false,
    features: ['עורך ויזואלי', 'תבניות מוכנות', 'אנליטיקס'],
  },
];

export default function ToolsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">כלים</h2>
        <p className="mt-1 text-slate-400">כל הכלים הזמינים במערכת ProSaaS Tools</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.key}
            href={tool.enabled ? tool.href : '#'}
            className={`group relative rounded-2xl border p-6 transition-all ${
              tool.enabled
                ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900'
                : 'border-slate-800/50 bg-slate-900/20 opacity-50 cursor-not-allowed'
            }`}
          >
            {!tool.enabled && (
              <span className="absolute top-4 start-4 rounded-full bg-slate-700 px-2.5 py-1 text-xs text-slate-400">
                בקרוב
              </span>
            )}
            <div className="mb-4 text-4xl">{tool.icon}</div>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              {tool.name}
            </h3>
            <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
