<!-- components/AppFooter.vue -->
<template>
  <footer class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
    <p>{{ t('footer.poweredBy') }} © {{ new Date().getFullYear() }}</p>
    <p class="mt-1">{{ t('footer.description') }}</p>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>