import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forge: { bg: "#070B17", surface: "#10182B", primary: "#6C63FF", mint: "#23D5AB", sky: "#38BDF8" }
      },
      boxShadow: { glow: "0 0 36px rgba(108,99,255,.22)" },
      fontFamily: { sans: ["var(--font-arabic)", "sans-serif"], display: ["var(--font-arabic)", "sans-serif"], mono: ["var(--font-space)", "monospace"] }
    }
  },
  plugins: []
};
export default config;
