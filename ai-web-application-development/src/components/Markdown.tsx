import { useMemo } from "react";

// Lightweight markdown renderer (no external deps) that handles:
// - code blocks with ```lang
// - inline code with `code`
// - **bold**, *italic*
// - headings, lists, blockquotes, horizontal rules
// - paragraphs and line breaks

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  // inline code first
  out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800/70 text-amber-300 text-[0.9em] font-mono">$1</code>');
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  // italic
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em class="italic text-slate-200">$2</em>');
  // links
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-300 underline hover:text-indigo-200">$1</a>');
  return out;
}

function highlightCode(code: string, lang: string): string {
  let h = escapeHtml(code);
  const l = lang.toLowerCase();
  const keywords =
    l === "python"
      ? ["def","return","import","from","if","else","elif","for","while","class","try","except","with","as","in","not","and","or","True","False","None","lambda","print"]
      : ["const","let","var","function","return","if","else","for","while","class","import","export","from","default","async","await","try","catch","throw","new","this","type","interface","extends","implements","public","private","protected","void","null","undefined","true","false"];

  // strings
  h = h.replace(/(&quot;.*?&quot;|&#039;.*?&#039;|`.*?`)/g, '<span class="text-emerald-300">$1</span>');
  // comments
  h = h.replace(/(\/\/.*$)/gm, '<span class="text-slate-500 italic">$1</span>');
  h = h.replace(/(#.*$)/gm, l === "python" ? '<span class="text-slate-500 italic">$1</span>' : '$1');
  // numbers
  h = h.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-orange-300">$1</span>');
  // keywords
  const kwRe = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  h = h.replace(kwRe, '<span class="text-pink-400 font-medium">$1</span>');
  // function calls
  h = h.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="text-sky-300">$1</span>(');
  return h;
}

type Block =
  | { type: "code"; lang: string; content: string }
  | { type: "heading"; level: number; content: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; content: string }
  | { type: "hr" }
  | { type: "p"; content: string };

function parse(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // code fence
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", lang, content: buf.join("\n") });
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      blocks.push({ type: "heading", level: h[1].length, content: h[2] });
      i++;
      continue;
    }

    // hr
    if (/^---+\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", content: buf.join("\n") });
      continue;
    }

    // unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // paragraph
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^```/.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", content: buf.join("\n") });
  }

  return blocks;
}

function renderBlock(b: Block, idx: number) {
  switch (b.type) {
    case "code":
      return (
        <div key={idx} className="my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/70">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/70">
            <span className="text-xs font-mono text-slate-400 uppercase">{b.lang || "code"}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(b.content)}
              className="text-xs text-slate-400 hover:text-white transition px-2 py-0.5 rounded"
            >
              Copy
            </button>
          </div>
          <pre className="p-3.5 overflow-x-auto text-sm leading-relaxed">
            <code
              className="font-mono text-slate-200"
              dangerouslySetInnerHTML={{ __html: highlightCode(b.content, b.lang) }}
            />
          </pre>
        </div>
      );
    case "heading": {
      const sizes = ["text-2xl","text-xl","text-lg","text-base","text-sm","text-xs"];
      const cls = `font-bold text-white my-2 ${sizes[b.level - 1]}`;
      return <div key={idx} className={cls} dangerouslySetInnerHTML={{ __html: renderInline(b.content) }} />;
    }
    case "hr":
      return <hr key={idx} className="my-3 border-slate-700/60" />;
    case "quote":
      return (
        <blockquote
          key={idx}
          className="my-2 border-l-4 border-indigo-500/60 pl-3 italic text-slate-300"
          dangerouslySetInnerHTML={{ __html: renderInline(b.content) }}
        />
      );
    case "ul":
      return (
        <ul key={idx} className="my-2 ml-5 list-disc space-y-1 text-slate-200 marker:text-indigo-400">
          {b.items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={idx} className="my-2 ml-5 list-decimal space-y-1 text-slate-200 marker:text-indigo-400 marker:font-semibold">
          {b.items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
          ))}
        </ol>
      );
    case "p":
      return (
        <p
          key={idx}
          className="my-2 leading-relaxed text-slate-200"
          dangerouslySetInnerHTML={{ __html: renderInline(b.content).replace(/\n/g, "<br/>") }}
        />
      );
  }
}

export function Markdown({ text }: { text: string }) {
  const blocks = useMemo(() => parse(text), [text]);
  return <div className="markdown text-[15px]">{blocks.map(renderBlock)}</div>;
}
