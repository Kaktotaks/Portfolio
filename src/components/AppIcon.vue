<script setup lang="ts">
import type { HomeApp } from '../data/types'
import IconTile from './IconTile.vue'

const props = withDefaults(defineProps<{ app: HomeApp; showLabel?: boolean }>(), { showLabel: true })
const emit = defineEmits<{ open: [app: HomeApp, origin: DOMRect] }>()

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
    :aria-label="`${app.name} (opens externally)`"
  >
    <IconTile :icon="app.icon" />
    <span v-if="showLabel" class="label">{{ app.name }}</span>
  </a>
  <button v-else type="button" class="app-icon" :aria-label="`Open ${app.name}`" @click="onClick">
    <IconTile :icon="app.icon" />
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
</style>
