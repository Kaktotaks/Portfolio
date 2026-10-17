<script setup lang="ts">
import map from '../assets/img/map-kyiv.webp'

/**
 * Small (2×2) Maps-style widget: central Kyiv with the Dnipro, a pulsing location dot on Maidan,
 * and a glass caption. Map data © OpenStreetMap contributors, restyled and baked into a static image
 * so the page makes no third-party map requests.
 */
defineProps<{ url: string; place: string; detail: string }>()
</script>

<template>
  <a class="map-widget" :href="url" target="_blank" rel="noopener noreferrer" :aria-label="`Maps: ${place}. ${detail}. Opens Google Maps. Map data © OpenStreetMap contributors`"
    title="Map data © OpenStreetMap contributors">
    <span class="card">
      <img class="map" :src="map" alt="" draggable="false" />

      <!-- Location dot on Maidan Nezalezhnosti -->
      <span class="dot" aria-hidden="true">
        <span class="halo" />
        <span class="core" />
      </span>

      <span class="caption">
        <span class="arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M13.5 2.5 2.8 7.1c-.5.2-.4.9.1 1l4.2 1 1 4.2c.1.5.8.6 1 .1L13.5 2.5Z" fill="currentColor" /></svg>
        </span>
        <span class="text">
          <strong>{{ place }}</strong>
          <small>{{ detail }}</small>
        </span>
      </span>

    </span>
    <span class="label">Maps</span>
  </a>
</template>

<style scoped>
.map-widget {
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
  background: #f6f4ee;
  box-shadow:
    0 8px 22px rgb(0 0 0 / 0.22),
    inset 0 0 0 0.5px rgb(0 0 0 / 0.08);
  transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
}

.map-widget:hover .card {
  transform: translateY(-2px) scale(1.015);
}

.map-widget:active .card {
  transform: scale(0.95);
}

.map-widget:focus-visible {
  outline: none;
}

.map-widget:focus-visible .card {
  outline: 3px solid rgb(255 255 255 / 0.9);
  outline-offset: 3px;
}

.map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.dot {
  position: absolute;
  left: 24.5%;
  top: 43%;
  width: 0;
  height: 0;
}

.core {
  position: absolute;
  width: 14px;
  height: 14px;
  left: -7px;
  top: -7px;
  border-radius: 50%;
  background: #0a84ff;
  border: 2.5px solid #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.3);
}

.halo {
  position: absolute;
  width: 46px;
  height: 46px;
  left: -23px;
  top: -23px;
  border-radius: 50%;
  background: rgb(10 132 255 / 0.22);
  animation: pulse 2.6s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.35);
    opacity: 1;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}

.caption {
  position: absolute;
  left: 7%;
  right: 7%;
  bottom: 7%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: calc(var(--icon-size) * 0.2);
  color: #1c1c1e;
  background: rgb(255 255 255 / 0.72);
  -webkit-backdrop-filter: blur(12px) saturate(1.6);
  backdrop-filter: blur(12px) saturate(1.6);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.12);
}

.arrow {
  flex: none;
  width: calc(var(--icon-size) * 0.3);
  height: calc(var(--icon-size) * 0.3);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: #0a84ff;
}

.arrow svg {
  width: 58%;
  height: 58%;
}

.text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.15;
}

.text strong {
  font-size: calc(var(--icon-size) * 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text small {
  font-size: calc(var(--icon-size) * 0.17);
  color: #6b6b73;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .halo {
    animation: none;
    opacity: 0.6;
  }
}
</style>
