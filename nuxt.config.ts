import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  runtimeConfig: {
    uptimeRobotApiKey: process.env.UPTIMEROBOT_API_KEY,
    public: {
      apiBase: '/api/monitors'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],
  
  // Tailwind CSS 配置
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
  },

  // Color Mode (主题切换)
  colorMode: {
    classSuffix: '', // 确保这行是 classSuffix: ''
    preference: 'system',
    fallback: 'light',
  },

  // i18n (多语言)
  i18n: {
    locales: [
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja-JP.json' },
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'zh',
    strategy: 'no_prefix', // URL中不显示语言前缀
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    vueI18n: './i18n.config.ts'
  },

  plugins: [
    '~/plugins/fontawesome.ts'
  ],

  build: {
    transpile: ['@fortawesome/vue-fontawesome']
  },

  app: {
    head: {
      title: '站点监控面板',
      htmlAttrs: {
        lang: 'zh'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '一个仿照 status.imsyy.top 风格的站点监控面板' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  }
})