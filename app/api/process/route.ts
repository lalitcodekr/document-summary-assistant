import { NextRequest, NextResponse } from "next/server";
import type { ApiError, ErrorCode, ProcessResult, SummaryLength } from "@/types";
import { extractFromPdf, pdfHasTextLayer } from "@/lib/extract-text";
import { ocrImage } from "@/lib/ocr";
import { summarizeWithRetry } from "@/lib/summarize";
import { previewText } from "@/lib/chunk-text";

// ─── Config ───────────────────────────────────────────────────────────────────

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB ?? 10);
const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp"]);

// ─── Helper ───────────────────────────────────────────────────────────────────

function errorResponse(code: ErrorCode, message: string, status = 400): NextResponse<ApiError> {
  return NextResponse.json({ error: { code, message } }, { status });
}

function getExtension(filename: string): string {
  return filename.toLowerCase().slice(filename.lastIndexOf("."));
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<ProcessResult | ApiError>> {
  const startTime = Date.now();

  // ── Parse multipart form ──────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return errorResponse("EXTRACTION_FAILED", "Invalid request format. Send multipart/form-data.", 400);
  }

  const file = formData.get("file") as File | null;
  const summaryLengthRaw = formData.get("summaryLength") as string | null;

  // ── Validate inputs ───────────────────────────────────────────────────────
  if (!file) {
    return errorResponse("UNSUPPORTED_FILE_TYPE", "No file provided.", 400);
  }

  const summaryLength: SummaryLength =
    summaryLengthRaw === "short" || summaryLengthRaw === "long"
      ? summaryLengthRaw
      : "medium";

  // File type validation
  const ext = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext) && !ALLOWED_MIME_TYPES.has(file.type)) {
    return errorResponse(
      "UNSUPPORTED_FILE_TYPE",
      `Unsupported file type "${file.type || ext}". Please upload a PDF, PNG, JPG, or WebP.`
    );
  }

  // File size validation
  if (file.size > MAX_BYTES) {
    return errorResponse(
      "FILE_TOO_LARGE",
      `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum allowed size is ${MAX_UPLOAD_MB} MB.`
    );
  }

  // Empty file guard
  if (file.size === 0) {
    return errorResponse("EXTRACTION_FAILED", "The uploaded file is empty.");
  }

  // ── Read file buffer ──────────────────────────────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isPdf = file.type === "application/pdf" || ext === ".pdf";

  // ── Text extraction ───────────────────────────────────────────────────────
  let extractedText = "";
  let pages = 1;
  let sourceType: "pdf" | "image" = isPdf ? "pdf" : "image";

  try {
    if (isPdf) {
      // Try PDF text layer first
      const pdfResult = await extractFromPdf(arrayBuffer.slice(0));
      pages = pdfResult.pages;

      if (pdfHasTextLayer(pdfResult.text, pdfResult.pages)) {
        // Digital PDF — use text layer directly
        extractedText = pdfResult.text;
      } else {
        // Scanned PDF — fall through to OCR
        console.log("[/api/process] PDF has no text layer — routing to OCR");
        const { renderPageAsImage } = await import("unpdf");
        
        let allOcrText = "";
        const maxPagesToOcr = Math.min(pdfResult.pages, 3); // OCR up to 3 pages to prevent timeout
        
        for (let i = 1; i <= maxPagesToOcr; i++) {
          console.log(`[/api/process] Rendering PDF page ${i} to image...`);
          const imageBuffer = await renderPageAsImage(new Uint8Array(buffer), i, {
            canvasImport: () => import('@napi-rs/canvas')
          });
          const pageText = await ocrImage(Buffer.from(imageBuffer));
          allOcrText += pageText + "\n";
        }
        extractedText = allOcrText.trim();
        sourceType = "image"; // treated as image-based
      }
    } else {
      // Image file
      extractedText = await ocrImage(buffer);
    }
  } catch (err) {
    console.error("[/api/process] Extraction error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "EXTRACTION_FAILED") {
      return errorResponse("EXTRACTION_FAILED", "Could not extract text from this file. The file may be corrupted or password-protected.");
    }
    return errorResponse("EXTRACTION_FAILED", "Text extraction failed. Please try again.");
  }

  // ── Guard: no readable text ───────────────────────────────────────────────
  const meaningfulText = extractedText.replace(/\s+/g, "").trim();
  if (meaningfulText.length < 30) {
    return errorResponse(
      "EXTRACTION_FAILED",
      "Couldn't find readable text in this document. The image may be blank or the text may be too small/unclear."
    );
  }

  // ── Summarization ─────────────────────────────────────────────────────────
  let summaryResult;
  try {
    summaryResult = await summarizeWithRetry(extractedText, summaryLength);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "SUMMARIZATION_FAILED") {
      return errorResponse(
        "SUMMARIZATION_FAILED",
        "The AI model failed to generate a summary. Please try again.",
        503
      );
    }
    return errorResponse("SUMMARIZATION_FAILED", "Summarization timed out. Please try a shorter document.", 503);
  }

  // ── Build response ────────────────────────────────────────────────────────
  const processingTimeMs = Date.now() - startTime;

  const result: ProcessResult = {
    extractedTextPreview: previewText(extractedText),
    extractedText,
    summary: summaryResult.summary,
    keyPoints: summaryResult.keyPoints,
    improvementSuggestions: summaryResult.improvementSuggestions,
    meta: {
      sourceType,
      pages,
      processingTimeMs,
    },
  };

  return NextResponse.json(result, { status: 200 });
}

// ─── Route segment config ─────────────────────────────────────────────────────
export const maxDuration = 60; // Vercel Pro allows up to 300s; free tier up to 60s
