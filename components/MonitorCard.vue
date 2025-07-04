<template>
  <div class="p-4 md:p-5 bg-light-card dark:bg-dark-card rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent dark:border-dark-border">
    <div class="flex-grow w-full md:w-auto">
      <div class="flex items-center">
        <span class="mr-3 text-lg" :class="statusInfo.colorClass">
          <font-awesome-icon :icon="statusInfo.icon" />
        </span>
        <p class="text-lg font-semibold">{{ monitor.friendly_name }}</p>
      </div>
      <a :href="monitor.url" target="_blank" rel="noopener noreferrer" class="text-sm text-light-text-sub dark:text-dark-text-sub hover:underline break-all ml-8">{{ monitor.url }}</a>
    </div>

    <div class="flex items-center mt-4 md:mt-0 space-x-6 text-sm w-full md:w-auto justify-end">
      <div class="text-right">
        <p class="text-light-text-sub dark:text-dark-text-sub">{{ t('daily') }}</p>
        <p class="font-semibold text-base">{{ monitor.daily_ratio }}%</p>
      </div>
      <div class="text-right">
        <p class="text-light-text-sub dark:text-dark-text-sub">{{ statusInfo.text }}</p>
        <p class="font-semibold text-base">{{ formatLog(monitor.log) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({
  monitor: {
    type: Object,
    required: true,
  },
})

const statusInfo = computed(() => {
  switch (props.monitor.status) {
    case 2: return { text: t('status.up'), colorClass: 'text-status-green-light dark:text-status-green-dark', icon: 'check-circle' };
    case 9: return { text: t('status.down'), colorClass: 'text-status-red-light dark:text-status-red-dark', icon: 'exclamation-circle' };
    case 8: return { text: t('status.seemsDown'), colorClass: 'text-status-yellow-light dark:text-status-yellow-dark', icon: 'question-circle' };
    default: return { text: t('status.paused'), colorClass: 'text-status-gray-light dark:text-status-gray-dark', icon: 'pause-circle' };
  }
})

const formatLog = (log) => {
  if (!log) return t('noData');
  const duration = log.duration; // seconds
  const days = Math.floor(duration / 86400);
  const hours = Math.floor((duration % 86400) / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `< 1m`;
}
</script>