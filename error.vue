<!-- error.vue -->
<template>
  <div class="bg-gray-50 dark:bg-[#0B0F19] text-gray-800 dark:text-gray-200">
    <div class="fixed inset-0 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.1)_0%,rgba(67,56,202,0)_35%)] pointer-events-none"></div>

    <!-- THE FINAL LAYOUT FIX: A flex container that fills the entire screen -->
    <div class="flex flex-col min-h-screen">
      
      <!-- Header (Manually included for reliability) -->
      <header class="w-full bg-gray-50/90 dark:bg-[#0B0F19]/90 backdrop-blur-sm z-10 shadow-md">
        <div class="max-w-5xl mx-auto px-4 pt-8 pb-4">
          <div class="flex justify-between items-center">
            <NuxtLink to="/" class="flex items-center gap-2">
              <svg class="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.498 21.042a.75.75 0 01-.483-.153.755.755 0 01-.25-1.033L9.58 15H4.75a.75.75 0 010-1.5h5.503a.75.75 0 01.62.345l-4.12 6.866a.75.75 0 01-.255.334zM21 19.542a.75.75 0 01-.75.75h-5.503a.75.75 0 01-.62-.345l4.12-6.866a.75.75 0 011.02-.268.75.75 0 01.268 1.02l-2.81 4.683h3.755a.75.75 0 01.75.75zM12 2.958a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.708a.75.75 0 01.75-.75z"></path></svg>
              <span class="text-xl font-bold">{{ t('pageTitle') }}</span>
            </NuxtLink>
            <ClientOnly>
              <div class="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <ActionMenu v-if="isPasswordProtected" />
              </div>
            </ClientOnly>
          </div>
        </div>
      </header>

      <!-- Main Content Area: Grows to fill space and centers its content -->
      <main class="flex-1 flex items-center justify-center">
        <div class="max-w-md w-full px-6 text-center">
          <template v-if="error">
            <div class="w-32 h-32 mb-6 mx-auto" :class="errorVisuals.colorClass">
              <component :is="errorVisuals.component" />
            </div>
            <p class="text-7xl sm:text-8xl font-bold opacity-50 tracking-wider" :class="errorVisuals.colorClass">{{ error.statusCode }}</p>
            <h1 class="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{{ errorDetails.title }}</h1>
            <p class="mt-4 text-base text-gray-600 dark:text-gray-400">{{ errorDetails.subtitle }}</p>
            <button @click="handleError" class="mt-8 inline-block py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition">{{ t('errorPage.button') }}</button>
          </template>
        </div>
      </main>

      <!-- Footer (Manually included for reliability) -->
      <footer class="w-full max-w-5xl mx-auto px-4 py-8 z-10">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ThemeSwitcher from '~/components/ThemeSwitcher.vue';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import ActionMenu from '~/components/ActionMenu.vue';
import AppFooter from '~/components/AppFooter.vue';
import ErrorAnimation404 from '~/components/ErrorAnimation404.vue';
import ErrorAnimation500 from '~/components/ErrorAnimation500.vue';
import ErrorAnimationDefault from '~/components/ErrorAnimationDefault.vue';

const { t, locale } = useI18n();
const config = useRuntimeConfig();
const error = useError();

const isPasswordProtected = computed(() => config.public.sitePasswordProtect === 'true');

const errorVisuals = computed(() => {
  const statusCode = error.value?.statusCode;
  if (statusCode === 404) return { component: ErrorAnimation404, colorClass: 'text-indigo-500' };
  if (statusCode && statusCode >= 500) return { component: ErrorAnimation500, colorClass: 'text-red-500' };
  return { component: ErrorAnimationDefault, colorClass: 'text-yellow-500' };
});

const errorDetails = computed(() => {
  const statusCode = error.value?.statusCode;
  if (statusCode === 404) return { title: t('errorPage.title404'), subtitle: t('errorPage.subtitle404') };
  if (statusCode && statusCode >= 500) return { title: t('errorPage.title500'), subtitle: t('errorPage.subtitle500') };
  return { title: t('errorPage.titleOther'), subtitle: t('errorPage.subtitleOther') };
});

useHead({
  title: computed(() => `${error.value?.statusCode || 'Error'} - ${errorDetails.value.title}`),
  htmlAttrs: { lang: locale.value }
});

const handleError = () => clearError({ redirect: '/' });
</script>

<style scoped>
/* Scoped styles are not needed here as the animations are self-contained in their components. */
</style>