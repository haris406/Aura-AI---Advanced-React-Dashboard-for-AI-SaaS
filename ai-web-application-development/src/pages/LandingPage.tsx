import { Link } from "react-router-dom";
import { useTheme, THEMES, type ThemeId } from "../lib/theme";
import { Icon, Logo } from "../components/Icons";

const FEATURES = [
  { Icon: Icon.Bolt, title: "Lightning Fast", desc: "Built on Vite + React 19 with optimized streaming responses and zero bloat." },
  { Icon: Icon.Sparkles, title: "6 AI Personas", desc: "Specialized assistants for code, creativity, business, education, wellness, and more." },
  { Icon: Icon.Shield, title: "Privacy First", desc: "All conversations stored locally. No backend required, no data leaves the browser." },
  { Icon: Icon.Globe, title: "4 Themes Built-in", desc: "Dark, Light, Midnight Blue, Sunset Glow — each lovingly designed and instantly switchable." },
  { Icon: Icon.Image, title: "Image Studio", desc: "Beautiful UI for AI image generation with prompt builder, styles, and gallery." },
  { Icon: Icon.Dashboard, title: "Analytics Dashboard", desc: "Track usage, token spend, conversations, and performance with elegant charts." },
];

const PRICING = [
  { name: "Regular License", price: "$29", tagline: "Perfect for personal & single-client projects", features: ["1 end product, free or commercial","Use in 1 application","Quality checked by Envato","Future updates","6 months support"], cta: "Buy Now", featured: false },
  { name: "Extended License", price: "$149", tagline: "For SaaS, products you sell to multiple users", features: ["1 end product sold to many users","Use in 1 application","Quality checked by Envato","Future updates","12 months support","Use in paid products"], cta: "Buy Extended", featured: true },
  { name: "Developer Bundle", price: "$299", tagline: "Unlimited projects + lifetime updates", features: ["Unlimited end products","Use in unlimited applications","Priority support","Lifetime free updates","Access to source design files","Private Discord community"], cta: "Get Bundle", featured: false },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Product Designer", quote: "Hands down the cleanest AI template on the market. The design system is gorgeous and the code is impeccable." },
  { name: "Marcus Rivera", role: "Founder, Notable", quote: "Saved us 3 weeks of build time. We launched our AI assistant product in 4 days using Nova as the base." },
  { name: "Aisha Patel", role: "Senior Engineer", quote: "Finally a template where the TypeScript actually makes sense. Beautiful, fast, and a joy to customize." },
  { name: "Tomás Müller", role: "Indie Hacker", quote: "The four themes alone are worth the price. Plus the personas system is brilliantly architected." },
];

const FAQS = [
  { q: "Does this template include a backend?", a: "Nova AI is a frontend template with a built-in simulated AI engine for demo purposes. You can easily wire it up to OpenAI, Anthropic, or any LLM API — the streaming and message handling are already in place." },
  { q: "Is it responsive?", a: "Absolutely. The entire template is mobile-first and tested across all major screen sizes — phones, tablets, laptops, and ultra-wide monitors." },
  { q: "Can I use it in a commercial SaaS?", a: "Yes, with the Extended License. The Regular License covers single-client and personal projects." },
  { q: "What technologies does it use?", a: "React 19, TypeScript, Vite 7, Tailwind CSS v4, and React Router. Zero heavy dependencies — your bundle stays small." },
  { q: "Do I get future updates?", a: "Yes! All licenses include future updates. The Developer Bundle includes lifetime updates and priority support." },
];

