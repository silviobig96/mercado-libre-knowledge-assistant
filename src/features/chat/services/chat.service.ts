import "server-only";

import { z } from "zod";

import { generateEmbedding } from "@/lib/ai/embedding.service";
import { generateAnswer } from "@/lib/ai/generation.service";
import {
  buildRagPrompt,
  RAG_FALLBACK_MESSAGE,
} from "@/lib/rag/build-rag-prompt";
import { retrieveRelevantContext } from "@/lib/rag/retrieve-context";
import { detectConversationIntent } from "@/features/chat/services/conversation-intent.service";
import { saveChatQueryLog } from "@/features/chat/services/chat-query-log.service";
import { DEFAULT_SIMILARITY_THRESHOLD } from "@/features/documents/services/document-query.service";

import type {
  ChatResponse,
  ChatSource,
  ConfidenceLevel,
} from "@/features/chat/types/chat.types";
import type { RetrievedDocumentChunk } from "@/features/documents/types/document.types";

const questionSchema = z.string().trim().min(1).max(1000);

export async function answerQuestion(
  questionInput: unknown,
): Promise<ChatResponse> {
  const startedAt = Date.now();
  const question = questionSchema.parse(questionInput);
  const intent = detectConversationIntent(question);

  if (intent.intent !== "knowledge") {
    return createResponseWithQueryLog(question, startedAt, intent.response);
  }

  const questionEmbedding = await generateEmbedding(question);
  const chunks = await retrieveRelevantContext(questionEmbedding);

  logRetrievalDebug({
    question,
    queryEmbeddingLength: questionEmbedding.length,
    chunks,
  });

  if (chunks.length === 0) {
    return createResponseWithQueryLog(question, startedAt, {
      answer: RAG_FALLBACK_MESSAGE,
      sources: [],
      confidence: null,
    });
  }

  const answer = await generateAnswer(buildRagPrompt(question, chunks));

  return createResponseWithQueryLog(question, startedAt, {
    answer: answer || RAG_FALLBACK_MESSAGE,
    sources: toSources(chunks),
    confidence: getConfidenceLevel(chunks[0]?.similarity ?? 0),
  });
}

type RetrievalDebugInput = {
  question: string;
  queryEmbeddingLength: number;
  chunks: RetrievedDocumentChunk[];
};

function logRetrievalDebug({
  question,
  queryEmbeddingLength,
  chunks,
}: RetrievalDebugInput) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (chunks.length === 0) {
    console.info("[RAG retrieval] no chunks matched", {
      question,
      queryEmbeddingLength,
      matchedChunks: 0,
      similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,
    });
    return;
  }

  console.info("[RAG retrieval] matched chunks", {
    question,
    queryEmbeddingLength,
    matchedChunks: chunks.length,
    similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,
    topSimilarities: chunks.map((chunk) => Number(chunk.similarity.toFixed(4))),
    topSources: chunks.map((chunk) => ({
      documentName: chunk.documentName,
      source: chunk.source,
      chunkIndex: chunk.chunkIndex,
    })),
  });
}

function toSources(chunks: RetrievedDocumentChunk[]): ChatSource[] {
  return chunks.map((chunk) => ({
    id: chunk.id,
    documentId: chunk.documentId,
    documentName: chunk.documentName,
    source: chunk.source,
    chunkIndex: chunk.chunkIndex,
    similarity: chunk.similarity,
    excerpt: createExcerpt(chunk.content),
  }));
}

function createExcerpt(content: string): string {
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  if (normalizedContent.length <= 180) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, 177)}...`;
}

function getConfidenceLevel(topSimilarity: number): ConfidenceLevel {
  if (topSimilarity >= 0.7) {
    return "High";
  }

  if (topSimilarity >= 0.5) {
    return "Medium";
  }

  return "Low";
}

async function createResponseWithQueryLog(
  question: string,
  startedAt: number,
  response: ChatResponse,
): Promise<ChatResponse> {
  try {
    await saveChatQueryLog({
      question,
      response,
      responseTimeMs: Date.now() - startedAt,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[chat query log] failed to save query log", error);
    }
  }

  return response;
}
