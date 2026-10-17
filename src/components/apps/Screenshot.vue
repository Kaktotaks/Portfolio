<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Screenshot } from '../../data/types'

/**
 * One App Store-style screenshot. The frame reserves the image's real shape from the start
 * (aspect-ratio), shows a shimmering skeleton, and cross-fades the image in once decoded —
 * so nothing collapses or jumps while it loads.
 */
const props = defineProps<{ shot: Screenshot }>()
const img = ref<HTMLImageElement>()
const loaded = ref(false)

function onLoad() {
  loaded.value = true
}

// A cached image can finish before Vue attaches the listener
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth) loaded.value = true
})
</script>

<template>
  <figure class="frame" :class="{ loaded }" :style="{ aspectRatio: String(props.shot.ratio) }">
    <span class="skeleton" aria-hidden="true">
      <span class="sk-bar w60" />
      <span class="sk-bar w40" />
      <span class="sk-block" />
    </span>
    <img ref="img" :src="shot.src" :alt="shot.alt" loading="lazy" decoding="async" draggable="false" @load="onLoad" />
  </figure>
</template>

<style scoped>
.frame {
  position: relative;
  flex: none;
  height: min(420px, 56vh);
  margin: 0;
  border-radius: 22px;
  overflow: hidden;
  background: var(--skeleton-base);
  box-shadow:
    0 0 0 1px var(--glass-edge),
    0 8px 20px rgb(0 0 0 / 0.14);
  scroll-snap-align: start;
  /* Isolate the shimmer so it can't trigger repaints outside the frame */
  contain: paint;
}

img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 360ms ease;
}

.loaded img {
  opacity: 1;
}

/* Skeleton: a hint of a screen layout with a moving sheen, like App Store placeholders */
.skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18% 14% 0;
  transition: opacity 300ms ease;
}

.loaded .skeleton {
  opacity: 0;
}

.sk-bar,
.sk-block {
  display: block;
  border-radius: 6px;
  background: var(--skeleton-shape);
}

.sk-bar {
  height: 10px;
}

.w60 {
  width: 60%;
}

.w40 {
  width: 40%;
}

.sk-block {
  margin-top: 14%;
  width: 100%;
  flex: 1;
  border-radius: 16px 16px 0 0;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, var(--skeleton-sheen) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: sheen 1.4s ease-in-out infinite;
}

.loaded .skeleton::after {
  animation: none;
}

@keyframes sheen {
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
  }
}
</style>
