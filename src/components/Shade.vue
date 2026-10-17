<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDrag } from '../composables/useDrag'

/**
 * A pull-down "shade" (Notification Center / Control Center).
 * Progress (0 → 1) is applied straight to the DOM, so a drag never re-renders Vue components —
 * the parent drives it through `drag(p)` / `settle(open)`, and so does the shade's own swipe-up.
 */
const props = defineProps<{ kind: 'notifications' | 'control' }>()
const emit = defineEmits<{ closed: [] }>()

const root = ref<HTMLElement>()
const backdrop = ref<HTMLElement>()
const frost = ref<HTMLElement>()
const panel = ref<HTMLElement>()

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'
const DURATION = 420
let progress = 0
let closeTimer: number | undefined

/**
 * The blur is the expensive part, so it never animates: while a finger is moving the shade we show
 * only a tint, and the frosted layer fades in once the shade has settled open.
 */
function setFrost(on: boolean) {
  frost.value?.classList.toggle('on', on)
}

function render(p: number, animate: boolean) {
  progress = p
  const t = animate ? `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}` : 'none'
  if (root.value) root.value.style.pointerEvents = p > 0.02 ? 'auto' : 'none'
  if (backdrop.value) {
    backdrop.value.style.transition = t
    backdrop.value.style.opacity = String(p)
  }
  if (panel.value) {
    panel.value.style.transition = t
    if (props.kind === 'notifications') {
      panel.value.style.transform = `translate3d(0, ${(p - 1) * 100}%, 0)`
    } else {
      panel.value.style.opacity = String(p)
      panel.value.style.transform = `translate3d(0, ${(p - 1) * 48}px, 0) scale(${0.88 + 0.12 * p})`
    }
  }
}

/** Follow a finger: no animation. */
function drag(p: number) {
  window.clearTimeout(closeTimer)
  setFrost(false)
  render(Math.max(0, Math.min(1, p)), false)
}

/** Snap open or closed with the iOS curve; emits `closed` once fully hidden. */
function settle(open: boolean) {
  window.clearTimeout(closeTimer)
  render(open ? 1 : 0, true)
  setFrost(false)
  if (open) closeTimer = window.setTimeout(() => setFrost(true), DURATION)
  else closeTimer = window.setTimeout(() => emit('closed'), DURATION)
}

let height = 800
const swipe = useDrag({
  lazyCapture: true,
  start: () => {
    height = root.value?.getBoundingClientRect().height ?? 800
  },
  move: ({ dy }) => drag(1 + dy / (height * 0.6)),
  end: ({ dy, vy, tap }) => {
    if (tap) return
    settle(!(dy < -80 || vy < -0.5))
  },
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') settle(false)
}

onMounted(() => {
  render(0, false)
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.clearTimeout(closeTimer)
})

defineExpose({ drag, settle, isOpen: () => progress > 0.5 })
</script>

<template>
  <div
    ref="root"
    class="shade"
    :class="kind"
    role="dialog"
    aria-modal="true"
    :aria-label="kind === 'control' ? 'Control Center' : 'Notification Center'"
    v-bind="swipe"
  >
    <!-- Frost (blur) appears once settled; the tint follows the finger -->
    <div ref="frost" class="frost" />
    <div ref="backdrop" class="backdrop" />

    <div ref="panel" class="panel">
      <slot />
      <button type="button" class="grabber" aria-label="Close" @click="settle(false)">
        <span />
      </button>
    </div>
  </div>
</template>

<style scoped>
.shade {
  position: absolute;
  inset: 0;
  z-index: 40;
  touch-action: none;
  user-select: none;
  color: #fff;
  pointer-events: none;
}

.backdrop {
  position: absolute;
  inset: 0;
  opacity: 0;
  will-change: opacity;
}

.notifications .backdrop {
  background: rgb(14 10 40 / 0.55);
}

.control .backdrop {
  background: rgb(0 0 0 / 0.55);
}

.frost {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 260ms ease;
  -webkit-backdrop-filter: blur(30px) saturate(1.6);
  backdrop-filter: blur(30px) saturate(1.6);
}

.frost.on {
  opacity: 1;
}

.panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 56px 16px 12px;
  will-change: transform;
}

.control .panel {
  transform-origin: 90% 0;
}

.grabber {
  margin-top: auto;
  align-self: center;
  padding: 12px 40px 4px;
  background: none;
  border: 0;
  cursor: pointer;
}

.grabber span {
  display: block;
  width: 134px;
  height: 5px;
  border-radius: 3px;
  background: #fff;
}

.grabber:focus-visible {
  outline: 2px solid #fff;
  border-radius: 10px;
}
</style>
