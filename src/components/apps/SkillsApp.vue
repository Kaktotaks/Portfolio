<script setup lang="ts">
import type { SkillGroup } from '../../data/types'

defineProps<{ skills: SkillGroup[] }>()
</script>

<template>
  <article class="page">
    <h1 class="title">Skills</h1>
    <section v-for="group in skills" :key="group.title" class="section">
      <h2 class="section-title">{{ group.title }}</h2>
      <div class="group chips">
        <span v-for="item in group.items" :key="item" class="chip">{{ item }}</span>
      </div>
    </section>
  </article>
</template>

<style scoped>
.title {
  margin: 16px 0 0;
  font-size: 28px;
}
</style>
