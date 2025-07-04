<template>
  <div class="grid grid-cols-30 grid-rows-3 gap-px bg-light-border dark:bg-dark-border p-px rounded-md mt-3">
    <template v-for="(ratio, index) in ratios" :key="index">
      <div 
        class="h-4 w-full"
        :class="getUptimeColor(ratio)"
        :title="getTooltipText(index, ratio)">
      </div>
    </template>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  ratios: {
    type: Array,
    default: () => Array(90).fill(0), // 默认填充90个空数据
  },
})

// 根据可用率返回颜色class
const getUptimeColor = (ratio) => {
  if (ratio === 100) return 'bg-status-green-light dark:bg-status-green-dark'
  if (ratio > 99) return 'bg-status-yellow-light dark:bg-status-yellow-dark'
  if (ratio > 0) return 'bg-status-red-light dark:bg-status-red-dark'
  return 'bg-gray-200 dark:bg-gray-600' // No data
}

// 生成鼠标悬浮时的提示文字
const getTooltipText = (index, ratio) => {
  const date = dayjs().subtract(89 - index, 'day').format('YYYY-MM-DD')
  return `${date}: ${ratio.toFixed(3)}%`
}
</script>

<style>
.grid-cols-30 {
  grid-template-columns: repeat(30, minmax(0, 1fr));
}
</style>