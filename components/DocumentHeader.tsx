"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Layers, Clock } from "lucide-react";
import type { ProcessResult } from "@/types";

interface DocumentHeaderProps {
  documentName: string;
  result: ProcessResult;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function DocumentHeader({ documentName, result }: DocumentHeaderProps) {
  const { sourceType, pages, processingTimeMs } = result.meta;
  const isImage = sourceType === "image";

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Section label */}
      <p className="text-xs tracking-[0.25em] uppercase text-white/25 mb-4 font-semibold">
        Document Summary
      </p>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/10 via-white/20 to-transparent mb-6" />

      {/* Document name */}
      <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-tight mb-3 break-words leading-tight">
        {documentName}
      </h1>

      {/* Metadata pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1">
          {isImage ? (
            <ImageIcon className="w-3 h-3" aria-hidden />
          ) : (
            <FileText className="w-3 h-3" aria-hidden />
          )}
          {isImage ? "Image · OCR processed" : "PDF"}
        </span>

        {pages > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1">
            <Layers className="w-3 h-3" aria-hidden />
            {pages} page{pages !== 1 ? "s" : ""}
          </span>
        )}

        <span className="flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1">
          <Clock className="w-3 h-3" aria-hidden />
          Processed in {formatTime(processingTimeMs)}
        </span>
      </div>
    </motion.div>
  );
}
