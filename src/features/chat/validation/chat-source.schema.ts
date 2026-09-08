import { z } from "zod";

import type { ChatSource } from "@/features/chat/types/chat.types";

export const chatSourceSchema = z.object({
  id: z.string().min(1),
  documentId: z.string().min(1),
  documentName: z.string().min(1),
  source: z.string().min(1),
  chunkIndex: z.number().int().nonnegative(),
  similarity: z.number(),
  excerpt: z.string(),
});

export const chatSourcesSchema = z.array(chatSourceSchema);

export function parseStoredChatSources(value: unknown): ChatSource[] {
  const result = chatSourcesSchema.safeParse(value);

  return result.success ? result.data : [];
}
