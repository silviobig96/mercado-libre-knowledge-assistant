# Mercado Libre Knowledge Assistant

Mercado Libre Knowledge Assistant is an internal-style knowledge-management and
RAG prototype for Customer Experience and Marketplace Operations personnel. It
answers operational questions about Argentina Marketplace and Mercado Envíos
using only qualifying document context, exposes the evidence used, records user
feedback, and turns insufficient-context responses into visible knowledge gaps.

> Academic prototype for educational purposes. This is not an official Mercado
> Libre product and is not affiliated with or endorsed by Mercado Libre. It has
> no connection to private Mercado Libre APIs, CRM records, tickets, employees,
> customer PII, or internal policy systems.

## Product

The MVP is scoped to:

- Argentina Marketplace buyer and seller support.
- Customer Experience and Marketplace Operations.
- Mercado Envíos delivery incidents and exceptions.
- Returns, refunds, claims, buyer protection, and escalation procedures.

Mercado Pago, lending, investments, advertising, unrelated general knowledge,
and real private-company integrations are explicitly outside scope. A human
employee remains the final decision-maker.

### Product workspaces

| Route             | Purpose                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `/`               | Ask operational questions and inspect answers, confidence, evidence, and feedback controls       |
| `/history`        | Review persisted questions, answers, outcomes, sources, response time, and feedback              |
| `/sources`        | Browse real uploaded documents, chunk coverage, category, provenance, scope, and lifecycle state |
| `/knowledge-gaps` | Prioritize real fallback questions by exact normalized frequency and recency                     |
| `/analytics`      | Monitor database-backed knowledge-base, RAG-quality, performance, and feedback metrics           |
| `/admin/login`    | Authenticate for knowledge administration                                                        |
| `/admin`          | Upload and delete permitted documents; inspect governance metadata and legacy state              |

The legacy `/evaluation` URL redirects to `/analytics`. Academic showcase routes
are intentionally not part of the application.

## Architecture

The implementation uses:

- Next.js App Router and React.
- TypeScript strict mode.
- Tailwind CSS and shadcn/ui-style components.
- Vercel AI SDK and Gemini for generation.
- Gemini embeddings with 768 output dimensions.
- Supabase PostgreSQL with pgvector.
- pnpm, ESLint, and Prettier.

### Ingestion

```text
Authenticated PDF upload
  -> boundary validation
  -> PDF text extraction
  -> overlapping text chunks
  -> Gemini embeddings
  -> Supabase documents + document_chunks
```

### Question answering

```text
Validated question
  -> conversational-intent check
  -> Gemini query embedding
  -> thresholded pgvector retrieval
  -> fixed fallback when no chunk qualifies
  -> context-restricted Gemini generation
  -> answer + confidence + structured sources
  -> persisted query and optional feedback
```

The required fallback is:

```text
I don't have enough information in the knowledge base to answer that.
```

Generation is not allowed to replace the fallback with Gemini general
knowledge. Retrieved context is limited and source document names, excerpts,
chunk metadata, and similarity scores remain available to the interface.

## Analytics semantics

Every displayed metric is derived from persisted Supabase data:

- Uploaded documents: count of rows selected from `documents`.
- Indexed chunks: exact count of `document_chunks` rows.
- Categories covered: distinct stored `documents.category` values.
- Knowledge-base readiness: Ready only when both document and chunk counts are
  greater than zero.
- Total queries: count of `chat_queries` rows.
- Source-backed answers: queries where `had_fallback = false` and stored sources
  contain at least one valid source object.
- Fallback queries: queries where `had_fallback = true`.
- Eligible knowledge queries: source-backed answers plus fallback queries.
- Conversational/unscored: total queries minus eligible knowledge queries.
- Source-backed and fallback rates: their respective counts divided by eligible
  knowledge queries, never all interactions.
- Confidence distribution: only source-backed queries with a stored confidence
  label.
- Average response time: arithmetic mean of `response_time_ms` across all stored
  query rows.
- Helpful rate: helpful rows divided by all rows in `chat_feedback`.
- Top documents: source-document appearances in valid stored sources for
  source-backed queries.
- Top categories: those source appearances mapped to the current document
  category by document ID.
- Knowledge gaps: real fallback query rows; repeated questions are grouped only
  by exact normalized text, not speculative semantic clustering.

