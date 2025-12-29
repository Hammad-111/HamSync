module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2E1065", // Deep Violet
        accent: "#06B6D4",  // Electric Cyan
        background: {
          light: "#F8FAFC", // Soft White
          dark: "#0F172A",  // Charcoal Black
        }
      },
      fontFamily: {
        poppins: ["Poppins_400Regular", "Poppins_600SemiBold", "Poppins_700Bold"],
        inter: ["Inter_400Regular", "Inter_500Medium", "Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
}

