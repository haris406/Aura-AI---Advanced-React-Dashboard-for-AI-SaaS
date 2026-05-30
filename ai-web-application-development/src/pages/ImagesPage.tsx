import { useState } from "react";
import { useTheme } from "../lib/theme";
import { Icon } from "../components/Icons";

const STYLES = [
  { id: "realistic", label: "Photo Realistic", emoji: "📸" },
  { id: "anime", label: "Anime", emoji: "🎌" },
  { id: "3d", label: "3D Render", emoji: "🎲" },
  { id: "oil", label: "Oil Painting", emoji: "🎨" },
  { id: "pixel", label: "Pixel Art", emoji: "👾" },
  { id: "watercolor", label: "Watercolor", emoji: "💧" },
];

const RATIOS = [
  { id: "1:1", label: "Square 1:1", w: 1, h: 1 },
  { id: "16:9", label: "Widescreen 16:9", w: 16, h: 9 },
  { id: "9:16", label: "Portrait 9:16", w: 9, h: 16 },
  { id: "4:3", label: "Classic 4:3", w: 4, h: 3 },
];

const PROMPTS = [
  "Cyberpunk Tokyo street at night with neon reflections in the rain",
  "A serene Japanese garden with cherry blossoms and a wooden bridge",
  "Astronaut riding a horse on Mars, cinematic lighting",
  "Cozy mountain cabin during a snowstorm, warm interior glow",
];

type GeneratedItem = {
  id: string;
  prompt: string;
  style: string;
  ratio: string;
  // SVG gradient placeholder (we don't generate real images)
  seed: number;
};

function gradientFor(seed: number) {
  const palettes = [
    ["#6366f1","#ec4899","#f59e0b"],
    ["#06b6d4","#3b82f6","#8b5cf6"],
    ["#10b981","#06b6d4","#3b82f6"],
    ["#f43f5e","#f59e0b","#10b981"],
    ["#a855f7","#ec4899","#f43f5e"],
    ["#0ea5e9","#22d3ee","#a3e635"],
  ];
  return palettes[seed % palettes.length];
}

function PlaceholderImage({ item }: { item: GeneratedItem }) {
  const colors = gradientFor(item.seed);
  const ratio = RATIOS.find(r => r.id === item.ratio) ?? RATIOS[0];
  const aspect = `${ratio.w} / ${ratio.h}`;
  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: aspect }}>
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`g-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]}/>
            <stop offset="50%" stopColor={colors[1]}/>
            <stop offset="100%" stopColor={colors[2]}/>
          </linearGradient>
          <radialGradient id={`r-${item.id}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#g-${item.id})`}/>
        <rect width="400" height="400" fill={`url(#r-${item.id})`}/>
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i}
            cx={(item.seed * 13 + i * 37) % 400}
            cy={(item.seed * 17 + i * 53) % 400}
            r={10 + (i * item.seed) % 40}
            fill="white"
            opacity={0.05 + (i % 5) * 0.03}
          />
        ))}
      </svg>
    </div>
  );
}

