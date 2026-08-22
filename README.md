# 📄 Document Summary Assistant

> Upload a document, get an instant AI-powered summary, key points, and suggestions for improvement.

**🔗 Live Demo:** [doc-summary-unthinkable.vercel.app](https://doc-summary-unthinkable.vercel.app)

Built as a technical assessment project within an 8-hour time budget — prioritizing a clean, working end-to-end flow over exhaustive feature coverage.

---

## 🧠 Overview

Document Summary Assistant lets users upload a PDF, image, or plain text document and receive a readable, configurable-length summary in seconds. It handles both digital documents (with a selectable text layer) and scanned/image-based documents (via OCR) through a single unified pipeline — so a scanned lecture handout gets summarized just as easily as a native PDF report.

**Who it's for:**

| User | Use Case |
|---|---|
| 🧑‍💼 Evaluator / Reviewer | Quickly assess a candidate's submitted report without opening the full doc |
| 🎓 Student | Summarize a scanned lecture handout and extract key concepts |
| 💼 Professional | Summarize a long contract or article while preserving key clauses |

---

## ✨ Features

- **📤 Flexible Input** — Upload PDF, TXT, or image files, or paste text directly.
- **🔍 Smart Text Extraction** — Parses digital PDFs directly, and falls back to OCR (Tesseract.js) for images and scanned/no-text-layer PDFs.
- **🤖 AI Summarization** — Powered by Gemini 1.5 Flash for fast, accurate, structured summaries.
- **📏 Adjustable Length** — Toggle between Short / Medium / Long summaries on the fly.
- **🎯 Key Insights** — Automatically extracts 3–5 key points as a distinct, structured list.
- **💡 Improvement Suggestions** — Get 1–3 LLM-generated suggestions for strengthening the source document.
- **🎨 Rich UI** — Glassmorphism design, interactive 3D backgrounds (Spline), and fully responsive layout.
- **📋 Copy & Export** — Copy-to-clipboard and download-as-text for any generated summary.
- **⚠️ Graceful Error Handling** — Clear, friendly messaging for unsupported files, oversized uploads, extraction failures, and API timeouts.

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | Unified frontend + serverless backend, fast deploys |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Framer Motion | Rapid, responsive, animated UI |
| **AI / LLM** | [Google AI SDK](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) (Gemini 1.5 Flash) | Best quality-per-effort for summarization + structured output |
| **PDF Parsing** | `unpdf` | Reliable text-layer extraction |
| **OCR** | `tesseract.js` | Free, no API key, works for images & scanned docs |
| **3D Graphics** | `@splinetool/react-spline` | Interactive, modern visual backdrop |
| **Hosting** | [Vercel](https://vercel.com) | Single deploy target for frontend + serverless functions |

---

## 🏗️ How It Works

1. User uploads a file (drag-and-drop or file picker) or pastes text directly.
2. The app validates file type and size, then shows a preview before processing.
3. **Text extraction:** digital PDFs are parsed directly; images and scanned/text-less PDFs are routed through OCR.
4. Extracted text is sent to Gemini with a structured prompt requesting a JSON response: `{ summary, keyPoints[], improvementSuggestions[] }`, parameterized by the selected summary length.
5. Long documents that exceed context limits are chunked and summarized hierarchically (map-reduce).
6. Results are rendered with clear loading states at every stage, plus copy/download actions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd document-summary-assistant

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

Add your Gemini API key to `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the `GEMINI_API_KEY` environment variable in your Vercel project settings.
4. Deploy 🚀

**Live instance:** [doc-summary-unthinkable.vercel.app](https://doc-summary-unthinkable.vercel.app)

---

## 📚 API Reference

### `POST /api/process`

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | binary | The uploaded PDF/image/text file |
| `summaryLength` | `"short" \| "medium" \| "long"` | Desired summary length |

**Response `200`:**

```json
{
  "extractedTextPreview": "string",
  "summary": "string",
  "keyPoints": ["string"],
  "improvementSuggestions": ["string"],
  "meta": {
    "sourceType": "pdf" | "image",
    "pages": 0,
    "processingTimeMs": 0
  }
}
```

**Error shape:**

```json
{
  "error": {
    "code": "UNSUPPORTED_FILE_TYPE" | "FILE_TOO_LARGE" | "EXTRACTION_FAILED" | "SUMMARIZATION_FAILED" | "TIMEOUT",
    "message": "string"
  }
}
```

---

## ⚠️ Known Limitations

- **English-only** for v1 (OCR and summarization).
- **Single-document** processing — no batch/multi-document support yet.
- **No accounts or saved history** — results are session-only.
- **OCR accuracy** depends on scan quality; raw extracted text is surfaced so users can sanity-check results.
- **Free-tier API limits** may cause occasional rate-limiting on the live demo.

---

## 🔭 Future Enhancements

- Multi-language OCR and summarization
- Batch/multi-document upload and comparison
- User accounts with summary history
- Export summaries to PDF/Word

---

## 📄 License

This project was built for a technical assessment. Feel free to fork and adapt.
