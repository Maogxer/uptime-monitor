// tailwind.config.ts
import type { Config } from 'tailwindcss'

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
        // --- NEW: Ripple Glow Animation based on imsyy.top ---
        'ripple-glow': 'ripple-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', 
      },
      keyframes: {
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        // --- NEW: Keyframes for multi-layer, high-quality ripple glow ---
        'ripple-glow': {
          '0%': {
            boxShadow: '0 0 0px 0px rgba(var(--glow-color-rgb), 0.7), 0 0 0px 0px rgba(var(--glow-color-rgb), 0)'
          },
          '50%': {
            // First visible ripple (solid)
            boxShadow: '0 0 0px 4px rgba(var(--glow-color-rgb), 0.5), 0 0 0px 8px rgba(var(--glow-color-rgb), 0)'
          },
          '100%': {
            // First ripple fades out, second ripple expands and fades
            boxShadow: '0 0 0px 6px rgba(var(--glow-color-rgb), 0), 0 0 0px 12px rgba(var(--glow-color-rgb), 0)'
          },
        }
      }
    },
  },
  plugins: [],
}