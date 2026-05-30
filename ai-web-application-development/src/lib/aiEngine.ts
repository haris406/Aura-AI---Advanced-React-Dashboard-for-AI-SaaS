// Nova AI simulated engine - generates contextual responses based on user input

export type Persona = {
  id: string;
  name: string;
  emoji: string;
  systemTone: string;
  color: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "general",
    name: "Nova",
    emoji: "✨",
    systemTone: "balanced, helpful, friendly",
    color: "from-violet-500 to-indigo-500",
  },
  {
    id: "coder",
    name: "Codex",
    emoji: "💻",
    systemTone: "technical, precise, code-focused",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "creative",
    name: "Muse",
    emoji: "🎨",
    systemTone: "imaginative, poetic, expressive",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "tutor",
    name: "Sage",
    emoji: "📚",
    systemTone: "educational, patient, explanatory",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "business",
    name: "Atlas",
    emoji: "📊",
    systemTone: "strategic, analytical, business-savvy",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "wellness",
    name: "Lumi",
    emoji: "🌿",
    systemTone: "calm, supportive, mindful",
    color: "from-green-400 to-emerald-500",
  },
];

type ResponderCtx = {
  input: string;
  lower: string;
  persona: Persona;
  history: { role: "user" | "assistant"; content: string }[];
};

type Rule = {
  match: (ctx: ResponderCtx) => boolean;
  respond: (ctx: ResponderCtx) => string;
};

const greetings = [
  "Hey there! 👋 What can I help you with today?",
  "Hello! I'm here and ready to dive in. What's on your mind?",
  "Hi! Great to see you. Where shall we begin?",
  "Hey! I'm all ears — what would you like to explore?",
];

const farewells = [
  "Catch you later! Come back anytime. 👋",
  "Goodbye! It was a pleasure chatting with you.",
  "See you soon! Take care of yourself.",
];

