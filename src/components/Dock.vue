<script setup lang="ts">
import type { LinkApp } from '../data/types'
import AppIcon from './AppIcon.vue'

defineProps<{ apps: LinkApp[] }>()
</script>

<template>
  <nav class="dock" aria-label="Contacts">
    <AppIcon v-for="app in apps" :key="app.id" :app="app" :show-label="false" />
  </nav>
</template>

<style scoped>
.dock {
  display: flex;
  justify-content: space-around;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 32px;
  background: rgb(255 255 255 / 0.18);
  backdrop-filter: blur(28px) saturate(1.5);
  -webkit-backdrop-filter: blur(28px) saturate(1.5);
}
</style>
