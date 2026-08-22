import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";

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
        {/* Mainframe — HelveticaNowDisplay fonts */}
        <link
          href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg"
          rel="stylesheet"
        />
        {/* Hand-drawn design system fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full">
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
