<!-- app.vue -->
<template>
  <div class="bg-gray-50 dark:bg-[#0B0F19] text-gray-800 dark:text-gray-200">
    <!-- Background pattern -->
    <div 
      class="fixed inset-0 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.1)_0%,rgba(67,56,202,0)_35%)] pointer-events-none"
    ></div>

    <div class="relative flex flex-col min-h-screen">
      <header class="fixed top-0 left-0 w-full bg-gray-50/90 dark:bg-[#0B0F19]/90 backdrop-blur-sm z-50 shadow-md">
        <div class="max-w-5xl mx-auto px-4 pt-8 pb-4">
          <div class="flex justify-between items-center">
            <a href="/" class="flex items-center gap-2">
              <svg class="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.498 21.042a.75.75 0 01-.483-.153.755.755 0 01-.25-1.033L9.58 15H4.75a.75.75 0 010-1.5h5.503a.75.75 0 01.62.345l-4.12 6.866a.75.75 0 01-.255.334zM21 19.542a.75.75 0 01-.75.75h-5.503a.75.75 0 01-.62-.345l4.12-6.866a.75.75 0 011.02-.268.75.75 0 01.268 1.02l-2.81 4.683h3.755a.75.75 0 01.75.75zM12 2.958a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.708a.75.75 0 01.75-.75z"></path>
              </svg>
              <span class="text-xl font-bold">站点监测</span>
            </a>
            
            <ClientOnly>
              <ThemeSwitcher />
              <template #fallback>
                <div class="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </header>
      
      <main class="flex-grow w-full max-w-5xl mx-auto px-4 py-8 pt-28 z-10"> 
        <div class="p-4 mb-8 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
          <div v-if="pending && !monitors.length" class="flex justify-between items-center animate-pulse">
            <div class="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div class="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>
          <div v-else class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <!-- NEW: Double span structure for dot + halo -->
                <span class="relative flex h-3 w-3 items-center justify-center"> <!-- Outer container for positioning -->
                  <!-- The solid dot, now with dot-pulse animation -->
                  <span class="absolute inline-flex h-full w-full rounded-full animate-dot-pulse z-10" :class="overallStatus.dotColor"></span>
                  <!-- The glowing halo, with halo-expand animation -->
                  <span 
                    class="absolute inline-flex h-full w-full rounded-full animate-halo-expand"
                    :style="{ backgroundColor: `rgba(${overallStatus.glowColorRgb}, var(--tw-bg-opacity, 1))` }"
                  >
                  </span>
                </span>
                <span class="font-bold text-lg">{{ overallStatus.text }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>更新于: {{ lastUpdated }}</span>
                <span class="text-gray-400">|</span> 
                <span>下次刷新: {{ countdownMinutes }}:{{ countdownSeconds }}</span>
                <button @click="triggerRefresh" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="立即刷新">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform duration-500" :class="{'rotate-[-180deg]': pending}"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="m3 2 4 6"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="m21 22-4-6"></path></svg>
                </button>
              </div>
          </div>
        </div>

        <div v-if="pending && !monitors.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 6" :key="i" class="p-4 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg animate-pulse"><div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div><div class="h-28 bg-gray-300 dark:bg-gray-700 rounded"></div></div>
        </div>
        
        <div v-else-if="error" class="text-center py-10 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg"><p class="text-xl font-bold text-red-500">请求数据失败</p><p class="text-sm text-gray-500 mt-2">请检查您的网络连接或 API 密钥。</p></div>
        
        <div v-else class="space-y-12">
          <div v-if="groupedMonitors.down.length > 0">
            <h2 class="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-3">出现异常 ({{ groupedMonitors.down.length }})</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="monitor in groupedMonitors.down" :key="monitor.id" class="p-4 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow"><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg truncate" :title="monitor.friendly_name">{{ monitor.friendly_name }}</h3><span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="getStatus(monitor).color">{{ getStatus(monitor).text }}</span></div><div class="h-20 mb-4"><ResponseChart :monitor="monitor" /></div><div><UptimeHeatmap :monitor="monitor" :days="60" today-label="今日" overall-uptime-label="近60天可用率" /></div></div>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-3">运行中 ({{ groupedMonitors.up.length }})</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="monitor in groupedMonitors.up" :key="monitor.id" class="p-4 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow"><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg truncate" :title="monitor.friendly_name">{{ monitor.friendly_name }}</h3><span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="getStatus(monitor).color">{{ getStatus(monitor).text }}</span></div><div class="h-20 mb-4"><ResponseChart :monitor="monitor" /></div><div><UptimeHeatmap :monitor="monitor" :days="60" today-label="今日" overall-uptime-label="近60天可用率" /></div></div>
            </div>
          </div>
          <div v-if="groupedMonitors.paused.length > 0">
            <h2 class="text-2xl font-bold mb-4 border-l-4 border-gray-400 pl-3">已暂停 ({{ groupedMonitors.paused.length }})</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="monitor in groupedMonitors.paused" :key="monitor.id" class="p-4 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow"><div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg truncate" :title="monitor.friendly_name">{{ monitor.friendly_name }}</h3><span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="getStatus(monitor).color">{{ getStatus(monitor).text }}</span></div><div class="h-20 mb-4 flex items-center justify-center"><p class="text-sm text-gray-400 dark:text-gray-500">无响应时间数据</p></div><div><PlaceholderHeatmap :days="60" /></div></div>
            </div>
          </div>
        </div>
      </main>
      
      <footer class="w-full max-w-5xl mx-auto px-4 py-8 z-10">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ThemeSwitcher from '~/components/ThemeSwitcher.vue';
import UptimeHeatmap from '~/components/UptimeHeatmap.vue';
import ResponseChart from '~/components/ResponseChart.client.vue';
import PlaceholderHeatmap from '~/components/PlaceholderHeatmap.vue';
import AppFooter from '~/components/AppFooter.vue';
import dayjs from 'dayjs';

interface Log { type: number; datetime: number; duration: number; }
interface ResponseTime { datetime: number; value: number; }
interface Monitor { id: number; friendly_name: string; status: number; logs: Log[]; response_times: ResponseTime[]; url: string; } 

const { data: monitors, pending, error, refresh } = await useFetch<Monitor[]>('/api/status', { lazy: true, default: () => [] });
const initialLoading = computed(() => pending.value && !monitors.value.length);

const REFRESH_INTERVAL_SECONDS = 300;
const lastUpdated = ref(dayjs().format('HH:mm:ss')); 
const countdown = ref(REFRESH_INTERVAL_SECONDS);
let countdownTimer: NodeJS.Timeout;

const countdownMinutes = computed(() => Math.floor(countdown.value / 60).toString().padStart(2, '0'));
const countdownSeconds = computed(() => (countdown.value % 60).toString().padStart(2, '0'));

// FIX: Renamed to avoid direct call in setInterval, which can cause issues.
const performRefresh = async () => {
  if (pending.value) return; // Prevent multiple refreshes if one is already in progress
  
  clearInterval(countdownTimer); // Stop current countdown
  
  try {
    await refresh(); // Perform the fetch
    lastUpdated.value = dayjs().format('HH:mm:ss'); // Update timestamp only on success
    countdown.value = REFRESH_INTERVAL_SECONDS; // Reset countdown only on success
  } catch (e) {
    console.error("Refresh failed:", e);
    // Optionally: show a persistent error message or stop countdown if errors persist
    // For now, we just let the error state in template handle it.
    // Do NOT reset countdown here, let it reach zero again to retry if needed.
  } finally {
    startCountdown(); // Always restart countdown to keep the cycle going
  }
};

// This is the function called by the button and interval
const triggerRefresh = () => {
  performRefresh();
};

const startCountdown = () => {
  clearInterval(countdownTimer); // Clear any existing timer
  // Only set interval if not already pending
  if (!pending.value) { // This check prevents starting multiple timers if `refresh()` is slow
    countdownTimer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        triggerRefresh(); // Trigger refresh when countdown hits zero
      }
    }, 1000);
  }
};

