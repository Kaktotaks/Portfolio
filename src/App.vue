<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import AppIcon from './components/AppIcon.vue'
import AppWindow from './components/AppWindow.vue'
import Avatar from './components/Avatar.vue'
import ControlCenter from './components/ControlCenter.vue'
import NotificationCenter from './components/NotificationCenter.vue'
import Shade from './components/Shade.vue'
import Dock from './components/Dock.vue'
import LockScreen from './components/LockScreen.vue'
import StatusBar from './components/StatusBar.vue'
import Wallpaper from './components/Wallpaper.vue'
import AboutApp from './components/apps/AboutApp.vue'
import ExperienceApp from './components/apps/ExperienceApp.vue'
import ProjectApp from './components/apps/ProjectApp.vue'
import SkillsApp from './components/apps/SkillsApp.vue'
import { useClock } from './composables/useClock'
import { useDrag } from './composables/useDrag'
import { dock, homeApps, notices, profile } from './data/portfolio'
import type { HomeApp, Project, SystemApp } from './data/types'

type OpenableApp = Project | SystemApp

const { time, date } = useClock(profile.timeZone)

// Skip the lock screen on reloads within the same tab session
const locked = ref(readUnlocked() ? false : true)
const openApp = shallowRef<OpenableApp | null>(null)
const origin = shallowRef<DOMRect | null>(null)
let returnFocusTo: HTMLElement | null = null


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

/* ---------- Notification Center & Control Center ---------- */

type ShadeKind = 'notifications' | 'control'
const shadeKind = ref<ShadeKind | null>(null)
const shadeRef = ref<InstanceType<typeof Shade>>()
const screenRef = ref<HTMLElement>()

function screenHeight() {
  return screenRef.value?.getBoundingClientRect().height ?? window.innerHeight
}

/** Mount the shade (if needed) and run `fn` once it exists. */
async function withShade(kind: ShadeKind, fn: (s: InstanceType<typeof Shade>) => void) {
  if (shadeKind.value !== kind) {
    shadeKind.value = kind
    await nextTick()
  }
  if (shadeRef.value) fn(shadeRef.value)
}

function openShade(kind: ShadeKind) {
  // Next frame, so the freshly mounted panel animates in from closed
  withShade(kind, (s) => requestAnimationFrame(() => s.settle(true)))
}

/** Pull down from the left or right half of the status bar, like iOS. */
function pullFrom(kind: ShadeKind) {
  return useDrag({
    start: () => !(shadeKind.value && shadeRef.value?.isOpen()),
    move: ({ dy, tap }) => {
      if (tap) return
      withShade(kind, (s) => s.drag(dy / (screenHeight() * 0.6)))
    },
    end: ({ dy, vy, tap }) => {
      if (tap || !shadeKind.value) return
      shadeRef.value?.settle(dy > screenHeight() * 0.18 || vy > 0.5)
    },
  })
}
const pullNotifications = pullFrom('notifications')
const pullControl = pullFrom('control')

function openFromNotification(appId: string) {
  shadeRef.value?.settle(false)
  const app = homeApps.find((a) => a.id === appId)
  if (!app || app.kind === 'link') return
  locked.value = false
  const tile = document.querySelector(`[aria-label="Open ${app.name}"] .icon-tile`)
  window.setTimeout(() => launch(app, openApp.value ? null : (tile?.getBoundingClientRect() ?? null)), 200)
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('popstate', syncFromHash)
})
onUnmounted(() => window.removeEventListener('popstate', syncFromHash))
</script>

<template>
  <main class="stage">
    <div class="device">
      <div ref="screenRef" class="screen">
        <Wallpaper />
        <StatusBar :time="time" :dark="!!openApp && !shadeKind" />

        <!-- Pull-down zones over the status bar: left = Notification Center, right = Control Center -->
        <button
          type="button"
          class="pull pull-left"
          aria-label="Open Notification Center"
          v-bind="pullNotifications"
          @click="openShade('notifications')"
        />
        <button
          type="button"
          class="pull pull-right"
          aria-label="Open Control Center"
          v-bind="pullControl"
          @click="openShade('control')"
        />

        <div class="home" :class="{ receded: openApp, locked }" :inert="!!openApp || locked">
          <h1 class="visually-hidden">{{ profile.name }} — {{ profile.title }}</h1>

          <section class="widget glass-clear" aria-label="Introduction">
            <div class="widget-avatar"><Avatar /></div>
            <div class="widget-text">
              <p class="widget-name">{{ profile.name }}</p>
              <p class="widget-title">{{ profile.title }}</p>
            </div>
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

        <Shade v-if="shadeKind" ref="shadeRef" :key="shadeKind" :kind="shadeKind" @closed="shadeKind = null">
          <NotificationCenter
            v-if="shadeKind === 'notifications'"
            :time="time"
            :date="date"
            :notices="notices"
            :apps="homeApps"
            @open="openFromNotification"
          />
          <ControlCenter
            v-else
            :links="dock"
            :email="profile.email"
            :time="time"
            repo-url="https://github.com/Kaktotaks/Portfolio"
          />
        </Shade>

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
  background: #3d6fb8;
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
    transform 520ms cubic-bezier(0.32, 0.72, 0, 1),
    filter 420ms ease,
    opacity 420ms ease;
}

.home.receded {
  transform: scale(0.94);
}

/* While locked the home screen waits slightly enlarged and invisible, then settles in on unlock */
.home.locked {
  opacity: 0;
  transform: scale(1.08);
}

.widget {
  align-self: stretch;
  padding: 18px 20px;
  border-radius: 28px;
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
}

.widget {
  display: flex;
  align-items: center;
  gap: 14px;
}

.widget > * {
  position: relative;
  z-index: 2;
}

.widget-avatar {
  flex: none;
  width: 78px;
  height: 78px;
  margin: -6px 0 -6px -6px;
}

.widget p {
  margin: 0;
}

.widget-name {
  font-size: 21px;
  white-space: nowrap;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.widget-title {
  font-size: 15px;
  opacity: 0.9;
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
    flex-direction: column;
    align-items: flex-start;
  }

  .widget-avatar {
    width: 140px;
    height: 140px;
    margin: 0 auto 4px;
  }

  .widget-name {
    font-size: 26px;
    white-space: normal;
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

.pull {
  position: absolute;
  top: 0;
  z-index: 35;
  width: 50%;
  height: 48px;
  padding: 0;
  border: 0;
  background: none;
  cursor: grab;
  touch-action: none;
}

.pull-left {
  left: 0;
}

.pull-right {
  right: 0;
}

.pull:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -4px;
  border-radius: 14px;
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
