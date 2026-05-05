/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: {
					950: "#020617", // slate-950
					900: "#0f172a", // slate-900
					800: "#1e293b", // slate-800
				},
				accent: {
					blue: "#3b82f6", // blue-500
					purple: "#a855f7", // purple-500
					cyan: "#22d3ee", // cyan-400
				},
			},
			fontFamily: {
				display: ["Sora", "Space Grotesk", "sans-serif"],
				body: ["Inter", "Manrope", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "Fira Code", "monospace"],
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				glow: {
					"0%, 100%": { opacity: "0.7", filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.35))" },
					"50%": { opacity: "1", filter: "drop-shadow(0 0 16px rgba(168, 85, 247, 0.6))" },
				},
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { opacity: "0", transform: "translateY(18px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				float: "float 5s ease-in-out infinite",
				glow: "glow 3s ease-in-out infinite",
				fadeIn: "fadeIn 600ms ease-out both",
				slideUp: "slideUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
			},
			backdropBlur: {
				xs: "2px",
				glass: "14px",
				deep: "24px",
			},
		},
	},
	plugins: [],
};

