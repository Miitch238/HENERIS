/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Preflight is Tailwind's global CSS reset. This project already has ~60 pages
  // styled with plain CSS (src/styles/*.css) plus its own reset in global.css,
  // so Preflight is disabled to avoid regressing every existing page. Tailwind
  // utility classes still work everywhere they're used.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      // The component was written for Tailwind v4, which allows arbitrary
      // spacing steps like `w-42`. v3 needs them declared explicitly.
      spacing: { "42": "10.5rem" },
    },
  },
  plugins: [],
};
