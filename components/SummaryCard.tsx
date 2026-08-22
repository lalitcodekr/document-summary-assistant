"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";

interface SummaryCardProps {
  summary: string;
  isLoading?: boolean;
}

function SkeletonLines() {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Generating summary…" role="status">
      {[100, 90, 95, 85, 80].map((w, i) => (
        <div
          key={i}
          className="h-4 bg-white/[0.06] rounded-full"
          style={{ width: `${w}%` }}
        />
      ))}
      <div className="h-4 bg-white/[0.06] rounded-full w-3/5" />
      <p className="sr-only">Generating summary…</p>
    </div>
  );
}

export function SummaryCard({ summary, isLoading = false }: SummaryCardProps) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Subtle blue inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative p-7 sm:p-9">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-lg bg-white/[0.08] flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white/60" aria-hidden />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
            Executive Summary
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SkeletonLines />
            </motion.div>
          ) : (
            <motion.p
              key="text"
              className="text-white/80 leading-[1.85] text-base md:text-lg"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {summary}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
