import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Register the Tailwind CSS v4 loader for Turbopack so that
  // `@import "tailwindcss"` in app/globals.css is expanded into
  // Preflight, the theme, and utility classes.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;