Errors are rendered as unavailable states rather than misleading zero values.

## Setup

Install dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env.local` and provide real values:

```txt
ADMIN_PASSWORD=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`SUPABASE_URL` must be the project URL without `/rest/v1/`. The current UI does
not require browser-side Supabase access, so the `NEXT_PUBLIC_*` values may stay
empty unless a future client feature requires them.

Use the current Supabase key format:

- `SUPABASE_PUBLISHABLE_KEY` starts with `sb_publishable_`.
- `SUPABASE_SECRET_KEY` starts with `sb_secret_`.

Never expose `SUPABASE_SECRET_KEY`, `GEMINI_API_KEY`, or `ADMIN_PASSWORD` to the
browser. `.env.local` must not be committed.

### Supabase migrations

Run these files in order in the Supabase SQL Editor:

1. `db/migrations/001_enable_pgvector.sql`
2. `db/migrations/002_create_documents_tables.sql`
3. `db/migrations/003_create_similarity_search_function.sql`
4. `db/migrations/004_enforce_document_chunks_cascade_delete.sql`
5. `db/migrations/005_add_document_category.sql`
6. `db/migrations/006_create_chat_feedback.sql`
7. `db/migrations/007_create_chat_queries.sql`
8. `db/migrations/008_add_mercado_libre_document_categories.sql`
9. `db/migrations/009_add_document_governance_metadata.sql`

Migration `009` is additive and nullable. It adds `source_type`, `country`, and
`status` without rewriting or deleting existing documents. Until it is applied,
read paths fall back to the previous schema and classify current-category rows
as Needs review. Known NovaRetail-era categories always render as Legacy.

The vector schema uses `vector(768)`, matching `gemini-embedding-001` with
`outputDimensionality: 768`. A model or dimension change requires coordinated
application, table, index, and RPC changes.

### Document categories

New uploads use these stable values:

| Value                     | Label                     |
| ------------------------- | ------------------------- |
| `customer-experience`     | Customer Experience       |
| `mercado-envios`          | Mercado Envíos            |
| `claims-buyer-protection` | Claims & Buyer Protection |
| `returns-refunds`         | Returns & Refunds         |
| `marketplace-operations`  | Marketplace Operations    |
| `general-policy`          | General Policy            |

Migration `008` retains older category values for compatibility. Existing rows
are not renamed, deleted, or represented as Mercado Libre documents.

### Run locally

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Knowledge administration

`ADMIN_PASSWORD` protects the Admin page and document mutation APIs through a
signed HTTP-only session cookie. An administrator chooses a category, source
type, and Argentina scope before uploading a text-based PDF up to 10 MB.

New documents are marked Active. Existing rows without migration `009` metadata
remain Needs review; known old NovaRetail categories remain Legacy. Deletion is
manual and explicit because document provenance cannot be inferred safely.

Use only permitted public references, clearly labeled test documents, or
clearly simulated procedures. Do not upload copyrighted, personal, sensitive,
private, or unauthorized material.

The shared password is appropriate only for this prototype. A production
implementation needs identity-based authentication, role authorization,
auditing, rate limiting, retention controls, and a formal review lifecycle.

## Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## Academic context

The product deliberately excludes coursework and presentation screens. The
supporting evidence is preserved as documentation:

- [Knowledge acquisition](docs/academic/knowledge-acquisition.md)
- [Business integration](docs/academic/business-flow.md)
- [Architecture and solution design](docs/academic/architecture.md)
- [Product-oriented live demo](docs/demo/demo-script.md)
- [Sample questions](docs/demo/sample-questions.md)
- [Activity 4 integration report](docs/actividad-4-integracion-empresarial.md)

These documents explain how the prototype was scoped, designed, and evaluated;
the application itself demonstrates the operational solution.

## Deployment and repository follow-up

Repository and hosting project names cannot be changed by application code.
When appropriate:

1. Rename the GitHub repository to `mercado-libre-knowledge-assistant`.
2. Update the local Git remote.
3. Rename or review the Vercel project and deployment URL.
4. Confirm the Git integration and all environment variables after the rename.
5. Apply every migration and upload the approved Argentina corpus.
6. Review and manually replace/delete legacy NovaRetail documents.
