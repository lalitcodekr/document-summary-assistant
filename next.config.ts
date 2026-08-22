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
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /draco_decoder\.wasm|draco_wasm_wrapper\.js|draco_decoder\.js|boolean_wasm_bg\.wasm/,
      })
    );
    return config;
  },
};

export default nextConfig;
