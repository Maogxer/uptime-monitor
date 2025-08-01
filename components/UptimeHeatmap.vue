<!-- components/UptimeHeatmap.vue -->
<template>
  <div>
    <div class="grid grid-flow-col auto-cols-fr gap-px w-full">
      <div
        v-for="day in heatmapData.days"
        :key="day.date"
        class="h-5 rounded-sm transform transition-transform duration-150 ease-in-out
               hover:translate-y-[-2px] hover:z-10"
        :class="day.color"
        :title="day.tooltip"
      ></div>
    </div>
    
    <div class="flex justify-between text-xs text-gray-400 mt-1.5">
      <span>{{ startDate }}</span>
      <span class="font-semibold text-gray-500 dark:text-gray-300">{{ overallUptimeLabel }}: {{ heatmapData.overallUptime.toFixed(2) }}%</span>
      <span>{{ todayLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import type { Log, Monitor } from '~/types/monitor';

const { t } = useI18n();

const props = defineProps<{
  monitor: Monitor,
  days: number,
  todayLabel: string,
  overallUptimeLabel: string,
}>();

const startDate = computed(() => dayjs().subtract(props.days - 1, 'day').format('YYYY-MM-DD'));

const heatmapData = computed(() => {
  const daysMap = new Map<string, { downtime: number }>();
  const today = dayjs().endOf('day');
  const daySeconds = 24 * 60 * 60;
  
  for (let i = 0; i < props.days; i++) {
    const date = today.subtract(i, 'day').format('YYYY-MM-DD');
    daysMap.set(date, { downtime: 0 });
  }

  (props.monitor.logs || []).forEach(log => {
    if (log.type === 1) {
      const logDay = dayjs.unix(log.datetime).format('YYYY-MM-DD');
      if (daysMap.has(logDay)) {
        daysMap.get(logDay)!.downtime += log.duration;
      }
    }
  });

  let totalUptime = 0;
  const daysData = Array.from(daysMap.entries())
    .map(([date, { downtime }]) => {
      const uptime = downtime === 0 ? 100 : Math.max(0, (1 - downtime / daySeconds)) * 100;
      totalUptime += uptime;
      
      let color = 'bg-green-500';
      if (uptime < 100 && uptime >= 99) color = 'bg-yellow-400';
      else if (uptime < 99) color = 'bg-red-500';
      
      return {
        date,
        uptime,
        color,
        tooltip: t('heatmap.dailyUptime', { uptime: uptime.toFixed(2) }),
      };
    });

  return {
    days: daysData.reverse(),
    overallUptime: totalUptime / props.days
  };
});
</script>