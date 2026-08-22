/**
 * LLM summarization using Vercel AI SDK v6 + Google Gemini 2.0 Flash.
 * Uses generateObject for structured JSON output with a Zod schema.
 * Supports map-reduce for long documents.
 */

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import type { SummaryLength } from "@/types";
import { chunkText, needsChunking } from "./chunk-text";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const SummaryOutputSchema = z.object({
  summary: z.string().describe("The narrative summary of the document"),
  keyPoints: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3-5 key points from the document as bullet items"),
  improvementSuggestions: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("1-3 suggestions for improving the document"),
});

export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

// ─── Word targets per length ───────────────────────────────────────────────────

const WORD_TARGETS: Record<SummaryLength, number> = {
  short: 50,
  medium: 150,
  long: 300,
};

// ─── Model config ─────────────────────────────────────────────────────────────

function getModel() {
  // gemini-2.5-flash is the current recommended model.
  return google("gemini-2.5-flash");
}

// ─── Single-chunk summarization ───────────────────────────────────────────────

async function summarizeChunk(
  text: string,
  length: SummaryLength,
  isMapPhase = false
): Promise<string> {
  const wordTarget = WORD_TARGETS[length];
  const instruction = isMapPhase
    ? `Summarize this section of a document in ~${wordTarget} words. Preserve the most important factual content.`
    : `Summarize this text in approximately ${wordTarget} words. Write in clear, concise prose.`;

  const { object } = await generateObject({
    model: getModel(),
    schema: SummaryOutputSchema,
    prompt: `${instruction}\n\nDOCUMENT TEXT:\n${text}`,
    system: `You are an expert document analyst. Your job is to summarize documents clearly and extract key insights. 
Always respond with valid JSON matching the schema exactly.
- summary: ${wordTarget}-word narrative summary (±20 words)
- keyPoints: exactly 3-5 bullet-point key takeaways
- improvementSuggestions: 1-3 actionable improvements for the document`,
  });

  return object.summary;
}

// ─── Full summarization with map-reduce ───────────────────────────────────────

export async function summarizeDocument(
  text: string,
  length: SummaryLength
): Promise<SummaryOutput> {
  if (needsChunking(text)) {
    // MAP phase: summarize each chunk
    const chunks = chunkText(text);
    const chunkSummaries: string[] = [];

    for (const chunk of chunks) {
      const chunkSummary = await summarizeChunk(chunk, length, true);
      chunkSummaries.push(chunkSummary);
    }

    // REDUCE phase: summarize the summaries
    const combinedSummaries = chunkSummaries.join("\n\n---\n\n");
    return await summarizeFull(combinedSummaries, length);
  }

  return await summarizeFull(text, length);
}

async function summarizeFull(
  text: string,
  length: SummaryLength
): Promise<SummaryOutput> {
  const wordTarget = WORD_TARGETS[length];

  const { object } = await generateObject({
    model: getModel(),
    schema: SummaryOutputSchema,
    prompt: `Analyze this document and provide a structured summary.\n\nDOCUMENT:\n${text}`,
    system: `You are an expert document analyst. Summarize documents clearly and extract insights.
- summary: exactly ~${wordTarget} words (±20 words), written as clear prose
- keyPoints: exactly 3-5 bullet-point key takeaways, each 1-2 sentences
- improvementSuggestions: 1-3 specific, actionable suggestions to improve the document

Always respond with valid JSON. Be factual and precise.`,
  });

  return object;
}

// ─── Retry wrapper ────────────────────────────────────────────────────────────

/** Parse the retry-after delay (ms) from a Gemini 429 error body. */
function getRetryDelayMs(err: unknown): number {
  const DEFAULT_DELAY_MS = 10_000; // 10s fallback
  try {
    const errObj = err as any;
    const body = errObj?.responseBody || errObj?.cause?.responseBody;
    if (typeof body === "string") {
      const match = body.match(/\"retryDelay\":\s*\"(\d+)s\"/i);
      if (match) return (parseInt(match[1], 10) + 5) * 1000; // add 5s buffer
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_DELAY_MS;
}

export async function summarizeWithRetry(
  text: string,
  length: SummaryLength,
  maxRetries = 2
): Promise<SummaryOutput> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await summarizeDocument(text, length);
    } catch (err) {
      lastError = err;
      const statusCode = (err as Record<string, unknown>)?.statusCode;
      if (statusCode === 429) {
        // Honor the server-specified retry delay for quota errors
        const delayMs = getRetryDelayMs(err);
        console.warn(
          `[summarizeWithRetry] 429 quota exceeded. Waiting ${delayMs / 1000}s before retry ${attempt + 1}/${maxRetries}...`
        );
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      } else if (attempt < maxRetries) {
        // Exponential backoff for other transient errors
        await new Promise((r) => setTimeout(r, 2000 * Math.pow(2, attempt)));
      }
    }
  }

  console.error("[summarizeWithRetry] all retries failed:", lastError);
  throw new Error("SUMMARIZATION_FAILED");
}
