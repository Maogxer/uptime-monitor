<!-- components/PlaceholderHeatmap.vue -->
<template>
  <div>
    <div class="grid grid-flow-col auto-cols-fr gap-px w-full">
      <div
        v-for="i in days"
        :key="i"
        class="h-5 rounded-sm bg-gray-200 dark:bg-gray-700/50
               transform transition-transform duration-150 ease-in-out
               hover:translate-y-[-2px] hover:z-10"
        title="无可用数据"
      ></div>
    </div>
    <div class="flex justify-between text-xs text-gray-400 mt-1.5">
      <span>{{ startDate }}</span>
      <span class="font-semibold text-gray-500 dark:text-gray-300">无数据</span>
      <span>{{ todayLabel }}</span> <!-- NEW: Display todayLabel -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps<{
  days: number,
  todayLabel: string // NEW: Add todayLabel prop
}>();

const startDate = computed(() => dayjs().subtract(props.days - 1, 'day').format('YYYY-MM-DD'));
</script>