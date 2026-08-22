"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExtractedTextCollapsibleProps {
  text: string;
}

export function ExtractedTextCollapsible({ text }: ExtractedTextCollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.65 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 transition-all"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          fontSize: "0.85rem",
          color: open ? "#2d2d2d" : "rgba(45,45,45,0.5)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginBottom: 12,
          padding: 0,
        }}
        aria-expanded={open}
        aria-controls="extracted-text-content"
      >
        {open ? (
          <ChevronUp className="w-4 h-4" strokeWidth={2.5} aria-hidden />
        ) : (
          <ChevronDown className="w-4 h-4" strokeWidth={2.5} aria-hidden />
        )}
        {open ? "Hide" : "Show"} extracted text preview
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="extracted-text-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              style={{
                background: "#ffffff",
                border: "2px dashed #2d2d2d",
                borderRadius: "15px 255px 15px 225px / 225px 15px 255px 15px",
                boxShadow: "4px 4px 0px 0px rgba(45,45,45,0.2)",
                padding: "1.25rem 1.5rem",
                transform: "rotate(0.3deg)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Patrick Hand', cursive",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(45,45,45,0.45)",
                  marginBottom: "0.6rem",
                  fontWeight: 400,
                }}
              >
                📃 Extracted Text Preview
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  lineHeight: 1.65,
                  color: "rgba(45,45,45,0.55)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