onMounted(() => {
  // FIX: Perform initial fetch outside of countdown, then start countdown.
  // This ensures data is loaded and displayed before the countdown logic potentially re-triggers.
  // Also, initialLoading will correctly reflect this initial state.
  triggerRefresh(); 
});
onUnmounted(() => {
  clearInterval(countdownTimer);
});

// Helper function to convert hex to RGB for CSS variables
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
};

const overallStatus = computed(() => {
  let key: string;
  let text: string;
  let dotColorClass: string;
  let glowColorHex: string; // This will be the base color for the glow
  
  if (!monitors.value || monitors.value.length === 0) {
    key = 'loading'; text = '数据加载中'; dotColorClass = 'bg-gray-500'; glowColorHex = '#6b7280';
  } else {
    const downCount = monitors.value.filter(m => m.status !== 2).length;
    if (downCount === 0) {
      key = 'ok'; text = '所有系统运行正常'; dotColorClass = 'bg-green-500'; glowColorHex = '#22c55e';
    } else {
      key = 'warning'; text = '部分站点出现异常'; dotColorClass = 'bg-orange-500'; glowColorHex = '#f97316';
    }
  }

  return { 
    key, 
    text, 
    dotColor: dotColorClass, // This is a Tailwind class for the solid dot
    glowColor: glowColorHex, // This is the HEX code for --glow-color
    glowColorRgb: hexToRgb(glowColorHex) // This is the RGB string for --glow-color-rgb
  };
});

const groupedMonitors = computed(() => {
  const groups = { up: [], down: [], paused: [] } as { up: Monitor[], down: Monitor[], paused: Monitor[] };
  if (!monitors.value) return groups;
  for (const monitor of monitors.value) {
    if (monitor.status === 2) groups.up.push(monitor);
    else if (monitor.status === 8 || monitor.status === 9) groups.down.push(monitor);
    else groups.paused.push(monitor);
  }
  return groups;
});

function getStatus(monitor: Monitor) {
  switch (monitor.status) {
    case 2: return { text: '运行中', color: 'text-green-700 bg-green-100 dark:bg-green-500/10 dark:text-green-400' };
    case 8: case 9: return { text: '宕机', color: 'text-red-700 bg-red-100 dark:bg-red-500/10 dark:text-red-400' };
    default: return { text: '已暂停', color: 'text-gray-600 bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400' };
  }
}
</script>