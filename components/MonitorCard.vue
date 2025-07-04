<template>
  <div class="p-4 md:p-5 bg-light-card dark:bg-dark-card rounded-lg border border-light-border/50 dark:border-dark-border/50">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="flex-grow">
        <p class="text-lg font-semibold">{{ monitor.friendly_name }}</p>
        <p class="text-sm text-light-text-sub dark:text-dark-text-sub">HTTP / 5m</p>
      </div>
      <div class="flex items-center mt-2 md:mt-0" :class="statusInfo.colorClass">
        <font-awesome-icon :icon="statusInfo.icon" class="mr-2" />
        <span class="font-semibold">{{ statusInfo.text }}</span>
      </div>
    </div>
    
    <HistoryGrid :ratios="monitor.dailyRatios" />

    <div class="flex justify-between items-center mt-2 text-xs text-light-text-sub dark:text-dark-text-sub">
      <span>{{ t('history') }} 90 {{ t('days') }}</span>
      <span>{{ t('today') }}</span>
    </div>
  </div>
</template>

<script setup>
import HistoryGrid from './HistoryGrid.vue';
const { t } = useI18n();

const props = defineProps({
  monitor: {
    type: Object,
    required: true,
  },
});

const statusInfo = computed(() => {
  switch (props.monitor.status) {
    case 2: return { text: t('status.up'), colorClass: 'text-status-green-light dark:text-status-green-dark', icon: 'check-circle' };
    case 9: return { text: t('status.down'), colorClass: 'text-status-red-light dark:text-status-red-dark', icon: 'exclamation-circle' };
    case 8: return { text: t('status.seemsDown'), colorClass: 'text-status-yellow-light dark:text-status-yellow-dark', icon: 'question-circle' };
    default: return { text: t('status.paused'), colorClass: 'text-status-gray-light dark:text-status-gray-dark', icon: 'pause-circle' };
  }
});
</script>