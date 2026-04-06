import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f3f7ff',
        surface: '#ffffff',
        'surface-2': '#edf3ff',
        border: '#d6e1f5',
        'text-primary': '#0f1c33',
        'text-secondary': '#4d6287',
        'text-muted': '#7d8cab',
        accent: '#1f6feb',
        'accent-hover': '#185ed1',
        green: '#0f9f6e',
        blue: '#1f6feb',
        orange: '#c06c00',
        purple: '#6f42c1',
        red: '#c0364b',
        gold: '#a97800',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f8fbff 0%, #edf4ff 50%, #f7fbff 100%)',
        'accent-glow': 'radial-gradient(circle, rgba(31, 111, 235, 0.16) 0%, rgba(31, 111, 235, 0) 72%)',
        'grid-pattern':
          'linear-gradient(rgba(31, 111, 235, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 111, 235, 0.12) 1px, transparent 1px)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(31, 111, 235, 0.22), 0 16px 40px rgba(58, 90, 150, 0.18)',
        'glow-sm': '0 0 0 1px rgba(31, 111, 235, 0.2), 0 10px 24px rgba(58, 90, 150, 0.16)',
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

