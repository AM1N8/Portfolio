// filepath: portfolio/tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        green: {
          DEFAULT: "#00ff00",
          dark: "#00cc00",
        },
        muted: "rgba(255,255,255,0.6)",
        border: "rgba(255,255,255,0.15)",
      },
      fontFamily: {
        mono: [
          "IBM Plex Mono",
          "ui-monospace",
          "Cascadia Code",
          "Fira Code",
          "monospace",
        ],
        display: ["Bebas Neue", "Impact", "sans-serif"],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
