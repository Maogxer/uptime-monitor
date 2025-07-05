import { ref, computed } from 'vue'

// All available translations
import en from '~/locales/en.json'
import zhCN from '~/locales/zh-CN.json'
import ja from '~/locales/ja.json'

const messages = {
  en,
  'zh-CN': zhCN,
  ja
}

// Global state for the current locale, shared across the app
const currentLocale = useState<keyof typeof messages>('locale', () => 'zh-CN')

export const useMyI18n = () => {
  const setLocale = (locale: keyof typeof messages) => {
    currentLocale.value = locale
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let message: any = messages[currentLocale.value]
    for (const k of keys) {
      if (message && typeof message === 'object' && k in message) {
        message = message[k]
      } else {
        return key // Return the key itself if not found
      }
    }
    return message
  }

  return {
    locale: computed(() => currentLocale.value),
    setLocale,
    t
  }
}