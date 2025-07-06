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
    sitePassword: process.env.NUXT_SITE_PASSWORD, // Server-side only
    
    public: {
    title: 'Status Page',
    sitePasswordProtect: process.env.NUXT_SITE_PASSWORD_PROTECT, // Expose to client/middleware
    githubUrl: 'https://github.com/Maogxer/uptime-monitor' // <-- ADD THIS
    }
  },

  nitro: {
    hooks: {
      'compiled': () => {
        if (!process.env.NUXT_UPTIME_ROBOT_API_KEY) {
          console.warn('⚠️  UptimeRobot API key is not configured. The application will not be able to fetch monitor statuses.')
        }
        if (process.env.NUXT_SITE_PASSWORD_PROTECT === 'true' && !process.env.NUXT_SITE_PASSWORD) {
          console.warn('🔒 Password protection is enabled, but no site password is set. Users will not be able to log in.')
        }
      }
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
    vueI18n: './i18n.config.ts'
  },
})