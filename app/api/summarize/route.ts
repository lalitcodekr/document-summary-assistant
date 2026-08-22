import { NextRequest, NextResponse } from "next/server";
import type { ApiError, ErrorCode, SummaryLength } from "@/types";
import { summarizeWithRetry } from "@/lib/summarize";

// ─── Helper ───────────────────────────────────────────────────────────────────

function errorResponse(code: ErrorCode, message: string, status = 400): NextResponse<ApiError> {
  return NextResponse.json({ error: { code, message } }, { status });
}

// ─── Route Handler ────────────────────────────────────────────────────────────
// POST /api/summarize
// Body: JSON { text: string, summaryLength: SummaryLength }
// Used by the summary page for length switching without re-uploading the file.

export async function POST(req: NextRequest) {
  let body: { text?: string; summaryLength?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("SUMMARIZATION_FAILED", "Invalid JSON body.", 400);
  }

  const { text, summaryLength: lengthRaw } = body;

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return errorResponse("SUMMARIZATION_FAILED", "No valid text provided.", 400);
  }

  const summaryLength: SummaryLength =
    lengthRaw === "short" || lengthRaw === "long" ? lengthRaw : "medium";

  try {
    const result = await summarizeWithRetry(text, summaryLength);
    return NextResponse.json({
      summary: result.summary,
      keyPoints: result.keyPoints,
      improvementSuggestions: result.improvementSuggestions,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "SUMMARIZATION_FAILED") {
      return errorResponse(
        "SUMMARIZATION_FAILED",
        "The AI model failed to generate a summary. Please try again.",
        503
      );
    }
    return errorResponse("SUMMARIZATION_FAILED", "Summarization failed. Please try again.", 503);
  }
}

export const maxDuration = 60;
