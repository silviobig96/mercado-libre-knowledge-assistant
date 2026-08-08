# Business integration evidence

This document preserves the modeled human-in-the-loop flow behind the product.

## To-be operational flow

1. A buyer or seller case enters a Customer Experience or Marketplace
   Operations workflow.
2. The human agent reviews the case and asks the Assistant an operational
   question.
3. Gemini embeds the question.
4. Supabase pgvector retrieves only chunks that satisfy the similarity
   threshold.
5. If no chunk qualifies, the application returns the fixed
   insufficient-context fallback.
6. Otherwise, Gemini generates an answer using only retrieved context.
7. The product displays the response, confidence, source documents, excerpts,
   and match scores.
8. The agent verifies the evidence and decides whether to act, investigate, or
   escalate.
9. The application records the query outcome and optional feedback.
10. Supervisors use History, Knowledge Gaps, and Analytics to improve coverage.

## Human decision boundary

The Assistant supports retrieval and synthesis; it does not resolve real cases
autonomously. A human remains responsible for checking the source, identifying
conflicts or sensitive circumstances, and selecting the operational next step.

Escalation is appropriate when evidence is missing, contradictory, stale,
outside Argentina scope, or insufficient for a safe decision.

## Representative scenarios

- A purchase is marked delivered, but the buyer reports it was not received.
- A buyer reports a damaged or incomplete product and opens a claim.
- An agent must validate return requirements before starting the process.
- A Mercado Envíos incident requires documented handling or escalation.

## Product feedback loop

```text
Agent question
  -> source-backed answer or fallback
  -> human review and feedback
  -> persisted history and metrics
  -> knowledge-gap prioritization
  -> governed document update
```

The prototype models this workflow without claiming access to support tickets,
CRM data, employees, private APIs, or internal policy systems.
