<template>
  <!-- WRAP the entire card content in a NuxtLink -->
  <NuxtLink 
    :to="`/monitor/${monitor.id}`" 
    class="block p-4 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2 flex-grow min-w-0">
        <h3 class="font-bold text-lg truncate" :title="monitor.friendly_name">{{ monitor.friendly_name }}</h3>
        <!-- The link icon is now less important as the whole card is a link, but we keep it for visual cue -->
        <div class="text-gray-400 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L10 6"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L14 18"/></svg>
        </div>
      </div>
      <span class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" :class="statusInfo.color">{{ statusInfo.text }}</span>
    </div>
    
    <div class="h-20 mb-4">
      <ClientOnly>
        <ResponseChart v-if="monitor.status !== 0" :monitor="monitor" />
        <div v-else class="flex items-center justify-center h-full"><p class="text-sm text-gray-400 dark:text-gray-500">无响应时间数据</p></div>
        <template #fallback><div class="w-full h-full bg-gray-200 dark:bg-gray-700/50 rounded-md animate-pulse"></div></template>
      </ClientOnly>
    </div>

    <div>
      <UptimeHeatmap v-if="monitor.status !== 0" :monitor="monitor" :days="60" today-label="今日" overall-uptime-label="近60天可用率" />
      <PlaceholderHeatmap v-else :days="60" today-label="今日" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Monitor } from '~/types/monitor';
import ResponseChart from './ResponseChart.client.vue';
import UptimeHeatmap from './UptimeHeatmap.vue';
import PlaceholderHeatmap from './PlaceholderHeatmap.vue';

const props = defineProps<{
  monitor: Monitor;
}>();

// Note: I changed the original `a` tag to a `div` for the link icon to avoid nested `<a>` tags, which is invalid HTML.
const statusInfo = computed(() => {
  switch (props.monitor.status) {
    case 2: return { text: '运行中', color: 'text-green-700 bg-green-100 dark:bg-green-500/10 dark:text-green-400' };
    case 8: case 9: return { text: '宕机', color: 'text-red-700 bg-red-100 dark:bg-red-500/10 dark:text-red-400' };
    default: return { text: '已暂停', color: 'text-gray-600 bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400' };
  }
});
</script>