# NovaRetail AI Assistant

NovaRetail AI Assistant is an academic RAG prototype for a fictional omnichannel retail company. Employees can upload internal PDF documents, ask natural-language questions, and receive answers grounded only in retrieved document context with source attribution.

## Tech Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui-style components
- Vercel AI SDK
- Gemini API for generation and embeddings
- Supabase PostgreSQL with pgvector
- pnpm
- ESLint and Prettier

## Setup

Install dependencies:

```bash
pnpm install
```

Create `.env.local` from `.env.example` and fill in the real values:

```txt
ADMIN_PASSWORD=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The app uses server-side Supabase access for privileged database operations. Keep `SUPABASE_SECRET_KEY` only in `.env.local`; never expose it to browser code. Client-side Supabase access is not required for this prototype, so the `NEXT_PUBLIC_*` variables may remain empty unless you intentionally add client Supabase features later.

`ADMIN_PASSWORD` protects the Admin page and document management APIs in this academic MVP. Use a strong demo password locally and configure the same variable in Vercel for production deployments.

Use `SUPABASE_URL` as the project URL only, without `/rest/v1/`.

## Supabase Setup

1. Create a free Supabase project.
2. Open the SQL Editor.
3. Run the migration files in order:
   - `db/migrations/001_enable_pgvector.sql`
   - `db/migrations/002_create_documents_tables.sql`
   - `db/migrations/003_create_similarity_search_function.sql`
   - `db/migrations/004_enforce_document_chunks_cascade_delete.sql`
   - `db/migrations/005_add_document_category.sql`
   - `db/migrations/006_create_chat_feedback.sql`
4. Create or copy the new Supabase API keys:
   - `SUPABASE_PUBLISHABLE_KEY` starts with `sb_publishable_`
   - `SUPABASE_SECRET_KEY` starts with `sb_secret_`

The schema stores embeddings as `vector(768)`. The current implementation uses `gemini-embedding-001` with `outputDimensionality: 768` for free-tier-friendly storage. To change models or dimensions, update the constants in `src/lib/ai/gemini.client.ts` and adjust the migration vector dimensions and RPC signature.

## Gemini Setup

1. Create a Gemini API key from Google AI Studio.
2. Add it to `.env.local` as `GEMINI_API_KEY`.
3. The generation model is centralized in `src/lib/ai/gemini.client.ts`.

## Run Locally

```bash
pnpm dev
```

Open:

- `http://localhost:3000` for NovaRetail Knowledge Center and chat
- `http://localhost:3000/admin/login` to sign in to the Admin area
- `http://localhost:3000/admin` for protected PDF upload and document management
- `http://localhost:3000/business-flow` for business integration
- `http://localhost:3000/architecture` for solution design
- `http://localhost:3000/evaluation` for impact evaluation

## Academic Project Coverage

Activity 2 — Solution Design:

- Architecture page with component explanation.
- RAG data flow from PDF ingestion to source-backed answer.
- Technology stack and service boundaries.

Activity 3 — AI Prototype:

- Working PDF upload.
- Document categories for Customer Service, Logistics, Warranties, Returns, Store Operations, and General Policy.
- Text extraction and chunking.
- Gemini embeddings.
- Supabase pgvector storage and retrieval.
- Gemini RAG generation.
- Source attribution in chat responses.
- Answer feedback capture for helpful and not helpful responses.

Activity 4 — Business Integration:

- Business Flow page.
- User-system interaction flow.
- API and service involvement across upload, retrieval, and answer generation.
- NovaRetail operational scenarios for service, logistics, warranty, and onboarding.

Activity 5 — Impact Evaluation:

- Evaluation page.
- Database-backed uploaded document and indexed chunk counts when available.
- Database-backed answer feedback counts and helpful percentage.
- Impact, risks, mitigations, and future improvement framing.

Activity 6 — Final Demo:

- Functional web app.
- Presentation-ready Chat, Admin, Business Flow, Architecture, and Evaluation pages.
- Demo script in `docs/demo/demo-script.md`.
- Suggested demo questions in `docs/demo/sample-questions.md`.

## Test The Prototype

1. Run the Supabase migrations.
2. Start the app with `pnpm dev`.
3. Open `/admin/login`.
4. Sign in with `ADMIN_PASSWORD`.
5. Open `/admin`.
6. Upload a text-based PDF and choose a document category.
7. Open `/`.
8. Ask a question that the PDF can answer.
9. Confirm the answer is concise, shows a confidence label, and shows source document names.
10. Submit helpful or not helpful feedback under the assistant answer.
11. Open `/business-flow`, `/architecture`, and `/evaluation` to present Activities 2, 4, and 5.
12. Ask a question unrelated to uploaded documents and confirm the fallback:

```txt
I don't have enough information in the knowledge base to answer that.
```

## Quality Commands

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

## Free-Tier Notes

- Embeddings use 768 dimensions to reduce vector storage.
- PDF uploads are limited to 10 MB.
- Retrieved context is limited before generation.
- The app does not require paid hosting or paid vector databases.

## Security Notes

- Do not commit `.env.local`.
- Do not hardcode API keys.
- Do not use legacy Supabase key names.
- Keep `SUPABASE_SECRET_KEY` in server-only code.
- Protect `/admin` with `ADMIN_PASSWORD`; document upload and delete APIs require the same HTTP-only admin session cookie.
- This prototype uses simple password-based admin protection for demonstration purposes. In a production version, this should be replaced with a full authentication and authorization system such as Clerk, Auth0, Supabase Auth, or another identity provider with role-based access control.
- Review generated answers against source documents for academic evaluation.
