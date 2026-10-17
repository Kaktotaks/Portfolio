<script setup lang="ts">
import wallpaper from '../assets/img/wallpaper.webp'
</script>

<template>
  <!--
    Original wallpaper in the spirit of iOS's flowing-ribbon wallpapers (not Apple artwork).
    Source: src/assets/wallpaper.svg, pre-rendered to WebP so phones never re-run SVG blur filters.
    The slow drift is a single GPU-composited transform — effectively free.
  -->
  <div class="wallpaper" aria-hidden="true">
    <img :src="wallpaper" alt="" decoding="async" draggable="false" />
    <span class="dim" />
  </div>
</template>

<style scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #1a1150;
}

img {
  position: absolute;
  inset: -6%;
  width: 112%;
  height: 112%;
  object-fit: cover;
  will-change: transform;
  animation: drift 30s ease-in-out infinite alternate;
  user-select: none;
}

@keyframes drift {
  from {
    transform: translate3d(-2%, -1%, 0) scale(1);
  }
  to {
    transform: translate3d(2%, 1.5%, 0) scale(1.04);
  }
}

/* iOS dims the wallpaper in dark mode */
.dim {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  transition: opacity 400ms ease;
}

@media (prefers-color-scheme: dark) {
  :global(:root:not([data-theme='light'])) .dim {
    opacity: 0.28;
  }
}

:global(:root[data-theme='dark']) .dim {
  opacity: 0.28;
}

@media (prefers-reduced-motion: reduce) {
  img {
    animation: none;
  }
}
</style>
