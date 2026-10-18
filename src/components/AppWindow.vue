<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { IconStyle } from '../data/types'
import SystemIconArt from './SystemIconArt.vue'
import { rubberband, useDrag } from '../composables/useDrag'

/**
 * A full-screen "app" that zooms out of the icon it was launched from (FLIP),
 * and shrinks back into it on close — like iOS.
 */
const props = defineProps<{ title: string; icon: IconStyle; origin: DOMRect | null }>()
const emit = defineEmits<{ closing: []; closed: [] }>()

const root = ref<HTMLElement>()
const closeButton = ref<HTMLButtonElement>()
const iconOpacity = ref(1)
let closing = false

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Move focus into the app only for keyboard users; a focus ring after a tap looks like a bug
let usingKeyboard = false
window.addEventListener('keydown', () => (usingKeyboard = true), { capture: true })
window.addEventListener('pointerdown', () => (usingKeyboard = false), { capture: true })
/**
 * Write geometry straight to the element. Going through Vue's reactive :style would re-render
 * the component on every frame of a drag, which is what made gestures stutter on phones.
 */
const STYLE_KEYS = ['transform', 'transformOrigin', 'borderRadius', 'transition', 'opacity', 'boxShadow'] as const
function apply(next: Partial<Record<(typeof STYLE_KEYS)[number], string>>) {
  const el = root.value
  if (!el) return
  for (const k of STYLE_KEYS) el.style[k] = next[k] ?? ''
}

const DURATION = 420
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

/** Transform that maps the window onto the launching icon. */
function collapsedTransform(): Record<string, string> {
  const el = root.value
  if (!el || !props.origin || reduceMotion) return { opacity: '0' }
  // Measure the untransformed frame (the screen), not the window, which may be mid-gesture
  const box = (el.parentElement ?? el).getBoundingClientRect()
  const o = props.origin
  const sx = o.width / box.width
  const sy = o.height / box.height
  return {
    transform: `translate(${o.left - box.left}px, ${o.top - box.top}px) scale(${sx}, ${sy})`,
    borderRadius: `${(o.width * 0.225) / sx}px / ${(o.height * 0.225) / sy}px`,
  }
}

onMounted(async () => {
  apply({ ...collapsedTransform(), transition: 'none' })
  iconOpacity.value = 1
  await nextTick()
  // Force a frame so the browser registers the collapsed state before animating out
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      apply({
        transform: 'none',
        borderRadius: '0px',
        opacity: '1',
        transition: reduceMotion ? 'opacity 200ms ease' : `transform ${DURATION}ms ${EASE}, border-radius ${DURATION}ms ${EASE}`,
      })
      iconOpacity.value = 0
      if (usingKeyboard) closeButton.value?.focus({ preventScroll: true })
    }),
  )
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => window.removeEventListener('keydown', onKey))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

/**
 * Re-express the window's current on-screen frame as a transform with origin 0 0, so the close
 * animation starts exactly where a drag left the card — no jump when the transform origin changes.
 */
function freezeCurrentFrame() {
  const el = root.value
  if (!el || !el.style.transform) return
  const box = (el.parentElement ?? el).getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const sx = r.width / box.width
  apply({
    transform: `translate(${r.left - box.left}px, ${r.top - box.top}px) scale(${sx}, ${r.height / box.height})`,
    transformOrigin: '0 0',
    borderRadius: `${parseFloat(el.style.borderRadius || '0') || 0}px`,
    transition: 'none',
  })
  void el.offsetWidth // commit this frame before animating from it
}

function close() {
  if (closing) return
  closing = true
  // Let the home screen zoom back in *while* the app shrinks, as on iOS — not after
  emit('closing')
  root.value?.classList.add('animating')
  const content = root.value?.querySelector('.content') as HTMLElement | null
  if (content) content.scrollTop = 0
  freezeCurrentFrame()
  apply({
    ...collapsedTransform(),
    transformOrigin: '0 0',
    transition: reduceMotion ? 'opacity 160ms ease' : `transform ${DURATION - 60}ms ${EASE}, border-radius ${DURATION - 60}ms ${EASE}`,
  })
  iconOpacity.value = 1
  window.setTimeout(() => emit('closed'), reduceMotion ? 160 : DURATION - 60)
}

/* ---------- Gestures ---------- */

const CARD_RADIUS = '44px'
const SPRING = 'cubic-bezier(0.2, 0.9, 0.25, 1.15)'

function screenSize() {
  const r = (root.value?.parentElement ?? document.body).getBoundingClientRect()
  return { w: r.width, h: r.height }
}

// Drag up from the home indicator: the app shrinks into a card that follows the finger
function setDragging(on: boolean) {
  root.value?.classList.toggle('dragging', on)
}

