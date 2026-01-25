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
                background: "#0A0E27", // Deep Dark Blue
                primary: {
                    DEFAULT: "#8B5CF6", // Purple
                    hover: "#7C3AED",
                },
                secondary: {
                    DEFAULT: "#3B82F6", // Blue
                    hover: "#2563EB",
                },
                accent: {
                    DEFAULT: "#10B981", // Green
                    hover: "#059669",
                },
                warning: "#F59E0B", // Orange
                danger: "#EF4444", // Red
                card: "rgba(255, 255, 255, 0.05)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "primary-gradient": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                "danger-gradient": "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-montserrat)', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
            },
            animation: {
                'shimmer': 'shimmer 3s infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                glow: {
                    '0%, 100%': { opacity: '0.5' },
                    '50%': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            colors: {
                background: "#0A0E27",
                primary: {
                    DEFAULT: "#8B5CF6",
                    hover: "#7C3AED",
                },
                secondary: {
                    DEFAULT: "#3B82F6",
                    hover: "#2563EB",
                },
                accent: {
                    DEFAULT: "#10B981",
                    hover: "#059669",
                },
                warning: "#F59E0B",
                danger: "#EF4444",
                'empire': {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
            },
        },
    },
    plugins: [],
};
export default config;
