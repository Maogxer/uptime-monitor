<!-- pages/index.vue -->
<template>
  <div>
    <OverallStatusBanner
      :monitors="monitors"
      :loading="initialLoading"
      :pending="pending"
      :last-updated="lastUpdated"
      :countdown-minutes="countdownMinutes"
      :countdown-seconds="countdownSeconds"
      @refresh="triggerRefresh"
    />

    <!-- Loading Skeleton -->
    <div v-if="initialLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 6" :key="i" class="p-4 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg animate-pulse"><div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div><div class="h-28 bg-gray-300 dark:bg-gray-700 rounded"></div></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg"><p class="text-xl font-bold text-red-500">请求数据失败</p><p class="text-sm text-gray-500 mt-2">错误: {{ error.statusMessage }}</p></div>
    
    <!-- Monitor List -->
    <div v-else class="space-y-12">
        <div v-for="group in monitorGroups" :key="group.key" v-show="group.monitors.length > 0">
          
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold border-l-4 pl-3" :class="group.borderColor">
              {{ group.title }} ({{ group.monitors.length }})
            </h2>

            <button 
              v-if="group.sortable" 
              @click="toggleSortOrder"
              class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-200 dark:hover:text-indigo-400 dark:hover:bg-gray-700 transition-all"
              :title="`按延迟${sortOrder === 'desc' ? '从高到低' : '从低到高'}排序`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-arrow-down-wide-narrow transition-transform duration-300" :class="{ 'rotate-180': sortOrder === 'asc' }"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h4"/><path d="M11 8h7"/><path d="M11 12h10"/></svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MonitorCard
              v-for="monitor in group.monitors"
              :key="monitor.id"
              :monitor="monitor"
            />
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';
import type { Monitor } from '~/types/monitor';
import { useRefreshTimer } from '~/composables/useRefreshTimer';

// Import components used on this page
import OverallStatusBanner from '~/components/OverallStatusBanner.vue';
import MonitorCard from '~/components/MonitorCard.vue';

// All the logic that was in app.vue now lives here
const { data: monitors, pending, error, refresh } = await useFetch<Monitor[]>('/api/status', {
  lazy: true,
  default: () => []
});
const initialLoading = computed(() => pending.value && (!monitors.value || monitors.value.length === 0));

const lastUpdated = ref(dayjs().format('HH:mm:ss'));
const performRefresh = async () => { if (!pending.value) await refresh(); };
const triggerRefresh = () => { if (!pending.value) performRefresh(); };
const { countdownMinutes, countdownSeconds, resetTimer } = useRefreshTimer(performRefresh, 300);
watch(pending, (isPending, wasPending) => {
  if (wasPending && !isPending) {
    lastUpdated.value = dayjs().format('HH:mm:ss');
    resetTimer();
  }
});

const sortOrder = ref<'asc' | 'desc'>('desc');
const toggleSortOrder = () => { sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'; };
const getLatestLatency = (monitor: Monitor): number => monitor.response_times?.[0]?.value ?? 0;

const monitorGroups = computed(() => {
    const groups = { up: [], down: [], paused: [] } as { up: Monitor[], down: Monitor[], paused: Monitor[] };
    if (!monitors.value) return [];
    
    for (const monitor of monitors.value) {
        if (monitor.status === 2) groups.up.push(monitor);
        else if (monitor.status === 8 || monitor.status === 9) groups.down.push(monitor);
        else if (monitor.status === 0) groups.paused.push(monitor);
    }

    groups.up.sort((a, b) => {
      const latencyA = getLatestLatency(a);
      const latencyB = getLatestLatency(b);
      return sortOrder.value === 'asc' ? latencyA - latencyB : latencyB - latencyA;
    });
    
    return [
        { key: 'down', title: '出现异常', monitors: groups.down, borderColor: 'border-red-500', sortable: false },
        { key: 'up', title: '运行中', monitors: groups.up, borderColor: 'border-green-500', sortable: true },
        { key: 'paused', title: '已暂停', monitors: groups.paused, borderColor: 'border-gray-400', sortable: false },
    ];
});

useHead({
  title: '站点状态监控'
})
</script>