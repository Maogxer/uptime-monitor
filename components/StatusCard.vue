<template>
  <div class="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-bold text-lg">{{ monitor.friendly_name }}</h3>
      <StatusIndicator :status="monitor.status" />
    </div>
    <div class="h-24 mb-3">
       <ResponseChart :response-times="monitor.response_times" :status="monitor.status" />
    </div>
    <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
       <span>{{ $t('uptime') }} ({{ $t('last90Days') }})</span>
       <span class="font-semibold" :class="uptimeColor">{{ uptime90Days }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Monitor } from '~/server/api/status';
import StatusIndicator from './StatusIndicator.vue';
import ResponseChart from './ResponseChart.vue';

const props = defineProps<{
  monitor: Monitor
}>();

const uptimeRatios = computed(() => props.monitor.custom_uptime_ratios.split('-').map(Number));

const uptime90Days = computed(() => uptimeRatios.value[3] || 0);

const uptimeColor = computed(() => {
  const uptime = uptime90Days.value;
  if (uptime >= 99.9) return 'text-green-500';
  if (uptime >= 99) return 'text-yellow-500';
  return 'text-red-500';
});

</script>