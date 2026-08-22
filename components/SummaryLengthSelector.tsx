"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import type { SummaryLength, ProcessResult } from "@/types";

interface SummaryLengthSelectorProps {
  value: SummaryLength;
  onChange: (
    length: SummaryLength,
    result: Pick<ProcessResult, "summary" | "keyPoints" | "improvementSuggestions">
  ) => void;
  extractedText: string;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
  onError: (message: string) => void;
}

const OPTIONS: { value: SummaryLength; label: string; hint: string; emoji: string }[] = [
  { value: "short", label: "Short", hint: "~50 words", emoji: "✂️" },
  { value: "medium", label: "Medium", hint: "~150 words", emoji: "📝" },
  { value: "long", label: "Long", hint: "~300 words", emoji: "📖" },
];

const RADII = [
  "255px 15px 225px 15px / 15px 225px 15px 255px",
  "15px 255px 15px 225px / 225px 15px 255px 15px",
  "225px 15px 255px 15px / 15px 255px 15px 225px",
];

export function SummaryLengthSelector({
  value,
  onChange,
  extractedText,
  isLoading,
  onLoadingChange,
  onError,
}: SummaryLengthSelectorProps) {
  const handleSelect = useCallback(
    async (length: SummaryLength) => {
      if (length === value || isLoading) return;

      onLoadingChange(true);
      onError("");

      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: extractedText, summaryLength: length }),
          signal: AbortSignal.timeout(90_000),
        });

        const data = await res.json();

        if (!res.ok) {
          const msg =
            data?.error?.message ?? "Failed to generate summary. Please try again.";
          onError(msg);
          onLoadingChange(false);
          return;
        }

        onChange(length, data);
      } catch (err) {
        const isTimeout = err instanceof Error && err.name === "TimeoutError";
        onError(
          isTimeout
            ? "Request timed out. Please try again."
            : "Something went wrong. Please try again."
        );
      } finally {
        onLoadingChange(false);
      }
    },
    [value, isLoading, extractedText, onChange, onLoadingChange, onError]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
    >
      <div className="flex items-center gap-2" style={{ opacity: isLoading ? 0.55 : 1, pointerEvents: isLoading ? "none" : "auto" }}>
        {/* Label */}
        <span
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: "0.9rem",
            color: "rgba(45,45,45,0.6)",
            marginRight: 4,
            whiteSpace: "nowrap",
          }}
        >
          Length:
        </span>

        {/* Pill buttons */}
        <div
          role="group"
          aria-label="Summary length"
          className="flex items-center gap-2"
        >
          {OPTIONS.map((opt, i) => {
            const isActive = value === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={isActive}
                onClick={() => handleSelect(opt.value)}
                disabled={isLoading}
                style={{
                  fontFamily: "'Patrick Hand', cursive",
                  fontSize: "0.85rem",
                  color: isActive ? "#fdfbf7" : "#2d2d2d",
                  background: isActive ? "#2d2d2d" : "#ffffff",
                  border: "2px solid #2d2d2d",
                  borderRadius: RADII[i],
                  boxShadow: isActive ? "3px 3px 0px 0px rgba(45,45,45,0.4)" : "3px 3px 0px 0px #2d2d2d",
                  padding: "0.3rem 0.9rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.1s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#e5e0d8";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px 0px #2d2d2d";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translate(1px, 1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px 0px #2d2d2d";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                  }
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </span>
                <span
                  className="hidden sm:block"
                  style={{ fontSize: "0.7rem", opacity: 0.55 }}
                >
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
