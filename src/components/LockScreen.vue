<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ time: string; date: string; name: string; title: string; location: string; photo: string }>()
const emit = defineEmits<{ unlock: [] }>()

const dragY = ref(0)
let startY: number | null = null

function onPointerDown(e: PointerEvent) {
  startY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onPointerMove(e: PointerEvent) {
  if (startY === null) return
  dragY.value = Math.min(0, e.clientY - startY)
}
function onPointerUp() {
  if (startY === null) return
  // A tap or a swipe of more than 60px unlocks; a short drag snaps back
  const shouldUnlock = dragY.value === 0 || dragY.value < -60
  startY = null
  if (shouldUnlock) emit('unlock')
  else dragY.value = 0
}
</script>

<template>
  <section
    class="lock"
    :style="{ transform: `translateY(${dragY}px)`, transition: dragY === 0 ? 'transform 300ms ease' : 'none' }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="clock">
      <p class="date">{{ date }}</p>
      <p class="time">{{ time }}</p>
      <p class="where">{{ location }}</p>
    </div>

    <div class="notification glass-clear">
      <img class="avatar" :src="photo" alt="" width="38" height="38" />
      <div>
        <p class="n-title">{{ name }}</p>
        <p class="n-body">{{ title }} — available for new projects.</p>
      </div>
    </div>

    <button type="button" class="unlock" @click.stop="emit('unlock')" @pointerdown.stop>
      <span class="hint">Swipe up or tap to open</span>
      <span class="home-indicator" aria-hidden="true" />
    </button>
  </section>
</template>

<style scoped>
.lock {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72px 20px 16px;
  color: #fff;
  touch-action: none;
  user-select: none;
  cursor: grab;
}

.clock {
  text-align: center;
}

.date {
  margin: 0;
  font-size: 19px;
  font-weight: 500;
  opacity: 0.9;
}

.time {
  margin: 0;
  font-size: clamp(76px, 22vw, 108px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.where {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.75;
}

.notification {
  margin-top: 36px;
  width: min(100%, 360px);
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 26px;
}

.notification > * {
  position: relative;
  z-index: 2;
}

.avatar {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.n-title {
  margin: 0;
  font-weight: 600;
  font-size: 15px;
}

.n-body {
  margin: 2px 0 0;
  font-size: 14px;
  opacity: 0.85;
}

.unlock {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 12px 24px 4px;
}

.hint {
  font-size: 14px;
  opacity: 0.8;
  animation: breathe 2.4s ease-in-out infinite;
}

.home-indicator {
  width: 134px;
  height: 5px;
  border-radius: 3px;
  background: #fff;
}

.unlock:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
  border-radius: 12px;
}

@keyframes breathe {
  50% {
    opacity: 0.35;
  }
}
</style>
