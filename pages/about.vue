<!-- pages/about.vue -->
<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <div class="text-center">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">{{ t('about.title') }}</h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{{ t('about.subtitle') }}</p>
    </div>

    <!-- Features Section -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">{{ t('about.features.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Feature Cards -->
        <div v-for="item in features" :key="item.title" class="p-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
          <div class="flex items-center gap-4">
            <span class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <component :is="item.icon" class="h-6 w-6" />
            </span>
            <h3 class="text-xl font-semibold">{{ item.title }}</h3>
          </div>
          <p class="mt-3 text-gray-600 dark:text-gray-400">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">{{ t('about.stack.title') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
        <!-- Tech Logos -->
        <a v-for="tech in techStack" :key="tech.name" :href="tech.url" target="_blank" rel="noopener noreferrer" :title="tech.name" class="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300">
          <component :is="tech.icon" class="h-12 w-12" />
        </a>
      </div>
    </section>

    <!-- Source Code Section -->
    <section class="text-center p-8 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
      <h2 class="text-3xl font-bold">{{ t('about.source.title') }}</h2>
      <p class="mt-3 max-w-xl mx-auto text-gray-600 dark:text-gray-400">{{ t('about.source.desc') }}</p>
      <a :href="config.public.githubUrl" target="_blank" rel="noopener noreferrer" class="mt-6 inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition">
        {{ t('about.source.button') }}
      </a>
    </section>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue';

const { t } = useI18n();
const config = useRuntimeConfig();

useHead({
  title: t('about.title')
});

// Helper to create simple path-based SVG components
const icon = (path: string) => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: path })]);

const features = computed(() => [
  { title: t('about.features.items.monitoring.title'), desc: t('about.features.items.monitoring.desc'), icon: icon('M22 12h-4l-3 9L9 3l-3 9H2') },
  { title: t('about.features.items.history.title'), desc: t('about.features.items.history.desc'), icon: icon('M3 3v18h18') },
  { title: t('about.features.items.i18n.title'), desc: t('about.features.items.i18n.desc'), icon: icon('m5 8 6 6m-3-6 6 6m-4-1.5a9 9 0 1 0 0 12 9 9 0 1 0 0-12z') },
  { title: t('about.features.items.theming.title'), desc: t('about.features.items.theming.desc'), icon: icon('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z') },
  { title: t('about.features.items.auth.title'), desc: t('about.features.items.auth.desc'), icon: icon('M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2') },
  { title: t('about.features.items.responsive.title'), desc: t('about.features.items.responsive.desc'), icon: icon('M8 6h10M6 12h10M6 18h10') },
]);

const techStack = computed(() => [
  { name: 'Nuxt 3', icon: icon('M18.8 3.2a.2.2 0 0 0-.2.1l-6.2 10.1-4-6.5a.2.2 0 0 0-.2-.1h-5.2c-.2 0-.2.2 0 .4l7.2 11.7c.1.1.2.1.2 0l7.2-11.7c.1-.2 0-.4-.1-.4h-3.3z'), url: 'https://nuxt.com' },
  { name: 'Vue 3', icon: icon('M18.8 3.2a.2.2 0 0 0-.2.1l-6.2 10.1-4-6.5a.2.2 0 0 0-.2-.1h-5.2c-.2 0-.2.2 0 .4l7.2 11.7c.1.1.2.1.2 0l7.2-11.7c.1-.2 0-.4-.1-.4h-3.3z'), url: 'https://vuejs.org' },
  { name: 'TypeScript', icon: icon('M9 18V5.2H6.5V3h11v2.2H15V18h-2.2V8.4h-.2l-2.4 4.5v1.2h3.3V16h-3.3v2H9z'), url: 'https://www.typescriptlang.org' },
  { name: 'Tailwind CSS', icon: icon('M10.5 17.5.5 12l10-5.5 10 5.5-10 5.5zM.5 12l10 5.5 10-5.5M10.5 6.5l10-5.5-10 5.5-10-5.5'), url: 'https://tailwindcss.com' },
  { name: 'Chart.js', icon: icon('M3 3v18h18M18 17v-6a2 2 0 0 0-4 0v6m-4-3v3a2 2 0 0 0 4 0v-3m-4-1V8a2 2 0 0 1 4 0v2'), url: 'https://www.chartjs.org' },
  { name: 'UptimeRobot', icon: icon('m9.06 18.94 1.28-1.28a3.2 3.2 0 0 0-4.52-4.52l-1.28 1.28a3.2 3.2 0 0 0 4.52 4.52zM14.94 5.06l-1.28 1.28a3.2 3.2 0 0 0 4.52 4.52l1.28-1.28a3.2 3.2 0 0 0-4.52-4.52z'), url: 'https://uptimerobot.com' },
]);
</script>