"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, GitBranch, HelpCircle, Menu, X } from "lucide-react";
import type { AppStage, ErrorCode, ProcessResult, SummaryLength } from "@/types";
import { saveSummaryData } from "@/lib/summary-storage";
import { UploadZone } from "./UploadZone";

// ─────────────────────────────────────────────
// 1. BACKGROUND VIDEO (3D MODEL) — UNCHANGED
//    Mouse scrubs the video frame on desktop.
//    Mobile autoplays on loop.
// ─────────────────────────────────────────────
function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop mouse-scrub hook — PRESERVED EXACTLY
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let targetTime = 0;
    let prevX: number | null = null;

    const onSeeked = () => {
      // intentional no-op — ensures smooth frame tracking
    };

    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return; // disable on mobile
      if (!video.duration) return;

      const currentX = e.clientX;
      if (prevX === null) {
        prevX = currentX;
        return;
      }

      const delta = currentX - prevX;
      prevX = currentX;

      targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));
      video.currentTime = targetTime;
    };

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  // Mobile autoplay hook — PRESERVED EXACTLY
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. NAVBAR — DocSummary branding
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Supported files", href: "#supported-files" },
  { label: "GitHub", href: "https://github.com", external: true },
] as const;

interface HeroNavbarProps {
  onUploadClick: () => void;
}

function HeroNavbar({ onUploadClick }: HeroNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo */}
        <div className="flex flex-row items-center gap-2">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-black" aria-hidden />
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            DocSummary
          </span>
        </div>

        {/* Desktop nav links (center) */}
        <nav className="hidden md:flex flex-row items-center text-[20px] text-black" aria-label="Main navigation">
          {NAV_LINKS.map((link, i) => (
            <React.Fragment key={link.label}>
              <a
                href={link.href}
                target={"external" in link && link.external ? "_blank" : undefined}
                rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                className="hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={onUploadClick}
          className="hidden md:inline-block text-[20px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Upload Document
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 z-20 relative"
          onClick={toggleMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`w-6 h-[2px] bg-black block transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black block transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black block transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 transition-all duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="flex flex-col items-center gap-6" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={"external" in link && link.external ? "_blank" : undefined}
              rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
              className="text-4xl font-medium text-black hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onUploadClick();
            }}
            className="text-4xl font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
          >
            Upload Document
          </button>
        </nav>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// 3. TYPEWRITER HOOK
// ─────────────────────────────────────────────
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
// 4. MAIN HERO — DocSummary
// ─────────────────────────────────────────────
export function DocSummaryHero() {
  const router = useRouter();
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  // App state
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<AppStage>("idle");
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { displayed, done } = useTypewriter("Every document,\nunderstood.", 38, 600);

  // Scroll upload zone into view when nav CTA is clicked
  const scrollToUpload = useCallback(() => {
    uploadZoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

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

      // Save to sessionStorage and navigate
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
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Background video — 3D model with cursor scrub */}
      <HeroBackgroundVideo />

      {/* Navbar */}
      <HeroNavbar onUploadClick={scrollToUpload} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          {/* Headline with typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"
                />
              )}
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-10 max-w-xl">
              Upload a PDF or scanned image.
              <br className="hidden sm:inline" />
              Get a clear summary and key points in seconds.
            </p>
          </motion.div>

          {/* Upload zone — replaces ServicePills */}
          <motion.div
            ref={uploadZoneRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Upload title */}
            <AnimatePresence>
              {stage !== "uploading" && stage !== "extracting" && stage !== "summarizing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4"
                >
                  <p className="text-2xl font-medium tracking-tight text-black mb-1">
                    Upload your document
                  </p>
                  <p className="opacity-60 text-[#738273] text-sm">
                    Drop a PDF or scanned image here, or click to browse
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

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
