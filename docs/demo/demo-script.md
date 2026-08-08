# Mercado Libre Knowledge Assistant — Demo Script

## Before the Presentation

1. Apply all Supabase migrations, including migration `009` for governance
   metadata.
2. Review previous fictional-company documents in Sources/Admin and remove only
   the documents that are safe to replace.
3. Upload the permitted Mercado Libre Argentina corpus with accurate category,
   provenance, and scope.
4. Preflight one in-scope question, one source accordion, one feedback action,
   and one fallback question.
5. Confirm environment variables are configured and no sensitive data is in the
   corpus.

## Live Walkthrough

1. Open **Assistant** and introduce the operational knowledge problem.
2. State the MVP boundary: Argentina, Marketplace, Customer Experience, and
   Mercado Envíos. Explicitly exclude Mercado Pago and financial products.
3. Point out the non-affiliation disclaimer and explain that the human
   agent remains the final decision-maker.
4. Ask an in-scope question and inspect the grounded answer, confidence, source
   names, excerpts, and similarity.
5. Submit Helpful or Not helpful feedback.
6. Open **History** and expand the recorded interaction.
7. Ask the financial-product question and show the exact insufficient-context
   fallback.
8. Open **Knowledge Gaps** and locate the unresolved question.
9. Open **Analytics** and explain the eligible-query, confidence, performance,
   and feedback populations.
10. Open **Sources** to show corpus transparency and legacy/review states.
11. Open **Admin**, sign in, and show governed upload and delete controls.
12. Close with the human decision boundary and the need for document governance
    before any real implementation.

## Core Talking Points

- This is an academic RAG prototype, not an ecommerce storefront or official
  Mercado Libre product.
- It does not connect to private Mercado Libre systems, employees, tickets, or
  internal policies.
- Answers are constrained to retrieved context and retain visible sources.
- Factual procedures, deadlines, and amounts come only from the uploaded corpus.
- The final operational decision belongs to the human employee.
