"use client";

import React, { useEffect, useState } from "react";
import { FileText, Image, X } from "lucide-react";

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
    <div className="flex items-center gap-3 liquid-glass rounded-xl p-3 w-full">
      {/* Thumbnail or icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-black/5 flex items-center justify-center">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-5 h-5 text-black/50" />
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-black font-medium truncate">{file.name}</p>
        <p className="text-xs text-black/40 mt-0.5 flex items-center gap-1.5">
          {isImageFile(file) ? (
            <Image className="w-3 h-3" aria-hidden />
          ) : (
            <FileText className="w-3 h-3" aria-hidden />
          )}
          <span>{formatBytes(file.size)}</span>
          <span>·</span>
          <span className="uppercase">{file.type.split("/")[1] || "file"}</span>
        </p>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove file"
          className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-3 h-3 text-black/70" />
        </button>
      )}
    </div>
  );
}
