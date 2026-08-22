/**
 * Typed sessionStorage helpers for the summary page.
 * Data is stored under a single key as a JSON blob.
 */

import type { SummaryStorageData } from "@/types";

const STORAGE_KEY = "docSummaryData";

export function saveSummaryData(data: SummaryStorageData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota or private-mode issues — fail silently
    console.warn("[summary-storage] Failed to save to sessionStorage");
  }
}

export function loadSummaryData(): SummaryStorageData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SummaryStorageData;
  } catch {
    return null;
  }
}

export function clearSummaryData(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
