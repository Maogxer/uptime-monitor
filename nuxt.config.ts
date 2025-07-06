// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],

  runtimeConfig: {
    uptimeRobotApiKey: process.env.NUXT_UPTIME_ROBOT_API_KEY,
    sitePassword: process.env.NUXT_SITE_PASSWORD,
    public: {
      title: 'Status Page',
      sitePasswordProtect: process.env.NUXT_SITE_PASSWORD_PROTECT,
      githubUrl: 'https://github.com/Maogxer/uptime-monitor'
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  i18n: {
    locales: [
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    // FIX 2.1: Explicitly disable the deprecated directive
    bundle: {
      optimizeTranslationDirective: false,
    },
    // FIX 2.2: The vueI18n property has been removed
  },

  // FIX 1: Add the compatibility date for Nitro
  nitro: {
    compatibilityDate: '2024-04-03' // Using the fallback date is safest
  },
})