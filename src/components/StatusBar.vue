<script setup lang="ts">
defineProps<{ time: string; dark?: boolean }>()
</script>

<template>
  <div class="status-bar" :class="{ dark }" aria-hidden="true">
    <span class="time">{{ time }}</span>
    <span class="indicators">
      <svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
      <svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Zm-4.3-4.2a6.1 6.1 0 0 1 8.6 0l1.4-1.4a8.1 8.1 0 0 0-11.4 0Zm-2.8-2.8a10 10 0 0 1 14.2 0L16.5 3A12 12 0 0 0-.5 3Z" /></svg>
      <svg viewBox="0 0 27 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45" /><rect x="2" y="2" width="20" height="9" rx="2" /><path d="M25 4.5v4a2 2 0 0 0 0-4Z" opacity=".45" /></svg>
    </span>
  </div>
</template>

<style scoped>
.status-bar {
  position: relative;
  z-index: 45;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px 0;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  fill: currentColor;
  pointer-events: none;
}

.status-bar.dark {
  color: var(--ink);
}

.indicators {
  display: flex;
  gap: 6px;
  align-items: center;
}

.time {
  font-variant-numeric: tabular-nums;
  min-width: 54px;
  text-align: center;
}
</style>
