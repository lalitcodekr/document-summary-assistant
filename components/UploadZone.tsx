"use client";

import React, { useCallback, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Image,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import type { AppStage, ErrorCode, SummaryLength } from "@/types";
import { LiquidGlassPill } from "./LiquidGlassPill";
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
        const err = rejected[0].errors[0];
        if (err.code === "file-too-large") {
          // Parent will handle this via its own validation
        }
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
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {isProcessing ? (
          /* ── Processing panel ─────────────────────────────────────────── */
          <motion.div
            key="processing"
            className="liquid-glass rounded-3xl"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <ProcessingState stage={stage} />
          </motion.div>
        ) : (
          /* ── Upload / Error panel ─────────────────────────────────────── */
          <motion.div
            key="upload"
            className={`liquid-glass rounded-3xl transition-all duration-200 ${
              isDragActive && !isDragReject
                ? "shadow-[inset_0_0_0_1.4px_rgba(0,0,0,0.2)]"
                : isDragReject
                ? "shadow-[inset_0_0_0_1.4px_rgba(255,80,80,0.3)]"
                : ""
            }`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileHover={{ scale: 1.02, y: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            transition={{ duration: 0.4 }}
          >
            {/* Error banner */}
            <AnimatePresence>
              {isError && (errorCode || errorMessage) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 px-6 pt-5 pb-3">
                    <AlertCircle className="w-4 h-4 text-black/60 flex-shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <p className="text-sm text-black/80 font-medium">
                        {errorCode ? ERROR_LABELS[errorCode] ?? "Something went wrong" : "Error"}
                      </p>
                      {errorMessage && (
                        <p className="text-xs text-black/50 mt-0.5 leading-relaxed">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mx-6 h-px bg-black/10 mb-4" />
                </motion.div>
              )}
            </AnimatePresence>

            <div
              {...getRootProps()}
              data-cursor="grab"
              className={`relative p-8 sm:p-10 cursor-pointer outline-none flex flex-col items-center gap-5 ${
                isProcessing ? "cursor-not-allowed" : ""
              }`}
              aria-label="Document upload area. Click or drag and drop a PDF or image file here."
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
                        // Stop dropzone from triggering
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
                      className="w-14 h-14 liquid-glass rounded-2xl flex items-center justify-center"
                      animate={isDragActive ? { scale: 1.08 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <UploadCloud className="w-6 h-6 text-black/60" aria-hidden />
                    </motion.div>

                    <div>
                      <p className="text-black font-medium text-base">
                        {isDragActive && !isDragReject
                          ? "Drop your file here"
                          : isDragReject
                          ? "Unsupported file type"
                          : isError
                          ? "Try another file"
                          : "Drop a PDF or image here"}
                      </p>
                      <p className="text-black/40 text-sm mt-1">
                        or{" "}
                        <span className="text-black/70 underline underline-offset-2">
                          click to browse
                        </span>
                      </p>
                    </div>

                    {/* Supported formats */}
                    <div
                      id="supported-files"
                      className="flex items-center gap-3 flex-wrap justify-center"
                    >
                      {[
                        { icon: FileText, label: "PDF" },
                        { icon: Image, label: "PNG" },
                        { icon: Image, label: "JPG" },
                        { icon: Image, label: "WebP" },
                      ].map((fmt) => (
                        <span
                          key={fmt.label}
                          className="flex items-center gap-1 text-xs text-black/60 px-2 py-1 rounded-md bg-black/5"
                        >
                          <fmt.icon className="w-3 h-3" aria-hidden />
                          {fmt.label}
                        </span>
                      ))}
                      <span className="text-xs text-black/40">
                        Max {MAX_SIZE_MB} MB
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls row (only shown when file is selected or there's an error to retry) */}
            <AnimatePresence>
              {(file || isError) && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center gap-3">
                    <LengthToggle
                      value={summaryLength}
                      onChange={onLengthChange}
                      disabled={isProcessing}
                    />
                    <LiquidGlassPill
                      variant="primary"
                      onClick={onSubmit}
                      disabled={!file || isProcessing}
                      className="w-full sm:w-auto justify-center"
                      aria-label="Generate summary"
                    >
                      {isError ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
                          Retry
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" aria-hidden />
                          Generate Summary
                        </>
                      )}
                    </LiquidGlassPill>
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
          className="flex items-center justify-start gap-6 sm:gap-10 pt-2 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { step: "01", label: "Upload PDF or image" },
            { step: "02", label: "Text is extracted" },
            { step: "03", label: "AI summarizes it" },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-2 text-xs text-black/50">
              {i > 0 && <div className="hidden sm:block w-8 h-px bg-black/10" />}
              <span className="font-mono text-black/40">{item.step}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
