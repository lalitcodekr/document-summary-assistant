/**
 * Server-side OCR using Tesseract.js v6.
 * Accepts an image Buffer (png/jpg) and returns extracted text.
 */

export async function ocrImage(imageBuffer: Buffer | Uint8Array): Promise<string> {
  try {
    const { createWorker } = await import("tesseract.js");

    const worker = await createWorker("eng", 1, {
      // Suppress verbose logging in production
      logger: process.env.NODE_ENV === "development"
        ? (m: { status: string; progress: number }) => {
            if (m.status === "recognizing text") {
              process.stdout.write(`\rOCR progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        : undefined,
    });

    // Tesseract.js v6 accepts Buffer directly
    const { data } = await worker.recognize(Buffer.from(imageBuffer));
    await worker.terminate();

    return data.text?.trim() ?? "";
  } catch (err) {
    console.error("[ocrImage] error:", err);
    throw new Error("EXTRACTION_FAILED");
  }
}
