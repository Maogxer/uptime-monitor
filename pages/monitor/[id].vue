<!-- pages/monitor/[id].vue -->
<template>
  <div>
    <div class="flex items-center mb-6">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <span>{{ t('backToHome') }}</span>
      </NuxtLink>
    </div>
    <div v-if="pending" class="space-y-8">
      <div class="animate-pulse space-y-4">
        <div class="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div class="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      <div class="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
    </div>
    <div v-else-if="error || !monitor" class="text-center py-20">
        <p class="text-xl font-bold text-red-500">{{ t('details.errorTitle') }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ error?.statusMessage || t('details.errorSubtitle') }}</p>
    </div>
    <div v-else class="space-y-12">
      <div class="border-b border-gray-200 dark:border-white/10 pb-6">
        <div class="flex items-center justify-between">
          <h1 class="text-4xl font-bold truncate" :title="monitor.friendly_name">{{ monitor.friendly_name }}</h1>
          <span class="text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0" :class="statusInfo.color">{{ statusInfo.text }}</span>
        </div>
        <a :href="monitor.url" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-2 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
          {{ monitor.url }}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
      <StatsCards :monitor="monitor" />
      <div class="p-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
        <h2 class="text-xl font-bold mb-4">{{ t('details.responseTime') }}</h2>
        <div class="h-64">
          <ClientOnly>
            <ResponseChart v-if="monitor.status !== 0 && monitor.response_times.length > 0" :monitor="monitor" />
            <div v-else class="flex items-center justify-center h-full"><p class="text-sm text-gray-400 dark:text-gray-500">{{ t('details.noResponseData') }}</p></div>
          </ClientOnly>
        </div>
      </div>
      <div class="p-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
        <h2 class="text-xl font-bold mb-4">{{ t('details.eventLog') }}</h2>
        <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
          <div v-if="monitor.logs.length === 0" class="text-center py-8 text-gray-500">
            <p>{{ t('details.noEvents') }}</p>
          </div>
          <div v-for="log in monitor.logs" :key="log.datetime" class="flex items-start gap-4">
            <div class="flex-shrink-0 mt-1">
              <span class="flex h-6 w-6 items-center justify-center rounded-full" :class="getLogIcon(log.type).bg">
                <component :is="getLogIcon(log.type).icon" class="h-4 w-4" :class="getLogIcon(log.type).text" />
              </span>
            </div>
            <div class="flex-grow">
              <p class="font-semibold">{{ getLogMessage(log) }}</p>
              <p class="text-sm text-gray-500">{{ dayjs.unix(log.datetime).format('YYYY-MM-DD HH:mm:ss') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import dayjs from 'dayjs';
import type { Monitor, Log } from '~/types/monitor';
import ResponseChart from '~/components/ResponseChart.client.vue';
import StatsCards from '~/components/StatsCards.vue';

const { t } = useI18n();
const IconDown = h('svg',{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",'stroke-width':2,'stroke-linecap':"round",'stroke-linejoin':"round"},[h('path',{d:"m6 9 6 6 6-6"})]);
const IconUp = h('svg',{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",'stroke-width':2,'stroke-linecap':"round",'stroke-linejoin':"round"},[h('path',{d:"m18 15-6-6-6 6"})]);
const route = useRoute();
const monitorId = Number(route.params.id);

const { data: monitor, pending, error } = useFetch<Monitor[]>(`/api/status?id=${monitorId}`,{lazy:true,key:`monitor-detail-${monitorId}`,transform:(data)=>data?.[0]||null});

const statusInfo = computed(() => {
  if (!monitor.value) return { text: t('status.paused'), color: 'bg-gray-100 text-gray-600' };
  switch (monitor.value.status) {
    case 2: return { text: t('status.up'), color: 'text-green-700 bg-green-100 dark:bg-green-500/10 dark:text-green-400' };
    case 8: case 9: return { text: t('status.down'), color: 'text-red-700 bg-red-100 dark:bg-red-500/10 dark:text-red-400' };
    default: return { text: t('status.paused'), color: 'text-gray-600 bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400' };
  }
});

const getLogIcon = (type: number) => {
  if (type === 1) return { bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', icon: IconDown };
  if (type === 2) return { bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400', icon: IconUp };
  return { bg: 'bg-gray-100 dark:bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', icon: IconUp };
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  let parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  return parts.length > 0 ? parts.join(' ') : '0s';
};

const getLogMessage = (log: Log) => {
  const duration = formatDuration(log.duration);
  switch (log.type) {
    case 1: return t('logs.downtime', { duration });
    case 2: return t('logs.recovered');
    case 98: return t('logs.started');
    case 99: return t('logs.paused');
    default: return t('logs.unknown', { type: log.type });
  }
};

useHead({
  title: computed(() => monitor.value ? monitor.value.friendly_name : t('overallStatus.loading')),
});
</script>