"use client";

/**
 * SplineBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed full-screen background layer that renders the Spline 3D scene:
 *   - Floating animated 3D cubes
 *   - Cursor-reactive vivid green glow (built into the Spline scene)
 *
 * Layering contract:
 *   z-index 0  → this canvas  (receives pointer events for the interactive glow)
 *   z-index 10 → page content (sits on top, pointer-events: none on wrappers,
 *                               pointer-events: auto re-enabled on interactive els)
 *
 * Mouse-forward layer: A transparent full-screen div sits at z-index 5 with
 * pointer-events: none so it doesn't block content clicks, but we attach a
 * global mousemove listener that re-dispatches a synthetic PointerEvent clone
 * directly onto the Spline <canvas> element so the cursor-glow always responds.
 *
 * SplineCanvas is dynamically imported (ssr: false) so that @splinetool/runtime
 * is never evaluated by the Node/Turbopack server build.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load the isolated leaf component — never evaluated server-side
const SplineCanvas = dynamic(() => import("./SplineCanvas"), {
  ssr: false,
  loading: () => null,
});

export function SplineBackground() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Defer rendering until after hydration to avoid SSR/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Forward mouse events to the Spline canvas so the cursor-glow works
  // even when content overlays sit above the canvas (z-index > 0).
  useEffect(() => {
    if (!mounted) return;

    // Poll for the canvas — Spline loads asynchronously
    let splineCanvas: HTMLCanvasElement | null = null;

    const findCanvas = () => {
      if (!splineCanvas) {
        splineCanvas = containerRef.current?.querySelector("canvas") ?? null;
      }
    };

    const forwardMouse = (e: MouseEvent) => {
      findCanvas();
      if (!splineCanvas) return;

      // Clone the event and dispatch it directly to the canvas
      const forwarded = new MouseEvent(e.type, {
        bubbles: false,
        cancelable: false,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        movementX: e.movementX,
        movementY: e.movementY,
        buttons: e.buttons,
        button: e.button,
        view: window,
      });
      splineCanvas.dispatchEvent(forwarded);
    };

    window.addEventListener("mousemove", forwardMouse, { passive: true });

    return () => {
      window.removeEventListener("mousemove", forwardMouse);

    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        // Dark base colour visible while the Spline scene loads
        background: "hsl(0 0% 8%)",
        // Keep pointer-events auto on the background itself so Spline
        // can receive forwarded events from the window listener above.
        pointerEvents: "auto",
        // GPU compositing hints for smooth rendering
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <Suspense fallback={null}>
        <SplineCanvas />
      </Suspense>
    </div>
  );
}
