<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { Photo } from '../../data/photos'
import { useDrag } from '../../composables/useDrag'

/**
 * Full-screen viewer modelled on iOS Photos:
 *  - opens by zooming out of the tapped thumbnail and closes back into it
 *  - swipe left/right between photos, swipe down to dismiss (interactive, velocity-aware)
 *  - tap toggles the chrome; arrow keys and Esc work too
 * Geometry is written straight to the DOM during drags so it stays at 60 fps on phones.
 */
const props = defineProps<{ photos: Photo[]; start: number; thumbRect: (i: number) => DOMRect | null }>()
const emit = defineEmits<{ close: []; index: [i: number] }>()

const index = ref(props.start)
const chrome = ref(true)
const stage = ref<HTMLElement>()
const track = ref<HTMLElement>()
const backdrop = ref<HTMLElement>()
let closing = false

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const photo = computed(() => props.photos[index.value])
const dateLine = computed(() =>
  photo.value.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
)
const timeLine = computed(() => photo.value.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))

/** Where a photo sits when fitted (contain) into the stage. */
function fitRect(p: Photo) {
  const r = stage.value!.getBoundingClientRect()
  const s = Math.min(r.width / p.width, r.height / p.height)
  const w = p.width * s
  const h = p.height * s
  return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h }
}

function currentImg() {
  return track.value?.querySelector<HTMLElement>(`[data-i="${index.value}"] .img`) ?? null
}

