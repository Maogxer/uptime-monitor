<template>
  <div class="relative overflow-hidden transition-colors duration-500" :style="statusInfo.bgStyle">
    <div class="relative z-10 pt-16 pb-24 text-white text-center">
      <div class="flex justify-center items-center gap-x-4 mb-2">
        <div class="flex-shrink-0">
          <span class="relative flex h-6 w-6">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white/75"></span>
            <span class="relative inline-flex rounded-full h-6 w-6 bg-white"></span>
          </span>
        </div>
        <h1 class="text-4xl font-bold">{{ statusInfo.text }}</h1>
      </div>
      <div class="text-sm opacity-80">
        <span>更新于 {{ lastUpdated }}</span>
        <span class="mx-2">|</span>
        <span>将于 {{ countdownMinutes }}:{{ countdownSeconds }} 后刷新</span>
        <button @click="$emit('refresh')" class="ml-2 inline-block align-middle" title="立即刷新">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-refresh-cw transition-transform" :class="{ 'rotate-180': isRefreshing }"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        </button>
      </div>
    </div>
    <div class="absolute bottom-0 left-1/2 w-[200%] h-48 bg-gray-50 dark:bg-gray-900 rounded-[100%] -translate-x-1/2 translate-y-1/2"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
const props = defineProps<{ monitors: any[], isRefreshing: boolean }>();
const emit = defineEmits(['refresh']);
const REFRESH_INTERVAL_SECONDS = 300;
const lastUpdated = ref(dayjs().format('HH:mm:ss'));
const countdown = ref(REFRESH_INTERVAL_SECONDS);
let countdownTimer: NodeJS.Timeout;
const countdownMinutes = computed(() => Math.floor(countdown.value / 60).toString().padStart(2, '0'));
const countdownSeconds = computed(() => (countdown.value % 60).toString().padStart(2, '0'));
const statusColors = {
  ok: { hex: '#22c55e' }, warning: { hex: '#f97316' }, error: { hex: '#ef4444' }, loading: { hex: '#6b7280' },
};
const statusInfo = computed(() => {
  if (!props.monitors || props.monitors.length === 0) {
    const color = statusColors.loading;
    return { text: '数据加载中', bgStyle: { backgroundColor: color.hex } };
  }
  const downCount = props.monitors.filter(m => m.status !== 2).length;
  if (downCount === 0) {
    const color = statusColors.ok;
    return { text: '所有站点运行正常', bgStyle: { backgroundColor: color.hex } };
  } else if (downCount < props.monitors.length) {
    const color = statusColors.warning;
    return { text: '部分站点出现异常', bgStyle: { backgroundColor: color.hex } };
  } else {
    const color = statusColors.error;
    return { text: '所有站点出现故障', bgStyle: { backgroundColor: color.hex } };
  }
});
const startCountdown = () => { clearInterval(countdownTimer); countdown.value = REFRESH_INTERVAL_SECONDS; countdownTimer = setInterval(() => { if (countdown.value > 0) countdown.value--; else if (!props.isRefreshing) emit('refresh'); }, 1000); };
onMounted(() => startCountdown());
onUnmounted(() => clearInterval(countdownTimer));
const reset = () => { lastUpdated.value = dayjs().format('HH:mm:ss'); startCountdown(); }
defineExpose({ reset });
</script>