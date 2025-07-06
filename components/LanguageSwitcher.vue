<!-- components/LanguageSwitcher.vue -->
<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="切换语言"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m12 14 6-6"/><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
    </button>
    <div 
      v-if="isOpen"
      v-on-click-outside="() => isOpen = false"
      class="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      <ul>
        <li v-for="loc in availableLocales" :key="loc.code">
          <button
            @click="switchLanguage(loc.code)"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'font-bold text-indigo-600 dark:text-indigo-400': locale === loc.code }"
          >
            {{ loc.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { vOnClickOutside } from '@vueuse/components';

const { locale, locales, setLocale } = useI18n();
const isOpen = ref(false);

const availableLocales = computed(() => {
  return locales.value;
});

const switchLanguage = (code) => {
  setLocale(code);
  isOpen.value = false;
};
</script>