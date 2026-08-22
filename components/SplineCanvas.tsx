"use client";

/**
 * SplineCanvas — the actual Spline renderer.
 * This module is a true "leaf" client component that imports @splinetool/react-spline.
 * It is never imported directly; it is only dynamically loaded by SplineBackground.
 */

import Spline from "@splinetool/react-spline";

const SCENE_URL =
  "https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode";

export default function SplineCanvas() {
  return (
    <Spline
      scene={SCENE_URL}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
