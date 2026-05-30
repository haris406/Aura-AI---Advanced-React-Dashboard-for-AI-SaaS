import { useTheme } from "../lib/theme";
import { Markdown } from "../components/Markdown";

const DOC = `# Getting Started

Welcome to **Nova AI** — a premium React + TypeScript template for building modern AI applications. This guide will get you up and running in under 5 minutes.

## Installation

\`\`\`bash
# Clone or unzip the template
cd nova-ai

# Install dependencies
npm install

# Start the dev server
npm run dev
\`\`\`

Open \`http://localhost:5173\` in your browser. That's it!

## Project Structure

\`\`\`
nova-ai/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages (chat, images, etc.)
│   ├── lib/            # Theme system, AI engine
│   └── App.tsx         # Router setup
├── public/             # Static assets
└── index.html
\`\`\`

## Connecting a Real AI

By default, Nova ships with a built-in simulated AI engine in \`src/lib/aiEngine.ts\`. To connect a real LLM like OpenAI:

\`\`\`ts
async function callOpenAI(messages: Message[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${import.meta.env.VITE_OPENAI_KEY}\`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      stream: true,
    }),
  });
  return res.body!.getReader();
}
\`\`\`

Then update the \`streamAssistantReply\` function in \`ChatPage.tsx\` to consume the stream.

## Customizing Themes

All four themes are defined in \`src/lib/theme.tsx\`. To add a new theme:

1. Add a new entry to the \`THEMES\` object
2. Provide your Tailwind class strings for surfaces, text, accents
3. The new theme appears automatically in the picker

\`\`\`ts
sapphire: {
  id: "sapphire",
  name: "Sapphire",
  emoji: "💎",
  bg: "bg-gradient-to-br from-blue-950 to-indigo-950",
  // ...
}
\`\`\`

## Adding a New Persona

Personas live in \`src/lib/aiEngine.ts\`. Each persona has its own personality, color gradient, and tone:

\`\`\`ts
{
  id: "chef",
  name: "Gusto",
  emoji: "👨‍🍳",
  systemTone: "culinary, warm, flavorful",
  color: "from-red-500 to-yellow-500",
}
\`\`\`

## Tech Stack

- **React 19** — Latest features including concurrent rendering
- **TypeScript 5** — Full type safety end to end
- **Vite 7** — Lightning-fast dev server and builds
- **Tailwind CSS 4** — Utility-first styling with the new v4 engine
- **React Router 7** — Client-side routing

## Support

> Need help? Reach out at **support@nova-ai.app** or join our community Discord. Premium license holders get priority support.

Happy building! ✨
`;

export default function DocsPage() {
  const { theme } = useTheme();
  return (
    <div className="flex-1 overflow-y-auto">
      <header className={`px-6 py-4 border-b ${theme.border} ${theme.bgSoft} backdrop-blur`}>
        <div className="pl-12 md:pl-0">
          <h1 className="font-semibold">Documentation</h1>
          <p className={`text-xs ${theme.textMuted}`}>Everything you need to ship</p>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className={`p-8 rounded-2xl ${theme.surface} border ${theme.border}`}>
          <Markdown text={DOC} />
        </div>
      </div>
    </div>
  );
}
