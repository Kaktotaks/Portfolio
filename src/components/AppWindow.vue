<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { IconStyle } from '../data/types'
import Glyph from './Glyph.vue'

/**
 * A full-screen "app" that zooms out of the icon it was launched from (FLIP),
 * and shrinks back into it on close — like iOS.
 */
const props = defineProps<{ title: string; icon: IconStyle; origin: DOMRect | null }>()
const emit = defineEmits<{ closed: [] }>()

const root = ref<HTMLElement>()
const closeButton = ref<HTMLButtonElement>()
const style = ref<Record<string, string>>({})
const iconOpacity = ref(1)
let closing = false

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const DURATION = 420
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

/** Transform that maps the window onto the launching icon. */
function collapsedTransform(): Record<string, string> {
  const el = root.value
  if (!el || !props.origin || reduceMotion) return { opacity: '0' }
  const box = el.getBoundingClientRect()
  const o = props.origin
  const sx = o.width / box.width
  const sy = o.height / box.height
  return {
    transform: `translate(${o.left - box.left}px, ${o.top - box.top}px) scale(${sx}, ${sy})`,
    borderRadius: `${(o.width * 0.225) / sx}px / ${(o.height * 0.225) / sy}px`,
  }
}

onMounted(async () => {
  style.value = { ...collapsedTransform(), transition: 'none' }
  iconOpacity.value = 1
  await nextTick()
  // Force a frame so the browser registers the collapsed state before animating out
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      style.value = {
        transform: 'none',
        borderRadius: '0px',
        opacity: '1',
        transition: reduceMotion ? 'opacity 200ms ease' : `transform ${DURATION}ms ${EASE}, border-radius ${DURATION}ms ${EASE}`,
      }
      iconOpacity.value = 0
      closeButton.value?.focus({ preventScroll: true })
    }),
  )
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => window.removeEventListener('keydown', onKey))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function close() {
  if (closing) return
  closing = true
  const content = root.value?.querySelector('.content') as HTMLElement | null
  if (content) content.scrollTop = 0
  style.value = {
    ...collapsedTransform(),
    transition: reduceMotion ? 'opacity 160ms ease' : `transform ${DURATION - 60}ms ${EASE}, border-radius ${DURATION - 60}ms ${EASE}`,
  }
  iconOpacity.value = 1
  window.setTimeout(() => emit('closed'), reduceMotion ? 160 : DURATION - 60)
}

defineExpose({ close })
</script>

<template>
  <div ref="root" class="window" role="dialog" aria-modal="true" :aria-label="title" :style="style">
    <!-- Icon face shown while the window is small, cross-fades into the app -->
    <div
      class="icon-face"
      :style="{ '--from': icon.from, '--to': icon.to, color: icon.ink ?? '#fff', opacity: iconOpacity }"
      aria-hidden="true"
    >
      <Glyph :name="icon.glyph" />
    </div>

    <header class="nav">
      <button ref="closeButton" type="button" class="back" @click="close">
        <svg viewBox="0 0 12 20" width="11" height="18" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
        Home
      </button>
      <span class="nav-title">{{ title }}</span>
      <span class="spacer" />
    </header>

    <div class="content">
      <slot />
    </div>

    <button type="button" class="home-bar" aria-label="Close and go home" @click="close">
      <span />
    </button>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  color: var(--ink);
  transform-origin: 0 0;
  overflow: hidden;
  will-change: transform;
}

.icon-face {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, var(--from), var(--to));
  pointer-events: none;
  transition: opacity 220ms ease;
}

.icon-face svg {
  width: 52%;
  height: 52%;
}

.nav {
  flex: none;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 52px 12px 10px;
  background: color-mix(in srgb, var(--surface) 85%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  position: relative;
  z-index: 2;
}

.back {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 0;
  font: inherit;
  font-size: 17px;
  color: var(--tint);
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
}

.back:focus-visible {
  outline: 2px solid var(--tint);
}

.nav-title {
  font-weight: 600;
  font-size: 17px;
}

.content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.home-bar {
  position: absolute;
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
  z-index: 2;
  padding: 10px 30px;
  background: none;
  border: 0;
  cursor: pointer;
}

.home-bar span {
  display: block;
  width: 134px;
  height: 5px;
  border-radius: 3px;
  background: var(--ink);
  opacity: 0.85;
}

.home-bar:focus-visible {
  outline: 2px solid var(--tint);
  border-radius: 10px;
}
</style>
