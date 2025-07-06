<!-- components/OverallStatusBanner.vue -->
<template>
  <div class="p-4 mb-8 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
    <div v-if="loading" class="flex justify-between items-center animate-pulse">
      <div class="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
      <div class="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
    </div>
    <div v-else class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="relative flex h-3 w-3 items-center justify-center">
          <span class="absolute inline-flex h-full w-full rounded-full animate-dot-pulse z-10" :class="overallStatus.dotColor"></span>
          <span class="absolute inline-flex h-full w-full rounded-full animate-halo-expand" :style="{ backgroundColor: `rgba(${overallStatus.glowColorRgb}, var(--tw-bg-opacity, 1))` }"></span>
        </span>
        <span class="font-bold text-lg">{{ overallStatus.text }}</span>
      </div>
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <span>{{ t('time.updated') }}: {{ lastUpdated }}</span>
        <span class="text-gray-400">|</span> 
        <span>{{ t('time.nextUpdate') }}: {{ countdownMinutes }}:{{ countdownSeconds }}</span>
        <button 
          @click="$emit('refresh')" 
          :disabled="pending" 
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          :title="t('tooltips.refresh')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform duration-500" :class="{'rotate-[-180deg]': pending}"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="m3 2 4 6"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="m21 22-4-6"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Monitor } from '~/types/monitor';

const { t } = useI18n();

const props = defineProps<{
  monitors: Monitor[] | null;
  loading: boolean;
  pending: boolean;
  lastUpdated: string;
  countdownMinutes: string;
  countdownSeconds: string;
}>();

defineEmits(['refresh']);

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
};

const overallStatus = computed(() => {
  if (!props.monitors || props.monitors.length === 0) {
    return { text: t('overallStatus.loading'), dotColor: 'bg-gray-500', glowColorRgb: hexToRgb('#6b7280') };
  }
  const downCount = props.monitors.filter(m => m.status === 8 || m.status === 9).length;
  if (downCount === 0) {
    return { text: t('overallStatus.allOperational'), dotColor: 'bg-green-500', glowColorRgb: hexToRgb('#22c55e') };
  }
  return { text: t('overallStatus.partialOutage'), dotColor: 'bg-orange-500', glowColorRgb: hexToRgb('#f97316') };
});
</script>