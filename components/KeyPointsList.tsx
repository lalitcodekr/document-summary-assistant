"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface KeyPointsListProps {
  points: string[];
}

export function KeyPointsList({ points }: KeyPointsListProps) {
  if (!points || points.length === 0) return null;

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="p-7">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-lg bg-white/[0.08] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white/60" aria-hidden />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
            Key Points
          </span>
        </div>

        <ul className="space-y-4" role="list" aria-label="Key points">
          {points.map((point, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.45 }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mt-0.5"
                aria-hidden
              >
                <span className="text-[10px] font-mono text-white/35 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-white/70 text-sm leading-[1.8]">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
