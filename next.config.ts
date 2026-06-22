import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer is a Node-only dependency used inside the
  // /api/devis-materiaux route handler. Keep it external from the bundle.
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    // Serve the already-optimised WebP files from public/ as-is
    // without additional server-side optimisation (avoids recompression).
    unoptimized: true,
  },
};

export default nextConfig;
