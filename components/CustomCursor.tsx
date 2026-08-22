"use client";

import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Hide native cursor
    const style = document.createElement("style");
    style.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const interactive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        !!target.closest("[role='button']") ||
        target.hasAttribute("data-cursor-pointer");
      setIsPointer(interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      if (dot && ringEl) {
        // Dot: instant
        dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;

        // Ring: lerp towards dot for smooth lag
        ring.current.x += (pos.current.x - ring.current.x) * 0.12;
        ring.current.y += (pos.current.y - ring.current.y) * 0.12;
        ringEl.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.head.removeChild(style);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "difference" }}
      aria-hidden="true"
    >
      {/* Sharp center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white"
        style={{
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />

      {/* Outer ring — scales up on interactive elements */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-white"
        style={{
          width: isPointer ? 40 : 32,
          height: isPointer ? 40 : 32,
          marginLeft: isPointer ? -4 : 0,
          marginTop: isPointer ? -4 : 0,
          transition: "width 0.2s ease, height 0.2s ease, margin 0.2s ease",
          willChange: "transform",
          opacity: 0.8,
        }}
      />
    </div>
  );
}
