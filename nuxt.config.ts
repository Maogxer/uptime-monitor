// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],

  runtimeConfig: {
    // This is a private key, only available on the server side
    uptimeRobotApiKey: process.env.NUXT_UPTIME_ROBOT_API_KEY,
    // Public keys are exposed to the client side
    public: {
      title: 'Status Page',
      // Add any other public config here
    }
  },

  colorMode: {
    classSuffix: '', // Required for Tailwind CSS integration
    preference: 'system', // default value
    fallback: 'light', // fallback value if system preference isn't set
  },

  i18n: {
    locales: [
      { code: 'zh-CN', iso: 'zh-CN', file: 'zh-CN.json', name: '简体中文' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: '日本語' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'zh-CN',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
  },

  css: ['~/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})