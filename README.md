# Mercado Libre Knowledge Assistant

Mercado Libre Knowledge Assistant is an academic Retrieval-Augmented Generation
(RAG) prototype scoped to Mercado Libre Argentina. It supports a deliberately
narrow set of Marketplace and Mercado Envíos operational knowledge for Customer
Experience and Marketplace Operations personnel: returns, refunds, claims,
buyer protection, delivery incidents, and escalation.

> Academic prototype for educational purposes. This is not an official Mercado
> Libre product and is not affiliated with or endorsed by Mercado Libre. It has
> no connection to private Mercado Libre APIs, CRM records, tickets, employees,
> or internal policy systems.

The assistant answers only from retrieved document context, shows the source
documents used, and falls back safely when the knowledge base is insufficient.
The human employee remains the final decision-maker.

## MVP Scope

Included:

- Country: Argentina.
- Marketplace buyer and seller support.
- Customer Experience and Marketplace Operations.
- Mercado Envíos delivery incidents and exceptions.
- Returns, refunds, claims, buyer protection, and escalation procedures.

Excluded:

- Mercado Pago, credit, lending, investments, and other financial products.
- Advertising products.
- Unrelated general knowledge.
- Real private-company integrations or fabricated operational policies.

## Tech Stack

- Next.js App Router and React.
- TypeScript strict mode.
- Tailwind CSS and shadcn/ui-style components.
- Vercel AI SDK.
- Gemini API for generation and embeddings.
- Supabase PostgreSQL with pgvector.
- pnpm, ESLint, and Prettier.

## Setup

Install dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env.local` and supply real values:

```txt
ADMIN_PASSWORD=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The current UI does not require client-side Supabase access, so the
`NEXT_PUBLIC_*` values may remain empty unless a future client feature needs
them. `SUPABASE_URL` must be the project URL without `/rest/v1/`.

`ADMIN_PASSWORD` protects the academic Admin experience and document APIs. Use
a strong value locally and configure the same variable in the deployment.

## Supabase Setup

Create a free Supabase project and run these files in order in the SQL Editor:

1. `db/migrations/001_enable_pgvector.sql`
2. `db/migrations/002_create_documents_tables.sql`
3. `db/migrations/003_create_similarity_search_function.sql`
4. `db/migrations/004_enforce_document_chunks_cascade_delete.sql`
5. `db/migrations/005_add_document_category.sql`
6. `db/migrations/006_create_chat_feedback.sql`
7. `db/migrations/007_create_chat_queries.sql`
8. `db/migrations/008_add_mercado_libre_document_categories.sql`

Use the current Supabase key format:

- `SUPABASE_PUBLISHABLE_KEY` starts with `sb_publishable_`.
- `SUPABASE_SECRET_KEY` starts with `sb_secret_`.

The secret key is used only in server-side modules. If inserts fail after Row
Level Security is enabled, verify the deployment uses the secret key for
`SUPABASE_SECRET_KEY`.

The schema stores embeddings as `vector(768)`. The app uses
`gemini-embedding-001` with `outputDimensionality: 768`. Changing the model or
dimension requires coordinated code, table, index, and RPC updates.

### Document Categories

New uploads use stable logical values with these labels:

| Value                     | Label                     |
| ------------------------- | ------------------------- |
| `customer-experience`     | Customer Experience       |
| `mercado-envios`          | Mercado Envíos            |
| `claims-buyer-protection` | Claims & Buyer Protection |
| `returns-refunds`         | Returns & Refunds         |
| `marketplace-operations`  | Marketplace Operations    |
| `general-policy`          | General Policy            |

Migration `008` retains the earlier category values in the database constraint
for backward compatibility. Existing rows are not renamed or deleted, and the
Admin list marks known legacy categories explicitly.

## Gemini Setup

1. Create a Gemini API key in Google AI Studio.
2. Add it to `.env.local` as `GEMINI_API_KEY`.
3. Review generation and embedding model constants in
   `src/lib/ai/gemini.client.ts` when upgrading models.

## Run Locally

```bash
pnpm dev
```

Open:

- `http://localhost:3000` — primary knowledge chat.
- `http://localhost:3000/knowledge-acquisition` — source strategy and risks.
- `http://localhost:3000/business-flow` — human-in-the-loop operational flow.
- `http://localhost:3000/architecture` — RAG solution design.
- `http://localhost:3000/evaluation` — database-backed metrics and evaluation.
- `http://localhost:3000/demo` — presentation walkthrough.
- `http://localhost:3000/admin/login` — Admin sign-in.
- `http://localhost:3000/admin` — protected PDF management.

## How the RAG Flow Works

### Ingestion

1. An authenticated administrator selects a category and permitted PDF.
2. The server validates and extracts text from the PDF.
3. Text is normalized and split into overlapping chunks.
4. Gemini creates a 768-dimensional embedding for each chunk.
5. Supabase stores document metadata, chunks, and pgvector embeddings.

### Question Answering

