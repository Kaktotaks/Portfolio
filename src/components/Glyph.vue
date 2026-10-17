<script setup lang="ts">
import type { GlyphName } from '../data/types'

defineProps<{ name: GlyphName }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'leaf'">
      <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
      <path d="M5 19c3-4 6-7 10-9" />
    </template>
    <template v-else-if="name === 'signal'">
      <path d="M5 18v-2M9.5 18v-5M14 18V9.5M18.5 18V6" />
    </template>
    <template v-else-if="name === 'fish'">
      <path d="M3 12c3-4 7-5 11-4s5 4 5 4-1 3-5 4-8 0-11-4Z" />
      <path d="M19 12l2.5-3v6Z" />
      <circle cx="8" cy="11" r=".6" fill="currentColor" />
    </template>
    <template v-else-if="name === 'doc'">
      <path d="M7 3h7l4 4v14H7Z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </template>
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </template>
    <template v-else-if="name === 'notes'">
      <path d="M6 4h12v16H6Z" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </template>
    <template v-else-if="name === 'linkedin'">
      <path d="M7 10v7M7 7v.01M11 17v-4a3 3 0 0 1 6 0v4M11 10v7" />
    </template>
    <template v-else-if="name === 'github'">
      <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </template>
    <template v-else-if="name === 'instagram'">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.8 7.2v.01" />
    </template>
    <template v-else-if="name === 'person'">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
    </template>
    <template v-else-if="name === 'graduation'">
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5Z" />
      <path d="M6.5 11v4.5c3 2.5 8 2.5 11 0V11" />
    </template>
  </svg>
</template>
