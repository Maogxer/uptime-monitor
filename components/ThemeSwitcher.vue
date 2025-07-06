<!-- components/ThemeSwitcher.vue -->
<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    :title="nextThemeTooltip"
  >
    <!-- Sun Icon for Light Mode (Unchanged) -->
    <svg v-if="currentIcon === 'sun'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>

    <!-- Moon Icon for Dark Mode (Unchanged) -->
    <svg v-if="currentIcon === 'moon'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    
    <!-- THE FINAL ICON: Using the SVG you provided -->
    <svg v-if="currentIcon === 'system'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10.85 12.65h2.3L12 9zM20 8.69V6c0-1.1-.9-2-2-2h-2.69l-1.9-1.9c-.78-.78-2.05-.78-2.83 0L8.69 4H6c-1.1 0-2 .9-2 2v2.69l-1.9 1.9c-.78.78-.78 2.05 0 2.83l1.9 1.9V18c0 1.1.9 2 2 2h2.69l1.9 1.9c.78.78 2.05.78 2.83 0l1.9-1.9H18c1.1 0 2-.9 2-2v-2.69l1.9-1.9c.78-.78.78-2.05 0-2.83zm-5.91 6.71L13.6 14h-3.2l-.49 1.4c-.13.36-.46.6-.84.6a.888.888 0 0 1-.84-1.19l2.44-6.86c.2-.57.73-.95 1.33-.95s1.13.38 1.34.94l2.44 6.86a.888.888 0 0 1-.84 1.19a.87.87 0 0 1-.85-.59"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const colorMode = useColorMode();
const { t } = useI18n();

const themes = ['light', 'dark', 'system'];

const currentIcon = computed(() => {
  if (colorMode.preference === 'system') {
    return 'system';
  }
  return colorMode.value === 'dark' ? 'moon' : 'sun';
});

const nextThemeTooltip = computed(() => {
  const currentIndex = themes.indexOf(colorMode.preference);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextThemeKey = themes[nextIndex];
  
  const nextThemeLabel = t(`themes.labels.${nextThemeKey}`);
  
  return t('themes.switchTo', { theme: nextThemeLabel });
});

function toggleTheme() {
  const currentIndex = themes.indexOf(colorMode.preference);
  const nextIndex = (currentIndex + 1) % themes.length;
  colorMode.preference = themes[nextIndex];
}
</script>