<script setup lang="ts">
import type { Role } from '../../data/types'

defineProps<{ experience: Role[] }>()
</script>

<template>
  <article class="page">
    <h1>Experience</h1>
    <p class="lead">5+ years building iOS products — startups, product companies, outsourcing and outstaffing.</p>

    <ol class="timeline group glass">
      <li v-for="role in experience" :key="role.company + role.period">
        <p class="period">{{ role.period }}</p>
        <h2>{{ role.title }}</h2>
        <p class="company">{{ role.company }}</p>
        <p class="note">{{ role.note }}</p>
      </li>
    </ol>
  </article>
</template>

<style scoped>

h1 {
  margin: 16px 0 4px;
  font-size: 28px;
}

.lead {
  margin: 0 0 20px;
  color: var(--ink-secondary);
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 20px 18px 4px 22px;
}

.timeline li {
  position: relative;
  z-index: 2;
  padding: 0 0 22px 22px;
  border-left: 2px solid var(--separator);
  margin-left: 6px;
}

.timeline li:last-child {
  border-left-color: transparent;
}

.timeline li::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(160deg, #fbbf24, #f97316);
  box-shadow: 0 0 0 4px color-mix(in srgb, #f59e0b 22%, transparent);
}

.period {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-secondary);
}

h2 {
  margin: 4px 0 0;
  font-size: 18px;
}

.company {
  margin: 2px 0 0;
  font-weight: 500;
  color: var(--tint);
}

.note {
  margin: 6px 0 0;
  line-height: 1.45;
}
</style>
