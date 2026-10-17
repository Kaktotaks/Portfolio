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

    <!-- Photos: original design — a sunrise snapshot on a white tile (not Apple's flower) -->
    <template v-else-if="art === 'photos'">
      <defs>
        <linearGradient id="sa-p-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="1" stop-color="#eeeef2" />
        </linearGradient>
        <linearGradient id="sa-p-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff9a62" />
          <stop offset="0.55" stop-color="#ffc36b" />
          <stop offset="1" stop-color="#ffe29a" />
        </linearGradient>
        <linearGradient id="sa-p-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7c5cff" />
          <stop offset="1" stop-color="#4b33c9" />
        </linearGradient>
        <linearGradient id="sa-p-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2fa8ff" />
          <stop offset="1" stop-color="#1167d9" />
        </linearGradient>
        <clipPath id="sa-p-clip"><rect x="20" y="22" width="60" height="56" rx="10" /></clipPath>
      </defs>
      <rect width="100" height="100" fill="url(#sa-p-bg)" />
      <!-- a second print peeking behind -->
      <rect x="26" y="16" width="52" height="52" rx="9" fill="#ff5f8f" opacity="0.9" transform="rotate(-8 52 42)" />
      <rect x="20" y="22" width="60" height="56" rx="10" fill="#000" opacity="0.12" transform="translate(0 2)" />
      <g clip-path="url(#sa-p-clip)">
        <rect x="20" y="22" width="60" height="56" fill="url(#sa-p-sky)" />
        <circle cx="62" cy="40" r="7.5" fill="#fff6d9" />
        <path d="M14 70 36 48l14 13 10-8 26 23V84H14Z" fill="url(#sa-p-hill1)" />
        <path d="M14 76c14-8 28-10 40-6s22 4 32-2V84H14Z" fill="url(#sa-p-hill2)" />
      </g>
      <rect x="20" y="22" width="60" height="56" rx="10" fill="none" stroke="#fff" stroke-width="3" />
    </template>

    <!-- Notes: original design — lined notepad and pencil on warm yellow -->
    <template v-else-if="art === 'notes'">
      <defs>
        <linearGradient id="sa-n-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe066" />
          <stop offset="1" stop-color="#ffb800" />
        </linearGradient>
        <linearGradient id="sa-n-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="1" stop-color="#fbf6e6" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sa-n-bg)" />
      <rect x="22" y="20" width="50" height="62" rx="7" fill="#b37400" opacity="0.25" transform="translate(0 2.5)" />
      <rect x="22" y="20" width="50" height="62" rx="7" fill="url(#sa-n-paper)" />
      <path d="M30 37h34M30 47h34M30 57h34M30 67h22" stroke="#f0c341" stroke-width="2.6" stroke-linecap="round" />
      <circle cx="31" cy="27" r="2.2" fill="#e9b52f" /><circle cx="47" cy="27" r="2.2" fill="#e9b52f" /><circle cx="63" cy="27" r="2.2" fill="#e9b52f" />
      <g transform="rotate(38 70 62)">
        <rect x="64" y="36" width="10" height="40" rx="2" fill="#ff7a59" />
        <rect x="64" y="36" width="10" height="6" rx="2" fill="#f2a8c5" />
        <path d="M64 76h10l-5 9Z" fill="#f6d7a7" />
        <path d="M67.6 82.2h2.8L69 85Z" fill="#3a3a40" />
      </g>
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
