/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0a',
          green: '#00ff41',
          amber: '#ffb000',
          red: '#ff3333',
          cyan: '#00d4ff',
          muted: '#4a5568',
          border: '#1a2332',
          dim: '#1a1a2e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'scan': 'scan 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%': { textShadow: '0 0 4px #00ff41, 0 0 8px #00ff41' },
          '100%': { textShadow: '0 0 8px #00ff41, 0 0 16px #00ff41, 0 0 24px #00ff41' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};
