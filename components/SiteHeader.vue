<template>
  <header class="flex justify-between items-center mb-10">
    <div>
      <h1 class="text-3xl md:text-4xl font-bold">{{ t('title') }}</h1>
      <p class="text-light-text-sub dark:text-dark-text-sub mt-1">{{ t('description') }}</p>
    </div>

    <ClientOnly>
      <div class="flex items-center space-x-1">
        <div class="relative" ref="langMenuContainer">
          <button @click="langMenuOpen = !langMenuOpen" class="p-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10">
            <font-awesome-icon icon="language" class="h-5 w-5" />
          </button>
          <transition name="fade">
            <div v-if="langMenuOpen" class="absolute right-0 mt-2 w-32 bg-light-card dark:bg-dark-card rounded-md shadow-lg py-1 z-20 border border-light-border dark:border-dark-border">
              <a v-for="lang in availableLocales" :key="lang.code" @click="changeLocale(lang.code)"
                class="block px-4 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                :class="{ 'font-bold': locale === lang.code }">
                {{ lang.name }}
              </a>
            </div>
          </transition>
        </div>

        <div class="relative" ref="themeMenuContainer">
          <button @click="themeMenuOpen = !themeMenuOpen" class="p-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10">
            <font-awesome-icon v-if="colorMode.value === 'light'" icon="sun" class="h-5 w-5" />
            <font-awesome-icon v-else-if="colorMode.value === 'dark'" icon="moon" class="h-5 w-5" />
            <font-awesome-icon v-else icon="desktop" class="h-5 w-5" />
          </button>
          <transition name="fade">
            <div v-if="themeMenuOpen" class="absolute right-0 mt-2 w-32 bg-light-card dark:bg-dark-card rounded-md shadow-lg py-1 z-20 border border-light-border dark:border-dark-border">
              <a @click="changeTheme('light')" class="block px-4 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">Light</a>
              <a @click="changeTheme('dark')" class="block px-4 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">Dark</a>
              <a @click="changeTheme('system')" class="block px-4 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">System</a>
            </div>
          </transition>
        </div>
      </div>
       <template #fallback>
        <div class="h-10 w-20"></div>
      </template>
    </ClientOnly>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const { t, locale, availableLocales, setLocale } = useI18n()
const colorMode = useColorMode()

const langMenuOpen = ref(false)
const themeMenuOpen = ref(false)
const langMenuContainer = ref(null)
const themeMenuContainer = ref(null)

const changeLocale = (code) => {
  setLocale(code)
  langMenuOpen.value = false
}

const changeTheme = (theme) => {
  colorMode.preference = theme
  themeMenuOpen.value = false
}

const handleClickOutside = (event) => {
  if (langMenuContainer.value && !langMenuContainer.value.contains(event.target)) {
    langMenuOpen.value = false
  }
  if (themeMenuContainer.value && !themeMenuContainer.value.contains(event.target)) {
    themeMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>