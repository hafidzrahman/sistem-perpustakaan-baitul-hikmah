import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "source-sans": ["var(--font-source-sans)", "sans-serif"],
        "source-serif": ["var(--font-source-serif)", "serif"],
        "space-sans": ["var(--font-space-sans)", "sans-serif"],
      },
      boxShadow: {
        lg: "8px 8px rgba(0, 0, 0, 1)",
        md: "4px 4px rgba(0, 0, 0, 1)",
        "sistem-item": "4px 4px rgba(117, 117, 117, 1)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#145A32",
        "light-primary": "#008000",
        secondary: "#FF9100",
        dark: "#002C13",
        "dark-primary": "#00684a",
        "yellow-custom": "#FFE212",
        "white-custom": "#FEFEFE",
        "black-custom": "#101010",
        "border-gray": "#889397",
        "white-text": "#ECEFF1",
        "dark-gray": "#5C6C75",
        "gray-text": "#757575",
        "green-background": "#DDF5DC",
      },
      backgroundImage: {
        noise: "url(/img/bg-texture.png)",
      },
    },
  },
  plugins: [],
} satisfies Config;
