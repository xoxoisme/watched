import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#141414",
        surface: "#1f1f1f",
        accent: "#4ade80",
        muted: "#808080"
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
        brand: ["var(--font-brand)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
