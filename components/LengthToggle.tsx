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

const WOBBLY_SM = "15px 225px 15px 255px / 255px 15px 225px 15px";
const WOBBLY_INNER = "225px 15px 225px 15px / 15px 225px 15px 255px";

export function LengthToggle({ value, onChange, disabled = false }: LengthToggleProps) {
  const selectedIndex = OPTIONS.findIndex((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1 w-full" style={{ fontFamily: "'Patrick Hand', cursive" }}>
      <label className="text-[#2d2d2d] font-bold text-lg mb-1" style={{ fontFamily: "'Kalam', cursive" }}>
        Summary Length
      </label>
      <div
        role="group"
        aria-label="Summary length"
        className={`relative flex items-center bg-white border-[3px] border-[#2d2d2d] p-1 gap-1 w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        style={{ 
          borderRadius: WOBBLY_SM,
          boxShadow: "3px 3px 0px 0px #2d2d2d"
        }}
      >
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 bottom-1 bg-[#fff9c4] border-2 border-[#2d2d2d]"
          style={{
            width: `calc((100% - 12px) / 3)`,
            left: `calc(${selectedIndex} * (100% - 12px) / 3 + 4px)`,
            borderRadius: WOBBLY_INNER
          }}
          layout
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />

        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            role="radio"
            aria-checked={value === opt.value}
            onClick={(e) => {
               e.stopPropagation();
               onChange(opt.value);
            }}
            disabled={disabled}
            className={`relative z-10 flex-1 flex flex-col items-center py-1 px-2 text-sm transition-colors cursor-pointer ${
              value === opt.value
                ? "text-[#2d2d2d] font-bold"
                : "text-[#2d2d2d]/60 hover:text-[#2d2d2d]"
            }`}
          >
            <span className="text-lg">{opt.label}</span>
            <span className="text-sm opacity-70 hidden sm:block">{opt.words}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
