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
      {/* Section label sticky-note tag */}
      <div className="flex items-center gap-3 mb-5">
        <span
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: "0.75rem",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: "#fff9c4",
            color: "#2d2d2d",
            border: "2px solid #2d2d2d",
            borderRadius: "3px 12px 3px 12px / 12px 3px 12px 3px",
            boxShadow: "2px 2px 0px 0px #2d2d2d",
            padding: "2px 10px",
            display: "inline-block",
            transform: "rotate(-1deg)",
          }}
        >
          📄 Document Summary
        </span>
      </div>

      {/* Dashed divider — hand-drawn style */}
      <div
        aria-hidden
        style={{
          borderTop: "2px dashed rgba(45,45,45,0.2)",
          marginBottom: "1.25rem",
        }}
      />

      {/* Document name */}
      <h1
        style={{
          fontFamily: "'Kalam', cursive",
          fontWeight: 700,
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          color: "#2d2d2d",
          lineHeight: 1.25,
          marginBottom: "0.85rem",
          wordBreak: "break-word",
        }}
      >
        {documentName}
      </h1>

      {/* Metadata pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          {
            icon: isImage ? (
              <ImageIcon className="w-3 h-3" aria-hidden />
            ) : (
              <FileText className="w-3 h-3" aria-hidden />
            ),
            label: isImage ? "Image · OCR" : "PDF",
          },
          ...(pages > 0
            ? [{ icon: <Layers className="w-3 h-3" aria-hidden />, label: `${pages} page${pages !== 1 ? "s" : ""}` }]
            : []),
          {
            icon: <Clock className="w-3 h-3" aria-hidden />,
            label: `⚡ ${formatTime(processingTimeMs)}`,
          },
        ].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: "0.8rem",
              color: "#2d2d2d",
              background: "#ffffff",
              border: "2px solid #2d2d2d",
              borderRadius: i % 2 === 0
                ? "255px 15px 225px 15px / 15px 225px 15px 255px"
                : "15px 255px 15px 225px / 225px 15px 255px 15px",
              boxShadow: "2px 2px 0px 0px #2d2d2d",
              padding: "2px 10px",
            }}
          >
            {item.icon}
            {item.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
