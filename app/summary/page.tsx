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

export default function SummaryPage() {
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [documentName, setDocumentName] = useState("Document");
  const [extractedText, setExtractedText] = useState("");
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

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

  return (
    <div
      className="hd-page min-h-screen"
      style={{
        background: "#fdfbf7",
        backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      {/* Decorative top tape strip */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "repeating-linear-gradient(90deg, #2d2d2d 0px, #2d2d2d 32px, transparent 32px, transparent 40px)",
          zIndex: 100,
          opacity: 0.15,
        }}
      />

      {/* SSR skeleton */}
      {!mounted && (
        <div className="min-h-[40vh]" aria-hidden="true" />
      )}

      {/* Empty state */}
      {mounted && !result && <EmptySummaryState />}

      {/* Document summary results */}
      {mounted && result && (
        <div className="relative">
          {/* Sticky summary navbar */}
          <SummaryPageNavbar />

          {/* Main content */}
          <main
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24"
            aria-label="Document summary"
          >
            <motion.div
              className="flex flex-col gap-7"
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

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#ff4d4d", fontFamily: "'Patrick Hand', cursive" }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                      <span>{error}</span>
                      <button
                        onClick={() => setError("")}
                        className="ml-1 hover:opacity-70 transition-opacity"
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

              {/* Key points + Improvements */}
              <AnimatePresence mode="wait">
                {!isLoading && (
                  <motion.div
                    key={summaryLength + "-points"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-7"
                  >
                    <KeyPointsList points={result.keyPoints} />
                    <ImprovementsList suggestions={result.improvementSuggestions} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              {!isLoading && (
                <SummaryActions result={result} documentName={documentName} />
              )}

              {/* Extracted text collapsible */}
              {result.extractedTextPreview && !isLoading && (
                <ExtractedTextCollapsible text={result.extractedTextPreview} />
              )}

              {/* New document CTA (bottom) */}
              {!isLoading && (
                <motion.div
                  className="flex justify-center pt-8"
                  style={{
                    borderTop: "2px dashed #2d2d2d",
                    borderTopColor: "rgba(45,45,45,0.25)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <a
                    href="/"
                    className="flex items-center gap-2 transition-all hover:scale-105"
                    style={{
                      fontFamily: "'Patrick Hand', cursive",
                      fontSize: "1rem",
                      color: "#2d2d2d",
                      background: "#ffffff",
                      border: "2px solid #2d2d2d",
                      borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                      boxShadow: "4px 4px 0px 0px #2d2d2d",
                      padding: "0.6rem 1.5rem",
                      textDecoration: "none",
                    }}
                    aria-label="Analyze another document"
                  >
                    <RotateCcw className="w-4 h-4" strokeWidth={2.5} aria-hidden />
                    ✏️ Analyse another document
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
