import { useState } from "react";
import { useTheme, THEMES, type ThemeId } from "../lib/theme";
import { Icon } from "../components/Icons";

export default function SettingsPage() {
  const { theme, themeId, setThemeId } = useTheme();
  const [tab, setTab] = useState<"profile"|"api"|"prefs"|"billing">("profile");
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@nova-ai.app");
  const [bio, setBio] = useState("Building beautiful AI experiences.");
  const [apiKey, setApiKey] = useState("sk-nova-••••••••••••••••••••••••••••");
  const [streaming, setStreaming] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [model, setModel] = useState("nova-4");

  const TABS = [
    { id: "profile" as const, label: "Profile", Icon: Icon.User },
    { id: "api" as const, label: "API Keys", Icon: Icon.Key },
    { id: "prefs" as const, label: "Preferences", Icon: Icon.Settings },
    { id: "billing" as const, label: "Billing", Icon: Icon.Sparkles },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <header className={`px-6 py-4 border-b ${theme.border} ${theme.bgSoft} backdrop-blur`}>
        <div className="pl-12 md:pl-0">
          <h1 className="font-semibold">Settings</h1>
          <p className={`text-xs ${theme.textMuted}`}>Manage your profile and preferences</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Tabs */}
        <nav className="space-y-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition ${
                tab === t.id ? `bg-gradient-to-r ${theme.accent} text-white shadow-md` : `${theme.textMuted} hover:${theme.text} hover:${theme.surfaceAlt}`
              }`}>
              <t.Icon width={16} height={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className={`p-6 rounded-2xl ${theme.surface} border ${theme.border}`}>
          {tab === "profile" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold mb-1">Profile</h2>
                <p className={`text-xs ${theme.textMuted}`}>This is how others will see you on the site.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.accent} grid place-items-center text-2xl font-bold text-white shadow-lg`}>
                  {name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <button className={`px-3 py-1.5 rounded-lg ${theme.surfaceAlt} hover:${theme.surface} border ${theme.border} text-sm`}>Upload new</button>
                  <p className={`text-[11px] ${theme.textMuted} mt-1.5`}>JPG, PNG up to 2MB</p>
                </div>
              </div>
              <Field label="Name" value={name} onChange={setName} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
              <Field label="Bio" value={bio} onChange={setBio} textarea />
              <button className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-medium text-sm shadow-md hover:opacity-90`}>Save changes</button>
            </div>
          )}

          {tab === "api" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold mb-1">API Keys</h2>
                <p className={`text-xs ${theme.textMuted}`}>Connect Nova AI to your own LLM provider.</p>
              </div>
              <Field label="OpenAI API Key" value={apiKey} onChange={setApiKey} />
              <div className={`p-4 rounded-xl ${theme.surfaceAlt} text-xs ${theme.textMuted} flex gap-3`}>
                <Icon.Shield className="flex-shrink-0 mt-0.5 text-emerald-400" width={18} height={18}/>
                <div>Your API keys are encrypted and stored only in your browser. They never touch our servers.</div>
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textSubtle} mb-2 block`}>Default Model</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "nova-4", name: "Nova 4", desc: "Fastest, balanced" },
                    { id: "nova-4-pro", name: "Nova 4 Pro", desc: "Most capable" },
                    { id: "nova-3", name: "Nova 3", desc: "Legacy" },
                    { id: "nova-mini", name: "Nova Mini", desc: "Ultra-cheap" },
                  ].map(m => (
                    <button key={m.id} onClick={() => setModel(m.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        model === m.id ? `border-transparent bg-gradient-to-br ${theme.accent} text-white` : `${theme.border} hover:${theme.surfaceAlt}`
                      }`}>
                      <div className="font-semibold text-sm">{m.name}</div>
                      <div className={`text-xs ${model === m.id ? "text-white/80" : theme.textMuted}`}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "prefs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Preferences</h2>
                <p className={`text-xs ${theme.textMuted}`}>Customize how Nova behaves.</p>
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textSubtle} mb-3 block`}>Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(THEMES) as ThemeId[]).map(id => (
                    <button key={id} onClick={() => setThemeId(id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        themeId === id ? `border-transparent bg-gradient-to-br ${THEMES[id].accent} text-white shadow-lg` : `${theme.border} hover:${theme.surfaceAlt}`
                      }`}>
                      <div className="text-2xl mb-1">{THEMES[id].emoji}</div>
                      <div className="text-xs font-medium">{THEMES[id].name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Toggle label="Stream responses" desc="Show text as it's generated" value={streaming} onChange={setStreaming} theme={theme} />
              <Toggle label="Sound effects" desc="Play subtle sounds on send/receive" value={sounds} onChange={setSounds} theme={theme} />
              <Toggle label="Email notifications" desc="Get notified about important updates" value={notifications} onChange={setNotifications} theme={theme} />
            </div>
          )}

          {tab === "billing" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold mb-1">Billing</h2>
                <p className={`text-xs ${theme.textMuted}`}>Your plan and credits.</p>
              </div>
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${theme.accent} text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Current plan</div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">PRO</span>
                </div>
                <div className="text-3xl font-extrabold mb-1">$29/mo</div>
                <div className="text-sm opacity-90">Renews on Jan 15, 2027</div>
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold">Manage plan</button>
                  <button className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/30 text-xs font-semibold">View invoices</button>
                </div>
              </div>
              <div className={`p-5 rounded-2xl ${theme.surfaceAlt}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm">Credits remaining</div>
                  <div className={`text-xs ${theme.textMuted}`}>8,210 / 10,000</div>
                </div>
                <div className={`w-full h-2 rounded-full bg-black/20 overflow-hidden`}>
                  <div className={`h-full bg-gradient-to-r ${theme.accent}`} style={{ width: "82%" }} />
                </div>
                <button className={`mt-4 px-3 py-1.5 rounded-lg ${theme.surface} border ${theme.border} text-xs font-semibold`}>Buy more credits</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", textarea=false }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  const { theme } = useTheme();
  return (
    <div>
      <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textSubtle} mb-1.5 block`}>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className={`w-full p-3 rounded-xl ${theme.surfaceAlt} border ${theme.border} text-sm outline-none focus:ring-2 ${theme.ring} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 rounded-xl ${theme.surfaceAlt} border ${theme.border} text-sm outline-none focus:ring-2 ${theme.ring}`} />
      )}
    </div>
  );
}

function Toggle({ label, desc, value, onChange, theme }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void; theme: ReturnType<typeof useTheme>["theme"] }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className={`text-xs ${theme.textMuted}`}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition ${value ? `bg-gradient-to-r ${theme.accent}` : theme.surfaceAlt}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
