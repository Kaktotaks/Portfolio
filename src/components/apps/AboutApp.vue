<script setup lang="ts">
import type { LinkApp, Profile } from '../../data/types'

defineProps<{ profile: Profile; contacts: LinkApp[] }>()
</script>

<template>
  <article class="page">
    <header class="card">
      <span class="avatar" aria-hidden="true">LS</span>
      <h1>{{ profile.name }}</h1>
      <p class="sub">{{ profile.title }}</p>
      <p class="sub small">{{ profile.location }}</p>
    </header>

    <section class="section">
      <div class="group">
        <p class="prose">{{ profile.bio }}</p>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Contact</h2>
      <ul class="group list">
        <li v-for="c in contacts" :key="c.id" class="row">
          <span class="row-label">{{ c.name }}</span>
          <a :href="c.url" :target="c.url.startsWith('mailto:') ? undefined : '_blank'" rel="noopener noreferrer">
            {{ c.url.startsWith('mailto:') ? profile.email : 'Open ↗' }}
          </a>
        </li>
      </ul>
    </section>

    <section class="section">
      <h2 class="section-title">Languages</h2>
      <ul class="group list">
        <li v-for="l in profile.languages" :key="l" class="row">{{ l }}</li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.card {
  text-align: center;
  padding: 24px 0 8px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(160deg, #fbbf24, #c2410c);
}

h1 {
  margin: 0;
  font-size: 26px;
}

.sub {
  margin: 4px 0 0;
  color: var(--ink-secondary);
}

.small {
  font-size: 14px;
}

.row-label {
  flex: 1;
}
</style>