1. The chat validates the question and handles simple conversational intents.
2. Gemini embeds a knowledge question.
3. Supabase pgvector retrieves up to five qualifying chunks by cosine
   similarity.
4. If none qualify, the API returns the required fallback.
5. Otherwise Gemini receives a prompt restricted to retrieved context.
6. The UI shows the answer, confidence, sources, excerpts, and match scores.
7. The query and optional helpful/not-helpful feedback are recorded.

Required fallback:

```txt
I don't have enough information in the knowledge base to answer that.
```

## Suggested Academic Corpus

Upload appropriately prepared, permitted PDFs covering:

- Returns policy or process.
- Refund procedure.
- Claims and buyer-protection workflow.
- Mercado Envíos incident handling.
- Delivered-but-not-received procedure.
- Seller claim handling.
- Escalation procedure.

Public-source-derived or simulated documents must be labeled accurately. Do not
embed copyrighted site content in the repository or imply that simulated files
are official internal policies.

## Sample Questions

- ¿Cuál es el proceso para devolver un producto defectuoso?
- ¿Cuándo debe escalarse un reclamo?
- ¿Qué debe hacer un agente si una compra aparece como entregada pero el
  comprador indica que no la recibió?
- ¿Qué información debe validar un agente antes de iniciar una devolución?
- ¿Qué procedimiento aplica ante una incidencia con Mercado Envíos?

Factual deadlines, amounts, eligibility rules, and procedural details must come
from the uploaded corpus—not static UI copy.

## Academic Project Coverage

### Activity 1 — Initial Project Plan

- Real company/domain selection: Mercado Libre.
- Argentina Marketplace and Mercado Envíos MVP scope.
- AI objective, users, human decision boundary, and 10-week framing.

### Knowledge Acquisition

- Knowledge-source map and acquisition matrix.
- Representative in-scope and out-of-scope questions.
- Initial risks, mitigations, and 10-week source-sufficiency criterion.

### Activity 2 — Solution Design

- Modular architecture and RAG data flow.
- Next.js, Gemini, Supabase, and pgvector service boundaries.

### Activity 3 — AI Prototype

- Protected PDF upload, extraction, chunking, embeddings, storage, and search.
- Grounded Gemini generation, safe fallback, confidence, and source attribution.
- Query logging and answer feedback.

### Activity 4 — Business Integration

- Buyer/seller case flow through Customer Experience or Marketplace Operations.
- Human review, resolution, escalation, and continuous feedback.
- Technical evidence in `docs/actividad-4-integracion-empresarial.md`.

### Activity 5 — Impact Evaluation

- Database-backed knowledge-base, query, confidence, source, and feedback
  metrics.
- Risks, mitigations, impact, and future improvements.

### Activity 6 — Final Demo

- Presentation-ready routes and walkthrough.
- Demo script and sample questions in `docs/demo/`.

## Test the Prototype

1. Apply every Supabase migration.
2. Start the app with `pnpm dev`.
3. Sign in at `/admin/login` with `ADMIN_PASSWORD`.
4. Upload a text-based, permitted PDF and choose a new domain category.
5. Confirm the Admin list shows its category and chunk count.
6. Ask a question the PDF can answer.
7. Confirm the answer shows confidence and source document names.
8. Submit answer feedback.
9. Ask an unrelated question and confirm the exact fallback.
10. Review Knowledge Acquisition, Business Flow, Architecture, Evaluation, and
    Demo at desktop and mobile widths.

## Quality Commands

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## Free-Tier Notes

- Embeddings use 768 dimensions to reduce vector storage.
- PDF uploads are limited to 10 MB.
- Retrieval limits context before generation.
- No paid service is required by the architecture.

## Security Notes

- Never commit `.env.local` or hardcode credentials.
- Do not use legacy Supabase key names.
- Keep `SUPABASE_SECRET_KEY` in server-only code.
- Admin upload and delete endpoints require a signed HTTP-only session cookie.
- The shared Admin password is appropriate only for this demo; production needs
  identity-based authentication, authorization, auditing, rate limiting, and
  document governance.
- Do not upload personal, sensitive, private, or unauthorized documents.
- Review generated answers and sources before operational use.

## Legacy Knowledge Data

The migration does not rewrite or destroy uploaded documents. Before presenting
the Mercado Libre scenario, use the existing Admin delete flow to remove old
documents that belong to the previous fictional corpus, then upload the approved
Mercado Libre Argentina academic corpus. Database cleanup is a deliberate manual
action because source provenance cannot be inferred safely from filenames or
legacy categories.

## Repository and Deployment Rename

Code cannot rename GitHub or Vercel projects. After merging the migration:

1. Rename the GitHub repository to `mercado-libre-knowledge-assistant`.
2. Update the local remote:

   ```bash
   git remote set-url origin https://github.com/silviobig96/mercado-libre-knowledge-assistant.git
   ```

3. Rename or review the Vercel project and deployment URL separately.
4. Confirm Vercel Git integration still targets the renamed repository.
5. Verify all environment variables remain configured.
