<!-- components/StatsCards.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div 
      v-for="stat in stats" 
      :key="stat.label" 
      class="p-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
      <p 
        class="text-4xl font-bold mt-2"
        :class="stat.uptime > 99.9 ? 'text-green-500 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'"
      >
        {{ stat.uptime.toFixed(2) }}<span class="text-xl">%</span>
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ t('stats.incidents', { count: stat.incidents }) }}, {{ stat.downtimeFormatted }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Monitor, Log } from '~/types/monitor';

const { t } = useI18n();
const props = defineProps<{ monitor: Monitor }>();

const formatDowntime = (totalSeconds: number): string => {
  if (totalSeconds === 0) return t('stats.downtime', { duration: '0s' });
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  let parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 && h === 0) parts.push(`${s}s`);
  return t('stats.downtime', { duration: parts.join(' ') });
};

const calculateStatsForPeriod = (logs: Log[], days: number): { uptime: number, incidents: number, downtimeFormatted: string } => {
  const now = Date.now() / 1000;
  const periodStart = now - (days * 24 * 60 * 60);
  const totalPeriodSeconds = days * 24 * 60 * 60;
  let totalDowntimeInPeriod = 0;
  let incidents = 0;

  logs.forEach(log => {
    if (log.type === 1 && log.datetime >= periodStart) {
      incidents++;
      totalDowntimeInPeriod += log.duration;
    }
  });

  const uptimePercentage = Math.max(0, (1 - totalDowntimeInPeriod / totalPeriodSeconds)) * 100;
  return {
    uptime: uptimePercentage,
    incidents,
    downtimeFormatted: formatDowntime(totalDowntimeInPeriod)
  };
};

const stats = computed(() => {
  if (!props.monitor?.logs) return [];
  return [
    { label: t('stats.last1Day'), ...calculateStatsForPeriod(props.monitor.logs, 1) },
    { label: t('stats.last7Days'), ...calculateStatsForPeriod(props.monitor.logs, 7) },
    { label: t('stats.last30Days'), ...calculateStatsForPeriod(props.monitor.logs, 30) },
    { label: t('stats.last60Days'), ...calculateStatsForPeriod(props.monitor.logs, 60) },
  ];
});
</script>