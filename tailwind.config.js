/**
 * Tailwind CSS configuration for the BetterMatch demo app.
 *
 * Notes:
 * - Tailwind v3+ uses the `content` key to find files that include utility classes.
 * - Keep the globs in sync with where your templates/components live.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
        ],
      },
    },
  },
  plugins: [],
};
