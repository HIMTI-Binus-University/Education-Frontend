export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7faff",
        foreground: "#0b2452",
        primary: "#0059d6",
        muted: "#52678d",
      },
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
