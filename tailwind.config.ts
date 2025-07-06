// tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography' // <-- 1. Import it

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.{js,vue,ts}",
    "./plugins/**/*.{js,vue,ts}",
    "./app.vue",
    "./error.vue",
  ],
  
  safelist: [
    'bg-green-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-gray-500',
    'bg-green-400',
    'bg-orange-400',
    'bg-red-400',
    'bg-gray-400',
  ],

  theme: {
    extend: {
      colors: {
        'status-up': '#4ade80',
        'status-down': '#f87171',
        'status-paused': '#a1a1aa',
        'brand-primary': '#6366f1', // Indigo 500
        'brand-secondary': '#8b5cf6', // Violet 500
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0.6, 1) infinite',
        'background-pan': 'background-pan 15s linear infinite',
        // --- NEW: Animations for composite effect ---
        'dot-pulse': 'dot-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Core dot pulsing opacity
        'halo-expand': 'halo-expand 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite', // Outward halo expansion
      },
      keyframes: {
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        // --- NEW: Keyframes for dot pulsing opacity ---
        'dot-pulse': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        // --- NEW: Keyframes for transparent halo expansion ---
        'halo-expand': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.5)', opacity: '0' }, // Expands and fades out
        }
      }
    },
  },
  plugins: [
    typography, // <-- 2. Add it to the plugins array
  ],
}