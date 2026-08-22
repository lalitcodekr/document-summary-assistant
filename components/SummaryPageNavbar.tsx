"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Plus } from "lucide-react";
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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      aria-label="Summary page navigation"
    >
      <div
        className={`liquid-glass rounded-full px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        {/* Logo / Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white font-semibold text-lg select-none"
          aria-label="DocSummary home"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" aria-hidden />
          </div>
          <span className="hidden sm:inline font-semibold tracking-tight">
            DocSummary
          </span>
        </Link>

        {/* New Document CTA */}
        <button
          onClick={handleNewDocument}
          className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white liquid-glass rounded-full px-5 py-2 transition-all hover:bg-white/5"
          aria-label="Upload a new document"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          <span className="hidden sm:inline">New Document</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </motion.nav>
  );
}
