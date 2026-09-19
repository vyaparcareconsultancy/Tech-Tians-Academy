import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A1628",
          "navy-dark": "#060E1A",
          "navy-surface": "#0F1F38",
          "navy-light": "#162744",
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-subtle": "#EFF6FF",
          cyan: "#06B6D4",
          "cyan-dark": "#0891B2",
          "cyan-subtle": "#ECFEFF",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(10, 22, 40, 0.05), 0 1px 2px -1px rgba(10, 22, 40, 0.05)",
        card: "0 4px 6px -1px rgba(10, 22, 40, 0.06), 0 2px 4px -2px rgba(10, 22, 40, 0.06)",
        glow: "0 0 20px -5px rgba(37, 99, 235, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
