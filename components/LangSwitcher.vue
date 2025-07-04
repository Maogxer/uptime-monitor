<template>
  <div class="relative">
    <button @click="toggleDropdown" class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <!-- SVG for Language Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-languages"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
    </button>
    <div v-if="isOpen" v-click-outside="closeDropdown" class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
      <div class="py-1">
        <a
          v-for="lang in availableLocales"
          :key="lang.code"
          @click.prevent="setLanguage(lang.code)"
          href="#"
          :class="[
            'block px-4 py-2 text-sm',
            locale === lang.code ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ lang.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)

const availableLocales = computed(() => {
  return (locales.value as any[]).filter(i => i.code !== locale.value)
})

function setLanguage(code: string) {
  setLocale(code)
  isOpen.value = false
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

// Custom directive to detect clicks outside an element
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.__ClickOutsideHandler__ = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.__ClickOutsideHandler__)
  },
  unmounted(el: any) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__)
  },
}
</script>