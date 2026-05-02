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

  return `You are NovaRetail's internal knowledge assistant.

You must answer the user's question using only the provided context.

Rules:
- Do not use external knowledge.
- Do not invent facts.
- If the context does not contain the answer, say:
  "${RAG_FALLBACK_MESSAGE}"
- Be clear, concise, and professional.
- Include the source document names used.

User question:
${question}

Retrieved context:
${context}`;
}
