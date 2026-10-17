<script setup lang="ts">
import { computed, ref } from 'vue'
import { photos } from '../../data/photos'
import PhotoViewer from './PhotoViewer.vue'

/**
 * Photos, modelled on the iOS Photos library: large "Library" title, edge-to-edge square grid,
 * Years / Months / All switcher floating at the bottom, and a full-screen viewer that zooms
 * out of the tapped thumbnail. Add photos with tools/add-photos.py.
 */
type View = 'years' | 'months' | 'all'
const view = ref<View>('all')
const open = ref<number | null>(null)
const grid = ref<HTMLElement>()

const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })
const shortFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' })

const range = computed(() => {
  if (!photos.length) return ''
  const a = shortFmt.format(photos[0].date)
  const b = shortFmt.format(photos[photos.length - 1].date)
  return a === b ? a : `${a} – ${b}`
})

/** Groups for Months / Years, newest first like Photos; each opens at its latest photo. */
function groups(key: (d: Date) => string, label: (d: Date) => string) {
  const map = new Map<string, { label: string; count: number; cover: number }>()
  photos.forEach((p, i) => {
    const k = key(p.date)
    const g = map.get(k)
    if (g) {
      g.count++
      g.cover = i
    } else map.set(k, { label: label(p.date), count: 1, cover: i })
  })
  return [...map.values()].reverse()
}
const months = computed(() => groups((d) => `${d.getFullYear()}-${d.getMonth()}`, (d) => monthFmt.format(d)))
const years = computed(() => groups((d) => String(d.getFullYear()), (d) => String(d.getFullYear())))

/** Rect of a grid thumbnail, so the viewer can zoom out of / back into it. */
function thumbRect(i: number) {
  const el = grid.value?.querySelector<HTMLElement>(`[data-i="${i}"]`) ?? document.querySelector<HTMLElement>(`[data-cover="${i}"]`)
  return el?.getBoundingClientRect() ?? null
}

function openGroup(cover: number) {
  view.value = 'all'
  open.value = cover
}
</script>

<template>
  <div class="photos">
    <header class="head">
      <h1>Library</h1>
      <p v-if="photos.length" class="sub">{{ photos.length }} {{ photos.length === 1 ? 'Item' : 'Items' }} · {{ range }}</p>
    </header>

    <!-- Empty state, like a fresh iCloud library -->
    <div v-if="!photos.length" class="empty">
      <svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true"><rect x="6" y="10" width="36" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="2.4" /><circle cx="18" cy="20" r="3.5" fill="currentColor" /><path d="m8 34 10-9 7 6 5-4 10 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" /></svg>
      <p class="empty-title">No Photos</p>
      <p class="empty-body">Photos will appear here soon.</p>
    </div>

    <!-- All: square grid -->
    <div v-else-if="view === 'all'" ref="grid" class="grid">
      <button
        v-for="(p, i) in photos"
        :key="p.name"
        type="button"
        class="cell"
        :data-i="i"
        :aria-label="`Photo from ${p.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`"
        @click="open = i"
      >
        <img :src="p.thumb" alt="" loading="lazy" decoding="async" draggable="false" :style="{ visibility: open === i ? 'hidden' : 'visible' }" />
      </button>
    </div>

    <!-- Months / Years: big cards -->
    <div v-else class="cards">
      <button
        v-for="g in view === 'months' ? months : years"
        :key="g.label"
        type="button"
        class="card"
        :class="view"
        :data-cover="g.cover"
        @click="openGroup(g.cover)"
      >
        <img :src="photos[g.cover].src" alt="" loading="lazy" decoding="async" draggable="false" />
        <span class="card-text">
          <strong>{{ g.label }}</strong>
          <small>{{ g.count }} {{ g.count === 1 ? 'photo' : 'photos' }}</small>
        </span>
      </button>
    </div>

    <Teleport to="#window-overlay" defer>
      <!-- Floating segmented control, pinned to the bottom of the screen like Photos -->
      <nav v-if="photos.length && open === null" class="switcher" aria-label="Library view">
        <div class="seg">
          <button v-for="v in (['years', 'months', 'all'] as View[])" :key="v" type="button" :class="{ on: view === v }" :aria-pressed="view === v" @click="view = v">
            {{ v === 'all' ? 'All' : v[0].toUpperCase() + v.slice(1) }}
          </button>
        </div>
      </nav>
      <PhotoViewer v-if="open !== null" :photos="photos" :start="open" :thumb-rect="thumbRect" @index="open = $event" @close="open = null" />
    </Teleport>
  </div>
</template>

<style scoped>
.photos {
  min-height: 100%;
  padding-bottom: 120px;
}

.head {
  padding: 4px 20px 12px;
}

h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.sub {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

/* Edge-to-edge grid, 1px gutters like Photos */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

@container (min-width: 760px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.cell {
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: var(--skeleton-base);
  overflow: hidden;
  cursor: pointer;
}

.cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 160ms ease;
}

.cell:active img {
  filter: brightness(0.8);
}

.cell:focus-visible {
  outline: 3px solid var(--tint);
  outline-offset: -3px;
}

/* Months / Years cards */
.cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 16px;
}

.card {
  position: relative;
  padding: 0;
  border: 0;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--skeleton-base);
  cursor: pointer;
  text-align: left;
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.12);
}

.card.years {
  aspect-ratio: 1;
}

.card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.45), transparent 40%);
}

.card-text {
  position: absolute;
  z-index: 1;
  top: 14px;
  left: 16px;
  display: flex;
  flex-direction: column;
  color: #fff;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
}

.card-text strong {
  font-size: 22px;
  font-weight: 700;
}

.years .card-text strong {
  font-size: 30px;
}

.card-text small {
  font-size: 13px;
  opacity: 0.9;
}

.card:focus-visible {
  outline: 3px solid var(--tint);
  outline-offset: 2px;
}

/* Floating glass segmented control */
.switcher {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 38px;
  display: flex;
  justify-content: center;
  pointer-events: none !important;
}

.seg {
  pointer-events: auto;
  display: flex;
  padding: 3px;
  border-radius: 999px;
  background: rgb(120 120 128 / 0.22);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
  box-shadow:
    0 6px 20px rgb(0 0 0 / 0.18),
    inset 0 0.5px 0 rgb(255 255 255 / 0.4);
}

.seg button {
  min-width: 70px;
  padding: 7px 14px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  background: none;
  cursor: pointer;
  transition: background 200ms ease;
}

.seg button.on {
  background: var(--glass-strong);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.12);
}

.seg button:focus-visible {
  outline: 2px solid var(--tint);
  outline-offset: 1px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 90px 30px;
  color: var(--ink-secondary);
  text-align: center;
}

.empty-title {
  margin: 12px 0 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
}

.empty-body {
  margin: 4px 0 0;
}
</style>
