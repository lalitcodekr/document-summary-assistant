import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file body parsing for serverless functions (10MB PDF uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
  // External packages that should NOT be bundled server-side
  serverExternalPackages: ["tesseract.js", "unpdf"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../libs/draco/draco_decoder.wasm": false,
      "../libs/draco/draco_wasm_wrapper.js": false,
      "../libs/draco/draco_decoder.js": false,
      "../libs/draco/gltf/draco_decoder.wasm": false,
      "../libs/draco/gltf/draco_wasm_wrapper.js": false,
      "boolean_wasm_bg.wasm": false,
    };
    return config;
  },
};

export default nextConfig;
