"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import Link from "next/link";

export function EmptySummaryState() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "#fdfbf7",
        backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      <motion.div
        className="flex flex-col items-center text-center"
        style={{ maxWidth: 440 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated icon container */}
        <motion.div
          style={{
            width: 88,
            height: 88,
            background: "#ffffff",
            border: "3px solid #2d2d2d",
            borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            boxShadow: "6px 6px 0px 0px #2d2d2d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="w-10 h-10" style={{ color: "#2d2d2d" }} strokeWidth={2.5} aria-hidden />
        </motion.div>

        {/* Decorative doodle line */}
        <div
          aria-hidden
          style={{
            width: 60,
            height: 2,
            background: "#2d2d2d",
            borderRadius: 2,
            marginBottom: "1.2rem",
            opacity: 0.25,
            transform: "rotate(-2deg)",
          }}
        />

        <h1
          style={{
            fontFamily: "'Kalam', cursive",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            color: "#2d2d2d",
            lineHeight: 1.2,
            marginBottom: "0.9rem",
          }}
        >
          No document to summarize.
        </h1>
        <p
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "rgba(45,45,45,0.6)",
            marginBottom: "2.5rem",
          }}
        >
          Upload a PDF or scanned image and your AI‑generated summary will appear here.
        </p>

        {/* CTA button */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-all"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: "1.05rem",
            color: "#2d2d2d",
            background: "#ffffff",
            border: "3px solid #2d2d2d",
            borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            boxShadow: "6px 6px 0px 0px #2d2d2d",
            padding: "0.65rem 1.75rem",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#ff4d4d";
            (e.currentTarget as HTMLElement).style.color = "#ffffff";
            (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2d2d2d";
            (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#ffffff";
            (e.currentTarget as HTMLElement).style.color = "#2d2d2d";
            (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0px 0px #2d2d2d";
            (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
          }}
          aria-label="Upload a document to get started"
        >
          <Upload className="w-4 h-4" strokeWidth={2.5} aria-hidden />
          ✏️ Upload Document
        </Link>

        {/* Decorative squiggle below */}
        <div aria-hidden className="mt-10 opacity-20">
          <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12 C12 4, 22 20, 32 12 S52 4, 62 12 S82 20, 92 12 S112 4, 118 12"
              stroke="#2d2d2d"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
