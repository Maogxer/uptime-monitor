// file: i18n.config.ts
import { defineI18nConfig } from '#i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh',
  messages: {
    // 由于我们使用懒加载 (lazy: true), 这里可以为空
  }
}))