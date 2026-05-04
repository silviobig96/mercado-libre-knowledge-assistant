import "server-only";

import { extractText, getDocumentProxy } from "unpdf";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfData = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const pdf = await getDocumentProxy(pdfData);
  const result = await extractText(pdf, { mergePages: true });

  await pdf.destroy();

  return result.text.replace(/\s+/g, " ").trim();
}
