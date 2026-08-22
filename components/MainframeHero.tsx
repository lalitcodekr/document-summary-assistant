"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────
// 1. TYPEWRITER HOOK
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
// 2. BACKGROUND VIDEO COMPONENT
// ─────────────────────────────────────────────
function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop mouse-scrub hook
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

  // Mobile autoplay hook
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
// 3. NAVBAR
// ─────────────────────────────────────────────
const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"] as const;

function HeroNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo */}
        <div className="flex flex-row items-center gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            Mainframe&reg;
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1">
            &#10033;
          </span>
        </div>

        {/* Desktop nav links (center) */}
        <nav className="hidden md:flex flex-row items-center text-[23px] text-black" aria-label="Main navigation">
          {NAV_LINKS.map((link, i) => (
            <React.Fragment key={link}>
              <a
                href="#"
                className="hover:opacity-60 transition-opacity"
              >
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden md:inline-block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

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
              key={link}
              href="#"
              className="text-4xl font-medium text-black hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            className="text-4xl font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get in touch
          </a>
        </nav>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// 4. SERVICE PILLS
// ─────────────────────────────────────────────
const ALL_SERVICES = ["Brand", "Digital", "Campaign", "Other"] as const;
type Service = (typeof ALL_SERVICES)[number];

function ServicePills() {
  const [selected, setSelected] = useState<Service[]>([]);

  const toggle = (service: Service) => {
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div>
      {/* Prompt */}
      <p className="text-2xl font-medium tracking-tight text-black mb-2">
        What sort of service?
      </p>
      <p className="opacity-85 text-[#738273] mb-8">Select all that apply</p>

      {/* Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {ALL_SERVICES.map((service) => {
          const isActive = selected.includes(service);
          return (
            <motion.button
              key={service}
              onClick={() => toggle(service)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-colors ${
                isActive
                  ? "bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform"
                  : "bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55"
              }`}
              aria-pressed={isActive}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-flex"
                  >
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </motion.span>
                )}
              </AnimatePresence>
              {service}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback status banner */}
      <AnimatePresence mode="wait">
        {selected.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs italic text-[#738273]"
          >
            Please click to select services above.
          </motion.p>
        ) : (
          <motion.div
            key="selected"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between bg-[#FAFBF9] border border-[#E8EBE8] rounded-2xl px-5 py-4">
              <p className="text-sm text-[#4D6D47] font-medium">
                Ready to inquire about:{" "}
                <span className="font-semibold">{selected.join(", ")}</span>
              </p>
              <motion.a
                href="#"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-1.5 text-[#4D6D47] uppercase text-xs font-semibold tracking-wide ml-4"
              >
                Let&apos;s Go{" "}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. MAIN HERO SECTION
// ─────────────────────────────────────────────
export function MainframeHero() {
  const { displayed, done } = useTypewriter("we'd love to\nhear from you!", 38, 600);

  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Background video */}
      <HeroBackgroundVideo />

      {/* Navbar */}
      <HeroNavbar />

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
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
              Whether you have questions, feedback,{" "}
              <br className="hidden sm:inline" />
              drop us a message and we&apos;ll get back to you as soon as
              possible.
            </p>
          </motion.div>

          {/* Service pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ServicePills />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
