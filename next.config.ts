import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file body parsing for serverless functions (10MB PDF uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
  outputFileTracingIncludes: {
    "/api/**/*": ["./eng.traineddata.gz"],
  },
  // External packages that should NOT be bundled server-side
  serverExternalPackages: ["tesseract.js", "unpdf", "@napi-rs/canvas"],
};

export default nextConfig;
