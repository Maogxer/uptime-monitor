<!-- pages/monitor/[id].vue -->
<template>
  <div class="bg-gray-50 dark:bg-[#0B0F19] text-gray-800 dark:text-gray-200">
    <div class="fixed inset-0 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.1)_0%,rgba(67,56,202,0)_35%)] pointer-events-none"></div>

    <div class="relative flex flex-col min-h-screen">
      <!-- Simple Header for Detail Page -->
      <header class="w-full bg-transparent z-50">
        <div class="max-w-5xl mx-auto px-4 py-6">
          <NuxtLink to="/" class="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span>返回主页</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow w-full max-w-5xl mx-auto px-4 pb-12 z-10">
        
        <!-- CORRECTED LOGIC START -->

        <!-- Loading State: Only show when fetch is pending -->
        <div v-if="pending" class="space-y-8">
          <div class="animate-pulse space-y-4">
            <div class="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div class="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div class="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>

        <!-- Error State: Show if fetch is done, but there's an error OR no monitor found -->
        <div v-else-if="error || !monitor" class="text-center py-20">
            <p class="text-xl font-bold text-red-500">无法加载监控项详情</p>
            <p class="text-sm text-gray-500 mt-2">{{ error?.statusMessage || '该监控项不存在或无法从 API 获取数据。' }}</p>
        </div>
        
        <!-- Content Loaded: The final "happy path" case -->
        <div v-else class="space-y-12">
          <!-- Monitor Header -->
          <div class="border-b border-gray-200 dark:border-white/10 pb-6">
            <div class="flex items-center justify-between">
              <h1 class="text-4xl font-bold truncate" :title="monitor.friendly_name">{{ monitor.friendly_name }}</h1>
              <span class="text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0" :class="statusInfo.color">{{ statusInfo.text }}</span>
            </div>
            <a :href="monitor.url" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-2 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              {{ monitor.url }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>

          <!-- Response Time Chart -->
          <div class="p-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
            <h2 class="text-xl font-bold mb-4">响应时间 (最近 24 小时)</h2>
            <div class="h-64">
              <ClientOnly>
                <ResponseChart v-if="monitor.status !== 0" :monitor="monitor" />
                <div v-else class="flex items-center justify-center h-full"><p class="text-sm text-gray-400 dark:text-gray-500">无响应时间数据</p></div>
              </ClientOnly>
            </div>
          </div>

          <!-- Event Logs -->
          <div class="p-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
            <h2 class="text-xl font-bold mb-4">事件日志 (近 60 天)</h2>
            <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
              <div v-if="monitor.logs.length === 0" class="text-center py-8 text-gray-500">
                <p>在此期间没有记录到事件。</p>
              </div>
              <div v-for="log in monitor.logs" :key="log.datetime" class="flex items-start gap-4">
                <div class="flex-shrink-0 mt-1">
                  <span class="flex h-6 w-6 items-center justify-center rounded-full" :class="getLogIcon(log.type).bg">
                    <component :is="getLogIcon(log.type).icon" class="h-4 w-4" :class="getLogIcon(log.type).text" />
                  </span>
                </div>
                <div class="flex-grow">
                  <p class="font-semibold">{{ getLogMessage(log) }}</p>
                  <p class="text-sm text-gray-500">{{ dayjs.unix(log.datetime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- CORRECTED LOGIC END -->
      </main>
    </div>
  </div>
</template>