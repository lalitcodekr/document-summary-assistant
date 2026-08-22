"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — a sentinel-green radial gradient orb that smoothly follows
 * the mouse cursor using RAF + lerp interpolation. GPU-composited via
 * `transform` (no `top`/`left` thrashing).
 */
export function CursorGlow() {
  const orbRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const raf = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      // Smooth lerp: 6% per frame (~60fps → ~300ms to reach target)
      current.current.x += (mouse.current.x - current.current.x) * 0.06;
      current.current.y += (mouse.current.y - current.current.y) * 0.06;

      const orb = orbRef.current;
      if (orb) {
        // Offset so the glow is centered on cursor (orb is 600px wide/tall)
        orb.style.transform = `translate(${current.current.x - 300}px, ${current.current.y - 300}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={orbRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, hsla(119, 99%, 46%, 0.13) 0%, hsla(119, 99%, 46%, 0.05) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
        filter: "blur(48px)",
        mixBlendMode: "screen",
      }}
    />
  );
}
