import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#141414",
        surface: "#1f1f1f",
        accent: "#e50914",
        muted: "#808080"
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
