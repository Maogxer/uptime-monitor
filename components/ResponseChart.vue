<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'
import type { Monitor } from '~/server/api/status'
import dayjs from 'dayjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

const props = defineProps<{
  responseTimes: Monitor['response_times'],
  status: Monitor['status']
}>()

const colorMode = useColorMode()
const { t } = useI18n()

const chartColor = computed(() => {
  const isDark = colorMode.value === 'dark'
  if (props.status !== 2) return isDark ? '#f87171' : '#ef4444'
  return isDark ? '#38bdf8' : '#0ea5e9'
})

const chartData = computed(() => {
  const labels = props.responseTimes.map(rt => dayjs.unix(rt.datetime).format('HH:mm'))
  const data = props.responseTimes.map(rt => rt.value)

  return {
    labels: labels.reverse(),
    datasets: [
      {
        label: t('responseTime'),
        data: data.reverse(),
        borderColor: chartColor.value,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 100);
          gradient.addColorStop(0, `${chartColor.value}40`);
          gradient.addColorStop(1, `${chartColor.value}00`);
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const isDark = colorMode.value === 'dark'
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y} ${t('ms')}`
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  }
})
</script>