<!-- pages/login.vue -->
<template>
  <!-- The component is now just the box itself. The layout handles the centering. -->
  <div class="w-full max-w-sm p-8 space-y-6 rounded-2xl border bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/80 dark:border-white/10 shadow-lg">
    <div class="text-center">
      <h1 class="text-3xl font-bold">{{ t('auth.title') }}</h1>
      <p class="mt-2 text-sm text-gray-500">{{ t('auth.subtitle') }}</p>
    </div>

    <form action="/api/login" method="POST" class="space-y-6">
      <div>
        <label for="password" class="sr-only">{{ t('auth.password') }}</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          autofocus
          class="w-full px-4 py-2 border rounded-lg bg-white/60 dark:bg-white/10 border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          :placeholder="t('auth.password')"
        />
      </div>
      
      <p v-if="hasError" class="text-sm text-red-500 text-center">
        {{ t('auth.error') }}
      </p>

      <div>
        <button 
          type="submit" 
          class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          {{ t('auth.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'; // <-- 1. Import computed
// THE FIX: Explicitly tell this page to use our new 'centered' layout.
definePageMeta({
  layout: 'centered'
});

const { t } = useI18n();
const route = useRoute();

const hasError = computed(() => 'error' in route.query);

// 2. THE FIX: Wrap the title string in a computed property
useHead({
  title: computed(() => t('auth.title')),
});
</script>