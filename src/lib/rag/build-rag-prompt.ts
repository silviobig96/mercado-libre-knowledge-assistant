import type { RetrievedDocumentChunk } from "@/features/documents/types/document.types";

export const RAG_FALLBACK_MESSAGE =
  "I don't have enough information in the knowledge base to answer that.";

export function buildRagPrompt(
  question: string,
  chunks: RetrievedDocumentChunk[],
): string {
  const context = chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] Source: ${chunk.documentName} | Chunk ${
          chunk.chunkIndex + 1
        }\n${chunk.content}`,
    )
    .join("\n\n");

  return `You are an academic Mercado Libre knowledge assistant for an Argentina-scoped MVP.

Your operational scope is Marketplace and Mercado Envíos knowledge for Customer Experience and Marketplace Operations teams. This prototype is not connected to Mercado Libre's private systems.

You must answer the user's question using only the provided context.

Rules:
- Do not use external knowledge.
- Do not invent Mercado Libre rules, deadlines, amounts, policies, or procedures.
- Treat Mercado Pago, credit, lending, investments, advertising, and unrelated topics as out of scope unless the retrieved context is explicitly relevant to the defined Marketplace or Mercado Envíos operational question.
- If the context does not contain the answer, say:
  "${RAG_FALLBACK_MESSAGE}"
- Be clear, concise, and professional.
- Identify the source document names used in the answer. The application will also display structured source attribution.
- The human employee remains the final decision-maker and may escalate ambiguous or sensitive cases.

User question:
${question}

Retrieved context:
${context}`;
}
