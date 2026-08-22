"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Scan, Sparkles } from "lucide-react";
import type { AppStage } from "@/types";

interface ProcessingStateProps {
  stage: AppStage;
}

const STAGES: {
  key: AppStage;
  icon: React.ElementType;
  label: string;
  sublabel: string;
}[] = [
  {
    key: "uploading",
    icon: FileText,
    label: "Uploading your document…",
    sublabel: "Sending to the server",
  },
  {
    key: "extracting",
    icon: Scan,
    label: "Reading your document…",
    sublabel: "Extracting text and structure",
  },
  {
    key: "summarizing",
    icon: Sparkles,
    label: "Generating summary…",
    sublabel: "AI is analyzing your document",
  },
];

const WOBBLY_SM = "15px 225px 15px 255px / 255px 15px 225px 15px";

export function ProcessingState({ stage }: ProcessingStateProps) {
  const current = STAGES.find((s) => s.key === stage) ?? STAGES[0];
  const Icon = current.icon;
  const stageIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-6 w-full max-w-md mx-auto" style={{ fontFamily: "'Patrick Hand', cursive" }}>
      {/* Animated icon container */}
      <div className="relative">
        <motion.div
          className="w-20 h-20 bg-[#fff9c4] border-[3px] border-[#2d2d2d] flex items-center justify-center z-10 relative"
          style={{ borderRadius: WOBBLY_SM, boxShadow: "4px 4px 0px 0px #2d2d2d" }}
          animate={{ rotate: [-2, 2, -2], y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-10 h-10 text-[#2d2d2d]" strokeWidth={2.5} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Scribble effect behind icon */}
        <motion.div
          className="absolute inset-[-10px] border-[2px] border-dashed border-[#2d2d2d]/30 pointer-events-none"
          style={{ borderRadius: "50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="text-center mt-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#2d2d2d] font-bold text-3xl" style={{ fontFamily: "'Kalam', cursive" }}>{current.label}</p>
          <p className="text-[#2d2d2d]/60 text-xl mt-1">{current.sublabel}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress steps (hand-drawn blocks) */}
      <div className="flex items-center gap-3 mt-4">
        {STAGES.map((s, i) => (
          <React.Fragment key={s.key}>
            <motion.div
              className="h-4 border-2 border-[#2d2d2d]"
              style={{ width: 40, borderRadius: WOBBLY_SM }}
              animate={{
                backgroundColor:
                  i < stageIndex
                    ? "#2d2d2d"
                    : i === stageIndex
                    ? "#ff4d4d"
                    : "rgba(0,0,0,0)",
                rotate: i % 2 === 0 ? 2 : -2,
                scale: i === stageIndex ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
            />
            {i < STAGES.length - 1 && (
              <div className="w-6 h-0 border-b-2 border-dashed border-[#2d2d2d]/40" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
