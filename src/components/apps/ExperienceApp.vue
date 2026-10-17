<script setup lang="ts">
import type { Role } from '../../data/types'

defineProps<{ experience: Role[] }>()
</script>

<template>
  <div class="paper">
  <article class="page">
    <h1>Experience</h1>
    <p class="lead">5+ years building iOS products — startups, product companies, outsourcing and outstaffing.</p>

    <ol class="timeline">
      <li v-for="role in experience" :key="role.company + role.period">
        <p class="period">{{ role.period }}</p>
        <h2>{{ role.title }}</h2>
        <p class="company">{{ role.company }}</p>
        <p class="note">{{ role.note }}</p>
      </li>
    </ol>
  </article>
  </div>
</template>

<style scoped>
.paper {
  background: var(--paper);
  min-height: 100%;
}

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
  padding: 0;
}

.timeline li {
  position: relative;
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
  background: #f59e0b;
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
  color: #b45309;
}

.note {
  margin: 6px 0 0;
  line-height: 1.45;
}
</style>
