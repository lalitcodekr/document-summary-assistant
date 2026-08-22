/**
 * PDF text extraction using unpdf.
 * Runs server-side only (Node / Vercel serverless).
 * Returns extracted text and page count.
 * If the PDF has no text layer (scanned), returns empty text so the caller
 * can fall through to OCR.
 */

import type { ExtractionResult } from "@/types";

export async function extractFromPdf(
  buffer: ArrayBuffer
): Promise<ExtractionResult> {
  try {
    // Dynamic import — unpdf is a server-only module
    const { extractText } = await import("unpdf");

    const { text, totalPages } = await extractText(new Uint8Array(buffer), {
      mergePages: true,
    });

    const cleanedText = text?.trim() ?? "";

    return {
      text: cleanedText,
      pages: totalPages ?? 1,
      sourceType: "pdf",
    };
  } catch (err) {
    console.error("[extractFromPdf] error:", err);
    throw new Error("EXTRACTION_FAILED");
  }
}

/**
 * Determines whether a PDF has a real text layer.
 * A PDF with fewer than 50 meaningful chars per page is treated as image-only.
 */
export function pdfHasTextLayer(text: string, pages: number): boolean {
  const meaningfulChars = text.replace(/\s+/g, "").length;
  const avgCharsPerPage = meaningfulChars / Math.max(pages, 1);
  return avgCharsPerPage >= 50;
}
