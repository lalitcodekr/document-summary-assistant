"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ImprovementsListProps {
  suggestions: string[];
}

export function ImprovementsList({ suggestions }: ImprovementsListProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Amber tinted inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative p-7">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400/70" aria-hidden />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/35">
            Improvement Suggestions
          </span>
        </div>

        <ul className="space-y-4" role="list" aria-label="Improvement suggestions">
          {suggestions.map((suggestion, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.45 }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mt-0.5"
                aria-hidden
              >
                <span className="text-[10px] font-mono text-amber-400/50 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-white/55 text-sm leading-[1.8]">{suggestion}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
