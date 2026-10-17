<script setup lang="ts">
import type { Project } from '../../data/types'
import IconTile from '../IconTile.vue'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="page">
    <header class="hero">
      <IconTile :icon="project.icon" size="92px" />
      <div class="hero-text">
        <h1>{{ project.name }}</h1>
        <p class="tagline">{{ project.tagline }}</p>
        <p class="platforms">
          <span v-for="p in project.platforms" :key="p" class="platform">{{ p }}</span>
        </p>
      </div>
    </header>

    <a
      v-if="project.links?.length"
      class="primary glass"
      :href="project.links[0].url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>View on {{ project.links[0].label }}</span>
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </a>

    <template v-if="project.draft">
      <section class="section">
        <div class="group glass empty">
          <p class="empty-title">Case study coming soon</p>
          <p class="empty-body">The write-up for this project is in progress.</p>
        </div>
      </section>
    </template>

    <template v-else>
      <dl v-if="project.metrics.length" class="metrics glass">
        <div v-for="m in project.metrics" :key="m.label" class="metric">
          <dt>{{ m.label }}</dt>
          <dd>{{ m.value }}</dd>
        </div>
      </dl>

      <section v-if="project.screenshots?.length" class="section">
        <h2 class="section-title">Preview</h2>
        <div class="shots" tabindex="0" aria-label="Screenshots">
          <img
            v-for="shot in project.screenshots"
            :key="shot.src"
            class="shot"
            :src="shot.src"
            :alt="shot.alt"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Overview</h2>
        <div class="group glass">
          <p class="prose">{{ project.summary }}</p>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">What I did</h2>
        <ul class="group glass list">
          <li v-for="item in project.highlights" :key="item" class="row">{{ item }}</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="section-title">Stack</h2>
        <div class="group glass chips">
          <span v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</span>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Role</h2>
        <ul class="group glass list">
          <li class="row"><span class="k">Position</span><span class="v">{{ project.role }}</span></li>
          <li class="row"><span class="k">Company</span><span class="v">{{ project.company }}</span></li>
          <li class="row"><span class="k">Period</span><span class="v">{{ project.period }}</span></li>
        </ul>
      </section>
    </template>
  </article>
</template>

<style scoped>
.hero {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 8px 4px 4px;
}

.hero-text {
  min-width: 0;
}

h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
}

.tagline {
  margin: 2px 0 0;
  color: var(--ink-secondary);
  font-size: 15px;
}

.platforms {
  display: flex;
  gap: 6px;
  margin: 8px 0 0;
}

.platform {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--tint);
  background: color-mix(in srgb, var(--tint) 14%, transparent);
}

.primary {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 18px;
  border-radius: 999px;
  font-weight: 600;
  color: var(--tint);
  text-decoration: none;
  transition: transform 180ms ease;
}

.primary > * {
  position: relative;
  z-index: 2;
}

.primary:active {
  transform: scale(0.97);
}

.metrics {
  display: flex;
  margin: 16px 0 0;
  padding: 16px 0;
  border-radius: 22px;
}

.metric {
  position: relative;
  z-index: 2;
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 0 6px;
}

.metric dd {
  order: -1;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.metric + .metric {
  border-left: 1px solid var(--separator);
}

.metric dt {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-secondary);
}

.shots {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 2px 2px 10px;
  margin: 0 -2px;
}

.shots:focus-visible {
  outline: 2px solid var(--tint);
  border-radius: 14px;
}

.shot {
  flex: none;
  /* Fixed height, natural width: App Store sets mix 9:16 and 9:19.5 */
  height: min(420px, 56vh);
  width: auto;
  border-radius: 22px;
  box-shadow:
    0 0 0 1px var(--glass-edge),
    0 10px 30px rgb(0 0 0 / 0.18);
  scroll-snap-align: start;
}

.k {
  color: var(--ink-secondary);
  flex: none;
  width: 84px;
}

.v {
  font-weight: 500;
}

.empty {
  padding: 28px 20px;
  text-align: center;
}

.empty-title {
  margin: 0;
  font-weight: 600;
  font-size: 17px;
}

.empty-body {
  margin: 4px 0 0;
  color: var(--ink-secondary);
}

/* Content inside glass panes sits above the highlight layers */
.group > *,
.empty > * {
  position: relative;
  z-index: 2;
}
</style>
