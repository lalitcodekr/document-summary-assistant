"use client";

import React, { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, X } from "lucide-react";

interface FilePreviewChipProps {
  file: File;
  onRemove?: (e: React.MouseEvent) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

const WOBBLY_SM = "15px 225px 15px 255px / 255px 15px 225px 15px";

export function FilePreviewChip({ file, onRemove }: FilePreviewChipProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!isImageFile(file)) {
      setThumbnail(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setThumbnail(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div 
      className="flex items-center gap-3 bg-[#e5e0d8] border-[3px] border-[#2d2d2d] p-3 w-full"
      style={{ 
        borderRadius: WOBBLY_SM,
        boxShadow: "3px 3px 0px 0px #2d2d2d",
        fontFamily: "'Patrick Hand', cursive"
      }}
    >
      {/* Thumbnail or icon */}
      <div 
        className="flex-shrink-0 w-12 h-12 overflow-hidden bg-white border-2 border-[#2d2d2d] flex items-center justify-center rotate-[-2deg]"
        style={{ borderRadius: WOBBLY_SM }}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-6 h-6 text-[#2d2d2d]" strokeWidth={2.5} />
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-xl text-[#2d2d2d] font-bold truncate" style={{ fontFamily: "'Kalam', cursive" }}>{file.name}</p>
        <p className="text-base text-[#2d2d2d]/70 flex items-center gap-1.5">
          {isImageFile(file) ? (
            <ImageIcon className="w-4 h-4" strokeWidth={2} aria-hidden />
          ) : (
            <FileText className="w-4 h-4" strokeWidth={2} aria-hidden />
          )}
          <span>{formatBytes(file.size)}</span>
          <span>·</span>
          <span className="uppercase font-bold">{file.type.split("/")[1] || "file"}</span>
        </p>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove file"
          className="flex-shrink-0 w-8 h-8 bg-white border-2 border-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white flex items-center justify-center transition-colors cursor-pointer rotate-2"
          style={{ borderRadius: WOBBLY_SM }}
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
