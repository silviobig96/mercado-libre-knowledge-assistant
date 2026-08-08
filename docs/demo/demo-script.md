# Mercado Libre Knowledge Assistant — Demo Script

## Before the Presentation

1. Apply all Supabase migrations, including migration `008` for the new
   categories.
2. Remove previous fictional-company documents through the Admin delete flow.
3. Upload the permitted Mercado Libre Argentina academic corpus.
4. Preflight one in-scope question, one source accordion, one feedback action,
   and one fallback question.
5. Confirm environment variables are configured and no sensitive data is in the
   corpus.

## Live Walkthrough

1. Open the Chat landing page and introduce the academic problem.
2. State the MVP boundary: Argentina, Marketplace, Customer Experience, and
   Mercado Envíos. Explicitly exclude Mercado Pago and financial products.
3. Point out the academic/non-affiliation disclaimer and explain that the human
   agent remains the final decision-maker.
4. Open **Knowledge Acquisition** and show:
   - the source map;
   - the acquisition matrix;
   - in-scope and out-of-scope questions;
   - risks and mitigations;
   - the 10-week source-sufficiency criterion.
5. Open **Admin**, sign in with the demo password, and show an uploaded academic
   source with its category and chunk count.
6. Return to **Chat** and ask an in-scope question.
7. Show the grounded answer, confidence, source names, excerpts, and similarity.
8. Submit Helpful or Not helpful feedback.
9. Ask the financial-product question and show the exact insufficient-context
   fallback.
10. Open **Business Flow** and explain human review, resolution, and escalation.
11. Open **Architecture** and explain PDF extraction, chunking, Gemini
    embeddings, Supabase pgvector retrieval, Gemini generation, and sources.
12. Open **Evaluation** and distinguish source-backed answers, fallbacks,
    conversational/unscored queries, confidence-rated answers, and feedback.
13. Close with risks, future improvements, and the need for document governance
    before any real implementation.

## Core Talking Points

- This is an academic RAG prototype, not an ecommerce storefront or official
  Mercado Libre product.
- It does not connect to private Mercado Libre systems, employees, tickets, or
  internal policies.
- Answers are constrained to retrieved context and retain visible sources.
- Factual procedures, deadlines, and amounts come only from the uploaded corpus.
- The final operational decision belongs to the human employee.
