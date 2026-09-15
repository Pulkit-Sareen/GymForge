import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gym: {
          dark: "#09090b",
          card: "#121215",
          border: "#27272a",
          muted: "#71717a",
          accent: "#06b6d4", // bright cyan
          accentHover: "#0891b2",
          emerald: "#10b981", // success / completed
          amber: "#f59e0b", // secondary muscle / warning
          rose: "#f43f5e", // PR / high intensity
        }
      },
    },
  },
  plugins: [],
};
export default config;
