// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  runtimeConfig: {
    uptimeRobotApiKey: process.env.NUXT_UPTIME_ROBOT_API_KEY,
    public: {
      title: 'Status Page'
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // --- THIS IS THE DEFINITIVE FIX ---
  // We manually configure PostCSS and Tailwind's options here to force the build tool.
  postcss: {
    plugins: {
      tailwindcss: {
        // We can define tailwind config directly here if needed,
        // or just let it find the tailwind.config.ts file.
        // To be absolutely sure, we are defining the safelist here again.
        config: {
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
        }
      },
      autoprefixer: {},
    },
  },
})