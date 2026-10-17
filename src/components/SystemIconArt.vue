<script setup lang="ts">
import type { SystemArt } from '../data/types'

/**
 * Full-bleed artwork for the built-in apps, drawn in the iOS system-icon style:
 * filled shapes, soft gradients and a top-lit sheen. Original drawings, not Apple's icons.
 * Gradient ids are prefixed per icon so several can share a page.
 */
defineProps<{ art: SystemArt }>()
</script>

<template>
  <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <!-- About: silver contact card -->
    <template v-if="art === 'contact'">
      <defs>
        <linearGradient id="sa-c-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fbfbfd" />
          <stop offset="1" stop-color="#c9c9d0" />
        </linearGradient>
        <linearGradient id="sa-c-person" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a7a7b0" />
          <stop offset="1" stop-color="#6c6c75" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sa-c-bg)" />
      <circle cx="50" cy="39" r="17" fill="url(#sa-c-person)" />
      <path d="M17 92C19 70 33 61 50 61S81 70 83 92Z" fill="url(#sa-c-person)" />
      <ellipse cx="45" cy="32" rx="7" ry="4.5" fill="#fff" opacity="0.28" />
    </template>

    <!-- Experience: white briefcase on warm orange -->
    <template v-else-if="art === 'briefcase'">
      <defs>
        <linearGradient id="sa-b-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffbe4d" />
          <stop offset="1" stop-color="#ff7d0a" />
        </linearGradient>
        <linearGradient id="sa-b-case" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="1" stop-color="#ffe9cf" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sa-b-bg)" />
      <path d="M38 34V28a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v6h-6v-5H44v5Z" fill="#fff" opacity="0.95" />
      <rect x="19" y="34" width="62" height="44" rx="8" fill="#c25a00" opacity="0.25" transform="translate(0 2.5)" />
      <rect x="19" y="34" width="62" height="44" rx="8" fill="url(#sa-b-case)" />
      <path d="M19 52h62" stroke="#ffb15c" stroke-width="2.4" />
      <rect x="44" y="48" width="12" height="9" rx="2.5" fill="#ff8a1a" />
    </template>

    <!-- Skills: machined gear on graphite -->
    <template v-else-if="art === 'gear'">
      <defs>
        <linearGradient id="sa-g-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9a9aa0" />
          <stop offset="1" stop-color="#4a4a50" />
        </linearGradient>
        <linearGradient id="sa-g-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fafafc" />
          <stop offset="0.5" stop-color="#cfcfd5" />
          <stop offset="1" stop-color="#8e8e95" />
        </linearGradient>
        <radialGradient id="sa-g-well" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stop-color="#55555c" />
          <stop offset="1" stop-color="#2c2c31" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sa-g-bg)" />
      <path
        d="M78.64 45.46 L85.84 46.61 L85.84 53.39 L78.64 54.54 L77.07 60.39 L82.73 64.99 L79.34 70.85 L72.54 68.25 L68.25 72.54 L70.85 79.34 L64.99 82.73 L60.39 77.07 L54.54 78.64 L53.39 85.84 L46.61 85.84 L45.46 78.64 L39.61 77.07 L35.01 82.73 L29.15 79.34 L31.75 72.54 L27.46 68.25 L20.66 70.85 L17.27 64.99 L22.93 60.39 L21.36 54.54 L14.16 53.39 L14.16 46.61 L21.36 45.46 L22.93 39.61 L17.27 35.01 L20.66 29.15 L27.46 31.75 L31.75 27.46 L29.15 20.66 L35.01 17.27 L39.61 22.93 L45.46 21.36 L46.61 14.16 L53.39 14.16 L54.54 21.36 L60.39 22.93 L64.99 17.27 L70.85 20.66 L68.25 27.46 L72.54 31.75 L79.34 29.15 L82.73 35.01 L77.07 39.61Z"
        fill="url(#sa-g-metal)"
        stroke="#6d6d74"
        stroke-width="0.8"
        stroke-linejoin="round"
      />
      <circle cx="50" cy="50" r="22" fill="url(#sa-g-well)" />
      <circle cx="50" cy="50" r="12" fill="url(#sa-g-metal)" stroke="#6d6d74" stroke-width="0.8" />
      <circle cx="50" cy="50" r="4.5" fill="#3a3a40" />
    </template>
  </svg>
</template>

<style scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
