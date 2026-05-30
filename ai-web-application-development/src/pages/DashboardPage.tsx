import { useTheme } from "../lib/theme";
import { Icon } from "../components/Icons";
import { PERSONAS } from "../lib/aiEngine";

const USAGE_DATA = [42, 65, 48, 90, 73, 110, 95, 130, 118, 145, 132, 168];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ACTIVITY = [
  { who: "You", action: "started a chat with Codex", time: "2m ago", emoji: "💻" },
  { who: "You", action: "generated 4 images (cyberpunk style)", time: "1h ago", emoji: "🎨" },
  { who: "You", action: "exported conversation 'React tips'", time: "3h ago", emoji: "📥" },
  { who: "You", action: "switched theme to Midnight Blue", time: "yesterday", emoji: "🌌" },
  { who: "You", action: "asked Sage to explain transformers", time: "yesterday", emoji: "📚" },
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const max = Math.max(...USAGE_DATA);

  const stats = [
    { label: "Total Messages", value: "12,847", change: "+18.2%", up: true, Icon: Icon.Chat },
    { label: "Images Generated", value: "342", change: "+24.5%", up: true, Icon: Icon.Image },
    { label: "Tokens Used", value: "1.4M", change: "-3.1%", up: false, Icon: Icon.Bolt },
    { label: "Credits Left", value: "8,210", change: "+5.0%", up: true, Icon: Icon.Sparkles },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <header className={`px-6 py-4 border-b ${theme.border} ${theme.bgSoft} backdrop-blur flex items-center justify-between`}>
        <div className="pl-12 md:pl-0">
          <h1 className="font-semibold">Dashboard</h1>
          <p className={`text-xs ${theme.textMuted}`}>Your activity at a glance</p>
        </div>
        <button className={`px-3 py-1.5 rounded-lg ${theme.surface} border ${theme.border} text-xs ${theme.textMuted} hover:${theme.text} transition`}>Last 12 months</button>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`p-5 rounded-2xl ${theme.surface} border ${theme.border}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.accent} text-white grid place-items-center`}>
                  <s.Icon width={18} height={18} />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.up ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"}`}>
                  {s.change}
                </span>
              </div>
              <div className="text-3xl font-extrabold mb-1">{s.value}</div>
              <div className={`text-xs ${theme.textMuted}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className={`lg:col-span-2 p-6 rounded-2xl ${theme.surface} border ${theme.border}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Message Volume</h3>
                <p className={`text-xs ${theme.textMuted}`}>Monthly activity over the past year</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded-sm bg-gradient-to-r ${theme.accent}`}/>Messages</span>
              </div>
            </div>
            <div className="h-64 flex items-end gap-2">
              {USAGE_DATA.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative" style={{ height: `${(v / max) * 100}%` }}>
                    <div className={`w-full h-full rounded-t-md bg-gradient-to-t ${theme.accent} opacity-80 group-hover:opacity-100 transition`} />
                    <div className={`absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded ${theme.surfaceAlt} text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition whitespace-nowrap`}>
                      {v}
                    </div>
                  </div>
                  <div className={`text-[10px] ${theme.textMuted}`}>{MONTHS[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Persona usage donut */}
          <div className={`p-6 rounded-2xl ${theme.surface} border ${theme.border}`}>
            <h3 className="font-semibold mb-1">Persona Usage</h3>
            <p className={`text-xs ${theme.textMuted} mb-5`}>Top assistants this month</p>
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const data = [40, 25, 15, 10, 6, 4];
                  const colors = ["#8b5cf6","#10b981","#ec4899","#f59e0b","#0ea5e9","#22c55e"];
                  let offset = 0;
                  const circumference = 2 * Math.PI * 40;
                  return data.map((v, i) => {
                    const len = (v / 100) * circumference;
                    const el = (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={colors[i]} strokeWidth="14"
                        strokeDasharray={`${len} ${circumference}`} strokeDashoffset={-offset} />
                    );
                    offset += len;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-2xl font-extrabold">100%</div>
                  <div className={`text-[10px] ${theme.textMuted}`}>This month</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {PERSONAS.slice(0, 4).map((p, i) => {
                const pct = [40,25,15,10][i];
                return (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${p.color} grid place-items-center text-[11px]`}>{p.emoji}</div>
                    <span className="flex-1">{p.name}</span>
                    <span className={`font-semibold`}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className={`p-6 rounded-2xl ${theme.surface} border ${theme.border}`}>
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl hover:${theme.surfaceAlt} transition`}>
                <div className={`w-10 h-10 rounded-xl ${theme.surfaceAlt} grid place-items-center text-lg flex-shrink-0`}>{a.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm"><span className="font-semibold">{a.who}</span> {a.action}</div>
                </div>
                <div className={`text-xs ${theme.textMuted} flex-shrink-0`}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