export default function ImagesPage() {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [ratio, setRatio] = useState("1:1");
  const [generating, setGenerating] = useState(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);

  async function generate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1400));
    const newItems: GeneratedItem[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random().toString(36).slice(2),
      prompt,
      style,
      ratio,
      seed: Math.floor(Math.random() * 1000) + i,
    }));
    setItems(p => [...newItems, ...p]);
    setGenerating(false);
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Controls */}
      <aside className={`w-80 flex-shrink-0 border-r ${theme.border} ${theme.bgSoft} backdrop-blur overflow-y-auto hidden lg:block`}>
        <div className="p-5">
          <h2 className="text-lg font-bold mb-1">Image Studio</h2>
          <p className={`text-xs ${theme.textMuted} mb-5`}>Create stunning visuals with AI</p>

          <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textSubtle} mb-2 block`}>Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city skyline at dusk…"
            rows={4}
            className={`w-full p-3 rounded-xl ${theme.surface} border ${theme.border} text-sm outline-none focus:ring-2 ${theme.ring} resize-none`}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PROMPTS.map(p => (
              <button key={p} onClick={() => setPrompt(p)}
                className={`text-[10px] px-2 py-1 rounded-full ${theme.surfaceAlt} ${theme.textMuted} hover:${theme.text} transition`}>
                {p.slice(0, 26)}…
              </button>
            ))}
          </div>

          <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textSubtle} mt-5 mb-2 block`}>Style</label>
          <div className="grid grid-cols-3 gap-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className={`p-2.5 rounded-lg border text-xs transition flex flex-col items-center gap-1 ${
                  style === s.id ? `bg-gradient-to-br ${theme.accent} text-white border-transparent` : `${theme.surface} ${theme.border} hover:${theme.surfaceAlt}`
                }`}>
                <span className="text-lg">{s.emoji}</span>
                <span className="leading-tight text-center">{s.label}</span>
              </button>
            ))}
          </div>

          <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textSubtle} mt-5 mb-2 block`}>Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2">
            {RATIOS.map(r => (
              <button key={r.id} onClick={() => setRatio(r.id)}
                className={`p-2.5 rounded-lg border text-xs transition ${
                  ratio === r.id ? `bg-gradient-to-br ${theme.accent} text-white border-transparent` : `${theme.surface} ${theme.border} hover:${theme.surfaceAlt}`
                }`}>
                {r.label}
              </button>
            ))}
          </div>

          <button onClick={generate} disabled={!prompt.trim() || generating}
            className={`w-full mt-6 py-3 rounded-xl bg-gradient-to-r ${theme.accent} text-white font-semibold shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2`}>
            {generating ? (<><Icon.Spinner className="animate-spin" /> Generating…</>) : (<><Icon.Sparkles width={16} height={16} /> Generate 4 images</>)}
          </button>
          <p className={`text-[11px] ${theme.textSubtle} text-center mt-2`}>Uses ~4 credits</p>
        </div>
      </aside>

      {/* Gallery */}
      <main className="flex-1 overflow-y-auto">
        <header className={`px-6 py-4 border-b ${theme.border} ${theme.bgSoft} backdrop-blur flex items-center justify-between`}>
          <div className="pl-12 md:pl-0">
            <h1 className="font-semibold">Gallery</h1>
            <p className={`text-xs ${theme.textMuted}`}>{items.length} {items.length === 1 ? "image" : "images"} created</p>
          </div>
        </header>

        <div className="p-6">
          {items.length === 0 && !generating ? (
            <div className="text-center py-24">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${theme.accent} grid place-items-center text-4xl shadow-2xl mx-auto mb-4`}>🎨</div>
              <h2 className="text-2xl font-bold mb-2">Your gallery is empty</h2>
              <p className={`${theme.textMuted} max-w-md mx-auto`}>Type a prompt on the left and hit Generate to start creating beautiful AI artwork.</p>
            </div>
          ) : (
            <>
              {generating && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-xl ${theme.surfaceAlt} animate-pulse grid place-items-center`}>
                      <Icon.Spinner className="animate-spin opacity-50" width={28} height={28} />
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(item => (
                  <div key={item.id} className={`group rounded-2xl overflow-hidden border ${theme.border} ${theme.surface}`}>
                    <PlaceholderImage item={item} />
                    <div className="p-3">
                      <p className={`text-xs ${theme.textMuted} line-clamp-2 mb-2`}>{item.prompt}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${theme.surfaceAlt} ${theme.textMuted}`}>{item.style} · {item.ratio}</span>
                        <div className="flex gap-1">
                          <button className={`p-1.5 rounded-md hover:${theme.surfaceAlt} ${theme.textMuted} transition`}><Icon.Download width={14} height={14} /></button>
                          <button className={`p-1.5 rounded-md hover:${theme.surfaceAlt} ${theme.textMuted} transition`}><Icon.Heart width={14} height={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
