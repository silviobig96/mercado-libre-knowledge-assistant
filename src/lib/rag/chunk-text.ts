const DEFAULT_CHUNK_SIZE = 1200;
const DEFAULT_CHUNK_OVERLAP = 200;

export type TextChunk = {
  content: string;
  chunkIndex: number;
};

export function chunkText(
  text: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP,
): TextChunk[] {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (!normalizedText) {
    return [];
  }

  if (chunkOverlap >= chunkSize) {
    throw new Error("Chunk overlap must be smaller than chunk size.");
  }

  const chunks: TextChunk[] = [];
  let start = 0;

  while (start < normalizedText.length) {
    const targetEnd = Math.min(start + chunkSize, normalizedText.length);
    const end = findChunkBoundary(normalizedText, start, targetEnd);
    const content = normalizedText.slice(start, end).trim();

    if (content) {
      chunks.push({ content, chunkIndex: chunks.length });
    }

    if (end >= normalizedText.length) {
      break;
    }

    start = Math.max(end - chunkOverlap, 0);
  }

  return chunks;
}

function findChunkBoundary(text: string, start: number, targetEnd: number) {
  if (targetEnd >= text.length) {
    return text.length;
  }

  const sentenceBoundary = text.lastIndexOf(". ", targetEnd);

  const minimumUsefulBoundary = start + (targetEnd - start) * 0.5;

  if (sentenceBoundary > minimumUsefulBoundary) {
    return sentenceBoundary + 1;
  }

  const wordBoundary = text.lastIndexOf(" ", targetEnd);

  return wordBoundary > start ? wordBoundary : targetEnd;
}
