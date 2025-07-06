<!-- components/LanguageSwitcher.vue -->
<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      :title="t('tooltips.language')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
    </button>
    <div 
      v-if="isOpen"
      v-on-click-outside="() => isOpen = false"
      class="absolute top-full right-0 mt-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      <ul>
        <li v-for="loc in availableLocales" :key="loc.code">
          <button
            @click="switchLanguage(loc.code)"
            class="w-full text-left px-4 py-2 text-sm flex items-center gap-3 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'font-bold text-indigo-600 dark:text-indigo-400': locale === loc.code }"
          >
            <!-- The icon is now a text-based SVG -->
            <component :is="getLangIcon(loc.code)" class="h-5 w-5" />
            <span>{{ loc.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const { locale, locales, setLocale, t } = useI18n();
const isOpen = ref(false);

const availableLocales = computed(() => {
  return locales.value;
});

const switchLanguage = (code: string) => {
  setLocale(code);
  isOpen.value = false;
};

// --- THIS IS THE UPDATED ICON LOGIC ---

/**
 * Helper function to create an SVG containing a text character.
 * @param char The character to display.
 */
const textIcon = (char: string) => {
  return h('svg', { 
    xmlns: 'http://www.w3.org/2000/svg', 
    width: 24, 
    height: 24, 
    viewBox: '0 0 24 24', 
    fill: 'currentColor', // Inherits the color from the parent text
  }, [
    h('text', {
      x: '50%',
      y: '50%',
      'dominant-baseline': 'middle',
      'text-anchor': 'middle',
      'font-size': '16', // Adjust size as needed
      'font-weight': '600', // Semibold weight
    }, char)
  ]);
};

/**
 * Returns a specific character icon based on the language code.
 * @param code The language code (e.g., 'zh', 'en', 'ja').
 */
const getLangIcon = (code: string) => {
  switch(code) {
    case 'zh':
      return textIcon('文'); // "文" (wén) for language/script
    case 'en':
      return textIcon('A');   // A standard "A" for English
    case 'ja':
      return textIcon('あ'); // "a" in Hiragana, as you suggested
    default:
      // Fallback to a generic icon if a new language is added without an icon
      return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M2 12h20' })]);
  }
}
</script>