<script setup lang="ts">
import Glyph from './Glyph.vue'

/**
 * Small (2×2) home-screen widget in the style of LinkedIn's "Highlights" widget:
 * full-bleed photo, darkening gradient, name + two-line summary, reaction bubbles.
 * Tapping it opens Leonid's LinkedIn profile.
 */
defineProps<{ name: string; summary: string; photo: string; url: string; footer: string }>()
</script>

<template>
  <a class="li-widget" :href="url" target="_blank" rel="noopener noreferrer" :aria-label="`LinkedIn: ${name}. ${summary}`">
    <span class="card">
      <img class="photo" :src="photo" alt="" draggable="false" />
      <span class="shade" aria-hidden="true" />
      <span class="content">
        <span class="top">
          <span class="title">Highlights</span>
          <span class="badge" aria-hidden="true"><Glyph name="linkedin" /></span>
        </span>
        <span class="bottom">
          <span class="name">{{ name }}</span>
          <span class="summary">{{ summary }}</span>
          <span class="footer">
            <span class="reactions" aria-hidden="true">
              <span class="r like">
                <svg viewBox="0 0 16 16"><path d="M5 7v6H3V7h2Zm1 6V7l2.6-4c.9 0 1.4.7 1.2 1.5L9.4 6.5H12c.8 0 1.3.7 1.1 1.4l-1 4.1c-.1.6-.6 1-1.2 1H6Z" fill="#fff" /></svg>
              </span>
              <span class="r celebrate">
                <svg viewBox="0 0 16 16"><path d="M4 12.5 6 5l5 5-7.5 2.5Zm4-8.3.6-1.7m2 3.5 1.8-.4m-.9-2.6L13 1.5" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <span class="r love">
                <svg viewBox="0 0 16 16"><path d="M8 13.2 2.9 8.4a3 3 0 0 1 4.3-4.2l.8.8.8-.8a3 3 0 0 1 4.3 4.2Z" fill="#fff" /></svg>
              </span>
            </span>
            <span class="count">{{ footer }}</span>
          </span>
        </span>
      </span>
    </span>
    <span class="label">LinkedIn</span>
  </a>
</template>

<style scoped>
.li-widget {
  /* Spans two icon columns, edge-aligned with the icons around it, like an iOS small widget */
  grid-column: span 2;
  grid-row: span 2;
  justify-self: center;
  align-self: start;
  width: calc(50% + var(--icon-size));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.card {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: calc(var(--icon-size) * 0.36);
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 8px 22px rgb(0 0 0 / 0.28),
    inset 0 0 0 0.5px rgb(255 255 255 / 0.25);
  transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
}

.li-widget:hover .card {
  transform: translateY(-2px) scale(1.015);
}

.li-widget:active .card {
  transform: scale(0.95);
}

.li-widget:focus-visible {
  outline: none;
}

.li-widget:focus-visible .card {
  outline: 3px solid rgb(255 255 255 / 0.9);
  outline-offset: 3px;
}

.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
  z-index: -2;
}

.shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(to bottom, rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.1) 30%, rgb(0 0 0 / 0.35) 55%, rgb(0 0 0 / 0.82)),
    rgb(0 0 0 / 0.08);
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 11% 10% 10%;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-weight: 700;
  font-size: calc(var(--icon-size) * 0.25);
  letter-spacing: -0.01em;
}

.badge {
  width: calc(var(--icon-size) * 0.27);
  height: calc(var(--icon-size) * 0.27);
  border-radius: 3px;
  background: #0a66c2;
  display: grid;
  place-items: center;
}

.badge :deep(svg) {
  width: 92%;
  height: 92%;
  stroke-width: 2.6;
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.name {
  font-weight: 700;
  font-size: calc(var(--icon-size) * 0.19);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary {
  font-size: calc(var(--icon-size) * 0.2);
  line-height: 1.25;
  opacity: 0.82;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
}

.reactions {
  display: flex;
}

.r {
  width: calc(var(--icon-size) * 0.22);
  height: calc(var(--icon-size) * 0.22);
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: 0 0 0 1.5px rgb(0 0 0 / 0.55);
}

.r + .r {
  margin-left: -4px;
}

.r svg {
  width: 62%;
  height: 62%;
}

.like {
  background: #378fe9;
}

.celebrate {
  background: #44712e;
}

.love {
  background: #df704d;
}

.count {
  font-size: calc(var(--icon-size) * 0.18);
  opacity: 0.85;
  white-space: nowrap;
}

.label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.5);
}
</style>
