<script setup lang="ts">
import type { GlyphName } from '../data/types'

defineProps<{ name: GlyphName }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'mail'">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </template>
    <template v-else-if="name === 'linkedin'">
      <path d="M7 10v7M7 7v.01M11 17v-4a3 3 0 0 1 6 0v4M11 10v7" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </template>
  </svg>
</template>