const thanksReplies = [
  "You're very welcome! Happy to help anytime. 😊",
  "My pleasure! Let me know if there's anything else.",
  "Glad I could help! What's next on your list?",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const rules: Rule[] = [
  // Greetings
  {
    match: ({ lower }) =>
      /^(hi|hello|hey|yo|sup|hola|greetings|good (morning|afternoon|evening))\b/.test(
        lower.trim()
      ),
    respond: ({ persona }) =>
      `${persona.emoji} ${pick(greetings)}`,
  },
  // Farewells
  {
    match: ({ lower }) =>
      /^(bye|goodbye|see you|cya|farewell|good night)\b/.test(lower.trim()),
    respond: () => pick(farewells),
  },
  // Thanks
  {
    match: ({ lower }) => /\b(thanks|thank you|thx|ty|appreciate it)\b/.test(lower),
    respond: () => pick(thanksReplies),
  },
  // Who/what are you
  {
    match: ({ lower }) =>
      /(who are you|what are you|your name|tell me about yourself|what can you do)/.test(
        lower
      ),
    respond: ({ persona }) =>
      `I'm **${persona.name}** ${persona.emoji} — a Nova AI persona tuned for ${persona.systemTone} responses. I can help you brainstorm ideas, write and explain code, draft text, answer questions, work through problems step by step, and more. What would you like to try?`,
  },
  // Code requests
  {
    match: ({ lower }) =>
      /\b(code|function|javascript|typescript|python|react|html|css|api|algorithm|debug|error|bug)\b/.test(
        lower
      ),
    respond: ({ input, lower }) => codeResponse(input, lower),
  },
  // Math
  {
    match: ({ lower }) => /[\d]+\s*[\+\-\*\/x×÷]\s*[\d]+/.test(lower) || /\b(calculate|compute|what is|solve)\b.*\d/.test(lower),
    respond: ({ input }) => mathResponse(input),
  },
  // Explain X
  {
    match: ({ lower }) => /^(explain|what is|what's|define|describe|how does|how do)/.test(lower.trim()),
    respond: ({ input, persona }) => explainResponse(input, persona),
  },
  // Lists / ideas
  {
    match: ({ lower }) =>
      /\b(list|ideas|suggest|recommend|brainstorm|give me \d+)\b/.test(lower),
    respond: ({ input, persona }) => listResponse(input, persona),
  },
  // Writing
  {
    match: ({ lower }) =>
      /\b(write|draft|compose|create|generate)\b.*(poem|story|email|essay|letter|tweet|caption|tagline|haiku)/.test(
        lower
      ),
    respond: ({ input, persona }) => creativeResponse(input, persona),
  },
  // Opinion / preference
  {
    match: ({ lower }) =>
      /\b(do you think|your opinion|do you like|favorite|prefer)\b/.test(lower),
    respond: ({ persona }) =>
      `As an AI, I don't have personal preferences, but I can share perspective. From a ${persona.systemTone} lens, the most interesting answer usually depends on the goal you're optimizing for — what matters most to you here?`,
  },
  // Feelings
  {
    match: ({ lower }) => /\b(how are you|how do you feel|are you ok)\b/.test(lower),
    respond: ({ persona }) =>
      `I'm running smoothly, thanks for asking! ${persona.emoji} I'm a language model so I don't really "feel," but I'm fully focused on helping you. What can we work on?`,
  },
];

function codeResponse(input: string, lower: string): string {
  if (lower.includes("react") && (lower.includes("button") || lower.includes("component"))) {
    return `Here's a clean React button component in TypeScript:

\`\`\`tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export function Button({ label, variant = "primary", onClick }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <button
      onClick={onClick}
      className={\`px-4 py-2 rounded-lg font-medium transition \${styles}\`}
    >
      {label}
    </button>
  );
}
\`\`\`

This component is **type-safe**, supports two variants, and uses Tailwind for styling. Want me to add a loading state or icons?`;
  }

  if (lower.includes("fetch") || lower.includes("api")) {
    return `Here's a robust async fetch pattern:

\`\`\`ts
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  }
  return res.json() as Promise<T>;
}

// Usage
try {
  const user = await fetchData<{ name: string }>("/api/user");
  console.log(user.name);
} catch (err) {
  console.error("Failed:", err);
}
\`\`\`

Key things: generic return type, status checking, and proper try/catch. Want me to add retry logic or AbortController support?`;
  }

  if (lower.includes("python")) {
    return `Here's an example Python snippet:

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Return the first n Fibonacci numbers."""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

print(fibonacci(10))
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

Clean and idiomatic. Want a recursive version or a generator-based one for large n?`;
  }

  if (lower.includes("debug") || lower.includes("error") || lower.includes("bug")) {
    return `Debugging is a structured process. Here's my go-to approach:

1. **Reproduce reliably** — find the minimum steps that trigger the bug.
2. **Read the error message carefully** — stack traces usually point to the offender.
3. **Bisect** — comment out half the code, narrow down where it breaks.
4. **Log liberally** — \`console.log\` the values right before the failure.
5. **Question assumptions** — what do you *think* is true vs. what *is* true?
6. **Rubber-duck it** — explain the code out loud, line by line.

If you paste the error message and the relevant code, I can take a closer look. 🔍`;
  }

  return `Great question about code! For "${input.trim()}", here's a starting approach:

\`\`\`ts
// Pseudocode outline
function solve(input) {
  // 1. Parse / validate input
  // 2. Apply core logic
  // 3. Return result
}
\`\`\`

If you share more specifics — the language, expected input/output, and any constraints — I can write a complete implementation tailored to your case.`;
}

function mathResponse(input: string): string {
  const match = input.match(/(-?\d+(?:\.\d+)?)\s*([\+\-\*\/x×÷])\s*(-?\d+(?:\.\d+)?)/);
  if (match) {
    const a = parseFloat(match[1]);
    const op = match[2].replace("x", "*").replace("×", "*").replace("÷", "/");
    const b = parseFloat(match[3]);
    let result: number;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": result = b === 0 ? NaN : a / b; break;
      default: result = NaN;
    }
    if (Number.isNaN(result)) {
      return `Hmm, I can't compute that — looks like a division by zero or an unsupported operation.`;
    }
    return `**${a} ${match[2]} ${b} = ${result}**\n\nWant me to break down the steps or try a more complex expression?`;
  }
  return `I can handle basic arithmetic directly. Try something like \`23 * 47\` or \`(100 - 8) / 4\`. For bigger problems, describe the equation and I'll walk through it.`;
}

function explainResponse(input: string, persona: Persona): string {
  const topic = input
    .replace(/^(explain|what is|what's|define|describe|how does|how do)\s*/i, "")
    .replace(/\?$/, "")
    .trim() || "this topic";

  return `Great question — let's unpack **${topic}**.

**Quick definition:** At its core, ${topic} refers to a concept or process worth understanding in context. The exact meaning shifts a bit depending on the field you're asking from.

**Why it matters:**
- It shows up frequently in real-world scenarios
- Understanding it helps you reason about related ideas
- It connects to broader systems and patterns

**A simple analogy:** Think of ${topic} as a recipe — the ingredients (inputs) combine through a process (logic) to produce something useful (output). The skill is knowing when and how to apply it.

${persona.emoji} Want me to go deeper on a specific angle — history, technical details, examples, or pitfalls?`;
}

function listResponse(input: string, persona: Persona): string {
  const numMatch = input.match(/\b(\d+)\b/);
  const n = numMatch ? Math.min(parseInt(numMatch[1]), 10) : 5;
  const topic = input.replace(/(list|ideas|suggest|recommend|brainstorm|give me|\d+|of|for|on|about)/gi, "").trim() || "your topic";

  const items = [
    `**Start small** — pick one focused aspect of ${topic} and explore it deeply`,
    `**Look at edge cases** — the unusual examples often teach the most`,
    `**Find an analogy** — connect it to something you already understand well`,
    `**Build something** — apply the idea in a tiny project or sketch`,
    `**Teach it back** — explaining out loud reveals gaps in understanding`,
    `**Compare alternatives** — knowing what something *isn't* sharpens what it *is*`,
    `**Find a mentor or community** — others have already walked this road`,
    `**Document your journey** — notes today become insights tomorrow`,
    `**Question first principles** — why does it work the way it does?`,
    `**Iterate publicly** — feedback accelerates everything`,
  ];

  const selected = items.slice(0, n).map((it, i) => `${i + 1}. ${it}`).join("\n");
  return `Here are **${n} ideas** for ${topic.trim() || "you"}:\n\n${selected}\n\n${persona.emoji} Want me to expand any of these into a concrete plan?`;
}

function creativeResponse(input: string, persona: Persona): string {
  const lower = input.toLowerCase();
  if (lower.includes("haiku")) {
    return `A haiku for you:\n\n*Quiet morning hum,*\n*pixels dance to thought made real —*\n*ideas come alive.*\n\n${persona.emoji} Want one with a different mood?`;
  }
  if (lower.includes("poem")) {
    return `Here's a short poem:\n\n*Beyond the screen, a quiet glow,*\n*where words become the seeds we sow.*\n*We ask, we wonder, we explore —*\n*and always find there's something more.*\n\n${persona.emoji} I can try different styles — sonnet, free verse, limerick — just say the word.`;
  }
  if (lower.includes("email")) {
    return `Here's a draft email:\n\n---\n\n**Subject:** Following up\n\nHi [Name],\n\nHope you're doing well! I wanted to follow up on our recent conversation and see if you've had a chance to review the materials I sent over.\n\nHappy to set up a quick call this week if it would help — let me know what works for you.\n\nThanks,\n[Your name]\n\n---\n\nWant me to adjust the tone (more formal, more casual) or add specifics?`;
  }
  if (lower.includes("story")) {
    return `Here's a short story opener:\n\n> The lighthouse hadn't worked in forty years, but on the night the storm came, its lamp blinked once — slow and certain — as if remembering something important. Mira stood at the cliff's edge, salt in her hair, and whispered, *"You waited for me."*\n\n${persona.emoji} I can continue this, change genre, or start something completely different. What direction interests you?`;
  }
  return `Happy to write something for you! Could you share a few more details — the topic, the tone (playful, serious, professional), and roughly how long? With those, I can craft something that fits perfectly.`;
}

function defaultResponse(input: string, persona: Persona): string {
  const trimmed = input.trim();
  const responses = [
    `That's an interesting one — "${trimmed}". Let me think out loud for a moment.\n\nThere are a few angles worth considering: the **context** (what brought this up), the **goal** (what success looks like), and the **constraints** (what's fixed vs. flexible). With those clearer, we can shape a much sharper answer.\n\n${persona.emoji} Could you tell me a bit more about what you're hoping to do with this?`,
    `Good question. Here's how I'd approach "${trimmed}":\n\n1. Break it into smaller pieces you can reason about individually\n2. Identify the one piece that matters most right now\n3. Make a quick decision there, then iterate\n\nMost things look complicated until you split them into parts. Want to dig into any specific piece together?`,
    `Let me reflect on "${trimmed}" for a moment.\n\nThe most useful response depends on what you're looking for — a definition, a step-by-step plan, examples, or a quick recommendation. If you let me know which one fits best, I can deliver something genuinely useful rather than generic. ${persona.emoji}`,
  ];
  return pick(responses);
}

export function generateResponse(
  input: string,
  persona: Persona,
  history: { role: "user" | "assistant"; content: string }[]
): string {
  const ctx: ResponderCtx = {
    input,
    lower: input.toLowerCase(),
    persona,
    history,
  };

  for (const rule of rules) {
    if (rule.match(ctx)) {
      return rule.respond(ctx);
    }
  }
  return defaultResponse(input, persona);
}
