/**
 * Splits text into overlapping chunks for map-reduce summarization.
 * Each chunk is ~6000 chars (~1500 tokens) with a 300-char overlap.
 */
export function chunkText(
  text: string,
  chunkSize = 6000,
  overlap = 300
): string[] {
  if (text.length <= chunkSize) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
  }

  return chunks;
}

/**
 * Checks whether a document is likely too long for a single LLM call.
 * Threshold: 28000 chars (~7000 tokens).
 */
export function needsChunking(text: string): boolean {
  return text.length > 28000;
}

/**
 * Truncates text for preview (first N chars).
 */
export function previewText(text: string, maxChars = 500): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "…";
}
