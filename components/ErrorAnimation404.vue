<!-- components/ErrorAnimation404.vue -->
<template>
  <svg viewBox="0 0 100 100">
    <path class="map-outline" d="M 20 20 H 80 V 80 H 20 Z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="start-point" cx="30" cy="70" r="3" />
    <path class="path-line" d="M 30 70 C 35 50, 45 50, 50 60 S 60 75, 70 65" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <g class="cross-mark">
      <line x1="65" y1="60" x2="75" y2="70" stroke-width="3" stroke-linecap="round"/>
      <line x1="75" y1="60" x2="65" y2="70" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>
</template>

<style scoped>
svg * {
  stroke: currentColor;
}
.path-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw-path 2s ease-out forwards;
}
.cross-mark {
  opacity: 0;
  transform-origin: center;
  animation: fade-in-cross 0.5s ease-out forwards 1.8s;
}
@keyframes draw-path {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fade-in-cross {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>