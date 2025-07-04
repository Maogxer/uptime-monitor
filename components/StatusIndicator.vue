<template>
  <div class="flex items-center space-x-2">
    <span
      class="w-3 h-3 rounded-full"
      :class="{
        'bg-status-up': monitorStatus === 'up',
        'bg-status-down': monitorStatus === 'down',
        'bg-status-paused': monitorStatus === 'paused',
        'animate-pulse-fast': monitorStatus === 'down'
      }"
    ></span>
    <span class="text-sm font-semibold capitalize" :class="statusTextColor">
      {{ $t(`status.${monitorStatus}`) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Monitor } from '~/server/api/status';

const props = defineProps<{
  status: Monitor['status']
}>();

const monitorStatus = computed<'up' | 'down' | 'paused'>(() => {
  switch (props.status) {
    case 2: return 'up';
    case 9: return 'down';
    case 8: return 'down'; // seems down
    case 0: return 'paused';
    case 1: return 'paused'; // not checked yet
    default: return 'paused';
  }
});

const statusTextColor = computed(() => {
  switch (monitorStatus.value) {
    case 'up': return 'text-status-up';
    case 'down': return 'text-status-down';
    default: return 'text-status-paused';
  }
});
</script>