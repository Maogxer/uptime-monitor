<!-- components/ResponseChart.client.vue -->
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

interface ResponseTime { datetime: number; value: number; }
interface Monitor { status: number; response_times: ResponseTime[]; }

const props = defineProps<{
  monitor: Monitor
}>();

const colorMode = useColorMode();

const chartColor = computed(() => {
  const isDark = colorMode.value === 'dark';
  return props.monitor.status === 2
    ? (isDark ? '#38bdf8' : '#0ea5e9') // Up color
    : (isDark ? '#f87171' : '#ef4444'); // Down color
});

const chartData = computed(() => {
  const responseTimes = props.monitor.response_times || [];
  const labels = responseTimes.map(rt => dayjs.unix(rt.datetime).format('HH:mm')).reverse();
  const data = responseTimes.map(rt => rt.value).reverse();

  return {
    labels: labels,
    datasets: [{
      label: '响应时间',
      data: data,
      borderColor: chartColor.value,
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        if (!ctx) return 'transparent';
        const gradient = ctx.createLinearGradient(0, 0, 0, 50); // Shorter gradient
        gradient.addColorStop(0, `${chartColor.value}60`);
        gradient.addColorStop(1, `${chartColor.value}00`);
        return gradient;
      },
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
    }],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: { label: (context) => `响应时间: ${context.parsed.y} ms` }
    },
  },
  scales: {
    x: { display: false },
    y: { display: false, beginAtZero: true },
  },
}));
</script>