export default function LandingPage() {
  const { theme, themeId, setThemeId } = useTheme();

  return (
    <div className={`min-h-screen w-full ${theme.bg} ${theme.text}`}>
      {/* Nav */}
      <nav className={`sticky top-0 z-40 ${theme.bgSoft} backdrop-blur border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <div>
              <div className="font-bold text-lg leading-tight">Nova AI</div>
              <div className={`text-[10px] ${theme.textMuted} leading-tight uppercase tracking-wider`}>Premium Template</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className={`${theme.textMuted} hover:${theme.text} transition`}>Features</a>
            <a href="#demo" className={`${theme.textMuted} hover:${theme.text} transition`}>Demo</a>
            <a href="#pricing" className={`${theme.textMuted} hover:${theme.text} transition`}>Pricing</a>
            <a href="#faq" className={`${theme.textMuted} hover:${theme.text} transition`}>FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg ${theme.surface} border ${theme.border}`}>
              {(Object.keys(THEMES) as ThemeId[]).map((id) => (
                <button key={id} onClick={() => setThemeId(id)}
                  className={`w-8 h-8 rounded-md grid place-items-center text-sm transition ${themeId === id ? `bg-gradient-to-br ${THEMES[id].accent} shadow-md` : `hover:${theme.surfaceAlt}`}`}
                  title={THEMES[id].name}>{THEMES[id].emoji}</button>
              ))}
            </div>
            <Link to="/app/chat" className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white text-sm font-medium shadow-lg hover:opacity-90 transition flex items-center gap-1.5`}>
              Launch App <Icon.ArrowRight width={14} height={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className={`absolute top-20 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br ${theme.accent} blur-3xl opacity-50`} />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.surface} border ${theme.border} text-xs font-medium mb-6`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={theme.textMuted}>New: 6 personas, 4 themes, image studio</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            The AI Chat Template
            <br/>
            <span className={`bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>built for builders.</span>
          </h1>
          <p className={`text-lg sm:text-xl ${theme.textMuted} max-w-2xl mx-auto mb-10`}>
            A production-ready React + TypeScript template for shipping beautiful AI products in days, not months. Streaming chat, multi-persona engine, image studio, dashboard, and four gorgeous themes — all included.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/app/chat" className={`px-6 py-3 rounded-xl bg-gradient-to-r ${theme.accent} text-white font-semibold shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2`}>
              Try Live Demo <Icon.ArrowRight width={16} height={16} />
            </Link>
            <a href="#pricing" className={`px-6 py-3 rounded-xl ${theme.surface} border ${theme.border} ${theme.text} font-semibold hover:${theme.surfaceAlt} transition flex items-center justify-center gap-2`}>
              View Pricing
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2"><Icon.Check className="text-emerald-400" width={16} height={16} /><span className={theme.textMuted}>React 19 + TypeScript</span></div>
            <div className="flex items-center gap-2"><Icon.Check className="text-emerald-400" width={16} height={16} /><span className={theme.textMuted}>Tailwind CSS v4</span></div>
            <div className="flex items-center gap-2"><Icon.Check className="text-emerald-400" width={16} height={16} /><span className={theme.textMuted}>Fully Responsive</span></div>
            <div className="flex items-center gap-2"><Icon.Check className="text-emerald-400" width={16} height={16} /><span className={theme.textMuted}>Free Updates</span></div>
          </div>

          {/* Browser mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className={`rounded-2xl overflow-hidden border ${theme.border} ${theme.surface} shadow-2xl`}>
              <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${theme.border} ${theme.surfaceAlt}`}>
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className={`ml-4 flex-1 text-center text-xs ${theme.textMuted} font-mono`}>nova-ai.app/chat</div>
              </div>
              <div className="grid grid-cols-12 min-h-[420px]">
                <div className={`col-span-3 border-r ${theme.border} p-3 hidden sm:block`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white text-xs font-medium mb-2`}>+ New chat</div>
                  {["React app help","Marketing copy","Travel itinerary","Code review notes"].map((t,i) => (
                    <div key={i} className={`p-2 rounded-lg text-xs ${theme.textMuted} mb-1 truncate ${i === 0 ? theme.surfaceAlt : ""}`}>{t}</div>
                  ))}
                </div>
                <div className="col-span-12 sm:col-span-9 p-6 text-left">
                  <div className="flex gap-3 mb-4">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 text-white text-[10px] grid place-items-center">You</div>
                    <div className={`px-3 py-2 rounded-xl bg-gradient-to-br ${theme.accent} text-white text-sm`}>How do I center a div in CSS?</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 text-white grid place-items-center text-sm">✨</div>
                    <div className={`px-3 py-2 rounded-xl ${theme.surfaceAlt} text-sm max-w-md`}>
                      <p className="mb-2">Easy! The modern answer is flexbox:</p>
                      <pre className="bg-slate-950 text-emerald-300 text-[11px] p-2 rounded-md font-mono">{`.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`}</pre>
                      <span className="inline-block w-1.5 h-3 bg-indigo-400 animate-blink ml-0.5 rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl ${theme.surface} border ${theme.border}`}>
          {[
            { num: "12+", label: "Pages & layouts" },
            { num: "6", label: "AI personas" },
            { num: "4", label: "Premium themes" },
            { num: "100%", label: "Responsive" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>{s.num}</div>
              <div className={`text-xs sm:text-sm ${theme.textMuted} mt-1`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className={`text-xs uppercase tracking-wider ${theme.accentText} font-semibold mb-2`}>Features</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything you need to launch.</h2>
          <p className={`${theme.textMuted} text-lg`}>Carefully designed components, polished interactions, and battle-tested patterns.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`p-6 rounded-2xl ${theme.surface} border ${theme.border} hover:${theme.surfaceAlt} transition group`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.accent} grid place-items-center text-white mb-4 group-hover:scale-110 transition`}>
                <f.Icon width={22} height={22} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo links */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className={`text-xs uppercase tracking-wider ${theme.accentText} font-semibold mb-2`}>Live Demos</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Explore every page.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { to: "/app/chat", title: "Chat", desc: "Multi-persona streaming chat with markdown, code highlighting, history.", emoji: "💬" },
            { to: "/app/images", title: "Image Studio", desc: "Prompt builder, style presets, aspect ratio picker, gallery.", emoji: "🖼️" },
            { to: "/app/dashboard", title: "Dashboard", desc: "Usage analytics, custom charts, recent activity feed.", emoji: "📊" },
            { to: "/app/settings", title: "Settings", desc: "Profile, API keys, model preferences, billing.", emoji: "⚙️" },
            { to: "/app/docs", title: "Documentation", desc: "Beautifully formatted in-app docs page.", emoji: "📚" },
            { to: "/pricing", title: "Pricing Page", desc: "Three-tier plan comparison with featured highlight.", emoji: "💰" },
          ].map((d) => (
            <Link key={d.to} to={d.to} className={`p-6 rounded-2xl ${theme.surface} border ${theme.border} hover:${theme.surfaceAlt} transition group block`}>
              <div className="text-4xl mb-3">{d.emoji}</div>
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">{d.title} <Icon.ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" width={14} height={14} /></h3>
              <p className={`text-sm ${theme.textMuted}`}>{d.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className={`text-xs uppercase tracking-wider ${theme.accentText} font-semibold mb-2`}>Reviews</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Loved by builders.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={`p-6 rounded-2xl ${theme.surface} border ${theme.border}`}>
              <div className="flex gap-0.5 mb-3 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Icon.Star key={i} width={14} height={14} fill="currentColor" />)}
              </div>
              <p className={`${theme.text} mb-4 italic leading-relaxed`}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.accent} grid place-items-center text-white font-semibold text-sm`}>
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className={`text-xs ${theme.textMuted}`}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className={`text-xs uppercase tracking-wider ${theme.accentText} font-semibold mb-2`}>Pricing</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Simple, honest pricing.</h2>
          <p className={`${theme.textMuted} text-lg`}>One-time payment. No subscriptions. Yours forever.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING.map((p) => (
            <div key={p.name} className={`relative p-7 rounded-2xl border ${p.featured ? `${theme.border} bg-gradient-to-br ${theme.accent}/10` : theme.border} ${theme.surface} ${p.featured ? "shadow-2xl scale-[1.02]" : ""}`}>
              {p.featured && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r ${theme.accent} text-white text-xs font-semibold shadow-lg`}>
                  MOST POPULAR
                </div>
              )}
              <div className="text-sm font-medium mb-1">{p.name}</div>
              <div className="text-5xl font-extrabold mb-1">{p.price}</div>
              <div className={`text-sm ${theme.textMuted} mb-6`}>{p.tagline}</div>
              <ul className="space-y-2.5 mb-7">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Icon.Check className="text-emerald-400 flex-shrink-0 mt-0.5" width={16} height={16} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition ${
                p.featured ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg hover:opacity-90` : `${theme.surfaceAlt} hover:${theme.surface} border ${theme.border}`
              }`}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <div className={`text-xs uppercase tracking-wider ${theme.accentText} font-semibold mb-2`}>FAQ</div>
          <h2 className="text-4xl sm:text-5xl font-bold">Questions & answers.</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className={`group p-5 rounded-xl ${theme.surface} border ${theme.border}`}>
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-base list-none">
                {f.q}
                <span className={`${theme.textMuted} group-open:rotate-45 transition text-xl leading-none`}>+</span>
              </summary>
              <p className={`mt-3 ${theme.textMuted} text-sm leading-relaxed`}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className={`rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden bg-gradient-to-br ${theme.accent}`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Ready to ship your AI product?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">Join hundreds of developers building beautiful AI experiences with Nova.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/app/chat" className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-xl hover:bg-slate-100 transition">
                Try Live Demo
              </Link>
              <a href="#pricing" className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-semibold border border-white/30 hover:bg-white/20 transition">
                Buy on Envato
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${theme.border} ${theme.bgSoft}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <div className={`text-sm ${theme.textMuted}`}>© 2026 Nova AI Template. Crafted with care.</div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className={`${theme.textMuted} hover:${theme.text} transition`}><Icon.Github width={18} height={18} /></a>
            <a href="#" className={`${theme.textMuted} hover:${theme.text} transition`}><Icon.Twitter width={18} height={18} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
