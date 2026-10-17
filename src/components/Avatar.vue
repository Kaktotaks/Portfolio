<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import memoji from '../assets/img/memoji.webp'

/**
 * Leonid's own Memoji (exported from his iPhone) with a 3D tilt toward the pointer:
 * perspective rotation, a light glint that slides across it, and a shadow that shifts the other way.
 * Driven by two CSS variables (--lx, --ly in -1…1), so following the mouse never re-renders Vue,
 * and the animation loop sleeps once it has settled.
 */
const root = ref<HTMLElement>()
let target = { x: 0, y: 0 }
let look = { x: 0, y: 0 }
let raf = 0
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onPointer(e: PointerEvent) {
  const r = root.value?.getBoundingClientRect()
  if (!r) return
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  // Soft saturation: far away ≈ ±1, close by moves gently
  target = { x: dx / (Math.abs(dx) + 220), y: dy / (Math.abs(dy) + 220) }
  if (!raf) raf = requestAnimationFrame(tick)
}

function tick() {
  look = { x: look.x + (target.x - look.x) * 0.12, y: look.y + (target.y - look.y) * 0.12 }
  root.value?.style.setProperty('--lx', look.x.toFixed(4))
  root.value?.style.setProperty('--ly', look.y.toFixed(4))
  raf = Math.abs(target.x - look.x) + Math.abs(target.y - look.y) > 0.001 ? requestAnimationFrame(tick) : 0
}

onMounted(() => {
  if (reduceMotion) return
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pointerdown', onPointer, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('pointerdown', onPointer)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="avatar" :style="{ '--memoji': `url(${memoji})` }">
    <div class="float">
      <div class="tilt">
        <img :src="memoji" alt="Leonid's Memoji" draggable="false" />
        <span class="glint" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  --lx: 0;
  --ly: 0;
  width: 100%;
  height: 100%;
  perspective: 500px;
}

/* Gentle idle bob so it feels alive even without a pointer (phones) */
.float {
  width: 100%;
  height: 100%;
  animation: bob 4.5s ease-in-out infinite;
}

.tilt {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translate3d(calc(var(--lx) * 4px), calc(var(--ly) * 3px), 0) rotateY(calc(var(--lx) * 24deg))
    rotateX(calc(var(--ly) * -18deg));
  will-change: transform;
}

img {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  /* Contact shadow slides opposite the tilt, like light from above the screen */
  filter: drop-shadow(calc(var(--lx) * -5px) calc(6px + var(--ly) * -3px) 7px rgb(0 0 0 / 0.3));
}

/* Specular glint clipped to the Memoji's own silhouette */
.glint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at calc(35% + var(--lx) * 30%) calc(28% + var(--ly) * 25%),
    rgb(255 255 255 / 0.5),
    rgb(255 255 255 / 0) 45%
  );
  mix-blend-mode: soft-light;
  -webkit-mask: var(--memoji) center / contain no-repeat;
  mask: var(--memoji) center / contain no-repeat;
}

@keyframes bob {
  50% {
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .float {
    animation: none;
  }
}
</style>
