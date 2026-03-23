# Cloudflare Agents AI Chat

[cloudflarebutton]

A production-ready, full-stack AI chat application built on Cloudflare Workers. Features persistent chat sessions via Durable Objects and Agents SDK, real-time streaming responses, tool calling (web search, weather, MCP integration), multi-model support (Gemini), and a modern React UI with Tailwind CSS and shadcn/ui.

## 🚀 Features

- **Persistent Sessions**: Unlimited chat sessions with titles, timestamps, and activity tracking
- **Real-time Streaming**: Server-sent events for instant responses
- **Tool Calling**: Built-in tools (weather, Google search) + extensible MCP server integration
- **Model Switching**: Google Gemini models (Flash, Pro) via Cloudflare AI Gateway
- **Modern UI**: Responsive design with dark/light themes, sidebar session management
- **Session Management**: Create, list, update, delete sessions via REST API
- **TypeScript Everywhere**: Fully type-safe frontend, backend, and Workers
- **Edge Deployment**: Zero-cold-start Durable Objects, global replication

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Router
- **Backend**: Cloudflare Workers, Hono, Agents SDK, Durable Objects
- **AI**: Cloudflare AI Gateway, OpenAI SDK (Gemini models), SerpAPI, MCP SDK
- **Build Tools**: Vite, Bun, Wrangler
- **State**: Durable Objects for persistence (no external DB needed)

## 📦 Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled
- Cloudflare AI Gateway (for Gemini models)
- Optional: SerpAPI key (web search), MCP server URLs

## 🏗️ Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd <project-name>
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Copy environment variables:
   ```
   cp wrangler.jsonc.example wrangler.jsonc  # If example exists, otherwise edit directly
   ```

## 🔧 Environment Variables

Update `wrangler.jsonc` with your values:

```json
{
  "vars": {
    "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
    "CF_AI_API_KEY": "{your-cloudflare-api-key}",
    "SERPAPI_KEY": "{your-serpapi-key}",
    "OPENROUTER_API_KEY": "{optional-openrouter-key}"
  }
}
```

- `CF_AI_BASE_URL`: Your Cloudflare AI Gateway endpoint
- `CF_AI_API_KEY`: Cloudflare API token (with AI Gateway access)
- `SERPAPI_KEY`: For web search (free tier available)

Generate types:
```
bun run cf-typegen
```

## ▶️ Local Development

1. Start dev server:
   ```
   bun dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

Hot reload works for both UI and Worker. Debug with `wrangler tail`.

## 💬 Usage

### Chat Sessions
- **Create Session**: `POST /api/sessions` with `{title, firstMessage}`
- **List Sessions**: `GET /api/sessions`
- **Delete Session**: `DELETE /api/sessions/{id}`
- **Chat**: `POST /api/chat/{sessionId}/chat` with `{message, model, stream: true}`
- **Get State**: `GET /api/chat/{sessionId}/messages`
- **Clear Chat**: `DELETE /api/chat/{sessionId}/clear`
- **Switch Model**: `POST /api/chat/{sessionId}/model` with `{model}`

### Frontend
- Sidebar: Manage sessions
- Chat: Send messages, stream responses, switch models
- Responsive: Mobile-friendly drawer/sidebar

Example (cURL):
```bash
# Create session
curl -X POST /api/sessions -H "Content-Type: application/json" -d '{"firstMessage": "Hello"}'

# Chat (stream)
curl -X POST /api/chat/{sessionId}/chat -H "Content-Type: application/json" -d '{"message": "What is the weather?"}'
```

## 🔄 Development Workflow

- **Edit UI**: `src/` – React components, hooks
- **Edit Backend**: `worker/` – Add routes in `userRoutes.ts`, tools in `tools.ts`
- **Custom Tools**: Extend `tools.ts` or add MCP servers in `mcp-client.ts`
- **Models**: Update `MODELS` in `src/lib/chat.ts`
- **Lint**: `bun lint`
- **Build**: `bun build`
- **Preview**: `bun preview`

## ☁️ Deployment

1. Login to Cloudflare:
   ```
   bunx wrangler login
   ```

2. Deploy:
   ```
   bun run deploy
   ```

3. Or use the one-click deploy:

[cloudflarebutton]

Your app will be live at `https://{name}.{account}.workers.dev` with custom domain support.

**Post-Deploy**:
- Bind custom domain in Wrangler dashboard
- Monitor with Cloudflare Observability (enabled by default)
- Scale automatically – Durable Objects handle persistence

## 🏗️ Architecture

```
Browser ↔ Worker (Hono)
         ↓
   Routes → ChatAgent DO (per-session)
         ↓
   Tools → SerpAPI/MCP → AI Gateway → Gemini
Sessions → AppController DO (singleton)
```

- **ChatAgent**: Per-session Durable Object (chat state, processing)
- **AppController**: Singleton for session metadata
- **Assets**: SPA served from Worker

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Create feature branch: `git checkout -b feature/xyz`
4. Commit: `git commit -m "feat: description"`
5. Push & PR

Follow TypeScript best practices. No breaking changes without tests.

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Agents SDK](https://developers.cloudflare.com/agents/)
- File issues here for bugs/features

Built with ❤️ for the Cloudflare ecosystem.