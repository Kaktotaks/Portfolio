<script setup lang="ts">
import type { HomeApp } from '../data/types'
import Glyph from './Glyph.vue'

const props = withDefaults(defineProps<{ app: HomeApp; showLabel?: boolean }>(), { showLabel: true })
const emit = defineEmits<{ open: [app: HomeApp, origin: DOMRect] }>()

function onClick(event: MouseEvent) {
  const tile = (event.currentTarget as HTMLElement).querySelector('.tile') as HTMLElement
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
    :aria-label="`${app.name} (opens externally)`"
  >
    <span class="tile" :style="{ '--from': app.icon.from, '--to': app.icon.to, color: app.icon.ink ?? '#fff' }">
      <Glyph :name="app.icon.glyph" />
    </span>
    <span v-if="showLabel" class="label">{{ app.name }}</span>
  </a>
  <button v-else type="button" class="app-icon" :aria-label="`Open ${app.name}`" @click="onClick">
    <span class="tile" :style="{ '--from': app.icon.from, '--to': app.icon.to, color: app.icon.ink ?? '#fff' }">
      <Glyph :name="app.icon.glyph" />
    </span>
    <span v-if="showLabel" class="label">{{ app.name }}</span>
  </button>
</template>

<style scoped>
.app-icon {
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

.tile {
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: calc(var(--icon-size) * 0.225);
  background: linear-gradient(160deg, var(--from), var(--to));
  display: grid;
  place-items: center;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.25),
    0 6px 16px rgb(0 0 0 / 0.25);
  transition: transform 160ms ease, filter 160ms ease;
}

.tile svg {
  width: 52%;
  height: 52%;
}

.app-icon:hover .tile {
  transform: translateY(-2px);
}

.app-icon:active .tile {
  transform: scale(0.92);
  filter: brightness(0.85);
}

.app-icon:focus-visible {
  outline: none;
}

.app-icon:focus-visible .tile {
  outline: 3px solid rgb(255 255 255 / 0.9);
  outline-offset: 3px;
}

.label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #fff;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.45);
  max-width: calc(var(--icon-size) + 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
