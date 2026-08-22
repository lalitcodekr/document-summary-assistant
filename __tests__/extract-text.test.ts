import { describe, it, expect } from "vitest";
import { pdfHasTextLayer } from "@/lib/extract-text";

describe("pdfHasTextLayer", () => {
  it("returns true for a PDF with substantial text", () => {
    // 1000 chars across 2 pages = 500 chars/page (≥50 meaningful)
    const text = "This is a real document with real content. ".repeat(25);
    expect(pdfHasTextLayer(text, 2)).toBe(true);
  });

  it("returns false for a PDF with very little text (scanned)", () => {
    // Only whitespace / 0 meaningful chars
    const text = "   \n  \t  \n   ";
    expect(pdfHasTextLayer(text, 5)).toBe(false);
  });

  it("returns false when text is empty", () => {
    expect(pdfHasTextLayer("", 1)).toBe(false);
  });

  it("returns true for single-page PDF with enough text", () => {
    const text = "a".repeat(100);
    expect(pdfHasTextLayer(text, 1)).toBe(true);
  });

  it("handles zero pages gracefully (treats as 1 page)", () => {
    const text = "x".repeat(200);
    // Should not throw, should treat pages as 1
    expect(() => pdfHasTextLayer(text, 0)).not.toThrow();
  });
});
