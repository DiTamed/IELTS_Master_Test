import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8eeff",
          200: "#b9e2ff",
          300: "#89d0ff",
          400: "#52b3ff",
          500: "#2a91ff",
          600: "#1371f5",
          700: "#0d59e1",
          800: "#1147b6",
          900: "#143e8f",
          950: "#112757",
        },
      },
    },
  },
  plugins: [],
};

export default config;

