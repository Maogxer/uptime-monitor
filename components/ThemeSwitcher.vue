<template>
  <button @click="toggleTheme" class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
    <span class="sr-only">Toggle theme</span>
    <!-- Sun Icon -->
    <svg v-if="currentIcon === 'sun'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    <!-- Moon Icon -->
    <svg v-if="currentIcon === 'moon'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    <!-- System Icon -->
    <svg v-if="currentIcon === 'system'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laptop"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.7 20H3.3a1 1 0 0 1-.58-1.45L4 16"/></svg>
  </button>
</template>

<script setup>
const colorMode = useColorMode()

const themes = ['light', 'dark', 'system']

const currentIcon = computed(() => {
  if (colorMode.preference === 'system') return 'system'
  return colorMode.value === 'dark' ? 'moon' : 'sun'
})

function toggleTheme() {
  const currentIndex = themes.indexOf(colorMode.preference)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex]
}
</script>