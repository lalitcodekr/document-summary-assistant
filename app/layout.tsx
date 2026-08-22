import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocSummary — AI-Powered Document Understanding",
  description:
    "Upload a PDF or scanned image and get a clear, configurable summary with key points in seconds. Powered by AI.",
  keywords: ["document summary", "PDF summary", "AI summarization", "OCR", "document analysis"],
  openGraph: {
    title: "DocSummary",
    description: "Upload a PDF or image. Get a clear AI summary in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
