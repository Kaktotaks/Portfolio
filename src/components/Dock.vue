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
  display: flex;
  justify-content: space-around;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 36px;
}

/* Keep icons above the glass highlight layers */
.dock > :deep(*) {
  position: relative;
  z-index: 2;
}
</style>
