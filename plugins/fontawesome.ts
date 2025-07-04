// file: plugins/fontawesome.ts
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSun, faMoon, faDesktop, faLanguage, faCheckCircle, faExclamationCircle, faPauseCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

// 这对于 Nuxt 很重要，可以防止图标在初始加载时变得很大
config.autoAddCss = false

// 在这里添加你需要的图标
library.add(faSun, faMoon, faDesktop, faLanguage, faCheckCircle, faExclamationCircle, faPauseCircle, faQuestionCircle)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})