<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Project } from '../../data/types'
import IconTile from '../IconTile.vue'
import Screenshot from './Screenshot.vue'

/**
 * Case study laid out like an App Store product page: header with a "View" pill, a sideways
 * info strip, screenshots, a collapsible description, then hairline-separated sections and
 * an "Information" table at the bottom.
 */
const props = defineProps<{ project: Project }>()

const storeLink = computed(() => props.project.links?.[0])
const expanded = ref(false)
const shared = ref(false)

/** Info strip: the project's metrics, then role, period and platform — like RATINGS / AGE / CHART… */
const strip = computed(() => {
  const p = props.project
  const items = p.metrics.map((m) => ({ top: m.label, value: m.value, sub: '' }))
  const start = p.period.match(/\d{4}/)?.[0]
  const end = /present/.test(p.period) ? 'Now' : p.period.match(/\d{4}(?!.*\d{4})/)?.[0]
  items.push({ top: 'Role', value: roleShort(p.role), sub: p.company })
  if (start) items.push({ top: 'Years', value: end && end !== start ? `${start}–${end.slice(-2)}` : start, sub: end === 'Now' ? 'ongoing' : '' })
  items.push({ top: 'Platform', value: p.platforms.join(' + '), sub: p.domain ?? '' })
  return items
})

function roleShort(role: string) {
  if (/product owner/i.test(role)) return 'PO + Dev'
  if (/product engineer/i.test(role)) return 'Senior iOS / PE'
  return role.replace(/ Developer$/, ' Dev').replace(/\s*\(.*\)/, '')
}

async function share() {
  const url = `${location.origin}${location.pathname}#/${props.project.id}`
  try {
    if (navigator.share) await navigator.share({ title: props.project.name, url })
    else {
      await navigator.clipboard.writeText(url)
      shared.value = true
      window.setTimeout(() => (shared.value = false), 1600)
    }
  } catch {
    /* share sheet dismissed */
  }
}
</script>

<template>
  <article class="store">
    <!-- Header -->
    <header class="head">
      <IconTile :icon="project.icon" size="118px" />
      <div class="head-text">
        <h1>{{ project.name }}</h1>
        <p class="subtitle">{{ project.tagline }}</p>
        <p class="seller">{{ project.company }}</p>
        <div class="actions">
          <a v-if="storeLink" class="get" :href="storeLink.url" target="_blank" rel="noopener noreferrer" :aria-label="`View ${project.name} on the ${storeLink.label}`">
            View
          </a>
          <button type="button" class="share" :aria-label="shared ? 'Link copied' : `Share ${project.name}`" @click="share">
            <svg v-if="!shared" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Info strip -->
    <div class="strip" role="list" aria-label="Highlights">
      <div v-for="item in strip" :key="item.top" class="cell" role="listitem">
        <span class="cell-top">{{ item.top }}</span>
        <span class="cell-value">{{ item.value }}</span>
        <span class="cell-sub">{{ item.sub }}</span>
      </div>
    </div>

    <!-- Screenshots -->
    <section v-if="project.screenshots?.length" class="block shots-block">
      <div class="shots" tabindex="0" aria-label="Screenshots">
        <Screenshot v-for="shot in project.screenshots" :key="shot.src" :shot="shot" />
      </div>
      <p class="device">
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="4.5" y="1.5" width="7" height="13" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
        {{ project.platforms.includes('Web') ? 'iPhone · also on the Web' : 'iPhone' }}
      </p>
    </section>

    <!-- Description -->
    <section v-if="project.product" class="block">
      <div class="desc" :class="{ open: expanded }">
        <p class="prose">{{ project.product }}</p>
        <p class="prose">{{ project.summary }}</p>
      </div>
      <button v-if="!expanded" type="button" class="more" @click="expanded = true">more</button>
    </section>

    <!-- What I did: styled like "What's New" -->
    <section class="block">
      <div class="block-head">
        <h2>What I did</h2>
      </div>
      <p class="version">{{ project.role }} · {{ project.period }}</p>
      <ul class="bullets">
        <li v-for="item in project.highlights" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- Impact -->
    <section v-if="project.impact?.length" class="block">
      <div class="block-head">
        <h2>Impact</h2>
      </div>
      <ul class="impact">
        <li v-for="item in project.impact" :key="item" class="impact-card">
          <span class="tick" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="12" height="12"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- Built with -->
    <section class="block">
      <div class="block-head">
        <h2>Built with</h2>
      </div>
      <div class="chips">
        <span v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</span>
      </div>
    </section>

    <!-- Information table -->
    <section class="block">
      <div class="block-head">
        <h2>Information</h2>
      </div>
      <dl class="info">
        <div><dt>Provider</dt><dd>{{ project.company }}</dd></div>
        <div v-if="project.role"><dt>Position</dt><dd>{{ project.role }}</dd></div>
        <div v-if="project.period"><dt>Period</dt><dd>{{ project.period }}</dd></div>
        <div v-if="project.team"><dt>Team</dt><dd>{{ project.team }}</dd></div>
        <div v-if="project.domain"><dt>Category</dt><dd>{{ project.domain }}</dd></div>
        <div><dt>Platforms</dt><dd>{{ project.platforms.join(', ') }}</dd></div>
      </dl>
      <a v-if="storeLink" class="store-link" :href="storeLink.url" target="_blank" rel="noopener noreferrer">
        View on {{ storeLink.label }}
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </a>
    </section>
  </article>
