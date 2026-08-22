"use client";

import React from "react";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="!fixed bottom-0 left-0 w-full z-50 px-4 py-3 md:py-4 liquid-glass"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 text-center">
        {/* Main Line */}
        <p className="text-sm md:text-base text-[#2d2d2d] font-medium tracking-wide flex items-center gap-1.5">
          TL;DR: Made by{" "}
          <a
            href="https://github.com/Lalit-kumar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 transition-colors duration-300 font-bold"
          >
            Lalit
          </a>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            ❤️
          </motion.span>
        </p>

        <span className="hidden md:inline-block text-[#2d2d2d]/30">|</span>

        {/* Tagline */}
        <p className="text-xs md:text-sm text-[#2d2d2d]/70 font-light">
          Read less. Understand more.
        </p>

        <span className="hidden md:inline-block text-[#2d2d2d]/30">|</span>

        {/* Copyright */}
        <p className="text-[10px] md:text-xs text-[#2d2d2d]/50">
          &copy; {new Date().getFullYear()} P. Lalit Kumar
        </p>
      </div>
    </motion.footer>
  );
};
