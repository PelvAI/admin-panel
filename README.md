# 🛠️ ALMA Admin Panel

> **The central management interface for the ALMA (formerly Vela) platform.**

The Admin Panel is a [Next.js](https://nextjs.org/) application for clinical staff and administrators to manage questionnaires, scoring rules, user segments (targets), **RAG knowledge**, and conversation monitoring.

**Rule:** the browser never calls the chatbot (`:8000`). All API traffic goes to the Alma backend (`NEXT_PUBLIC_API_URL`, typically `:8001/api/v1`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescript.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Data Fetching**: Native Fetch (`lib/api.ts`)

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env.local`.
   - Set `NEXT_PUBLIC_API_URL` to the Alma Backend API (e.g. `http://localhost:8001/api/v1`).

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Login (MVP):**
   - Open `/login`.
   - Use `admin@vela.com` (maps to backend UID `test_uid_123`).
   - Password is required in the form but not validated by the backend yet.

---

## 🔐 Auth

- Token stored in `localStorage` (`alma_admin_token`) after `/auth/login`.
- `AuthGuard` on dashboard routes redirects to `/login` if missing.
- `lib/api.ts` sends `Authorization: Bearer <token>` and clears session on 401.

---

## 📚 Integration features

| Route | Purpose |
|-------|---------|
| `/clinical`, `/clinical/targets` | Forms & targets (existing, via backend) |
| `/knowledge` | RAG docs: list, upload, patch indexed, delete, reindex, analytics summary |
| `/chat` | Monitor: real conversations via `/admin/chat/*`; Sandbox marked “Próximamente” |

Backend endpoints expected (see `plano_integracoes_backend.md`):

- `/admin/rag/documents`, `/upload`, `PATCH/DELETE`, `/reindex/*`, `/analytics/*`
- `/admin/chat/conversations`, `/admin/chat/conversations/{id}/messages`

Until those exist, Knowledge and Monitor show errors from the API — clinical forms still work independently.

---

## 🏗️ Project Structure

- `app/`: Next.js App Router (pages and layouts).
- `components/`: UI (Sidebar, Topbar, AuthGuard).
- `lib/`: API client, auth helpers, RAG types.
- `public/`: Static assets.

---

## 📜 Key Features

- **Form Builder**: Clinical questionnaires and scoring rules.
- **Target Manager**: User segments for clinical tagging.
- **Conocimiento RAG**: Staff ops for the assistant knowledge base (proxied by backend).
- **Chat Monitor**: Read-only view of patient conversations (anonymized labels).
