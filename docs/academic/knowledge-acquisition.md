# Knowledge acquisition evidence

This document preserves the knowledge-engineering evidence behind the Mercado
Libre Knowledge Assistant. It is project documentation, not a product screen.

## MVP scope

The corpus is limited to Argentina Marketplace and Mercado Envíos operations:
returns, refunds, claims, buyer protection, delivery incidents, and escalation.
Mercado Pago, advertising, general knowledge, private company data, and personal
customer data are outside scope.

## Knowledge-source map

| Group                | Candidate sources                                                      | Treatment in the MVP                                                                   |
| -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Public documents     | Public Help Center material and permitted operational references       | Review country, date, provenance, and permission before preparing a PDF                |
| Project documents    | Clearly labeled academic test documents and simulated procedures       | Never present them as official or internal policy                                      |
| Product signals      | Query history, fallbacks, source usage, and feedback                   | Use to measure coverage and prioritize missing knowledge                               |
| Future human sources | Customer Experience, Marketplace Operations, and logistics specialists | Proposed for a future real implementation; no interviews or private access are claimed |

## Acquisition matrix

| Source                           | Access                     | Reliability                          | Main risk                               | Evidence required                 |
| -------------------------------- | -------------------------- | ------------------------------------ | --------------------------------------- | --------------------------------- |
| Public Help Center reference     | Public                     | High after Argentina/date review     | Content changes or regional differences | URL, access date, and reviewer    |
| Returns/refunds guidance         | Public or project-prepared | Medium to high after validation      | Outdated deadlines or exceptions        | Provenance and review record      |
| Claims/buyer-protection guidance | Public or project-prepared | Medium to high after validation      | Missing edge cases                      | Provenance and explicit scope     |
| Mercado Envíos guidance          | Public                     | High after Argentina review          | Status-specific rules can change        | URL and verification date         |
| Simulated escalation procedure   | Project controlled         | Medium                               | May not reflect a real process          | Clear simulated-document label    |
| Query and feedback data          | Application database       | High for recorded prototype behavior | Small or biased sample                  | Database-backed metric definition |

## Representative questions

In scope:

- What is the documented return process?
- When should a claim be escalated?
- What applies when a purchase is marked delivered but not received?
- What information must be validated before starting a return?
- What procedure applies to a Mercado Envíos incident?

Out of scope:

- Which Mercado Pago investment should a user choose?
- What will the exchange rate be next month?
- Unrelated general-knowledge questions.

## Risks and controls

| Risk                                | Control                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| Incomplete sources                  | Map evaluation questions to approved evidence and expose fallbacks as knowledge gaps  |
| Outdated or contradictory documents | Store provenance/status, review sources, and require human escalation                 |
| Country-specific differences        | Keep the MVP Argentina-only and label scope explicitly                                |
| Sensitive or unauthorized content   | Protect Admin and accept only permitted, non-PII documents                            |
| Hallucination                       | Threshold retrieval, constrain generation to context, and preserve the exact fallback |
| Irrelevant retrieval                | Limit context, retain source excerpts/scores, and tune using recorded outcomes        |
| Legacy fictional-company data       | Mark legacy categories visibly and replace or delete documents manually               |

## Sufficiency criterion

The corpus is sufficient for the prototype only when the approved documents
cover the selected operational test questions, retrieval returns relevant
evidence, unsupported questions fall back safely, and a human reviewer can
trace each generated answer to its sources. This is a validation criterion, not
a claim that the corpus represents complete Mercado Libre policy.
