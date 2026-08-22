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

export function ProcessingState({ stage }: ProcessingStateProps) {
  const current = STAGES.find((s) => s.key === stage) ?? STAGES[0];
  const Icon = current.icon;
  const stageIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="flex flex-col items-center gap-6 py-10 px-6 w-full max-w-md mx-auto">
      {/* Animated icon container */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 liquid-glass rounded-2xl flex items-center justify-center"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-7 h-7 text-black/80" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-black/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-black font-medium text-lg">{current.label}</p>
          <p className="text-black/40 text-sm mt-1">{current.sublabel}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {STAGES.map((s, i) => (
          <React.Fragment key={s.key}>
            <motion.div
              className="h-1 rounded-full"
              style={{ width: 32 }}
              animate={{
                backgroundColor:
                  i < stageIndex
                    ? "rgba(0,0,0,0.7)"
                    : i === stageIndex
                    ? "rgba(0,0,0,1)"
                    : "rgba(0,0,0,0.15)",
              }}
              transition={{ duration: 0.4 }}
            />
            {i < STAGES.length - 1 && (
              <div className="w-1 h-1 rounded-full bg-black/20" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Thin progress bar at bottom */}
      <div className="w-full h-px bg-black/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black/50 progress-pulse"
          animate={{
            width: stage === "uploading" ? "25%" : stage === "extracting" ? "60%" : "90%",
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
