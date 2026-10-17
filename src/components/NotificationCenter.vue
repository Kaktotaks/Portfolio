<script setup lang="ts">
import { computed } from 'vue'
import type { Notice } from '../data/portfolio'
import type { HomeApp } from '../data/types'
import IconTile from './IconTile.vue'

const props = defineProps<{ time: string; date: string; notices: Notice[]; apps: HomeApp[] }>()
const emit = defineEmits<{ open: [appId: string] }>()

const items = computed(() =>
  props.notices
    .map((n) => ({ ...n, app: props.apps.find((a) => a.id === n.appId) }))
    .filter((n) => n.app),
)
</script>

<template>
  <div class="nc">
    <div class="clock">
      <p class="date">{{ date }}</p>
      <p class="time">{{ time }}</p>
    </div>

    <p class="heading">Notifications</p>
    <ul class="list">
      <li v-for="(n, i) in items" :key="n.appId" :style="{ '--i': i }">
        <button type="button" class="card glass-clear" @click="emit('open', n.appId)">
          <IconTile :icon="n.app!.icon" size="38px" />
          <span class="text">
            <span class="row1">
              <span class="app">{{ n.app!.name }}</span>
              <span class="when">{{ n.when }}</span>
            </span>
            <span class="title">{{ n.title }}</span>
            <span class="body">{{ n.body }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nc {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 420px);
  margin: 0 auto;
  min-height: 0;
  flex: 1;
}

.clock {
  text-align: center;
  margin-top: 12px;
}

.clock p {
  margin: 0;
}

.date {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
}

.time {
  font-size: clamp(64px, 19vw, 92px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.heading {
  align-self: flex-start;
  margin: 28px 4px 8px;
  font-size: 20px;
  font-weight: 700;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 12px 14px;
  border: 0;
  border-radius: 24px;
  color: #fff;
  font: inherit;
  cursor: pointer;
  transition: transform 160ms ease;
}

.card > * {
  position: relative;
  z-index: 2;
}

.card:active {
  transform: scale(0.98);
}

.card:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.row1 {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  opacity: 0.75;
}

.app {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.title {
  font-weight: 600;
  font-size: 15px;
}

.body {
  font-size: 14px;
  opacity: 0.85;
  line-height: 1.35;
}
</style>
