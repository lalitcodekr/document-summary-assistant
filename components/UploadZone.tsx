"use client";

import React, { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import type { AppStage, ErrorCode, SummaryLength } from "@/types";
import { LengthToggle } from "./LengthToggle";
import { FilePreviewChip } from "./FilePreviewChip";
import { ProcessingState } from "./ProcessingState";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UploadZoneProps {
  file: File | null;
  stage: AppStage;
  summaryLength: SummaryLength;
  errorCode?: ErrorCode | null;
  errorMessage?: string | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onLengthChange: (length: SummaryLength) => void;
  onSubmit: () => void;
}

const ERROR_LABELS: Record<string, string> = {
  UNSUPPORTED_FILE_TYPE: "Unsupported file type",
  FILE_TOO_LARGE: `File too large (max ${MAX_SIZE_MB} MB)`,
  EXTRACTION_FAILED: "Text extraction failed",
  SUMMARIZATION_FAILED: "Summary generation failed",
  TIMEOUT: "Request timed out",
};

// Hand-Drawn Wobbly Border Radius 
const WOBBLY_MD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_SM = "15px 225px 15px 255px / 255px 15px 225px 15px";

export function UploadZone({
  file,
  stage,
  summaryLength,
  errorCode,
  errorMessage,
  onFileSelect,
  onFileRemove,
  onLengthChange,
  onSubmit,
}: UploadZoneProps) {
  const isProcessing =
    stage === "uploading" || stage === "extracting" || stage === "summarizing";
  const isError = stage === "error";

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        return;
      }
      if (accepted.length > 0) {
        onFileSelect(accepted[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6" style={{ fontFamily: "'Patrick Hand', cursive" }}>
      
      {/* Tape Decoration (Hand-Drawn style) */}
      <AnimatePresence mode="wait">
        {!isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/10 rotate-2 z-20 pointer-events-none"
            style={{ borderRadius: "2px" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          /* ── Processing panel ─────────────────────────────────────────── */
          <motion.div
            key="processing"
            className="bg-white border-[3px] border-[#2d2d2d] relative overflow-hidden"
            style={{ 
              borderRadius: WOBBLY_MD,
              boxShadow: "6px 6px 0px 0px #2d2d2d"
            }}
            initial={{ opacity: 0, scale: 0.97, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 1 }}
            exit={{ opacity: 0, scale: 0.97, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProcessingState stage={stage} />
          </motion.div>
        ) : (
          /* ── Upload / Error panel ─────────────────────────────────────── */
          <motion.div
            key="upload"
            className="bg-white border-[3px] border-[#2d2d2d] relative"
            style={{ 
              borderRadius: WOBBLY_MD,
              boxShadow: isDragActive && !isDragReject ? "2px 2px 0px 0px #2d2d2d" : "6px 6px 0px 0px #2d2d2d" 
            }}
            initial={{ opacity: 0, y: 16, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 16, rotate: -1 }}
            whileHover={{ rotate: -1, boxShadow: "8px 8px 0px 0px #2d2d2d" }}
            transition={{ duration: 0.2 }}
          >
            {/* Error banner */}
            <AnimatePresence>
              {isError && (errorCode || errorMessage) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden bg-[#ff4d4d]/10 border-b-[3px] border-dashed border-[#2d2d2d]"
                >
                  <div className="flex items-start gap-3 px-6 pt-5 pb-3">
                    <AlertCircle className="w-5 h-5 text-[#ff4d4d] flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden />
                    <div>
                      <p className="text-lg text-[#2d2d2d] font-bold" style={{ fontFamily: "'Kalam', cursive" }}>
                        {errorCode ? ERROR_LABELS[errorCode] ?? "Something went wrong" : "Error"}
                      </p>
                      {errorMessage && (
                        <p className="text-base text-[#2d2d2d]/80 mt-0.5 leading-relaxed">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              {...getRootProps()}
              className={`relative p-8 sm:p-10 cursor-pointer outline-none flex flex-col items-center gap-5 ${
                isProcessing ? "cursor-not-allowed" : ""
              }`}
            >
              <input {...getInputProps()} id="file-upload" aria-label="Upload file" />

              <AnimatePresence mode="wait">
                {file ? (
                  /* File selected */
                  <motion.div
                    key="file-preview"
                    className="w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FilePreviewChip
                      file={file}
                      onRemove={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onFileRemove();
                      }}
                    />
                  </motion.div>
                ) : (
                  /* Empty dropzone */
                  <motion.div
                    key="empty"
                    className="flex flex-col items-center gap-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-[#fff9c4] border-[3px] border-[#2d2d2d] flex items-center justify-center relative"
                      style={{ 
                        borderRadius: WOBBLY_SM, 
                        boxShadow: "3px 3px 0px 0px #2d2d2d"
                      }}
                      animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Thumbtack decoration */}
                      <div className="absolute -top-2 -right-1 w-3 h-3 bg-[#ff4d4d] rounded-full shadow-[1px_1px_0px_#2d2d2d]" />
                      <UploadCloud className="w-8 h-8 text-[#2d2d2d]" strokeWidth={2.5} aria-hidden />
                    </motion.div>

                    <div>
                      <p className="text-[#2d2d2d] font-bold text-2xl" style={{ fontFamily: "'Kalam', cursive" }}>
                        {isDragActive && !isDragReject
                          ? "Drop it here!"
                          : isDragReject
                          ? "Uh oh, unsupported file!"
                          : isError
                          ? "Try another file"
                          : "Drop a PDF or image here"}
                      </p>
                      <p className="text-[#2d2d2d]/70 text-lg mt-1">
                        or{" "}
                        <span className="text-[#2d5da1] underline decoration-wavy underline-offset-4">
                          click to browse
                        </span>
                      </p>
                    </div>

                    {/* Supported formats */}
                    <div
                      id="supported-files"
                      className="flex items-center gap-3 flex-wrap justify-center mt-2"
                    >
                      {[
                        { icon: FileText, label: "PDF" },
                        { icon: ImageIcon, label: "PNG" },
                        { icon: ImageIcon, label: "JPG" },
                        { icon: ImageIcon, label: "WebP" },
                      ].map((fmt) => (
                         <span
                          key={fmt.label}
                          className="flex items-center gap-1 text-base text-[#2d2d2d] px-2 border-2 border-dashed border-[#2d2d2d]"
                          style={{ borderRadius: WOBBLY_SM }}
                        >
                          <fmt.icon className="w-4 h-4" strokeWidth={2.5} aria-hidden />
                          {fmt.label}
                        </span>
                      ))}
                      <span className="text-base font-bold text-[#2d2d2d]">
                        Max {MAX_SIZE_MB} MB
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls row */}
            <AnimatePresence>
              {(file || isError) && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t-[3px] border-dashed border-[#2d2d2d]"
                >
                  <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#fdfbf7]/50" style={{ borderRadius: "0 0 15px 15px" }}>
                    <div className="w-full sm:w-auto flex-1">
                      <LengthToggle
                        value={summaryLength}
                        onChange={onLengthChange}
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <button
                      onClick={(e) => {
                         e.stopPropagation();
                         onSubmit();
                      }}
                      disabled={!file || isProcessing}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#2d2d2d] border-[3px] border-[#2d2d2d] px-6 py-3 text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ff4d4d] hover:text-white hover:shadow-[2px_2px_0px_0px_#2d2d2d] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                      style={{ 
                        borderRadius: WOBBLY_SM,
                        boxShadow: "4px 4px 0px 0px #2d2d2d"
                      }}
                    >
                      {isError ? (
                        <>
                          <RotateCcw className="w-5 h-5" strokeWidth={2.5} aria-hidden />
                          Retry
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" strokeWidth={2.5} aria-hidden />
                          Generate Summary
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works strip */}
      {stage === "idle" && (
        <motion.div
          id="how-it-works"
          className="flex items-center justify-center sm:justify-start gap-4 sm:gap-8 pt-2 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { step: "01", label: "Upload file" },
            { step: "02", label: "Text extraction" },
            { step: "03", label: "AI Summary" },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-2 text-[#2d2d2d] text-lg">
              {i > 0 && (
                <div className="hidden sm:flex items-center">
                  {/* Hand-drawn arrow */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-[#2d2d2d] stroke-[2]">
                     <path d="M5,12 L18,12 M14,7 L19,12 L14,17" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <span className="bg-[#fff9c4] border-2 border-[#2d2d2d] px-1 font-bold inline-block rotate-[-3deg]" style={{ borderRadius: WOBBLY_SM }}>
                {item.step}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
