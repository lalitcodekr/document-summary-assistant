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

const OPTIONS: { value: SummaryLength; label: string; hint: string }[] = [
  { value: "short", label: "Short", hint: "~50 words" },
  { value: "medium", label: "Medium", hint: "~150 words" },
  { value: "long", label: "Long", hint: "~300 words" },
];

export function SummaryLengthSelector({
  value,
  onChange,
  extractedText,
  isLoading,
  onLoadingChange,
  onError,
}: SummaryLengthSelectorProps) {
  const selectedIndex = OPTIONS.findIndex((o) => o.value === value);

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
      <div
        role="group"
        aria-label="Summary length"
        className={`relative inline-flex items-center liquid-glass rounded-full p-1 gap-1 ${
          isLoading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-white/[0.12] border border-white/[0.15]"
          style={{
            width: `calc((100% - 8px) / 3)`,
            left: `calc(${selectedIndex} * (100% - 8px) / 3 + 4px)`,
          }}
          layout
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />

        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => handleSelect(opt.value)}
            disabled={isLoading}
            className={`relative z-10 flex flex-col items-center py-1.5 px-5 sm:px-6 rounded-full text-xs transition-colors cursor-pointer ${
              value === opt.value
                ? "text-white"
                : "text-white/45 hover:text-white/75"
            }`}
          >
            <span className="font-medium text-sm">{opt.label}</span>
            <span className="text-[10px] opacity-60 hidden sm:block">{opt.hint}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
