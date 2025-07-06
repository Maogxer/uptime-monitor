// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  runtimeConfig: {
    // This key is only available on the server
    uptimeRobotApiKey: process.env.NUXT_UPTIME_ROBOT_API_KEY,
    // Public keys are exposed to the client
    public: {
      title: 'Status Page'
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // The postcss block is no longer needed here.
  // @nuxtjs/tailwindcss automatically handles it by reading tailwind.config.ts
})