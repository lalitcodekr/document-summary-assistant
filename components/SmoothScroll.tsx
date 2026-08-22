"use client";

import React, { useEffect } from "react";

/**
 * SmoothScroll — initializes Locomotive Scroll v5 (Lenis-based) globally.
 * - No wrapper div needed; Locomotive v5 targets the window by default.
 * - Dynamic import prevents SSR issues.
 * - Gracefully falls back to native scroll if the import fails.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let locomotiveInstance: { destroy(): void } | null = null;

    import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      locomotiveInstance = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.08,           // Lower = smoother / more lag; 0.08 is buttery
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
          syncTouch: false,     // Keep native touch feel on mobile
          infinite: false,
        },
        autoStart: true,
      });
    }).catch(() => {
      // Graceful fallback — native scroll works fine
      console.warn("Locomotive Scroll failed to load, using native scroll.");
    });

    return () => {
      locomotiveInstance?.destroy();
    };
  }, []);

  return <>{children}</>;
}
