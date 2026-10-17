<script setup lang="ts">
import type { Project } from '../../data/types'
import Glyph from '../Glyph.vue'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="page">
    <header class="hero">
      <span class="hero-icon" :style="{ '--from': project.icon.from, '--to': project.icon.to, color: project.icon.ink ?? '#fff' }">
        <Glyph :name="project.icon.glyph" />
      </span>
      <div>
        <h1>{{ project.name }}</h1>
        <p class="tagline">{{ project.tagline }}</p>
        <p class="meta">{{ project.role }} · {{ project.company }}</p>
      </div>
    </header>

    <dl v-if="project.metrics.length" class="metrics">
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
      <div class="group">
        <p class="prose">{{ project.summary }}</p>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">What I did</h2>
      <ul class="group list">
        <li v-for="item in project.highlights" :key="item" class="row">{{ item }}</li>
      </ul>
    </section>

    <section class="section">
      <h2 class="section-title">Stack</h2>
      <div class="group chips">
        <span v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</span>
      </div>
    </section>

    <section v-if="project.links?.length" class="section">
      <h2 class="section-title">Links</h2>
      <ul class="group list">
        <li v-for="link in project.links" :key="link.url" class="row">
          <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
        </li>
      </ul>
    </section>

    <p class="footnote">{{ project.period }}</p>
  </article>
</template>

<style scoped>
.hero {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px 4px 8px;
}

.hero-icon {
  flex: none;
  width: 88px;
  height: 88px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, var(--from), var(--to));
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.18);
}

.hero-icon svg {
  width: 50%;
  height: 50%;
}

h1 {
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.01em;
}

.tagline {
  margin: 2px 0 0;
  color: var(--ink-secondary);
  font-size: 15px;
}

.meta {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--tint);
  font-weight: 500;
}

.metrics {
  display: flex;
  margin: 12px 0 4px;
  padding: 12px 0;
  border-block: 1px solid var(--separator);
}

.metric {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 6px;
}

.metric dd {
  order: -1;
}

.metric + .metric {
  border-left: 1px solid var(--separator);
}

.metric dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-secondary);
}

.metric dd {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
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
  width: min(46%, 220px);
  aspect-ratio: 9 / 19.5;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid var(--separator);
  background: var(--card);
  scroll-snap-align: start;
}
</style>
