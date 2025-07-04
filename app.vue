<template>
  <div class="min-h-screen font-sans antialiased">
    <div class="max-w-4xl mx-auto px-4">
      <AppHeader />

      <main>
        <!-- Overall Status -->
        <div class="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ overallStatusText }}</h2>
            <div class="text-right">
              <p class="font-semibold text-lg" :class="overallUptimeColor">{{ overallUptime.toFixed(3) }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('overallUptime') }} ({{ $t('last90Days') }})</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-10">
          <p>{{ $t('loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-10 text-red-500">
           <p>{{ $t('error') }}</p>
           <p class="text-sm text-gray-500 mt-2">{{ error.statusMessage }}</p>
        </div>

        <!-- Monitor List -->
        <div v-else-if="monitors" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard v-for="monitor in monitors" :key="monitor.id" :monitor="monitor" />
        </div>
      </main>

      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Monitor } from '~/server/api/status';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import StatusCard from '~/components/StatusCard.vue';

// --- 正确的写法 ---
// 1. 在顶层调用 useI18n() 并解构出需要的内容
const { t, locale } = useI18n();

const { data: monitors, pending, error } = await useFetch<Monitor[]>('/api/status', {
  lazy: true // Use lazy fetch for better UX
});

const overallStatus = computed(() => {
  if (!monitors.value || monitors.value.length === 0) {
    return 'operational';
  }

  const downMonitors = monitors.value.filter(m => m.status === 8 || m.status === 9).length;
  const totalMonitors = monitors.value.length;

  if (downMonitors === 0) return 'operational';
  if (downMonitors === totalMonitors) return 'major';
  if (downMonitors < totalMonitors / 2) return 'degraded';
  return 'partial';
});

const overallStatusText = computed(() => {
  switch (overallStatus.value) {
    case 'operational': return t('allSystemsOperational');
    case 'degraded': return t('degradedPerformance');
    case 'partial': return t('partialOutage');
    case 'major': return t('majorOutage');
    default: return t('loading');
  }
});

const overallUptime = computed(() => {
  if (!monitors.value || monitors.value.length === 0) return 100;

  const totalUptime = monitors.value.reduce((acc, monitor) => {
    const ratios = monitor.custom_uptime_ratios.split('-').map(Number);
    return acc + (ratios[3] || 0); // 90-day uptime
  }, 0);

  return totalUptime / monitors.value.length;
});

const overallUptimeColor = computed(() => {
  const uptime = overallUptime.value;
  if (uptime >= 99.9) return 'text-green-500';
  if (uptime >= 99) return 'text-yellow-500';
  return 'text-red-500';
});

useHead({
  // 2. 在这里使用顶层定义的 t 和 locale
  title: t('title'),
  meta: [
    { name: 'description', content: t('description') }
  ],
  htmlAttrs: {
    lang: locale // 直接使用 locale，它本身就是一个 ref，会自动更新
  }
})
</script>

<style>
/* For smooth transitions */
body {
  transition: background-color 0.3s, color 0.3s;
}
</style>