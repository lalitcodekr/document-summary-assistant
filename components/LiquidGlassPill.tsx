"use client";

import React from "react";
import { motion } from "framer-motion";

interface LiquidGlassPillProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

export function LiquidGlassPill({
  children,
  onClick,
  href,
  className = "",
  variant = "secondary",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}: LiquidGlassPillProps) {
  const variantClass = {
    primary: "bg-white text-black font-medium hover:bg-white/90",
    secondary: "liquid-glass text-white hover:bg-white/5",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  }[variant];

  const baseClass = `liquid-glass rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2 transition-colors cursor-pointer select-none ${variantClass} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""} ${className}`;

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.04 },
    whileTap: disabled ? {} : { scale: 0.96 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.a href={href} className={baseClass} aria-label={ariaLabel} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
