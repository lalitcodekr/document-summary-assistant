"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { ProcessResult, SummaryLength } from "@/types";
import { loadSummaryData, saveSummaryData } from "@/lib/summary-storage";
import { SummaryPageNavbar } from "@/components/SummaryPageNavbar";
import { DocumentHeader } from "@/components/DocumentHeader";
import { SummaryLengthSelector } from "@/components/SummaryLengthSelector";
import { SummaryCard } from "@/components/SummaryCard";
import { KeyPointsList } from "@/components/KeyPointsList";
import { ImprovementsList } from "@/components/ImprovementsList";
import { SummaryActions } from "@/components/SummaryActions";
import { ExtractedTextCollapsible } from "@/components/ExtractedTextCollapsible";
import { EmptySummaryState } from "@/components/EmptySummaryState";
import { SplineBackground } from "@/components/SplineBackground";

export default function SummaryPage() {
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [documentName, setDocumentName] = useState("Document");
  const [extractedText, setExtractedText] = useState("");
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Load from sessionStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const data = loadSummaryData();
    if (data) {
      setResult(data.result);
      setDocumentName(data.documentName);
      setExtractedText(data.extractedText);
      setSummaryLength(data.summaryLength);
    }
  }, []);

  const handleLengthChange = useCallback(
    (
      newLength: SummaryLength,
      newData: Pick<ProcessResult, "summary" | "keyPoints" | "improvementSuggestions">
    ) => {
      setSummaryLength(newLength);
      setResult((prev) => {
        if (!prev) return prev;
        const updated: ProcessResult = {
          ...prev,
          summary: newData.summary,
          keyPoints: newData.keyPoints,
          improvementSuggestions: newData.improvementSuggestions,
        };
        // Persist updated result to sessionStorage
        saveSummaryData({
          result: updated,
          documentName,
          extractedText,
          summaryLength: newLength,
        });
        return updated;
      });
    },
    [documentName, extractedText]
  );

  // ── Always render; show hero regardless of document state ──────────────
  // (early returns would prevent SentinelHeroSection from appearing)

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--hero-bg))" }}>
      {/* ── Interactive Spline 3D background — fixed, always present ─────── */}
      {mounted && <SplineBackground />}

      {/* ── SSR skeleton: not mounted yet ─────────────────────────────────── */}
      {!mounted && (
        <div className="min-h-[40vh] bg-hero-bg" aria-hidden="true" />
      )}

      {/* ── Empty state: no document uploaded ─────────────────────────────── */}
      {/* Wrapper ensures EmptySummaryState sits above the Spline canvas (z-0) */}
      {mounted && !result && (
        <div className="relative" style={{ zIndex: 10, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>
            <EmptySummaryState />
          </div>
        </div>
      )}

      {/* ── Document summary results ───────────────────────────────────────── */}
      {mounted && result && (
        <div className="relative overflow-x-hidden" style={{ zIndex: 10, pointerEvents: "none" }}>
          {/* Soft bottom-edge green accent — purely decorative, no pointer events */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background:
                "radial-gradient(ellipse 70% 50% at 50% 100%, hsla(119, 99%, 46%, 0.04) 0%, transparent 65%)",
            }}
          />

          {/* Sticky summary navbar */}
          <div style={{ pointerEvents: "auto" }}>
            <SummaryPageNavbar />
          </div>

          {/* Main content */}
          <main
            className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24"
            aria-label="Document summary"
            style={{ pointerEvents: "auto" }}
          >
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Document header */}
              <DocumentHeader documentName={documentName} result={result} />

              {/* Length selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <SummaryLengthSelector
                  value={summaryLength}
                  onChange={handleLengthChange}
                  extractedText={extractedText}
                  isLoading={isLoading}
                  onLoadingChange={setIsLoading}
                  onError={setError}
                />

                {/* Inline error for length switching */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="flex items-center gap-2 text-xs text-white/60"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400/70" aria-hidden />
                      <span>{error}</span>
                      <button
                        onClick={() => setError("")}
                        className="text-white/40 hover:text-white/70 transition-colors ml-1"
                        aria-label="Dismiss error"
                      >
                        ×
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Executive summary card */}
              <SummaryCard summary={result.summary} isLoading={isLoading} />

              {/* Key points */}
              <AnimatePresence mode="wait">
                {!isLoading && (
                  <motion.div
                    key={summaryLength + "-points"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <KeyPointsList points={result.keyPoints} />

                    {/* Improvement suggestions */}
                    <ImprovementsList suggestions={result.improvementSuggestions} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions row */}
              {!isLoading && (
                <SummaryActions result={result} documentName={documentName} />
              )}

              {/* Extracted text (collapsible) */}
              {result.extractedTextPreview && !isLoading && (
                <ExtractedTextCollapsible text={result.extractedTextPreview} />
              )}

              {/* New document CTA (bottom) */}
              {!isLoading && (
                <motion.div
                  className="flex justify-center pt-6 border-t border-white/[0.06]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <a
                    href="/"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
                    aria-label="Analyze another document"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden />
                    Analyze another document
                  </a>
                </motion.div>
              )}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
}
