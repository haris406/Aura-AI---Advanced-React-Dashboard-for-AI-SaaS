import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme, THEMES, type ThemeId } from "../lib/theme";
import { Icon, Logo } from "./Icons";

const NAV = [
  { to: "/app/chat", label: "Chat", Icon: Icon.Chat },
  { to: "/app/images", label: "Images", Icon: Icon.Image },
  { to: "/app/dashboard", label: "Dashboard", Icon: Icon.Dashboard },
  { to: "/app/settings", label: "Settings", Icon: Icon.Settings },
  { to: "/app/docs", label: "Docs", Icon: Icon.Docs },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { theme, themeId, setThemeId } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  return (
    <div className={`h-screen w-screen flex ${theme.bg} ${theme.text} overflow-hidden`}>
      {/* Side rail */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 h-full w-20 ${theme.bgSoft} backdrop-blur border-r ${theme.border} flex flex-col items-center py-5 transition-transform`}
      >
        <Link to="/" className="mb-6">
          <Logo size={40} />
        </Link>
        <nav className="flex-1 flex flex-col items-center gap-2">
          {NAV.map(({ to, label, Icon: Ic }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative w-12 h-12 rounded-xl grid place-items-center transition ${
                  isActive
                    ? `bg-gradient-to-br ${theme.accent} text-white shadow-lg`
                    : `${theme.textMuted} hover:${theme.surface} hover:${theme.text}`
                }`
              }
              title={label}
            >
              <Ic width={20} height={20} />
              <span className={`absolute left-14 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none ${theme.surfaceAlt} ${theme.text} shadow-lg z-50 hidden md:block`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Theme picker */}
        <div className="relative group">
          <button
            className={`w-12 h-12 rounded-xl grid place-items-center text-xl ${theme.surface} border ${theme.border}`}
            title="Theme"
          >
            {theme.emoji}
          </button>
          <div className={`absolute bottom-0 left-14 ${theme.surface} border ${theme.border} rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition w-48 z-50`}>
            <div className={`text-[10px] uppercase tracking-wider ${theme.textSubtle} px-2 py-1 font-semibold`}>Theme</div>
            {(Object.keys(THEMES) as ThemeId[]).map((id) => (
              <button
                key={id}
                onClick={() => setThemeId(id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition ${
                  themeId === id ? `bg-gradient-to-r ${THEMES[id].accent} text-white` : `hover:${theme.surfaceAlt}`
                }`}
              >
                <span>{THEMES[id].emoji}</span>
                <span>{THEMES[id].name}</span>
                {themeId === id && <Icon.Check width={14} height={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className={`md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-lg ${theme.surface} border ${theme.border} grid place-items-center`}
      >
        {mobileOpen ? <Icon.Close /> : <Icon.Menu />}
      </button>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileOpen(false)} />
      )}

      <div key={loc.pathname} className="flex-1 min-w-0 flex flex-col overflow-hidden animate-fadein">
        {children}
      </div>
    </div>
  );
}
