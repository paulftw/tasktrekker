import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    relay: {
      src: "./src",
      language: "typescript",
      artifactDirectory: "./src/__generated__",
    },
  },
};

export default nextConfig;
