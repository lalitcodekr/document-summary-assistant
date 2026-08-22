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
    <div className="space-y-3" aria-label="Generating summary…" role="status">
      {[100, 88, 95, 78, 85].map((w, i) => (
        <div
          key={i}
          style={{
            height: 16,
            background: "rgba(45,45,45,0.1)",
            borderRadius: "8px 2px 8px 2px / 2px 8px 2px 8px",
            width: `${w}%`,
            animation: `pulse 1.4s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
      <p className="sr-only">Generating summary…</p>
    </div>
  );
}

export function SummaryCard({ summary, isLoading = false }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        background: "#ffffff",
        border: "3px solid #2d2d2d",
        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
        boxShadow: "6px 6px 0px 0px #2d2d2d",
        padding: "2rem 2.25rem",
        transform: "rotate(-0.4deg)",
      }}
    >
      {/* Tape decoration */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -14,
          left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 80,
          height: 26,
          background: "rgba(45,45,45,0.12)",
          borderRadius: "3px",
          border: "1px solid rgba(45,45,45,0.18)",
        }}
      />

      {/* Section label */}
      <div className="flex items-center gap-2 mb-5">
        <div
          style={{
            width: 28,
            height: 28,
            background: "#2d2d2d",
            borderRadius: "8px 2px 8px 2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText className="w-4 h-4" style={{ color: "#fdfbf7" }} aria-hidden />
        </div>
        <span
          style={{
            fontFamily: "'Kalam', cursive",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#2d2d2d",
            letterSpacing: "0.08em",
          }}
        >
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
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: "1.05rem",
              lineHeight: 1.85,
              color: "#2d2d2d",
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
          >
            {summary}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
