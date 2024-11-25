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
        sm: "2px 2px rgba(0, 0, 0, 1)",
        "sistem-item": "4px 4px rgba(117, 117, 117, 1)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#145A32",
        "light-primary": "#008000",
        "dark-primary": "#00684a",
        secondary: "#FF9100",
        dark: "#002C13",
        "yellow-custom": "#FFE212",
        "white-custom": "#FEFEFE",
        "black-custom": "#101010",
        "dark-gray": "#889397",
        "gray-text": "#757575",

        "jewel-green": "#055A39",
        "jewel-blue": "#064359",
        "jewel-red": "#C50043",
        "jewel-yellow": "#F3A51A",
        "jewel-purple": "#6D275D",

        "pastel-green": "#adf7b6",
        "pastel-blue": "#a0ced9",
        "pastel-red": "#ffc09f",
        "pastel-yellow": "#ffee93",
        "pastel-purple": "#a594f9",
      },
      backgroundImage: {
        noise: "url(/img/bg-texture.png)",
      },
    },
  },
  plugins: [],
} satisfies Config;
