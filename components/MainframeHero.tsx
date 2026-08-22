"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { AppStage, ErrorCode, ProcessResult, SummaryLength } from "@/types";
import { saveSummaryData } from "@/lib/summary-storage";
import { UploadZone } from "./UploadZone";
import { CursorGlow } from "./CursorGlow";

// ─────────────────────────────────────────────
// 1. BACKGROUND VIDEO (3D MODEL)
// ─────────────────────────────────────────────
const SENSITIVITY = 0.8;
const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef(false);
  const targetTimeRef = useRef(0);

  // Desktop mouse scrub hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;

    const doSeek = () => {
      if (!video.duration) return;
      video.currentTime = targetTimeRef.current;
    };

    const onSeeked = () => {
      pendingSeek.current = false;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
        pendingSeek.current = true;
        doSeek();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!video.duration || window.innerWidth < 1024) return;
      const currentX = e.clientX;
      if (prevX === null) {
        prevX = currentX;
        return;
      }
      const delta = currentX - prevX;
      prevX = currentX;

      targetTimeRef.current = Math.max(
        0,
        Math.min(
          video.duration,
          targetTimeRef.current +
          (delta / window.innerWidth) * SENSITIVITY * video.duration
        )
      );

      if (!pendingSeek.current) {
        pendingSeek.current = true;
        doSeek();
      }
    };

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  // Mobile autoplay hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hand-drawn paper texture background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: "#fdfbf7",
          backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* 3D Model / Video Overlay */}
      <div className="order-last lg:order-none relative lg:fixed lg:inset-0 lg:z-1 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom mix-blend-multiply opacity-80"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
      {/* Paper-edge vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(45,45,45,0.08) 100%)",
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// 2. TYPEWRITER HOOK
// ─────────────────────────────────────────────
const CYCLING_WORDS = ["understood.", "analyzed.", "summarized.", "simplified."];

function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 600
): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let index = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─────────────────────────────────────────────
// 3. MAIN HERO COMPONENT
// ─────────────────────────────────────────────
export function MainframeHero() {
  const router = useRouter();
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  // App state
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<AppStage>("idle");
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { displayed, done } = useTypewriter("Every document,\n", 38, 600);
  const [wordIndex, setWordIndex] = useState(0);

  // Start word cycling once typewriter finishes
  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, 2000);
    return () => clearInterval(id);
  }, [done]);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setStage("idle");
    setErrorCode(null);
    setErrorMessage(null);
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
    setStage("idle");
    setErrorCode(null);
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file) return;

    setStage("uploading");
    setErrorCode(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("summaryLength", summaryLength);

      // Transition to extracting state after a short delay
      const extractingTimer = setTimeout(() => setStage("extracting"), 1500);

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      clearTimeout(extractingTimer);
      setStage("summarizing");

      const data = await res.json();

      if (!res.ok) {
        const apiErr = data as { error: { code: ErrorCode; message: string } };
        setStage("error");
        setErrorCode(apiErr.error?.code ?? "SUMMARIZATION_FAILED");
        setErrorMessage(apiErr.error?.message ?? "Something went wrong.");
        return;
      }

      const result = data as ProcessResult;

      saveSummaryData({
        result,
        documentName: file.name,
        extractedText: result.extractedText,
        summaryLength,
      });

      router.push("/summary");
    } catch {
      setStage("error");
      setErrorCode("SUMMARIZATION_FAILED");
      setErrorMessage(
        "We couldn't connect to the server. Please check your connection and try again."
      );
    }
  }, [file, summaryLength, router]);

  return (
    <div className="relative text-[#2d2d2d] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen font-sans">
      <CursorGlow />
      <HeroBackgroundVideo />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center mt-12 md:mt-0"
        >
          {/* Decorative squiggly arrow pointing down, visible on desktop */}
          <div className="hidden lg:block absolute left-[-80px] top-[180px] opacity-60">
            <svg width="120" height="150" viewBox="0 0 120 150" fill="none" className="stroke-[#2d2d2d] stroke-[3] -rotate-12">
              <path d="M10,20 Q60,10 90,80 T110,140" strokeLinecap="round" strokeDasharray="8 8" fill="none" />
              <path d="M90,120 L110,140 L120,110" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.6 }}
            className="mb-8 w-full max-w-3xl"
          >
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#2d2d2d] leading-[1.1] select-none whitespace-pre-wrap"
              style={{ fontFamily: "Kalam, cursive" }}
            >
              {done ? (
                <>
                  <span className="whitespace-pre-wrap">{"Every document,\n"}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0, y: 12, rotate: 2 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, y: -12, rotate: -2 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="inline-block text-[#ff4d4d]"
                    >
                      {CYCLING_WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </>
              ) : (
                <span className="whitespace-pre-wrap">
                  {displayed}
                  <span
                    aria-hidden="true"
                    className="inline-block w-[4px] h-[1em] bg-[#2d2d2d] align-middle ml-[4px] animate-blink rounded-full"
                  />
                </span>
              )}
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10 max-w-xl"
          >
            <p
              className="text-xl md:text-2xl text-[#2d2d2d]/80 leading-relaxed"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              Upload a PDF or scanned image.
              <br className="hidden sm:inline" />
              Get a clear summary and key points in seconds.
            </p>
          </motion.div>

          {/* Upload zone */}
          <motion.div
            ref={uploadZoneRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <UploadZone
              file={file}
              stage={stage}
              summaryLength={summaryLength}
              errorCode={errorCode}
              errorMessage={errorMessage}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              onLengthChange={setSummaryLength}
              onSubmit={handleSubmit}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
