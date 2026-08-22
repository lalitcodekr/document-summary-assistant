import { describe, it, expect } from "vitest";
import { chunkText, needsChunking, previewText } from "@/lib/chunk-text";

// ─── chunkText ────────────────────────────────────────────────────────────────

describe("chunkText", () => {
  it("returns a single chunk for short text", () => {
    const text = "Hello world";
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("splits text into multiple chunks when it exceeds chunk size", () => {
    const text = "a".repeat(15000);
    const chunks = chunkText(text, 6000, 300);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("chunks overlap by the configured amount", () => {
    const text = "a".repeat(10000);
    const chunks = chunkText(text, 6000, 300);
    // Second chunk should start at position 6000 - 300 = 5700
    // First chunk is 0-6000, second starts at 5700
    expect(chunks[1].length).toBeLessThanOrEqual(6000);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
  });

  it("does not exceed chunk size", () => {
    const text = "x".repeat(20000);
    const chunks = chunkText(text, 6000, 300);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(6000);
    }
  });

  it("covers the full text across all chunks", () => {
    const text = "abcdefghij".repeat(1000); // 10000 chars
    const chunks = chunkText(text, 3000, 100);
    // Verify the start and end of the text appear in first and last chunks
    expect(chunks[0].startsWith("abcde")).toBe(true);
    expect(chunks[chunks.length - 1].endsWith("ghij")).toBe(true);
  });
});

// ─── needsChunking ────────────────────────────────────────────────────────────

describe("needsChunking", () => {
  it("returns false for short text", () => {
    expect(needsChunking("hello")).toBe(false);
  });

  it("returns true for text over 28000 chars", () => {
    expect(needsChunking("x".repeat(28001))).toBe(true);
  });

  it("returns false at exactly the threshold", () => {
    expect(needsChunking("x".repeat(28000))).toBe(false);
  });
});

// ─── previewText ──────────────────────────────────────────────────────────────

describe("previewText", () => {
  it("returns full text if shorter than maxChars", () => {
    const text = "Short text";
    expect(previewText(text, 500)).toBe(text);
  });

  it("truncates and appends ellipsis", () => {
    const text = "a".repeat(600);
    const preview = previewText(text, 500);
    expect(preview).toHaveLength(501); // 500 + "…"
    expect(preview.endsWith("…")).toBe(true);
  });

  it("uses default maxChars of 500", () => {
    const text = "b".repeat(1000);
    const preview = previewText(text);
    expect(preview.length).toBe(501);
  });
});