</template>

<style scoped>
.store {
  max-width: 720px;
  margin: 0 auto;
  padding: 4px 0 64px;
}

/* ---------- Header ---------- */
.head {
  display: flex;
  gap: 16px;
  padding: 6px 20px 18px;
}

.head-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--ink-secondary);
  line-height: 1.3;
}

.seller {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--tint);
}

.actions {
  margin-top: auto;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.get {
  min-width: 74px;
  padding: 6px 18px;
  border-radius: 999px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: var(--tint);
  text-decoration: none;
  transition: transform 160ms ease, filter 160ms ease;
}

.get:active {
  transform: scale(0.95);
  filter: brightness(0.9);
}

.share {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--tint);
  background: none;
  cursor: pointer;
}

.get:focus-visible,
.share:focus-visible,
.more:focus-visible,
.store-link:focus-visible {
  outline: 2px solid var(--tint);
  outline-offset: 2px;
}

/* ---------- Info strip ---------- */
.strip {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 12px 8px;
  border-top: 1px solid var(--separator);
  border-bottom: 1px solid var(--separator);
}

.strip::-webkit-scrollbar {
  display: none;
}

.cell {
  flex: 1 0 auto;
  min-width: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 12px;
}

.cell + .cell {
  border-left: 1px solid var(--separator);
}

.cell-top {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink-secondary);
  white-space: nowrap;
}

.cell-value {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink-secondary);
  white-space: nowrap;
}

.cell-sub {
  margin-top: 2px;
  min-height: 1em;
  font-size: 12px;
  color: var(--ink-secondary);
  white-space: nowrap;
}

/* ---------- Blocks ---------- */
.block {
  margin: 0 20px;
  padding: 18px 0;
  border-bottom: 1px solid var(--separator);
}

.block:last-child {
  border-bottom: 0;
}

.block-head h2 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.prose {
  margin: 0;
  line-height: 1.5;
}

.prose + .prose {
  margin-top: 10px;
}

.muted {
  color: var(--ink-secondary);
}

/* ---------- Screenshots ---------- */
.shots-block {
  margin: 0;
  padding: 16px 0 12px;
  border-bottom: 0;
}

.shots {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 4px 20px 22px;
  margin-bottom: -10px;
  scroll-padding-inline: 20px;
  scrollbar-width: none;
}

.shots::-webkit-scrollbar {
  display: none;
}

.shots:focus-visible {
  outline: 2px solid var(--tint);
  outline-offset: -4px;
  border-radius: 24px;
}

.device {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 20px;
  padding-bottom: 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-secondary);
  border-bottom: 1px solid var(--separator);
}

/* ---------- Description with "more" ---------- */
.desc {
  position: relative;
  max-height: calc(1.5em * 3);
  overflow: hidden;
  /* Fade the last line out instead of hard-cutting it */
  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);
  mask-image: linear-gradient(to bottom, #000 60%, transparent);
}

.desc.open {
  max-height: none;
  -webkit-mask-image: none;
  mask-image: none;
}

.more {
  display: block;
  margin: 2px 0 0 auto;
  padding: 0;
  border: 0;
  font: inherit;
  font-weight: 500;
  color: var(--tint);
  background: none;
  cursor: pointer;
}

/* ---------- What I did ---------- */
.version {
  margin: -2px 0 10px;
  font-size: 13px;
  color: var(--ink-secondary);
}

.bullets {
  margin: 0;
  padding-left: 18px;
  line-height: 1.5;
}

.bullets li + li {
  margin-top: 8px;
}

.bullets li::marker {
  color: var(--tint);
}

/* ---------- Impact cards ---------- */
.impact {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.impact-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 16px;
  line-height: 1.45;
  background: var(--card-fill);
}

.tick {
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: #34c759;
}

/* ---------- Chips ---------- */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 4px;
}

.chip {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  background: var(--card-fill);
}

/* ---------- Information ---------- */
.info {
  margin: 0;
}

.info > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid var(--separator);
}

.info dt {
  color: var(--ink-secondary);
  flex: none;
}

.info dd {
  margin: 0;
  text-align: right;
}

.store-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  color: var(--tint);
  text-decoration: none;
  font-weight: 500;
}
</style>
