<!-- components/ErrorAnimationDefault.vue -->
<template>
  <svg viewBox="0 0 100 100">
    <!-- The triangle warning sign outline -->
    <path 
      d="M 50 15 L 90 85 H 10 Z" 
      fill="none" 
      stroke-width="3" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <!-- The exclamation mark inside -->
    <g class="exclamation-mark">
      <line x1="50" y1="40" x2="50" y2="60" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="72" r="2.5" fill="currentColor"/>
    </g>
  </svg>
</template>

<style scoped>
/* All strokes will inherit the color from the parent text color */
svg * {
  stroke: currentColor;
}

.exclamation-mark {
  /* This animation creates a subtle pulsing effect */
  animation: pulse-attention 1.5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes pulse-attention {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
}
</style>