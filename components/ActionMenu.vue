<!-- components/ActionMenu.vue -->
<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      :title="t('menu.title')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
    </button>
    <div
      v-if="isOpen"
      v-on-click-outside="() => isOpen = false"
      class="absolute top-full right-0 mt-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      <ul>
        <li>
          <a :href="config.public.githubUrl" target="_blank" rel="noopener noreferrer" class="w-full text-left px-4 py-2 text-sm flex items-center gap-3 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
            <span>{{ t('menu.repository') }}</span>
          </a>
        </li>
        <li>
          <NuxtLink to="/about" @click="isOpen = false" class="w-full text-left px-4 py-2 text-sm flex items-center gap-3 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>{{ t('menu.about') }}</span>
          </NuxtLink>
        </li>
        <li class="border-t border-gray-200 dark:border-gray-700">
          <form action="/api/logout" method="POST">
            <button type="submit" class="w-full text-left px-4 py-2 text-sm flex items-center gap-3 whitespace-nowrap text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>{{ t('menu.logout') }}</span>
            </button>
          </form>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const { t } = useI18n();
const config = useRuntimeConfig();
const isOpen = ref(false);
</script>