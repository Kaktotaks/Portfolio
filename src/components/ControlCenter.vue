<script setup lang="ts">
import { ref } from 'vue'
import type { LinkApp } from '../data/types'
import { useTheme } from '../composables/useTheme'
import Glyph from './Glyph.vue'
import IconTile from './IconTile.vue'

const props = defineProps<{ links: LinkApp[]; email: string; time: string; repoUrl: string }>()

const { isDark, toggle } = useTheme()
const copied = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(props.email)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1600)
  } catch {
    window.location.href = `mailto:${props.email}`
  }
}
</script>

<template>
  <div class="cc">
    <div class="grid">
      <!-- Connectivity cluster: the ways to reach me -->
      <div class="tile glass-clear connect">
        <a
          v-for="l in links"
          :key="l.id"
          class="round"
          :href="l.url"
          :target="l.url.startsWith('mailto:') ? undefined : '_blank'"
          rel="noopener noreferrer"
          :aria-label="l.name"
          :style="{ '--on': l.icon.to }"
        >
          <IconTile :icon="l.icon" size="54px" />
        </a>
      </div>

      <div class="tile glass-clear wide focus">
        <span class="dot-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 12.5A8 8 0 1 1 11.5 4a6.5 6.5 0 0 0 8.5 8.5Z" fill="currentColor" /></svg>
        </span>
        <span class="label">
          <strong>Open to work</strong>
          <small>Senior iOS</small>
        </span>
      </div>

      <button type="button" class="tile glass-clear wide toggle" :class="{ on: isDark }" :aria-pressed="isDark" @click="toggle">
        <span class="dot-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="5" fill="currentColor" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
        </span>
        <span class="label">
          <strong>Dark Mode</strong>
          <small>{{ isDark ? 'On' : 'Off' }}</small>
        </span>
      </button>

      <button type="button" class="tile glass-clear square" :aria-label="`Copy email ${email}`" @click="copyEmail">
        <Glyph :name="copied ? 'check' : 'mail'" />
        <small>{{ copied ? 'Copied' : 'Copy email' }}</small>
      </button>

      <div class="tile glass-clear square clock-tile">
        <strong>{{ time }}</strong>
        <small>Kyiv</small>
      </div>

      <a class="tile glass-clear wide build" :href="repoUrl" target="_blank" rel="noopener noreferrer">
        <span class="dot-icon code" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="m8 7-5 5 5 5M16 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
        <span class="label">
          <strong>This site</strong>
          <small>Vue 3 + TS ↗</small>
        </span>
      </a>
    </div>
    <p class="hint">Swipe up to close</p>
  </div>
</template>

<style scoped>
.cc {
  width: min(100%, 380px);
  margin: 8px 0 0 auto;
}

.grid {
  --gap: 14px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((min(100vw - 32px, 380px) - 3 * var(--gap)) / 4);
  gap: var(--gap);
}

@container (min-width: 760px) {
  .grid {
    grid-auto-rows: calc((380px - 3 * var(--gap)) / 4);
  }
}

.tile {
  border: 0;
  border-radius: 26px;
  color: #fff;
  font: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  cursor: pointer;
  transition: transform 160ms ease;
}

.tile > * {
  position: relative;
  z-index: 2;
}

.tile:active {
  transform: scale(0.96);
}

.tile:focus-visible,
.round:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.connect {
  grid-column: span 2;
  grid-row: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
  border-radius: 30px;
  cursor: default;
}

.round {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  transition: transform 160ms ease;
}

.round:active {
  transform: scale(0.92);
}

.round :deep(svg),
.square :deep(svg) {
  width: 24px;
  height: 24px;
}

.wide {
  grid-column: span 2;
}

.dot-icon {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgb(255 255 255 / 0.18);
}

.focus .dot-icon {
  background: #5e5ce6;
}

.toggle.on .dot-icon {
  background: #fff;
  color: #111;
}

.code {
  background: rgb(255 255 255 / 0.18);
}

.label {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  line-height: 1.2;
}

.label strong {
  font-size: 14px;
}

.label small,
.square small {
  font-size: 12px;
  opacity: 0.75;
}

.square {
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  text-align: center;
}

.clock-tile {
  cursor: default;
}

.clock-tile strong {
  font-size: 18px;
  font-variant-numeric: tabular-nums;
}

.hint {
  margin: 18px 0 0;
  text-align: center;
  font-size: 13px;
  opacity: 0.6;
}
</style>
