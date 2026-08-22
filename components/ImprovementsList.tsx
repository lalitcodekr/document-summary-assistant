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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        background: "#fffde7",           /* warm yellow tint — suggestion "post-it" */
        border: "3px solid #2d2d2d",
        borderRadius: "225px 15px 255px 15px / 15px 255px 15px 225px",
        boxShadow: "6px 6px 0px 0px #2d2d2d",
        padding: "2rem 2.25rem",
        transform: "rotate(-0.5deg)",
      }}
    >
      {/* Tape decoration */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -14,
          left: 40,
          transform: "rotate(2deg)",
          width: 72,
          height: 24,
          background: "rgba(45,45,45,0.12)",
          borderRadius: "3px",
          border: "1px solid rgba(45,45,45,0.18)",
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          style={{
            width: 28,
            height: 28,
            background: "#ff4d4d",
            border: "2px solid #2d2d2d",
            borderRadius: "8px 2px 8px 2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "2px 2px 0px 0px #2d2d2d",
          }}
        >
          <Lightbulb className="w-4 h-4" style={{ color: "#fdfbf7" }} strokeWidth={2.5} aria-hidden />
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
          💡 Improvement Suggestions
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
              aria-hidden
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                background: "#ff4d4d",
                border: "2px solid #2d2d2d",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "2px 2px 0px 0px #2d2d2d",
                marginTop: 2,
                fontFamily: "'Kalam', cursive",
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "#ffffff",
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                fontFamily: "'Patrick Hand', cursive",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "#2d2d2d",
              }}
            >
              {suggestion}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
