<template>
  <div class="min-h-screen font-sans antialiased">
    <div class="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      
      <SiteHeader />

      <div v-if="pending" class="text-center py-10 text-light-text-sub dark:text-dark-text-sub">
        Loading Monitors...
      </div>
      <div v-if="error" class="bg-red-500/10 border border-status-red-light dark:border-status-red-dark text-status-red-light dark:text-status-red-dark p-4 rounded-lg" role="alert">
        <p class="font-bold">Error Loading Data</p>
        <p>{{ error.statusMessage || 'An unknown error occurred.' }}</p>
      </div>

      <main v-if="!pending && data" class="space-y-3">
        <MonitorCard v-for="monitor in data.monitors" :key="monitor.id" :monitor="monitor" />
      </main>

       <footer class="text-center mt-12 text-sm text-light-text-sub dark:text-dark-text-sub">
         <p>&copy; {{ new Date().getFullYear() }} Your Site Name. All Rights Reserved.</p>
         <p class="mt-1">{{ t('poweredBy') }}</p>
         <p v-if="data" class="mt-1">
           Last updated: {{ new Date(data.generatedAt).toLocaleString(locale) }}
         </p>
       </footer>
    </div>
  </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import MonitorCard from '~/components/MonitorCard.vue'

const { t, locale } = useI18n()

// 更新页面标题和html lang属性
useHead(() => ({
  title: t('title'),
  htmlAttrs: {
    lang: locale.value
  }
}))

// 获取监控数据
const { data, pending, error, refresh } = await useFetch('/api/monitors', {
  lazy: true,
  server: true,
})

// 每分钟自动刷新数据
onMounted(() => {
  const interval = setInterval(() => {
    refresh()
  }, 60000)
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>

<style>
/* 你可以保留这个 style 块，以备将来添加全局样式 */
</style>