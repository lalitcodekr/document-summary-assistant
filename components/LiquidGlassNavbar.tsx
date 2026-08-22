"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, GitBranch, Menu, X, Info, HelpCircle } from "lucide-react";
import { LiquidGlassPill } from "./LiquidGlassPill";

interface LiquidGlassNavbarProps {
  onUploadClick?: () => void;
}

export function LiquidGlassNavbar({ onUploadClick }: LiquidGlassNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#how-it-works", label: "How it works", icon: HelpCircle },
    { href: "#supported-files", label: "Supported files", icon: FileText },
    { href: "https://github.com", label: "GitHub", icon: GitBranch, external: true },
  ];

  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      aria-label="Main navigation"
    >
      <div
        className={`liquid-glass rounded-full px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        {/* Logo / Wordmark */}
        <a
          href="/"
          className="flex items-center gap-3 text-white font-semibold text-lg select-none"
          aria-label="Document Summary Assistant home"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" aria-hidden />
          </div>
          <span className="hidden sm:inline font-semibold tracking-tight">
            DocSummary
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 ml-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onUploadClick}
            className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Upload
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-8 h-8 rounded-full liquid-glass flex items-center justify-center"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-white/70" aria-hidden />
            ) : (
              <Menu className="w-4 h-4 text-white/70" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mt-2 liquid-glass rounded-2xl py-2 overflow-hidden"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 px-5 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="w-4 h-4" aria-hidden />
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
