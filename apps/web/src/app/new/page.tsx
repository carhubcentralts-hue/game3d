'use client';

import { useState } from 'react';
import {
  VIDEO_PURPOSES,
  VISUAL_STYLES,
  PLATFORMS,
  TONE_OF_VOICE,
  MOTION_INTENSITIES,
} from '@video-studio/shared';

const purposeLabels: Record<string, string> = {
  ad: 'פרסומת',
  ugc: 'UGC',
  'saas-promo': 'SaaS פרומו',
  explainer: 'הסבר',
  reel: 'Reel',
  testimonial: 'המלצה',
  'offer-ad': 'מבצע',
  'kpi-summary': 'סיכום KPI',
  slideshow: 'מצגת',
  'cinematic-typography': 'טיפוגרפיה קולנועית',
};

const platformLabels: Record<string, string> = {
  tiktok: 'TikTok',
  'instagram-reels': 'Instagram Reels',
  'instagram-story': 'Story',
  'youtube-shorts': 'YouTube Shorts',
  'youtube-16:9': 'YouTube 16:9',
  'facebook-ad': 'Facebook Ad',
  'square-post': 'פוסט מרובע',
};

const styleLabels: Record<string, string> = {
  'clean-saas': 'SaaS נקי',
  'bold-startup': 'סטארטאפ בולט',
  luxury: 'לוקסוס',
  'dark-premium': 'כהה פרמיום',
  minimal: 'מינימלי',
  'flashy-performance': 'פלאשי שיווקי',
};

const toneLabels: Record<string, string> = {
  professional: 'מקצועי',
  casual: 'חופשי',
  bold: 'נועז',
  friendly: 'ידידותי',
  urgent: 'דחוף',
  luxury: 'יוקרתי',
  playful: 'משחקי',
};

const motionLabels: Record<string, string> = {
  subtle: 'עדין',
  moderate: 'בינוני',
  energetic: 'אנרגטי',
  extreme: 'קיצוני',
};

function SelectGroup({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  labels: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
              value === opt
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            {labels[opt] ?? opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  const [prompt, setPrompt] = useState('');
  const [purpose, setPurpose] = useState<string>('ad');
  const [platform, setPlatform] = useState<string>('tiktok');
  const [style, setStyle] = useState<string>('clean-saas');
  const [tone, setTone] = useState<string>('professional');
  const [motion, setMotion] = useState<string>('moderate');
  const [duration, setDuration] = useState(15);
  const [sceneCount, setSceneCount] = useState(6);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    // In full implementation: call prompt-engine API
    setGenerated(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-3xl font-bold">יצירת פרויקט חדש</h2>

      <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        {/* Prompt */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">תיאור הסרטון</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="תאר את הסרטון שאתה רוצה ליצור..."
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <SelectGroup label="מטרת הסרטון" options={VIDEO_PURPOSES} labels={purposeLabels} value={purpose} onChange={setPurpose} />
        <SelectGroup label="פלטפורמה" options={PLATFORMS} labels={platformLabels} value={platform} onChange={setPlatform} />
        <SelectGroup label="סגנון ויזואלי" options={VISUAL_STYLES} labels={styleLabels} value={style} onChange={setStyle} />
        <SelectGroup label="טון דיבור" options={TONE_OF_VOICE} labels={toneLabels} value={tone} onChange={setTone} />
        <SelectGroup label="עוצמת אנימציה" options={MOTION_INTENSITIES} labels={motionLabels} value={motion} onChange={setMotion} />

        {/* Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              משך (שניות): {duration}
            </label>
            <input
              type="range"
              min={5}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              מספר סצנות: {sceneCount}
            </label>
            <input
              type="range"
              min={2}
              max={15}
              value={sceneCount}
              onChange={(e) => setSceneCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          🎬 יצירת סצנות
        </button>

        {generated && (
          <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-900/30 p-4 text-emerald-300">
            ✅ הסצנות נוצרו בהצלחה! מעבר לעורך הסצנות...
          </div>
        )}
      </div>
    </div>
  );
}
