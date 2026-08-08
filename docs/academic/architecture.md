# Architecture and solution-design evidence

## System overview

Mercado Libre Knowledge Assistant is a modular Retrieval-Augmented Generation
prototype built with Next.js App Router, TypeScript, Gemini, Supabase
PostgreSQL, and pgvector.

```text
Approved PDF
  -> validation and text extraction
  -> overlapping text chunks
  -> Gemini 768-dimensional embeddings
  -> Supabase documents + document_chunks
  -> pgvector semantic retrieval
  -> context-restricted Gemini generation
  -> answer + confidence + structured sources
```

## Application boundaries

- React components render product state and client interactions.
- Thin route handlers validate HTTP inputs and authentication.
- Feature services own ingestion, retrieval, history, gaps, and analytics logic.
- Gemini-specific operations remain under `src/lib/ai`.
- Supabase configuration and generated table contracts remain server-only.
- RAG prompt building and thresholded retrieval remain separate concerns.

## Data model

- `documents` stores filename, category, governance metadata, size, MIME type,
  and upload date.
- `document_chunks` stores source text, chunk order, and 768-dimensional vectors.
- `chat_queries` stores question, answer, structured sources, confidence,
  fallback status, response time, and timestamp.
- `chat_feedback` stores helpful/not-helpful ratings with the associated
  question, answer, and sources.
- `match_document_chunks` performs thresholded vector similarity search.

## Security and trust boundary

- `GEMINI_API_KEY` and `SUPABASE_SECRET_KEY` are used only by server modules.
- The Admin session is stored in a signed HTTP-only cookie.
- Upload and delete endpoints require Admin authentication.
- PDFs are restricted by type and size and must be explicitly permitted.
- The application has no connection to Mercado Libre private APIs, CRM records,
  tickets, employee directories, internal documents, or customer PII.

## Quality and operational signals

History is derived from `chat_queries`; Sources from `documents` and
`document_chunks`; Knowledge Gaps from recorded fallback queries; and Analytics
from the same persisted document, query, source, response-time, confidence, and
feedback data. Metric populations are deliberately explicit so conversational
interactions do not distort source-backed or fallback rates.
