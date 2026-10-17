<script setup lang="ts">
import type { IconStyle } from '../data/types'
import Glyph from './Glyph.vue'

/**
 * One app icon, drawn like a real device renders it:
 * artwork (or gradient + glyph) inside a continuous-corner mask, a hairline edge
 * that catches light at the top, and a soft contact shadow.
 */
defineProps<{ icon: IconStyle; size?: string }>()
</script>

<template>
  <span class="icon-tile" :style="{ '--size': size ?? 'var(--icon-size)' }">
    <img v-if="icon.image" class="art" :src="icon.image" alt="" draggable="false" />
    <span v-else class="art gradient" :style="{ '--from': icon.from, '--to': icon.to, color: icon.ink ?? '#fff' }">
      <Glyph :name="icon.glyph" />
    </span>
    <span class="edge" aria-hidden="true" />
  </span>
</template>

<style scoped>
.icon-tile {
  position: relative;
  display: block;
  width: var(--size);
  height: var(--size);
  /* ~22.4% radius is the closest plain-CSS match to the iOS squircle */
  border-radius: calc(var(--size) * 0.224);
  box-shadow:
    0 calc(var(--size) * 0.04) calc(var(--size) * 0.1) rgb(0 0 0 / 0.22),
    0 1px 2px rgb(0 0 0 / 0.18);
  flex: none;
}

@supports (corner-shape: squircle) {
  .icon-tile {
    border-radius: calc(var(--size) * 0.32);
    corner-shape: squircle;
  }
}

.art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  corner-shape: inherit;
  object-fit: cover;
  user-select: none;
}

.gradient {
  display: grid;
  place-items: center;
  background: linear-gradient(165deg, var(--from), var(--to));
}

.gradient :deep(svg) {
  width: 52%;
  height: 52%;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.18));
}

/* Light catching the rim: brighter at the top edge, a faint dark line at the bottom */
.edge {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  corner-shape: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 0.5px 0 rgb(255 255 255 / 0.55),
    inset 0 0 0 0.5px rgb(0 0 0 / 0.1),
    inset 0 -0.5px 0 rgb(0 0 0 / 0.12);
  background: linear-gradient(180deg, rgb(255 255 255 / 0.14), transparent 38%);
}
</style>
