<template>
  <div v-if="overallStatus" class="p-4 rounded-lg mb-8" :class="overallStatus.bgColorClass">
    <h2 class="text-xl font-semibold flex items-center" :class="overallStatus.textColorClass">
      <font-awesome-icon :icon="overallStatus.icon" class="mr-3"/>
      {{ overallStatus.text }}
    </h2>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({
  monitors: {
    type: Array,
    required: true,
  }
})

const overallStatus = computed(() => {
  if (!props.monitors || props.monitors.length === 0) {
    return null
  }
  
  const total = props.monitors.length
  const upCount = props.monitors.filter(m => m.status === 2).length

  if (upCount === total) {
    return { text: t('allSystemsOperational'), icon: 'check-circle', bgColorClass: 'bg-status-green-light/10 dark:bg-status-green-dark/10', textColorClass: 'text-status-green-light dark:text-status-green-dark' }
  } else if (upCount < total && upCount > 0) {
    return { text: t('someSystemsDown'), icon: 'exclamation-circle', bgColorClass: 'bg-status-yellow-light/10 dark:bg-status-yellow-dark/10', textColorClass: 'text-status-yellow-light dark:text-status-yellow-dark' }
  } else {
    return { text: t('allSystemsDown'), icon: 'exclamation-circle', bgColorClass: 'bg-status-red-light/10 dark:bg-status-red-dark/10', textColorClass: 'text-status-red-light dark:text-status-red-dark' }
  }
})
</script>