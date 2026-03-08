/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        oracle: {
          bg: '#080b10',
          surface: '#0d1117',
          card: '#111820',
          border: '#1a2332',
          accent: '#00d4ff',
          gold: '#ffd700',
          green: '#00ff87',
          red: '#ff3b5c',
          amber: '#ffaa00',
          muted: '#4a5568',
          text: '#e2e8f0',
          dim: '#8892a4',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        glow: {
          'from': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          'to': { boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff' }
        }
      }
    }
  },
  plugins: []
};
