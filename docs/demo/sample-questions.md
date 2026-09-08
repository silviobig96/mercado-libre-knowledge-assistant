# Mercado Libre Knowledge Assistant — Sample Questions

Use questions that are answerable by the exact academic PDFs loaded before the
demo. Do not expect the model to supply operational rules from general
knowledge.

## In-Scope Questions

1. `¿Cuál es el proceso para devolver un producto defectuoso?`
   - Demonstrates return-process retrieval.

2. `¿Cuándo debe escalarse un reclamo?`
   - Demonstrates claim and escalation criteria from the corpus.

3. `¿Qué debe hacer un agente si una compra aparece como entregada pero el comprador indica que no la recibió?`
   - Demonstrates a Mercado Envíos delivery incident.

4. `¿Qué debe hacer el agente cuando un comprador reporta que recibió un producto dañado?`
   - Demonstrates claims and buyer-protection guidance.

5. `¿Qué procedimiento debe seguirse después de aprobar un reembolso?`
   - Demonstrates refund-procedure retrieval without hardcoded timing claims.

6. `¿Qué información debe validar un agente antes de iniciar una devolución?`
   - Demonstrates required evidence or validation.

7. `¿Qué procedimiento aplica ante una incidencia con Mercado Envíos?`
   - Demonstrates logistics exception handling.

8. `¿Qué debe hacer un vendedor cuando recibe un reclamo?`
   - Demonstrates seller-support knowledge.

## Out-of-Scope / Fallback Questions

1. `¿Qué inversión de Mercado Pago tendrá mejor rendimiento?`
2. `¿Cuál será el tipo de cambio el próximo mes?`
3. `¿Quién ganó un evento deportivo no relacionado?`

Expected response when no relevant context qualifies:

```txt
I don't have enough information in the knowledge base to answer that.
```

## Demo Validation

- Confirm the in-scope answer uses only uploaded evidence.
- Expand the source list and identify document name, chunk, excerpt, and match.
- Confirm confidence appears only when retrieved sources are present.
- Submit feedback and check that Evaluation reflects stored data.
- Confirm the out-of-scope question does not receive general Gemini knowledge.
