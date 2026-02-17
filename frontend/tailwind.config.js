/** @type {import('tailwindcss').Config} */
export default {
        content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
        theme: {
                extend: {
                        colors: {
                                primary: {
                                        DEFAULT: '#6366f1',
                                        dark: '#4f46e5',
                                        light: '#818cf8',
                                },
                                success: '#10b981',
                                warning: '#f59e0b',
                                danger: '#ef4444',
                                'bg-dark': '#0f0f1a',
                                'bg-card': '#1a1a2e',
                                'bg-input': '#16162a',
                                'text-primary': '#f8fafc',
                                'text-secondary': '#94a3b8',
                                border: '#2d2d44',
                                'accent-cyan': '#06b6d4',
                                'accent-pink': '#ec4899',
                        },
                        fontFamily: {
                                sans: ['Manrope', 'sans-serif'],
                                mono: ['JetBrains Mono', 'monospace'],
                        },
                        animation: {
                                'slide-up': 'slideUp 0.6s ease-out both',
                                'slide-down': 'slideDown 0.6s ease-out both',
                                'slide-in-right': 'slideInRight 0.4s ease-out both',
                                'fade-in': 'fadeIn 0.6s ease-out both',
                                'fade-in-scale': 'fadeInScale 1s ease-out both',
                                float: 'float 20s ease-in-out infinite',
                                'fill-bar': 'fillBar 1.5s ease-out both',
                                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                spin: 'spin 0.8s linear infinite',
                                shimmer: 'shimmer 2s linear infinite',
                        },
                        keyframes: {
                                slideUp: {
                                        '0%': { opacity: '0', transform: 'translateY(20px)' },
                                        '100%': { opacity: '1', transform: 'translateY(0)' },
                                },
                                slideDown: {
                                        '0%': { opacity: '0', transform: 'translateY(-20px)' },
                                        '100%': { opacity: '1', transform: 'translateY(0)' },
                                },
                                slideInRight: {
                                        '0%': { opacity: '0', transform: 'translateX(30px)' },
                                        '100%': { opacity: '1', transform: 'translateX(0)' },
                                },
                                fadeIn: {
                                        '0%': { opacity: '0' },
                                        '100%': { opacity: '1' },
                                },
                                fadeInScale: {
                                        '0%': { opacity: '0', transform: 'scale(0.9)' },
                                        '100%': { opacity: '1', transform: 'scale(1)' },
                                },
                                float: {
                                        '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                                        '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
                                        '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                                },
                                fillBar: {
                                        '0%': { width: '0' },
                                },
                                spin: {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                },
                                shimmer: {
                                        '0%': { backgroundPosition: '-1000px 0' },
                                        '100%': { backgroundPosition: '1000px 0' },
                                },
                        },
                        backdropBlur: {
                                xs: '2px',
                        },
                        boxShadow: {
                                'glow-sm': '0 0 10px rgba(99, 102, 241, 0.3)',
                                'glow-md': '0 0 20px rgba(99, 102, 241, 0.4)',
                                'glow-lg': '0 0 30px rgba(99, 102, 241, 0.5)',
                        },
                        spacing: {
                                18: '4.5rem',
                                88: '22rem',
                                128: '32rem',
                        },
                        borderRadius: {
                                '4xl': '2rem',
                        },
                        transitionDuration: {
                                400: '400ms',
                        },
                },
        },
        plugins: [],
};