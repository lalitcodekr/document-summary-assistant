"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSummaryData } from "@/lib/summary-storage";

interface SummaryPageNavbarProps {
  onNewDocument?: () => void;
}

export function SummaryPageNavbar({ onNewDocument }: SummaryPageNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewDocument = () => {
    clearSummaryData();
    if (onNewDocument) onNewDocument();
    router.push("/");
  };

  return (
    <motion.nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      aria-label="Summary page navigation"
    >
      <div
        style={{
          background: "#fdfbf7",
          border: "2px solid #2d2d2d",
          borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
          boxShadow: scrolled ? "6px 6px 0px 0px #2d2d2d" : "4px 4px 0px 0px #2d2d2d",
          padding: "0.6rem 1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "box-shadow 0.3s ease",
          fontFamily: "'Patrick Hand', cursive",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 select-none"
          style={{ color: "#2d2d2d", textDecoration: "none" }}
          aria-label="DocSummary home"
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#2d2d2d",
              borderRadius: "12px 3px 10px 3px / 3px 10px 3px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText className="w-5 h-5" style={{ color: "#fdfbf7" }} aria-hidden />
          </div>
          <span
            className="hidden sm:inline"
            style={{ fontFamily: "'Kalam', cursive", fontWeight: 700, fontSize: "1.2rem", color: "#2d2d2d" }}
          >
            DocSummary
          </span>
        </Link>

        {/* New Document button */}
        <button
          onClick={handleNewDocument}
          className="flex items-center gap-2 transition-all"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: "0.9rem",
            color: "#2d2d2d",
            background: "#ffffff",
            border: "2px solid #2d2d2d",
            borderRadius: "225px 15px 255px 15px / 15px 255px 15px 225px",
            boxShadow: "3px 3px 0px 0px #2d2d2d",
            padding: "0.35rem 1rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ff4d4d";
            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px 0px #2d2d2d";
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(1px, 1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.color = "#2d2d2d";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px 0px #2d2d2d";
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
          }}
          aria-label="Upload a new document"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
          <span className="hidden sm:inline">New Document</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </motion.nav>
  );
}