const homeDrag = useDrag({
  start: () => {
    if (closing) return false
    setDragging(true)
  },
  move: ({ dx, dy }) => {
    const { h } = screenSize()
    // Rubber-band the travel so the card can never be dragged off the top of the screen
    const up = rubberband(Math.max(0, -dy), h * 0.45)
    const p = Math.min(1, up / (h * 0.55))
    const scale = 1 - p * 0.5
    apply({
      transform: `translate(${dx * 0.6}px, ${-up * 0.7}px) scale(${scale})`,
      transformOrigin: '50% 100%',
      borderRadius: CARD_RADIUS,
      transition: 'none',
    })
  },
  end: ({ dy, vy, tap }) => {
    setDragging(false)
    if (tap) return close()
    if (-dy > 90 || vy < -0.6) return close()
    springBack()
  },
})

// Swipe from the left edge: the app slides right to reveal the home screen (iOS "back")
const edgeDrag = useDrag({
  start: () => {
    if (closing) return false
    setDragging(true)
  },
  move: ({ dx }) => {
    apply({
      transform: `translateX(${Math.max(0, dx)}px)`,
      borderRadius: '0px',
      boxShadow: '-12px 0 40px rgb(0 0 0 / 0.25)',
      transition: 'none',
    })
  },
  end: ({ dx, vx }) => {
    setDragging(false)
    const { w } = screenSize()
    if (dx > w * 0.33 || vx > 0.5) {
      closing = true
      emit('closing')
      apply({ transform: `translateX(${w}px)`, transition: `transform 280ms ${EASE}` })
      window.setTimeout(() => emit('closed'), 280)
    } else springBack()
  },
})

function springBack() {
  apply({
    transform: 'none',
    transformOrigin: '50% 100%',
    borderRadius: '0px',
    transition: `transform 380ms ${SPRING}, border-radius 380ms ${EASE}`,
  })
}

defineExpose({ close })
</script>

<template>
  <div ref="root" class="window" role="dialog" aria-modal="true" :aria-label="title">
    <!-- Icon face shown while the window is small, cross-fades into the app -->
    <div
      class="icon-face"
      :style="{ '--from': icon.from, '--to': icon.to, opacity: iconOpacity }"
      aria-hidden="true"
    >
      <img v-if="icon.image" :src="icon.image" alt="" />
      <SystemIconArt v-else-if="icon.art" :art="icon.art" class="face-art" />
    </div>

    <!-- No back button on an app's first screen, as on iOS: swipe up on the home indicator (or Esc) closes it.
         Apps with a stack of screens (Notes, the Photos viewer) show their own back button inside. -->
    <header class="nav">
      <span />
      <span class="nav-title glass">{{ title }}</span>
      <span />
    </header>

    <div class="content">
      <slot />
    </div>

    <!-- Full-screen layer apps can teleport into (e.g. the Photos viewer), above nav and gestures -->
    <div id="window-overlay" class="overlay" />

    <!-- Edge swipe zone for the back gesture -->
    <div class="edge-zone" aria-hidden="true" v-bind="edgeDrag" />

    <!-- Home indicator: tap or drag up to go home. Keyboard users press Enter or Esc. -->
    <button
      ref="closeButton"
      type="button"
      class="home-bar"
      aria-label="Close and go home"
      v-bind="homeDrag"
      @keydown.enter.prevent="close"
      @keydown.space.prevent="close"
    >
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
  background: var(--sheet);
  -webkit-backdrop-filter: blur(48px) saturate(1.9);
  backdrop-filter: blur(48px) saturate(1.9);
  color: var(--ink);
  transform-origin: 0 0;
  overflow: hidden;
  will-change: transform;
}

.icon-face {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  background: linear-gradient(165deg, var(--from), var(--to));
  pointer-events: none;
  transition: opacity 240ms ease;
}

.icon-face img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-face .face-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Floating controls over content, with a soft scroll-edge fade instead of a solid bar */
.nav {
  position: absolute;
  inset: 0 0 auto;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 50px 14px 18px;
  pointer-events: none;
}

.nav > * {
  pointer-events: auto;
}


.nav-title {
  padding: 9px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 15px;
}

.content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-top: 100px;
  /* Scroll-edge effect: content dissolves as it slides under the status bar and controls */
  -webkit-mask-image: linear-gradient(to bottom, transparent 40px, #000 112px);
  mask-image: linear-gradient(to bottom, transparent 40px, #000 112px);
}

.home-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30px;
  z-index: 6;
  display: grid;
  place-items: end center;
  padding: 0 0 8px;
  background: none;
  border: 0;
  cursor: grab;
  touch-action: none;
}

.home-bar:active {
  cursor: grabbing;
}

/* Apps like Photos and Notes are opaque, not frosted; the app sets --app-bg */
.window.solid {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: var(--app-bg, var(--photos-bg));
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.overlay > :deep(*) {
  pointer-events: auto;
}

.window.animating {
  /* While shrinking to the icon the blur behind changes every frame; the icon face covers it anyway */
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: var(--sheet-solid);
}

.edge-zone {
  position: absolute;
  left: 0;
  top: 100px;
  bottom: 30px;
  width: 16px;
  z-index: 6;
  touch-action: none;
  cursor: e-resize;
}

.home-bar span {
  display: block;
  width: 134px;
  height: 5px;
  border-radius: 3px;
  background: var(--ink);
  opacity: 0.8;
}

.home-bar:focus-visible {
  outline: 2px solid var(--tint);
  border-radius: 10px;
}
</style>
