// ─── Summary Length ───────────────────────────────────────────────────────────
export type SummaryLength = "short" | "medium" | "long";

// ─── Source Type ───────────────────────────────────────────────────────────────
export type SourceType = "pdf" | "image";

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ProcessResult {
  extractedTextPreview: string;
  extractedText: string; // full text, used for length-switching re-generation
  summary: string;
  keyPoints: string[];
  improvementSuggestions: string[];
  meta: {
    sourceType: SourceType;
    pages: number;
    processingTimeMs: number;
  };
}

// ─── API Error ────────────────────────────────────────────────────────────────
export type ErrorCode =
  | "UNSUPPORTED_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "EXTRACTION_FAILED"
  | "SUMMARIZATION_FAILED"
  | "TIMEOUT";

export interface ApiError {
  error: {
    code: ErrorCode;
    message: string;
  };
}

// ─── App State ────────────────────────────────────────────────────────────────
export type AppStage =
  | "idle"
  | "uploading"
  | "extracting"
  | "summarizing"
  | "done"
  | "error";

export interface AppState {
  stage: AppStage;
  file: File | null;
  summaryLength: SummaryLength;
  result: ProcessResult | null;
  error: { code: ErrorCode; message: string } | null;
}

// ─── Extraction Result ────────────────────────────────────────────────────────
export interface ExtractionResult {
  text: string;
  pages: number;
  sourceType: SourceType;
}

// ─── Summary Storage (sessionStorage) ────────────────────────────────────────
export interface SummaryStorageData {
  result: ProcessResult;
  documentName: string;
  extractedText: string; // kept for length-switching re-generation
  summaryLength: SummaryLength;
}
