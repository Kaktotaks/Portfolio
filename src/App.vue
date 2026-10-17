<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import AppIcon from './components/AppIcon.vue'
import AppWindow from './components/AppWindow.vue'
import Dock from './components/Dock.vue'
import LockScreen from './components/LockScreen.vue'
import StatusBar from './components/StatusBar.vue'
import AboutApp from './components/apps/AboutApp.vue'
import ExperienceApp from './components/apps/ExperienceApp.vue'
import ProjectApp from './components/apps/ProjectApp.vue'
import SkillsApp from './components/apps/SkillsApp.vue'
import { useClock } from './composables/useClock'
import { dock, homeApps, profile } from './data/portfolio'
import type { HomeApp, Project, SystemApp } from './data/types'

type OpenableApp = Project | SystemApp

const { time, date } = useClock(profile.timeZone)

// Skip the lock screen on reloads within the same tab session
const locked = ref(readUnlocked() ? false : true)
const openApp = shallowRef<OpenableApp | null>(null)
const origin = shallowRef<DOMRect | null>(null)
let returnFocusTo: HTMLElement | null = null

const projectCount = computed(() => homeApps.filter((a) => a.kind === 'project').length)

function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem('unlocked') === '1'
  } catch {
    return false
  }
}

function unlock() {
  locked.value = false
  try {
    sessionStorage.setItem('unlocked', '1')
  } catch {
    /* storage unavailable — nothing to remember */
  }
}

function launch(app: HomeApp, rect: DOMRect | null) {
  if (app.kind === 'link') return
  returnFocusTo = document.activeElement as HTMLElement | null
  origin.value = rect
  openApp.value = app
  if (location.hash !== `#/${app.id}`) history.pushState(null, '', `#/${app.id}`)
}

function onClosed() {
  openApp.value = null
  if (location.hash) history.pushState(null, '', location.pathname + location.search)
  returnFocusTo?.focus({ preventScroll: true })
}

/** Deep links: /#/liven opens a case study directly — handy for sharing one project. */
function syncFromHash() {
  const id = location.hash.replace(/^#\//, '')
  const app = homeApps.find((a) => a.id === id && a.kind !== 'link')
  if (app && app !== openApp.value) {
    locked.value = false
    launch(app, null)
  } else if (!id && openApp.value) {
    windowRef.value?.close()
  }
}

const windowRef = ref<InstanceType<typeof AppWindow>>()

onMounted(() => {
  syncFromHash()
  window.addEventListener('popstate', syncFromHash)
})
onUnmounted(() => window.removeEventListener('popstate', syncFromHash))
</script>

<template>
  <main class="stage">
    <div class="device">
      <div class="screen">
        <StatusBar :time="time" :dark="!!openApp" />

        <div class="home" :class="{ receded: openApp }" :inert="!!openApp || locked">
          <h1 class="visually-hidden">{{ profile.name }} — {{ profile.title }}</h1>

          <section class="widget" aria-label="Introduction">
            <p class="widget-name">{{ profile.name }}</p>
            <p class="widget-title">{{ profile.title }}</p>
            <p class="widget-foot">
              <span class="dot" aria-hidden="true" />
              {{ projectCount }} projects · tap an app to open
            </p>
          </section>

          <nav class="grid" aria-label="Projects and info">
            <AppIcon v-for="app in homeApps" :key="app.id" :app="app" @open="launch" />
          </nav>

          <div class="dock-wrap">
            <Dock :apps="dock" />
          </div>
        </div>

        <AppWindow
          v-if="openApp"
          :key="openApp.id"
          ref="windowRef"
          :title="openApp.name"
          :icon="openApp.icon"
          :origin="origin"
          @closed="onClosed"
        >
          <ProjectApp v-if="openApp.kind === 'project'" :project="openApp" />
          <AboutApp v-else-if="openApp.id === 'about'" :profile="profile" :contacts="dock" />
          <ExperienceApp v-else-if="openApp.id === 'notes'" :experience="profile.experience" />
          <SkillsApp v-else-if="openApp.id === 'settings'" :skills="profile.skills" />
        </AppWindow>

        <Transition name="lock">
          <LockScreen
            v-if="locked"
            :time="time"
            :date="date"
            :name="profile.name"
            :title="profile.title"
            :location="profile.location"
            :photo="profile.photo"
            @unlock="unlock"
          />
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
.stage {
  min-height: 100dvh;
  display: grid;
  place-items: center;
}

/* Phone: the browser viewport *is* the device */
.device {
  width: 100%;
  height: 100dvh;
}

.screen {
  --icon-size: 62px;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--wallpaper);
  container-type: inline-size;
}

/* Desktop & tablets: show an iPad in landscape */
@media (min-width: 900px) and (min-height: 620px) {
  .device {
    width: min(1180px, 92vw, calc((100dvh - 64px) * 1.43));
    height: auto;
    aspect-ratio: 1.43;
    padding: 14px;
    border-radius: 46px;
    background: #0b0b0e;
    box-shadow:
      0 0 0 2px #2a2a30,
      0 40px 80px rgb(0 0 0 / 0.45);
  }

  .screen {
    --icon-size: 74px;
    border-radius: 32px;
  }
}

.home {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 56px 20px 18px;
  transition:
    transform 420ms cubic-bezier(0.32, 0.72, 0, 1),
    filter 420ms ease;
}

.home.receded {
  transform: scale(0.92);
  filter: blur(6px) brightness(0.8);
}

.widget {
  align-self: stretch;
  padding: 18px 20px;
  border-radius: 24px;
  color: #fff;
  background: rgb(255 255 255 / 0.16);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
}

.widget p {
  margin: 0;
}

.widget-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.widget-title {
  font-size: 15px;
  opacity: 0.9;
}

.widget-foot {
  margin-top: 12px !important;
  font-size: 13px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgb(74 222 128 / 0.25);
}

.grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 24px;
  justify-items: center;
  align-content: start;
}

.dock-wrap {
  margin-top: auto;
}

/* iPad layout: widget on the left, wider grid on the right */
@container (min-width: 760px) {
  .home {
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 1fr auto;
    column-gap: 48px;
    padding: 64px 56px 22px;
  }

  .widget {
    align-self: start;
    padding: 24px;
  }

  .widget-name {
    font-size: 30px;
  }

  .grid {
    margin-top: 0;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    row-gap: 34px;
  }

  .dock-wrap {
    grid-column: 1 / -1;
    justify-self: center;
    width: min(100%, 460px);
  }
}

.lock-leave-active {
  transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1), opacity 450ms ease;
}

.lock-leave-to {
  transform: translateY(-100%) !important;
  opacity: 0.4;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
