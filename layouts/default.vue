<!-- app.vue -->
<template>
  <div class="bg-gray-50 dark:bg-[#0B0F19] text-gray-800 dark:text-gray-200">
    <div 
      class="fixed inset-0 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.1)_0%,rgba(67,56,202,0)_35%)] pointer-events-none"
    ></div>

    <div class="relative flex flex-col min-h-screen">
      <header class="fixed top-0 left-0 w-full bg-gray-50/90 dark:bg-[#0B0F19]/90 backdrop-blur-sm z-50 shadow-md">
        <div class="max-w-5xl mx-auto px-4 pt-8 pb-4">
          <div class="flex justify-between items-center">
            <NuxtLink to="/" class="flex items-center gap-2">
              <svg class="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.498 21.042a.75.75 0 01-.483-.153.755.755 0 01-.25-1.033L9.58 15H4.75a.75.75 0 010-1.5h5.503a.75.75 0 01.62.345l-4.12 6.866a.75.75 0 01-.255.334zM21 19.542a.75.75 0 01-.75.75h-5.503a.75.75 0 01-.62-.345l4.12-6.866a.75.75 0 011.02-.268.75.75 0 01.268 1.02l-2.81 4.683h3.755a.75.75 0 01.75.75zM12 2.958a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.708a.75.75 0 01.75-.75z"></path>
              </svg>
              <span class="text-xl font-bold">{{ t('pageTitle') }}</span>
            </NuxtLink>
            
            <ClientOnly>
              <div class="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <ActionMenu v-if="isPasswordProtected" /> <!-- NEW: Conditionally show the menu -->
              </div>
              <template #fallback>
                  <div class="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  <div class="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </header>
      
      <main class="flex-grow w-full max-w-5xl mx-auto px-4 py-8 pt-28 z-10"> 
        <NuxtPage />
      </main>
      
      <footer class="w-full max-w-5xl mx-auto px-4 py-8 z-10">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '~/components/ThemeSwitcher.vue';
import AppFooter from '~/components/AppFooter.vue';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import ActionMenu from '~/components/ActionMenu.vue'; // <-- IMPORT

const { t, locale } = useI18n();

const config = useRuntimeConfig();
// This computed property checks if password protection is enabled
const isPasswordProtected = computed(() => config.public.sitePasswordProtect === 'true');

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t('pageTitle')}` : t('pageTitle');
  },
  htmlAttrs: {
    lang: locale,
  }
})
</script>