# Clarity

**Clarity** is an AI-powered project intelligence platform for engineering teams. It grounds a chatbot in a team's project documents, codebase, and production logs — so instead of manually searching Slack, Git, and error dashboards, engineers can ask one assistant and get answers backed by real sources.

## What it does

- **Grounded Q&A** — Ask questions about a project and get answers cited from actual requirement docs and code, not guesses.
- **Git-aware debugging** — Paste an error, and Clarity cross-references your codebase and docs to explain the root cause and suggest a fix.
- **Production monitoring** — Clarity watches logs and deploys, flags failures automatically, and notifies the right people via email and in-app alerts.
- **Access-controlled by design** — Every user only sees and queries projects they're authorized for (active membership, historical/alumni access, or company-public). Retrieval is filtered _before_ it reaches the AI, not just hidden in the UI.
- **Team messaging, routed through AI** — Teammates can ask questions through Clarity instead of Slack/Outlook; Clarity answers directly when it can, and routes to a human when it can't.

## Tech stack

**Frontend**

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Currently running on mock data — backend integration in progress

**Planned backend**

- FastAPI (Python)
- PostgreSQL + pgvector for permission-scoped retrieval
- LLM-based reasoning with citation verification
- GitHub webhook integration for live code sync

## Pages

| Route                   | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `/login`                | Auth entry point                                                     |
| `/home`                 | Dashboard — stats, recent activity, project overview                 |
| `/projects`             | Access-scoped project list with filters                              |
| `/projects/[projectId]` | Project detail — Docs / Code / Logs tabs                             |
| `/chat`                 | Team inbox with Clarity auto-answering on your behalf                |
| `/alerts`               | Production issue feed with AI-generated root cause + fix suggestions |
| `/settings`             | Profile, notification preferences, connected integrations            |

## Status

🚧 Frontend prototype complete (UI + mock data). Backend, auth, and LLM integration in progress.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Why this project

Most AI chatbot demos are a thin wrapper around an LLM API. Clarity's core engineering challenge is different: **permission-aware retrieval** (no data reaches the AI unless the requesting user is authorized to see it), **grounded answers with source verification** (no hallucinated citations), and an **event-driven monitoring pipeline** that runs the same reasoning engine autonomously when production breaks — not just reactively in chat.
