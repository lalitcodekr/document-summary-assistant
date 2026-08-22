"use client";

import React from "react";
import { motion } from "framer-motion";
import type { SummaryLength } from "@/types";

interface LengthToggleProps {
  value: SummaryLength;
  onChange: (value: SummaryLength) => void;
  disabled?: boolean;
}

const OPTIONS: { value: SummaryLength; label: string; words: string }[] = [
  { value: "short", label: "Short", words: "~50 words" },
  { value: "medium", label: "Medium", words: "~150 words" },
  { value: "long", label: "Long", words: "~300 words" },
];

export function LengthToggle({ value, onChange, disabled = false }: LengthToggleProps) {
  const selectedIndex = OPTIONS.findIndex((o) => o.value === value);

  return (
    <div
      role="group"
      aria-label="Summary length"
      className={`relative flex items-center liquid-glass rounded-full p-1 gap-1 ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-black/10"
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
          onClick={() => onChange(opt.value)}
          disabled={disabled}
          className={`relative z-10 flex-1 flex flex-col items-center py-1.5 px-3 rounded-full text-xs transition-colors cursor-pointer ${
            value === opt.value
              ? "text-black"
              : "text-black/50 hover:text-black/80"
          }`}
        >
          <span className="font-medium">{opt.label}</span>
          <span className="text-[10px] opacity-70">{opt.words}</span>
        </button>
      ))}
    </div>
  );
}
