/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./app.vue`,
    `./plugins/**/*.{js,ts}`,
    `./nuxt.config.{js,ts}`,
  ],
  theme: {
    extend: {
      colors: {
        // 精确复刻的颜色
        // 浅色模式
        'light-bg': '#f0f2f5',
        'light-card': '#ffffff',
        'light-text-main': 'rgba(60, 60, 67)',
        'light-text-sub': 'rgba(60, 60, 67, 0.6)',
        'light-border': 'rgba(60, 60, 67, 0.29)',

        // 深色模式
        'dark-bg': '#000000',
        'dark-card': '#1c1c1e',
        'dark-text-main': 'rgba(242, 242, 247)',
        'dark-text-sub': 'rgba(235, 235, 245, 0.6)',
        'dark-border': 'rgba(84, 84, 88, 0.65)',

        // 状态颜色
        'status-green': {
          light: '#34c759',
          dark: '#30d158'
        },
        'status-yellow': {
          light: '#ffcc00',
          dark: '#ffd60a'
        },
        'status-red': {
          light: '#ff3b30',
          dark: '#ff453a'
        },
        'status-gray': {
          light: '#8e8e93',
          dark: '#8e8e93'
        },
      },
      fontFamily: {
        // 使用和原站一致的字体，确保观感
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen-Sans',
          'Ubuntu',
          'Cantarell',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}