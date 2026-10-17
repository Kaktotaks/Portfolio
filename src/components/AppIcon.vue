<script setup lang="ts">
import { ref } from 'vue'
import type { HomeApp } from '../data/types'
import IconTile from './IconTile.vue'

const props = withDefaults(defineProps<{ app: HomeApp; showLabel?: boolean }>(), { showLabel: true })
const emit = defineEmits<{ open: [app: HomeApp, origin: DOMRect] }>()

/* Badge: shown until the visitor taps the icon once, then remembered as "read" in this browser */
const seenKey = `badge-seen:${props.app.id}`
function readSeen() {
  try {
    return localStorage.getItem(seenKey) === '1'
  } catch {
    return false
  }
}
const badge = ref(props.app.kind === 'link' && props.app.badge && !readSeen() ? props.app.badge : 0)

function clearBadge() {
  if (!badge.value) return
  badge.value = 0
  try {
    localStorage.setItem(seenKey, '1')
  } catch {
    /* storage unavailable — it just reappears next visit */
  }
}

function onClick(event: MouseEvent) {
  const tile = (event.currentTarget as HTMLElement).querySelector('.icon-tile') as HTMLElement
  emit('open', props.app, tile.getBoundingClientRect())
}
</script>

<template>
  <a
    v-if="app.kind === 'link'"
    class="app-icon"
    :href="app.url"
    :target="app.url.startsWith('mailto:') ? undefined : '_blank'"
    rel="noopener noreferrer"
    :aria-label="`${app.name}${badge ? `, ${badge} new` : ''} (opens externally)`"
    @click="clearBadge"
  >
    <span class="tile-wrap">
      <IconTile :icon="app.icon" />
      <span v-if="badge" class="badge" aria-hidden="true">{{ badge }}</span>
    </span>
    <span v-if="showLabel" class="label">{{ app.name }}</span>
  </a>
  <button v-else type="button" class="app-icon" :aria-label="`Open ${app.name}`" @click="onClick">
    <IconTile :icon="app.icon" />
    <span v-if="showLabel" class="label">{{ app.name }}</span>
  </button>
</template>

<style scoped>
.app-icon {
  font: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: 0;
  padding: 0;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.app-icon :deep(.icon-tile) {
  transition:
    transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
    filter 160ms ease;
}

.app-icon:hover :deep(.icon-tile) {
  transform: translateY(-2px) scale(1.03);
}

.app-icon:active :deep(.icon-tile) {
  transform: scale(0.9);
  filter: brightness(0.8);
}

.app-icon:focus-visible {
  outline: none;
}

.app-icon:focus-visible :deep(.icon-tile) {
  outline: 3px solid rgb(255 255 255 / 0.9);
  outline-offset: 3px;
}

.label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #fff;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.5);
  max-width: calc(var(--icon-size) + 22px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tile-wrap {
  position: relative;
  display: block;
}

/* iOS notification badge: pops in after unlock, then breathes now and then to invite a tap */
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 3;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #ff3b30;
  box-shadow:
    0 2px 6px rgb(255 59 48 / 0.45),
    inset 0 0.5px 0 rgb(255 255 255 / 0.35);
  transform-origin: 50% 50%;
  animation:
    badge-pop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) 900ms both,
    badge-nudge 6s ease-in-out 3s infinite;
}

.badge::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 0 rgb(255 59 48 / 0.55);
  animation: badge-ring 6s ease-out 3s infinite;
}

@keyframes badge-pop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes badge-nudge {
  0%,
  88%,
  100% {
    transform: scale(1);
  }
  92% {
    transform: scale(1.18);
  }
  96% {
    transform: scale(0.96);
  }
}

@keyframes badge-ring {
  0%,
  86% {
    box-shadow: 0 0 0 0 rgb(255 59 48 / 0.55);
  }
  100% {
    box-shadow: 0 0 0 10px rgb(255 59 48 / 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .badge,
  .badge::after {
    animation: none;
  }
}
</style>
