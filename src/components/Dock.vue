<script setup lang="ts">
import type { LinkApp } from '../data/types'
import AppIcon from './AppIcon.vue'

defineProps<{ apps: LinkApp[] }>()
</script>

<template>
  <nav class="dock glass-clear" aria-label="Contacts">
    <AppIcon v-for="app in apps" :key="app.id" :app="app" :show-label="false" />
  </nav>
</template>

<style scoped>
.dock {
  /* Hugs its icons, like the iOS dock when it holds only a few apps */
  display: flex;
  width: fit-content;
  margin: 0 auto;
  gap: calc(var(--icon-size) * 0.42);
  padding: 14px calc(var(--icon-size) * 0.3);
  border-radius: calc(var(--icon-size) * 0.5);
}

/* Keep icons above the glass highlight layers */
.dock > :deep(*) {
  position: relative;
  z-index: 2;
}
</style>
