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
        className="flex items-center gap-1.5 text-xs text-white/25 hover:text-white/45 transition-colors cursor-pointer mb-3"
        aria-expanded={open}
        aria-controls="extracted-text-content"
      >
        {open ? (
          <ChevronUp className="w-3.5 h-3.5" aria-hidden />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" aria-hidden />
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
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5">
              <p className="text-xs text-white/25 tracking-widest uppercase mb-3 font-semibold">
                Extracted Text Preview
              </p>
              <p className="text-white/35 text-xs leading-relaxed font-mono whitespace-pre-wrap break-words">
                {text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
