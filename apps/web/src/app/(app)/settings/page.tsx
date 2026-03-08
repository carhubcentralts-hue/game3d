export default function SettingsPage() {
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">הגדרות</h2>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold">כללי</h3>
        <div className="space-y-4 text-sm text-slate-400">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span>גרסה</span>
            <span className="text-slate-300">1.0.0</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span>מערכת</span>
            <span className="text-slate-300">ProSaaS Tools</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span>Render Service</span>
            <span className="text-slate-300">Local (localhost:4010)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Storage</span>
            <span className="text-slate-300">Local</span>
          </div>
        </div>
      </div>
    </div>
  );
}
