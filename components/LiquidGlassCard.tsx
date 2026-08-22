"use client";

import React from "react";
import { motion } from "framer-motion";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  rounded?: "xl" | "2xl" | "3xl" | "full";
  animate?: boolean;
  delay?: number;
}

export function LiquidGlassCard({
  children,
  className = "",
  rounded = "2xl",
  animate = true,
  delay = 0,
}: LiquidGlassCardProps) {
  const roundedClass = {
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[rounded];

  const baseClass = `liquid-glass ${roundedClass} ${className}`;

  if (!animate) {
    return <div className={baseClass}>{children}</div>;
  }

  return (
    <motion.div
      className={baseClass}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