/** Transform that puts the fitted image exactly over a thumbnail rect (cover-cropped square). */
function toThumb(p: Photo, t: DOMRect) {
  const f = fitRect(p)
  const s = Math.max(t.width / f.width, t.height / f.height)
  const cx = t.left + t.width / 2 - (f.left + f.width / 2)
  const cy = t.top + t.height / 2 - (f.top + f.height / 2)
  // Clip to the square while scaled, so it lands as the cropped thumbnail
  const insetX = ((f.width * s - t.width) / 2 / s / f.width) * 100
  const insetY = ((f.height * s - t.height) / 2 / s / f.height) * 100
  return {
    transform: `translate(${cx}px, ${cy}px) scale(${s})`,
    clip: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${3 / s}px)`,
  }
}

function setTrack(offsetPx: number, animate: boolean) {
  if (!track.value) return
  track.value.style.transition = animate ? `transform 380ms ${EASE}` : 'none'
  track.value.style.transform = `translate3d(calc(${-index.value * 100}% + ${offsetPx}px), 0, 0)`
}

onMounted(async () => {
  await nextTick()
  setTrack(0, false)
  const img = currentImg()
  const t = props.thumbRect(index.value)
  if (img && t && !reduceMotion) {
    const { transform, clip } = toThumb(photo.value, t)
    img.style.transition = 'none'
    img.style.transform = transform
    img.style.clipPath = clip
    backdrop.value!.style.opacity = '0'
    void img.offsetWidth
    requestAnimationFrame(() => {
      img.style.transition = `transform 420ms ${EASE}, clip-path 420ms ${EASE}`
      img.style.transform = ''
      img.style.clipPath = 'inset(0% 0% 0% 0% round 0px)'
      backdrop.value!.style.transition = 'opacity 320ms ease'
      backdrop.value!.style.opacity = '1'
    })
  }
  // Capture phase + stopImmediatePropagation: Esc closes the photo, not the whole app
  window.addEventListener('keydown', onKey, { capture: true })
})

onUnmounted(() => window.removeEventListener('keydown', onKey, { capture: true }))

function go(i: number) {
  if (i < 0 || i >= props.photos.length) return setTrack(0, true)
  index.value = i
  emit('index', i)
  setTrack(0, true)
}

function close() {
  if (closing) return
  closing = true
  chrome.value = false
  const img = currentImg()
  const t = props.thumbRect(index.value)
  backdrop.value!.style.transition = 'opacity 300ms ease'
  backdrop.value!.style.opacity = '0'
  if (img && t && !reduceMotion) {
    const { transform, clip } = toThumb(photo.value, t)
    img.style.transition = `transform 380ms ${EASE}, clip-path 380ms ${EASE}`
    img.style.transform = transform
    img.style.clipPath = clip
    window.setTimeout(() => emit('close'), 380)
  } else window.setTimeout(() => emit('close'), 200)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') go(index.value + 1)
  else if (e.key === 'ArrowLeft') go(index.value - 1)
  else return
  e.stopImmediatePropagation()
  e.preventDefault()
}

/* ---------- Gestures: axis-locked swipe ---------- */
let axis: 'x' | 'y' | null = null

const drag = useDrag({
  start: () => {
    axis = null
    return !closing
  },
  move: ({ dx, dy }) => {
    if (!axis) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    if (axis === 'x') {
      const edge = (index.value === 0 && dx > 0) || (index.value === props.photos.length - 1 && dx < 0)
      setTrack(edge ? dx * 0.3 : dx, false)
    } else {
      // Pull down: photo follows the finger and shrinks, background fades
      const down = Math.max(0, dy)
      const p = Math.min(1, down / 400)
      const img = currentImg()
      if (img) {
        img.style.transition = 'none'
        img.style.transform = `translate(${dx}px, ${dy}px) scale(${1 - p * 0.35})`
      }
      backdrop.value!.style.transition = 'none'
      backdrop.value!.style.opacity = String(1 - p * 0.9)
      chrome.value = false
    }
  },
  end: ({ dx, dy, vx, vy, tap }) => {
    if (tap) {
      chrome.value = !chrome.value
      return
    }
    if (axis === 'x') {
      const w = stage.value!.getBoundingClientRect().width
      if (dx < -w * 0.2 || vx < -0.4) go(index.value + 1)
      else if (dx > w * 0.2 || vx > 0.4) go(index.value - 1)
      else setTrack(0, true)
    } else if (axis === 'y') {
      if (dy > 110 || vy > 0.6) close()
      else {
        const img = currentImg()
        if (img) {
          img.style.transition = `transform 360ms ${EASE}`
          img.style.transform = ''
        }
        backdrop.value!.style.transition = 'opacity 300ms ease'
        backdrop.value!.style.opacity = '1'
        chrome.value = true
      }
    }
  },
})

/** Render only the current photo and its neighbours. */
const visible = (i: number) => Math.abs(i - index.value) <= 1
</script>

<template>
  <div class="viewer" role="dialog" aria-modal="true" aria-label="Photo viewer">
    <div ref="backdrop" class="backdrop" />

    <header class="top" :class="{ hidden: !chrome }">
      <button type="button" class="btn" aria-label="Back to library" @click="close">
        <svg viewBox="0 0 12 20" width="10" height="17" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="when">
        <strong>{{ dateLine }}</strong>
        <small>{{ timeLine }}</small>
      </div>
      <span class="count">{{ index + 1 }} / {{ photos.length }}</span>
    </header>

    <div ref="stage" class="stage" v-bind="drag">
      <div ref="track" class="track">
        <div v-for="(p, i) in photos" :key="p.name" class="slide" :data-i="i">
          <img
            v-if="visible(i)"
            class="img"
            :src="p.src"
            :alt="p.caption || `Photo from ${p.date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`"
            :style="{ '--ratio': p.width / p.height }"
            draggable="false"
          />
        </div>
      </div>
    </div>

    <footer class="bottom" :class="{ hidden: !chrome }">
      <p v-if="photo.caption" class="caption">{{ photo.caption }}</p>
      <div v-if="photos.length > 1" class="strip">
        <button
          v-for="(p, i) in photos"
          :key="p.name"
          type="button"
          class="mini"
          :class="{ on: i === index }"
          :aria-label="`Photo ${i + 1}`"
          @click="go(i)"
        >
          <img :src="p.thumb" alt="" />
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.viewer {
  position: absolute;
  inset: 0;
  z-index: 10;
  color: #fff;
  user-select: none;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: #000;
}

/* The photo fits between the header (back button, date) and the thumbnail strip, never under them */
.stage {
  position: absolute;
  inset: 104px 0 96px;
  /* Clip sideways (neighbouring slides) but not vertically, so zoom and swipe-down can leave the band */
  overflow: clip visible;
  touch-action: none;
  cursor: grab;
}

.track {
  display: flex;
  height: 100%;
  will-change: transform;
}

.slide {
  flex: none;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  /* The slide is the size container, so the photo can be fitted against both its width and height */
  container-type: size;
}

/* Aspect-fit: as large as possible without cropping, on any screen shape */
.img {
  width: min(100cqw, 100cqh * var(--ratio));
  aspect-ratio: var(--ratio);
  height: auto;
  object-fit: contain;
  will-change: transform;
}

.top,
.bottom {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  transition: opacity 220ms ease;
}

.hidden {
  opacity: 0;
  pointer-events: none;
}

.top {
  top: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 50px 14px 14px;
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.55), transparent);
}

.btn {
  justify-self: start;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgb(255 255 255 / 0.16);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  cursor: pointer;
}

.btn:focus-visible,
.mini:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.when {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.when strong {
  font-size: 15px;
}

.when small {
  font-size: 12px;
  opacity: 0.7;
}

.count {
  justify-self: end;
  font-size: 13px;
  opacity: 0.7;
  padding-right: 6px;
}

.bottom {
  bottom: 0;
  padding: 18px 0 34px;
  background: linear-gradient(to top, rgb(0 0 0 / 0.6), transparent);
}

.caption {
  margin: 0 20px 12px;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
}

.strip {
  display: flex;
  justify-content: center;
  gap: 2px;
  padding: 0 16px;
}

.mini {
  width: 30px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 3px;
  overflow: hidden;
  opacity: 0.6;
  transition: width 220ms ease, opacity 220ms ease;
  cursor: pointer;
  background: #222;
}

.mini.on {
  width: 42px;
  opacity: 1;
  margin: 0 4px;
}

.mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
