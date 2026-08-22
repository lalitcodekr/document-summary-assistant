# Document Summary Assistant

An AI-powered document summarization tool built with Next.js, React, and Gemini API. It allows users to upload documents or paste text to generate concise summaries, extract key points, and receive improvement suggestions.

## ✨ Features

- **Document Parsing**: Extract text from PDF, TXT, and Image (OCR) files.
- **AI Summarization**: Powered by Gemini 1.5 Flash to generate fast and accurate summaries.
- **Adjustable Length**: Switch between Short, Medium, and Long summaries on the fly.
- **Key Insights**: Automatically extracts key points and improvement suggestions.
- **Rich UI**: Stunning interface featuring Glassmorphism, 3D interactive backgrounds (Spline), and responsive design.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Framer Motion
- **AI / LLM**: [Google AI SDK](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- **Parsing**: `unpdf` (PDFs), `tesseract.js` (Images)
- **3D Graphics**: `@splinetool/react-spline`

## 🚀 Getting Started

1. **Clone the repository** (or download the source code).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

The easiest way to deploy this Next.js application is via [Vercel](https://vercel.com).
Ensure that you set the `GEMINI_API_KEY` environment variable in your Vercel project settings before deploying.
