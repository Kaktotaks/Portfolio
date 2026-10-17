<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useDrag } from '../composables/useDrag'

/**
 * A pull-down "shade" (Notification Center / Control Center).
 * `progress` (0 → 1) is owned by the parent so the opening drag that starts on the status bar
 * and the closing drag that starts here drive the same value. While `dragging`, nothing animates;
 * on release the parent snaps to 0 or 1 and the CSS transition finishes the motion.
 */
const props = defineProps<{ kind: 'notifications' | 'control'; progress: number; dragging: boolean }>()
const emit = defineEmits<{ drag: [progress: number]; release: [open: boolean] }>()

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'
let height = 800

const drag = useDrag({
  lazyCapture: true,
  start: (_s, e) => {
    height = (e.currentTarget as HTMLElement).getBoundingClientRect().height
  },
  move: ({ dy }) => emit('drag', Math.max(0, Math.min(1, 1 + dy / (height * 0.6)))),
  end: ({ dy, vy, tap }) => {
    if (tap) return
    emit('release', !(dy < -80 || vy < -0.5))
  },
})

const p = computed(() => props.progress)
const transition = computed(() => (props.dragging ? 'none' : `all 420ms ${EASE}`))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('release', false)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="shade"
    :class="kind"
    role="dialog"
    aria-modal="true"
    :aria-label="kind === 'control' ? 'Control Center' : 'Notification Center'"
    v-bind="drag"
    :style="{ pointerEvents: p > 0.02 ? 'auto' : 'none' }"
  >
    <!-- Blurred backdrop fades in with the pull -->
    <div class="backdrop" :style="{ opacity: p, transition }" />

    <div
      class="panel"
      :style="
        kind === 'notifications'
          ? { transform: `translateY(${(p - 1) * 100}%)`, transition }
          : { opacity: p, transform: `translateY(${(p - 1) * 48}px) scale(${0.88 + 0.12 * p})`, transition }
      "
    >
      <slot />
      <button type="button" class="grabber" aria-label="Close" @click="emit('release', false)">
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
}

.backdrop {
  position: absolute;
  inset: 0;
  -webkit-backdrop-filter: blur(30px) saturate(1.6);
  backdrop-filter: blur(30px) saturate(1.6);
}

.notifications .backdrop {
  background: rgb(10 10 25 / 0.25);
}

.control .backdrop {
  background: rgb(0 0 0 / 0.42);
}

.panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 56px 16px 12px;
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
