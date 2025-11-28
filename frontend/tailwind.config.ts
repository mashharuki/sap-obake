import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Haunted theme colors
        "ghost-white": "var(--ghost-white)",
        "midnight-purple": "var(--midnight-purple)",
        "haunted-orange": "var(--haunted-orange)",
        "witch-green": "var(--witch-green)",
        "dark-void": "var(--dark-void)",
        "shadow-gray": "var(--shadow-gray)",
        "mist-gray": "var(--mist-gray)",
        "blood-red": "var(--blood-red)",
        "ghostly-blue": "var(--ghostly-blue)",
        "poison-green": "var(--poison-green)",
        "correct-glow": "var(--correct-glow)",
        "incorrect-glow": "var(--incorrect-glow)",
        "warning-glow": "var(--warning-glow)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        ghostly: "var(--shadow-ghostly)",
        eerie: "var(--shadow-eerie)",
        haunted: "var(--shadow-haunted)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flicker: "flicker 4s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        heading: ["var(--font-creepster)", "Creepster", "cursive"],
        mono: ["var(--font-fira-code)", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
