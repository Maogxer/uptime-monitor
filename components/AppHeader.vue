<template>
  <header class="flex justify-between items-center py-6">
    <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
      {{ $t('title') }}
    </h1>
    <div class="flex items-center space-x-2">
      <LangSwitcher />
      <ThemeSwitcher />
    </div>
  </header>
</template>

<script setup lang="ts">
import LangSwitcher from './LangSwitcher.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
</script>