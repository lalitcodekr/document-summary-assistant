"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import Link from "next/link";

export function EmptySummaryState() {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black flex flex-col items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 liquid-glass rounded-3xl flex items-center justify-center mb-8"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="w-9 h-9 text-white/40" aria-hidden />
        </motion.div>

        <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
          No document to summarize.
        </h1>
        <p className="text-white/45 text-base leading-relaxed mb-10">
          Upload a PDF or scanned image and your AI-generated summary will appear here.
        </p>

        <Link
          href="/"
          className="flex items-center gap-2 liquid-glass rounded-full px-7 py-3.5 text-white font-medium hover:bg-white/5 transition-all text-sm"
          aria-label="Upload a document to get started"
        >
          <Upload className="w-4 h-4" aria-hidden />
          Upload Document
        </Link>
      </motion.div>
    </div>
  );
}
