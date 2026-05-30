import { useEffect, useMemo, useRef, useState } from "react";
import { PERSONAS, generateResponse, type Persona } from "../lib/aiEngine";
import { Markdown } from "../components/Markdown";
import { Icon } from "../components/Icons";
import { useTheme } from "../lib/theme";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  persona?: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  personaId: string;
  createdAt: number;
};

const STORAGE_KEY = "nova-ai-conversations-v1";

const SUGGESTIONS = [
  { icon: "💡", title: "Brainstorm ideas", prompt: "Give me 5 creative ideas for a weekend side project" },
  { icon: "💻", title: "Write React code", prompt: "Write a React button component in TypeScript" },
  { icon: "📝", title: "Draft an email", prompt: "Write a polite follow-up email to a client" },
  { icon: "🎓", title: "Explain a concept", prompt: "Explain how neural networks learn in simple terms" },
];

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveConversations(c: Conversation[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}
const titleFromMessage = (t: string) => {
  const s = t.trim().slice(0, 48);
  return s.length < t.trim().length ? s + "…" : s || "New chat";
};

export default function ChatPage() {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [activeId, setActiveId] = useState<string | null>(() => loadConversations()[0]?.id ?? null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("general");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) ?? null, [conversations, activeId]);
  const currentPersona: Persona = PERSONAS.find((p) => p.id === (active?.personaId ?? selectedPersonaId)) ?? PERSONAS[0];

  useEffect(() => { saveConversations(conversations); }, [conversations]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active?.messages.length, streamingId, active?.messages[active.messages.length - 1]?.content]);
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  function startNewChat(personaId?: string) {
    const pid = personaId ?? selectedPersonaId;
    const convo: Conversation = { id: uid(), title: "New chat", messages: [], personaId: pid, createdAt: Date.now() };
    setConversations((p) => [convo, ...p]);
    setActiveId(convo.id);
    setSelectedPersonaId(pid);
    setInput("");
  }
  function deleteConversation(id: string) {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }
  function clearAll() {
    if (!confirm("Delete all conversations? This can't be undone.")) return;
    setConversations([]); setActiveId(null);
  }

  function exportConversation() {
    if (!active) return;
    const md = `# ${active.title}\n\n` + active.messages.map(m =>
      `**${m.role === "user" ? "You" : (PERSONAS.find(p => p.id === m.persona)?.name || "AI")}:**\n\n${m.content}\n`
    ).join("\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${active.title.replace(/[^\w]+/g, "-")}.md`;
    a.click(); URL.revokeObjectURL(url);
  }

  async function streamAssistantReply(convoId: string, fullText: string) {
    const assistantId = uid();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", timestamp: Date.now(), persona: currentPersona.id };
    setConversations((p) => p.map((c) => c.id === convoId ? { ...c, messages: [...c.messages, assistantMsg] } : c));
    setStreamingId(assistantId);
    let i = 0;
    while (i < fullText.length) {
      const len = Math.max(2, Math.floor(Math.random() * 6) + 2);
      const chunk = fullText.slice(i, i + len);
      i += len;
      await new Promise((r) => setTimeout(r, 12 + Math.random() * 25));
      setConversations((p) => p.map((c) => c.id === convoId ? {
        ...c, messages: c.messages.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m),
      } : c));
    }
    setStreamingId(null);
  }

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isThinking) return;
    let convoId = activeId;
    let convo = active;
    if (!convo) {
      const newConvo: Conversation = { id: uid(), title: titleFromMessage(content), messages: [], personaId: selectedPersonaId, createdAt: Date.now() };
      convoId = newConvo.id; convo = newConvo;
      setConversations((p) => [newConvo, ...p]);
      setActiveId(newConvo.id);
    }
    const userMsg: Message = { id: uid(), role: "user", content, timestamp: Date.now() };
    setConversations((p) => p.map((c) => c.id === convoId ? {
      ...c, title: c.messages.length === 0 ? titleFromMessage(content) : c.title, messages: [...c.messages, userMsg],
    } : c));
    setInput(""); setIsThinking(true);
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    const history = (convo.messages ?? []).map((m) => ({ role: m.role, content: m.content }));
    history.push({ role: "user", content });
    const reply = generateResponse(content, currentPersona, history);
    await streamAssistantReply(convoId!, reply);
    setIsThinking(false);
  }

  async function regenerate() {
    if (!active || active.messages.length === 0 || isThinking) return;
    // find last user message
    let lastUserIdx = -1;
    for (let i = active.messages.length - 1; i >= 0; i--) {
      if (active.messages[i].role === "user") { lastUserIdx = i; break; }
    }
    if (lastUserIdx === -1) return;
    const userMsg = active.messages[lastUserIdx];
    // remove everything after that user message
    setConversations((p) => p.map((c) => c.id === active.id ? {
      ...c, messages: c.messages.slice(0, lastUserIdx + 1),
    } : c));
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    const history = active.messages.slice(0, lastUserIdx + 1).map((m) => ({ role: m.role, content: m.content }));
    const reply = generateResponse(userMsg.content, currentPersona, history);
    await streamAssistantReply(active.id, reply);
    setIsThinking(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }
  function changePersona(pid: string) {
    setSelectedPersonaId(pid);
    if (active && active.messages.length === 0) {
      setConversations((p) => p.map((c) => c.id === active.id ? { ...c, personaId: pid } : c));
    } else if (active) {
      startNewChat(pid);
    }
  }

  const showEmpty = !active || active.messages.length === 0;

  return (
    <div className="flex flex-1 min-h-0">
      {/* Conversation list */}
      <aside className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-300 flex-shrink-0 overflow-hidden border-r ${theme.border} ${theme.bgSoft} backdrop-blur hidden md:block`}>
        <div className="w-72 h-full flex flex-col">
          <div className={`p-4 border-b ${theme.border}`}>
            <button
              onClick={() => startNewChat()}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-medium text-sm shadow-lg transition hover:opacity-90`}
            >
              <Icon.Plus width={16} height={16} /> New chat
            </button>
          </div>
          <div className={`px-4 pt-4 pb-2 text-[11px] uppercase tracking-wider ${theme.textSubtle} font-semibold`}>History</div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {conversations.length === 0 ? (
              <div className={`px-3 py-6 text-center text-sm ${theme.textSubtle}`}>No conversations yet.</div>
            ) : conversations.map((c) => {
              const persona = PERSONAS.find((p) => p.id === c.personaId) ?? PERSONAS[0];
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`group w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 transition ${
                    c.id === activeId ? `${theme.surfaceAlt} ${theme.text}` : `hover:${theme.surfaceAlt} ${theme.textMuted}`
                  }`}
                >
                  <span className="text-base flex-shrink-0">{persona.emoji}</span>
                  <span className="flex-1 truncate text-sm">{c.title}</span>
                  <span
                    onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
                    className={`opacity-0 group-hover:opacity-100 ${theme.textSubtle} hover:text-rose-400 transition text-xs px-1`}
                  >✕</span>
                </button>
              );
            })}
          </div>
          {conversations.length > 0 && (
            <div className={`p-3 border-t ${theme.border}`}>
              <button onClick={clearAll} className={`w-full text-xs ${theme.textSubtle} hover:text-rose-400 transition py-1`}>
                Clear all conversations
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b ${theme.border} ${theme.bgSoft} backdrop-blur`}>
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className={`hidden md:grid p-2 rounded-lg hover:${theme.surfaceAlt} transition ${theme.textMuted} hover:${theme.text} place-items-center`}
              title="Toggle history"
            ><Icon.Menu /></button>
            <div className="flex items-center gap-2 min-w-0 pl-12 md:pl-0">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentPersona.color} grid place-items-center text-sm shadow-md`}>
                {currentPersona.emoji}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm leading-tight truncate">{currentPersona.name}</div>
                <div className={`text-[11px] ${theme.textMuted} leading-tight truncate`}>{currentPersona.systemTone}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {active && active.messages.length > 0 && (
              <button onClick={exportConversation} title="Export as Markdown"
                className={`p-2 rounded-lg hover:${theme.surfaceAlt} ${theme.textMuted} hover:${theme.text} transition hidden sm:grid place-items-center`}>
                <Icon.Download width={16} height={16} />
              </button>
            )}
            <div className={`flex items-center gap-1 p-1 rounded-xl ${theme.surface} border ${theme.border} overflow-x-auto max-w-[60vw]`}>
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => changePersona(p.id)}
                  title={`${p.name} — ${p.systemTone}`}
                  className={`px-2.5 py-1.5 rounded-lg text-sm transition flex items-center gap-1.5 flex-shrink-0 ${
                    currentPersona.id === p.id ? `bg-gradient-to-r ${p.color} text-white shadow-md` : `${theme.textMuted} hover:${theme.text} hover:${theme.surfaceAlt}`
                  }`}
                >
                  <span>{p.emoji}</span>
                  <span className="hidden lg:inline text-xs font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {showEmpty ? (
            <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentPersona.color} grid place-items-center text-4xl shadow-2xl mb-6 animate-pulse-slow`}>
                {currentPersona.emoji}
              </div>
              <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-current via-current to-current bg-clip-text`}>
                How can I help you today?
              </h1>
              <p className={`${theme.textMuted} text-center max-w-md mb-10`}>
                I'm <span className={`${theme.text} font-medium`}>{currentPersona.name}</span> — your {currentPersona.systemTone} AI.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => sendMessage(s.prompt)}
                    className={`text-left p-4 rounded-xl ${theme.surface} hover:${theme.surfaceAlt} border ${theme.border} transition group`}
                  >
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className={`font-medium text-sm ${theme.text} mb-1`}>{s.title}</div>
                    <div className={`text-xs ${theme.textMuted} line-clamp-2`}>{s.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              {active!.messages.map((m, idx) => {
                const p = PERSONAS.find((x) => x.id === m.persona) ?? currentPersona;
                const isUser = m.role === "user";
                const isLastAssistant = !isUser && idx === active!.messages.length - 1 && streamingId !== m.id;
                return (
                  <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-fadein`}>
                    <div className="flex-shrink-0">
                      {isUser ? (
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 grid place-items-center text-xs font-semibold text-white shadow-md`}>You</div>
                      ) : (
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} grid place-items-center text-sm shadow-md`}>{p.emoji}</div>
                      )}
                    </div>
                    <div className={`flex-1 min-w-0 ${isUser ? "flex justify-end" : ""}`}>
                      <div className={`inline-block max-w-full rounded-2xl px-4 py-3 ${
                        isUser ? `bg-gradient-to-br ${theme.accent} text-white shadow-lg` : `${theme.surface} border ${theme.border}`
                      }`}>
                        {isUser ? (
                          <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content}</div>
                        ) : (
                          <>
                            <Markdown text={m.content} />
                            {streamingId === m.id && (
                              <span className="inline-block w-2 h-4 bg-indigo-400 align-middle ml-0.5 animate-blink rounded-sm" />
                            )}
                          </>
                        )}
                      </div>
                      {isLastAssistant && (
                        <div className="mt-1.5 flex gap-1">
                          <button onClick={() => navigator.clipboard?.writeText(m.content)}
                            className={`p-1.5 rounded-md ${theme.textSubtle} hover:${theme.text} hover:${theme.surfaceAlt} transition`}
                            title="Copy"><Icon.Copy width={14} height={14} /></button>
                          <button onClick={regenerate}
                            className={`p-1.5 rounded-md ${theme.textSubtle} hover:${theme.text} hover:${theme.surfaceAlt} transition`}
                            title="Regenerate"><Icon.Refresh width={14} height={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isThinking && !streamingId && (
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentPersona.color} grid place-items-center text-sm shadow-md flex-shrink-0`}>{currentPersona.emoji}</div>
                  <div className={`${theme.surface} border ${theme.border} rounded-2xl px-4 py-3 flex items-center gap-1.5`}>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`border-t ${theme.border} ${theme.bgSoft} backdrop-blur px-4 sm:px-6 py-4`}>
          <div className="max-w-3xl mx-auto">
            <div className={`relative rounded-2xl ${theme.surface} border ${theme.border} focus-within:ring-2 focus-within:${theme.ring} transition shadow-lg`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message ${currentPersona.name}…`}
                rows={1}
                disabled={isThinking}
                className={`w-full bg-transparent resize-none px-4 py-3.5 pr-28 outline-none text-[15px] placeholder:${theme.textSubtle} max-h-[200px]`}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button title="Attach (demo)" className={`w-9 h-9 rounded-lg ${theme.textMuted} hover:${theme.text} hover:${theme.surfaceAlt} grid place-items-center transition`}>
                  <Icon.Paperclip width={16} height={16} />
                </button>
                <button title="Voice (demo)" className={`w-9 h-9 rounded-lg ${theme.textMuted} hover:${theme.text} hover:${theme.surfaceAlt} grid place-items-center transition`}>
                  <Icon.Mic width={16} height={16} />
                </button>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isThinking}
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${theme.accent} hover:opacity-90 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed grid place-items-center text-white shadow-md transition`}
                >
                  {isThinking ? <Icon.Spinner className="animate-spin" width={16} height={16}/> : <Icon.Send width={16} height={16} />}
                </button>
              </div>
            </div>
            <div className={`mt-2 text-center text-[11px] ${theme.textSubtle}`}>
              Press <kbd className={`px-1.5 py-0.5 rounded ${theme.surfaceAlt} ${theme.textMuted} font-mono text-[10px]`}>Enter</kbd> to send, <kbd className={`px-1.5 py-0.5 rounded ${theme.surfaceAlt} ${theme.textMuted} font-mono text-[10px]`}>Shift+Enter</kbd> for new line.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
