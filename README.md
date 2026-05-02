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
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The app uses server-side Supabase access for privileged database operations. Keep `SUPABASE_SECRET_KEY` only in `.env.local`; never expose it to browser code. Client-side Supabase access is not required for this prototype, so the `NEXT_PUBLIC_*` variables may remain empty unless you intentionally add client Supabase features later.

Use `SUPABASE_URL` as the project URL only, without `/rest/v1/`.

## Supabase Setup

1. Create a free Supabase project.
2. Open the SQL Editor.
3. Run the migration files in order:
   - `db/migrations/001_enable_pgvector.sql`
   - `db/migrations/002_create_documents_tables.sql`
   - `db/migrations/003_create_similarity_search_function.sql`
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

- `http://localhost:3000` for chat
- `http://localhost:3000/admin` for PDF upload

## Test The Prototype

1. Run the Supabase migrations.
2. Start the app with `pnpm dev`.
3. Open `/admin`.
4. Upload a text-based PDF.
5. Open `/`.
6. Ask a question that the PDF can answer.
7. Confirm the answer is concise and shows source document names.
8. Ask a question unrelated to uploaded documents and confirm the fallback:

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
- Review generated answers against source documents for academic evaluation.
