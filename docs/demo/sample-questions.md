# NovaRetail Demo Questions

Use these questions to demonstrate the RAG assistant with an uploaded NovaRetail policy, procedure, warranty, logistics, or internal FAQ document.

## Suggested Questions

1. `What is the process to return a defective laptop?`
   - Demonstrates returns and warranty procedure retrieval.

2. `When should a customer service case be escalated?`
   - Demonstrates customer service escalation policy retrieval.

3. `What should the advisor do if a package is marked as delivered but the customer did not receive it?`
   - Demonstrates logistics exception support and escalation guidance.

4. `What does the electronics warranty cover?`
   - Demonstrates warranty coverage lookup.

5. `How long does an approved refund take?`
   - Demonstrates internal procedure and SLA retrieval.

6. `What information must an advisor validate before approving a return?`
   - Demonstrates process checklist support for frontline employees.

## Expected Demo Behavior

- The assistant should answer only from retrieved document context.
- The assistant should show source document names, chunk numbers, similarity scores, and excerpts.
- If the uploaded knowledge base does not contain the answer, the assistant must return:

```txt
I don't have enough information in the knowledge base to answer that.
```
