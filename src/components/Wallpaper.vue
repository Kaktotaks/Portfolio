<script setup lang="ts">
import wallpaper from '../assets/img/wallpaper.webp'
</script>

<template>
  <!--
    Leonid's own photo, blurred ahead of time into the WebP (no live blur filter, so phones stay smooth).
    The slow drift is a single GPU-composited transform — effectively free.
  -->
  <div class="wallpaper" aria-hidden="true">
    <img :src="wallpaper" alt="" decoding="async" draggable="false" />
    <span class="legibility" />
    <span class="dim wallpaper-dim" />
  </div>
</template>

<style scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #3d6fb8;
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
    transform: translate3d(-1%, -0.5%, 0) scale(1);
  }
  to {
    transform: translate3d(1%, 0.8%, 0) scale(1.03);
  }
}

/* Keeps white labels readable over the bright sky and paving */
.legibility {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.18), rgb(0 0 0 / 0.08) 40%, rgb(0 0 0 / 0.22));
}

/* iOS dims the wallpaper in dark mode */
.dim {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  transition: opacity 400ms ease;
}

/* Dark-mode dimming lives in style.css (.wallpaper-dim): it depends on the root's theme */

@media (prefers-reduced-motion: reduce) {
  img {
    animation: none;
  }
}
</style>
