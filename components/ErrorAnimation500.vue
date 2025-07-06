<!-- components/ErrorAnimation500.vue -->
<template>
  <svg viewBox="0 0 100 100">
    <!-- Smoothly rotating gears -->
    <path class="gear-smooth" d="M 50 35 A 15 15 0 0 1 50 65 A 15 15 0 0 1 50 35 Z M 50 29 L 50 71 M 33 42 L 67 58 M 33 58 L 67 42" fill="none" stroke-width="2" stroke-linecap="round"/>
    <path class="gear-smooth reverse" d="M 75 58 A 10 10 0 0 1 75 78 A 10 10 0 0 1 75 58 Z M 75 54 L 75 82 M 66 63 L 84 73 M 66 73 L 84 63" fill="none" stroke-width="2" stroke-linecap="round"/>
    <!-- The breaking gear -->
    <g class="gear-breaking">
      <path d="M 25 22 A 10 10 0 0 1 25 42 A 10 10 0 0 1 25 22 Z M 25 18 L 25 46 M 16 27 L 34 37 M 16 37 L 34 27" fill="none" stroke-width="2" stroke-linecap="round"/>
      <path class="crack" d="M 22 24 L 25 32 L 28 27" fill="none" stroke-width="1.5" stroke-linecap="round" />
    </g>
  </svg>
</template>

<style scoped>
svg * {
  stroke: currentColor;
}
.gear-smooth {
  transform-origin: center;
  animation: rotate-smooth 8s linear infinite;
}
.gear-smooth.reverse {
  animation-direction: reverse;
}
.gear-breaking {
  transform-origin: 25px 32px;
  animation: rotate-and-break 2.5s ease-in-out infinite;
}
.crack {
  opacity: 0;
  animation: fade-in-crack 0.2s linear forwards 1.2s;
}
@keyframes rotate-smooth {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes rotate-and-break {
  0%, 40% { transform: rotate(0deg); }
  80%, 100% { transform: rotate(90deg); }
}
@keyframes fade-in-crack {
  to { opacity: 1; stroke: #ef4444; }
}
</style>