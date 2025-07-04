// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',

  // --- 这是最关键的修复部分 ---
  // 明确告诉 Tailwind 去扫描这些文件以查找用到的类名
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  // -------------------------

  theme: {
    extend: {
      colors: {
        'status-up': '#4ade80',
        'status-down': '#f87171',
        'status-paused': '#a1a1aa',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}