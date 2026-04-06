import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080d1a',
        surface: '#0f1629',
        'surface-2': '#162033',
        border: '#1e2d45',
        'text-primary': '#f0f4ff',
        'text-secondary': '#8896b3',
        'text-muted': '#4a5568',
        accent: '#4f8ef7',
        'accent-hover': '#6ba3ff',
        green: '#10d9a0',
        blue: '#4f8ef7',
        orange: '#f59e0b',
        purple: '#a78bfa',
        red: '#f87171',
        gold: '#fbbf24',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #080d1a 0%, #0d1535 50%, #080d1a 100%)',
        'accent-glow': 'radial-gradient(circle, rgba(79, 142, 247, 0.1) 0%, rgba(79, 142, 247, 0) 72%)',
        'grid-pattern':
          'linear-gradient(rgba(79, 142, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 142, 247, 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(107, 163, 255, 0.25), 0 14px 38px rgba(22, 59, 122, 0.32)',
        'glow-sm': '0 0 0 1px rgba(107, 163, 255, 0.2), 0 8px 24px rgba(22, 59, 122, 0.25)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 14s ease infinite',
      },
    },
  },
  plugins: [typography],
};

