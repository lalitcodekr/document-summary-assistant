"use client";

import React, { useEffect, useRef } from "react";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let direction: 1 | -1 = 1; // 1 = forward, -1 = reverse
    let raf: number;
    let lastTime = 0;

    const step = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;

      if (direction === 1) {
        // Playing forward — browser handles this via video.play()
        if (video.currentTime >= video.duration - 0.08) {
          direction = -1;
          video.pause();
        }
      } else {
        // Manually scrub backwards
        const next = video.currentTime - dt * 0.6; // 0.6× speed reverse
        if (next <= 0.04) {
          video.currentTime = 0;
          direction = 1;
          video.play().catch(() => {});
        } else {
          video.currentTime = next;
        }
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      lastTime = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    video.addEventListener("loadedmetadata", start);
    video.play().catch(() => {});

    if (video.readyState >= 1) start();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", start);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
      className="absolute inset-0 w-full h-full object-cover object-bottom"
      muted
      playsInline
      preload="auto"
      style={{ opacity: 0.6 }}
    />
  );
}
